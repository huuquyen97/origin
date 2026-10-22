import { norm } from "@/lib/search/normalize";
import { modelKey, type StockItem } from "./types";

/** Tên cột chấp nhận được (đã bỏ dấu, chữ thường) */
const COLS = {
  model: ["model", "ma model", "ma san pham", "ma hang", "san pham", "ma sp"],
  qty: ["ton kho", "so luong", "so luong ton", "sl", "ton", "qty", "quantity", "stock"],
  warehouse: ["kho", "kho hang", "warehouse", "chi nhanh", "vi tri"],
  note: ["ghi chu", "note", "notes"],
};

const findCol = (header: string[], names: string[]) => header.findIndex((h) => names.includes(norm(h)));

/** "1.200" / "1,200" / "1 200" → 1200; "12" → 12; rỗng hoặc chữ → null */
export function parseQty(raw: string): number | null {
  const s = String(raw ?? "").replace(/\s/g, "");
  if (!s) return null;
  const n = /^-?\d{1,3}([.,]\d{3})+$/.test(s) ? Number(s.replace(/[.,]/g, "")) : Number(s.replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : null;
}

export type ParsedSheet = {
  /** Theo modelKey */
  byKey: Map<string, StockItem & { model: string }>;
  warnings: string[];
};

/**
 * Đọc bảng tồn kho: tìm dòng tiêu đề trong 10 dòng đầu (cần cột Model + Tồn kho),
 * cộng dồn nếu một model có nhiều dòng (VD nhiều kho).
 */
export function parseRows(rows: string[][]): ParsedSheet {
  const warnings: string[] = [];
  const byKey: ParsedSheet["byKey"] = new Map();
  const hi = rows.slice(0, 10).findIndex((r) => findCol(r, COLS.model) >= 0 && findCol(r, COLS.qty) >= 0);
  if (hi < 0) throw new Error("Không tìm thấy dòng tiêu đề có cột “Model” và “Tồn kho” trong 10 dòng đầu");
  const header = rows[hi];
  const c = { model: findCol(header, COLS.model), qty: findCol(header, COLS.qty), wh: findCol(header, COLS.warehouse), note: findCol(header, COLS.note) };

  rows.slice(hi + 1).forEach((r, i) => {
    const model = String(r[c.model] ?? "").trim();
    // Bỏ qua dòng trống / model chưa nhập số (VD file mẫu liệt kê sẵn model)
    if (!model || !String(r[c.qty] ?? "").trim()) return;
    const qty = parseQty(r[c.qty]);
    if (qty === null) {
      warnings.push(`Dòng ${hi + i + 2}: số lượng “${r[c.qty] ?? ""}” của ${model} không đọc được`);
      return;
    }
    const key = modelKey(model);
    const cur = byKey.get(key) ?? { model, qty: 0, warehouses: [], notes: [] };
    cur.qty += qty;
    const wh = c.wh >= 0 ? String(r[c.wh] ?? "").trim() : "";
    if (wh) {
      const w = cur.warehouses.find((x) => x.name === wh);
      if (w) w.qty += qty;
      else cur.warehouses.push({ name: wh, qty });
    }
    const note = c.note >= 0 ? String(r[c.note] ?? "").trim() : "";
    if (note && !cur.notes.includes(note)) cur.notes.push(note);
    byKey.set(key, cur);
  });
  return { byKey, warnings };
}

/** CSV đơn giản (dấu phẩy, ngoặc kép) cho nguồn file thử */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text; // bỏ BOM của file Excel
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"' && s[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && s[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
