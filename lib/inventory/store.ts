import "server-only";
import { unstable_cache } from "next/cache";
import { getProducts } from "@/lib/data";
import { lastGood, type Snapshot } from "./last-good";
import { parseRows } from "./parse";
import { getSource, type InventorySource } from "./source";
import { modelKey, type InventoryResponse } from "./types";

const POLL_S = Math.max(15, Number(process.env.INVENTORY_POLL_SECONDS) || 60);
const LOW = Number(process.env.INVENTORY_LOW_STOCK) || 10;

function toSnapshot(src: InventorySource, rows: string[][], modified: string): Snapshot {
  const { byKey, warnings } = parseRows(rows);
  const slugOf = new Map<string, string>();
  for (const p of getProducts()) {
    slugOf.set(modelKey(p.model), p.slug);
    slugOf.set(modelKey(p.slug), p.slug);
  }
  const items: Snapshot["items"] = {};
  const unmatched: Snapshot["unmatched"] = [];
  for (const [key, it] of byKey) {
    const slug = slugOf.get(key);
    if (!slug) unmatched.push({ model: it.model, qty: it.qty });
    else items[slug] = { qty: it.qty, warehouses: it.warehouses, notes: it.notes };
  }
  return { sourceId: src.id, modified, fetchedAt: new Date().toISOString(), items, unmatched, warnings };
}

type Result = { snap: Snapshot | null; checkedAt: string; error: string | null };

/**
 * Một lần kiểm tra nguồn. Chạy trong unstable_cache nên mỗi POLL_S giây chỉ một request thật sự gọi Google
 * (dùng chung mọi instance trên Vercel), các request khác đọc kết quả đã cache.
 */
async function check(sourceId: string): Promise<Result> {
  const src = getSource()!;
  const checkedAt = new Date().toISOString();
  const saved = await lastGood.read().catch(() => null);
  const last = saved?.sourceId === sourceId ? saved : null;
  try {
    // Rẻ: chỉ đọc thời điểm sửa file; chưa đổi thì dùng lại bản đã lưu
    const modified = await src.modifiedTime();
    if (last && last.modified === modified) return { snap: last, checkedAt, error: null };
    const snap = toSnapshot(src, await src.rows(), modified);
    await lastGood.write(snap).catch((e) => console.error("[ton-kho] không lưu được bản dự phòng:", e));
    return { snap, checkedAt, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("[ton-kho]", error);
    // Có bản đọc trước thì trả về kèm lỗi (giao diện báo "số liệu lần trước"); lần revalidate sau thử lại
    if (last) return { snap: last, checkedAt, error };
    throw e; // không cache lỗi khi chưa có số liệu nào
  }
}

const cachedCheck = unstable_cache(check, ["inventory-v2"], { revalidate: POLL_S, tags: ["inventory"] });

export async function getInventory(): Promise<InventoryResponse> {
  const src = getSource();
  const base = { lowThreshold: LOW, sheetUrl: src?.sheetUrl ?? null, source: src?.kind ?? null };
  if (!src) return { ...base, configured: false, updatedAt: null, checkedAt: null, stale: false, error: null, warnings: [], items: {}, unmatched: [] };

  let r: Result;
  try {
    r = await cachedCheck(src.id);
  } catch (e) {
    // Lần đầu đã lỗi (chưa có cache): vẫn thử bản dự phòng trên Blob / file
    const saved = await lastGood.read().catch(() => null);
    r = { snap: saved?.sourceId === src.id ? saved : null, checkedAt: new Date().toISOString(), error: e instanceof Error ? e.message : String(e) };
  }
  const { snap } = r;
  return {
    ...base,
    configured: true,
    updatedAt: snap?.modified ?? null,
    checkedAt: r.checkedAt,
    stale: Boolean(r.error && snap),
    error: r.error,
    warnings: snap?.warnings.slice(0, 20) ?? [],
    items: snap?.items ?? {},
    unmatched: snap?.unmatched ?? [],
  };
}
