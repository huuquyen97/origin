// Ánh xạ đường dẫn tài liệu gốc trong /Data sang URL tĩnh trong /public/files.
// Dùng chung cho scripts/copy-assets.mjs và lib/data (tránh lỗi tên file Unicode NFC/NFD trên URL).

/** @param {string} s */
export function slugSegment(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * "Data/MK Vision/Docs/V-SECURE/VB50FB1V 5MP R1.pdf" -> "/files/docs/v-secure/vb50fb1v-5mp-r1.pdf"
 * @param {string} dataPath
 */
export function fileUrl(dataPath) {
  const rel = dataPath.replace(/\\/g, "/").replace(/^Data\/MK Vision\//, "");
  const parts = rel.split("/");
  const name = parts.pop() ?? "";
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  return "/files/" + [...parts.map(slugSegment), slugSegment(base) + (ext ? "." + ext : "")].join("/");
}

/** So khớp đường dẫn không phụ thuộc dạng Unicode (NFC/NFD) và dấu gạch chéo. */
export function pathKey(p) {
  return String(p ?? "").replace(/\\/g, "/").trim().normalize("NFC");
}
