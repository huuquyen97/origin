/** Chuẩn hoá để tìm kiếm không phân biệt dấu tiếng Việt / hoa thường. */
export function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mọi từ trong truy vấn đều xuất hiện trong văn bản (đã chuẩn hoá). */
export function matchesAll(query: string, text: string): boolean {
  const q = norm(query);
  if (!q) return true;
  const t = norm(text);
  return q.split(" ").every((w) => t.includes(w));
}
