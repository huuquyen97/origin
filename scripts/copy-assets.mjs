// Đưa tài liệu gốc và logo trong /Data sang /public để web phục vụ trực tiếp.
// Không sửa file gốc. Dùng hard link khi có thể (không tốn thêm dung lượng), nếu không thì copy.
import { readdirSync, statSync, mkdirSync, linkSync, copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileUrl } from "../lib/file-slug.mjs";

const root = process.cwd();
const SOURCES = ["Data/MK Vision/Docs", "Data/MK Vision/Solutions"];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

function place(src, dest) {
  if (existsSync(dest) && statSync(dest).size === statSync(src).size) return "skip";
  mkdirSync(dirname(dest), { recursive: true });
  try {
    if (existsSync(dest)) return copyFileSync(src, dest), "copy";
    linkSync(src, dest);
    return "link";
  } catch {
    copyFileSync(src, dest);
    return "copy";
  }
}

const manifest = {};
const seen = new Map();
const count = { link: 0, copy: 0, skip: 0 };
for (const dir of SOURCES) {
  for (const abs of walk(join(root, dir))) {
    const rel = relative(root, abs).replace(/\\/g, "/");
    const url = fileUrl(rel);
    if (seen.has(url)) throw new Error(`Trùng URL tài liệu: "${rel}" và "${seen.get(url)}" -> ${url}`);
    seen.set(url, rel);
    manifest[rel.normalize("NFC")] = { url, size: statSync(abs).size };
    count[place(abs, join(root, "public", url))]++;
  }
}

place(join(root, "Data/MK Vision/Logo/mk-vision.png"), join(root, "public/brand/mk-vision.png"));
mkdirSync(join(root, "lib/generated"), { recursive: true });
writeFileSync(join(root, "lib/generated/files.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Tài liệu: ${Object.keys(manifest).length} file (link ${count.link}, copy ${count.copy}, giữ nguyên ${count.skip}) -> public/files`);
