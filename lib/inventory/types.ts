// Kiểu dữ liệu tồn kho dùng chung server ↔ client (không import gì phía server).

export type WarehouseQty = { name: string; qty: number };
export type StockItem = { qty: number; warehouses: WarehouseQty[]; notes: string[] };

/** Kết quả GET /api/ton-kho */
export type InventoryResponse = {
  /** Đã cấu hình nguồn tồn kho (Google Sheet hoặc file thử) */
  configured: boolean;
  source: "google" | "file" | null;
  /** Thời điểm file nguồn được sửa lần cuối (ISO) */
  updatedAt: string | null;
  /** Lần server kiểm tra file gần nhất (ISO) */
  checkedAt: string | null;
  /** Lần kiểm tra gần nhất lỗi nhưng vẫn còn số liệu cũ */
  stale: boolean;
  error: string | null;
  /** Dòng trong file không đọc được số lượng */
  warnings: string[];
  lowThreshold: number;
  sheetUrl: string | null;
  /** Theo slug sản phẩm */
  items: Record<string, StockItem>;
  /** Dòng trong file không khớp model nào trên web */
  unmatched: { model: string; qty: number }[];
};

export type StockStatus = "ok" | "low" | "out";

export const stockStatus = (qty: number, low: number): StockStatus => (qty <= 0 ? "out" : qty <= low ? "low" : "ok");

/** So khớp model không phân biệt hoa thường, bỏ dấu cách / gạch / chấm: "VA50FA2V-40" = "va50fa2v 40" */
export const modelKey = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");
