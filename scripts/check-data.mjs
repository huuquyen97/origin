// npm run check-data — kiểm tra dữ liệu trong /Data trước khi build:
// trường bắt buộc, slug trùng, liên kết sản phẩm/giải pháp bị gãy, file tài liệu/ảnh không tồn tại.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathKey } from "../lib/file-slug.mjs";

const root = process.cwd();
const errors = [];
const warns = [];
const read = (rel) => {
  try {
    return JSON.parse(readFileSync(join(root, rel), "utf8").replace(/^﻿/, ""));
  } catch (e) {
    errors.push(`${rel}: JSON lỗi — ${e.message}`);
    return null;
  }
};
const dir = (rel) => readdirSync(join(root, rel)).filter((f) => f.endsWith(".json")).map((f) => [`${rel}/${f}`, read(`${rel}/${f}`)]).filter(([, v]) => v);

// Tên file trên đĩa có thể ở dạng NFC hoặc NFD — so khớp theo NFC
const onDisk = new Set();
const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(join(d, e.name)) : onDisk.add(pathKey(join(d, e.name).slice(root.length + 1)))));
walk(join(root, "Data"));
const fileExists = (p) => onDisk.has(pathKey(p));
const publicExists = (p) => !p || existsSync(join(root, "public", p));

const REQ_P = ["slug", "model", "name", "series", "category", "summary", "specs", "features", "solutions", "documents", "status", "updatedAt"];
const REQ_S = ["slug", "name", "industry", "summary", "painPoints", "architecture", "products", "documents"];

const products = dir("Data/Products");
const solutions = dir("Data/Solutions");
const series = new Set((read("Data/Site/series.json") || []).map((s) => s.id));
const pSlugs = new Map();
const sSlugs = new Map();

for (const [f, p] of products) {
  for (const k of REQ_P) if (!(k in p)) errors.push(`${f}: thiếu trường "${k}"`);
  if (pSlugs.has(p.slug)) errors.push(`${f}: trùng slug "${p.slug}" với ${pSlugs.get(p.slug)}`);
  pSlugs.set(p.slug, f);
  if (`${p.slug}.json` !== f.split("/").pop()) warns.push(`${f}: tên file khác slug "${p.slug}"`);
  if (!series.has(p.series)) errors.push(`${f}: series "${p.series}" không có trong Data/Site/series.json`);
  for (const d of p.documents || []) if (!fileExists(d.path)) errors.push(`${f}: tài liệu không tồn tại — ${d.path}`);
  for (const s of p.sources || []) if (!fileExists(s)) errors.push(`${f}: nguồn không tồn tại — ${s}`);
  if (!(p.sources || []).length) warns.push(`${f}: chưa có datasheet nguồn`);
  if (!publicExists(p.image)) errors.push(`${f}: ảnh không tồn tại — public${p.image}`);
}
for (const [f, s] of solutions) {
  for (const k of REQ_S) if (!(k in s)) errors.push(`${f}: thiếu trường "${k}"`);
  if (sSlugs.has(s.slug)) errors.push(`${f}: trùng slug "${s.slug}"`);
  sSlugs.set(s.slug, f);
  for (const d of s.documents || []) if (!fileExists(d.path)) errors.push(`${f}: tài liệu không tồn tại — ${d.path}`);
  for (const x of s.sources || []) if (!fileExists(x)) errors.push(`${f}: nguồn không tồn tại — ${x}`);
  for (const img of [s.cover, ...(s.images || [])]) if (!publicExists(img)) errors.push(`${f}: ảnh không tồn tại — public${img}`);
}
for (const [f, p] of products) for (const s of p.solutions || []) if (!sSlugs.has(s)) errors.push(`${f}: giải pháp liên kết không tồn tại — ${s}`);
for (const [f, s] of solutions) for (const p of s.products || []) if (!pSlugs.has(p)) errors.push(`${f}: sản phẩm liên kết không tồn tại — ${p}`);
for (const d of read("Data/Documents/documents.json") || []) {
  if (!fileExists(d.path)) errors.push(`Data/Documents/documents.json: không tồn tại — ${d.path}`);
  for (const p of d.products || []) if (!pSlugs.has(p)) warns.push(`Data/Documents/documents.json: "${d.title}" gắn sản phẩm không tồn tại — ${p}`);
}
for (const a of read("Data/AI/algorithms.json") || []) for (const s of a.sources || []) if (!fileExists(s)) errors.push(`Data/AI/algorithms.json: "${a.name}" nguồn không tồn tại — ${s}`);

console.log(`check-data: ${products.length} sản phẩm, ${solutions.length} giải pháp`);
if (warns.length) console.log(`Cảnh báo (${warns.length}):\n` + warns.map((w) => "  - " + w).join("\n"));
if (errors.length) {
  console.error(`LỖI (${errors.length}):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("OK");
