import "server-only";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { z } from "zod";
import { fileUrl, pathKey } from "@/lib/file-slug.mjs";
import {
  AiSchema, CompanySchema, DocumentSchema, HomeSchema, ProductSchema, SeriesSchema, SolutionSchema,
  type AiAlgorithm, type Company, type DocType, type Home, type Product, type Series, type Solution,
} from "./schema";

const ROOT = process.cwd();
const DATA = join(ROOT, "Data");

/* ---------- Kiểu dữ liệu đã liên kết (dùng ở UI) ---------- */
export type Doc = {
  path: string;
  url: string;
  ext: string;
  title: string;
  type: DocType;
  description: string;
  series: string;
  products: string[];
  size: number;
};
export type ProductFull = Omit<Product, "documents" | "sources"> & { documents: Doc[]; sources: Doc[] };
export type SolutionFull = Omit<Solution, "documents" | "sources"> & { documents: Doc[]; sources: Doc[] };
export type AiFull = Omit<AiAlgorithm, "sources"> & { sources: Doc[] };

/* ---------- Đọc + validate ---------- */
function readJson(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, ""));
  } catch (e) {
    throw new Error(`[Data] JSON lỗi trong ${file.replace(ROOT, "")}: ${(e as Error).message}`);
  }
}

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown, file: string): z.infer<T> {
  const r = schema.safeParse(value);
  if (!r.success) {
    const issues = r.error.issues.map((i) => `  - ${i.path.join(".") || "(gốc)"}: ${i.message}`).join("\n");
    throw new Error(`[Data] ${file.replace(ROOT, "")} không hợp lệ:\n${issues}`);
  }
  return r.data;
}

function readDir<T extends z.ZodTypeAny>(dir: string, schema: T): z.infer<T>[] {
  const abs = join(DATA, dir);
  return readdirSync(abs).filter((f) => f.endsWith(".json")).sort().map((f) => parse(schema, readJson(join(abs, f)), join(abs, f)));
}

function readArray<T extends z.ZodTypeAny>(rel: string, schema: T): z.infer<T>[] {
  const file = join(DATA, rel);
  const raw = readJson(file);
  if (!Array.isArray(raw)) throw new Error(`[Data] ${rel} phải là một mảng`);
  return raw.map((x, i) => parse(schema, x, `${file} [${i}]`));
}

/* ---------- Manifest tài liệu (scripts/copy-assets.mjs) ---------- */
type Manifest = Record<string, { url: string; size: number }>;
function readManifest(): Manifest {
  const f = join(ROOT, "lib/generated/files.json");
  if (!existsSync(f)) throw new Error("Thiếu lib/generated/files.json — chạy `node scripts/copy-assets.mjs` trước.");
  return JSON.parse(readFileSync(f, "utf8"));
}

const FOLDER_SERIES: Record<string, string> = { "V-SECURE": "v-secure", MOBISECURE: "mobisecure", AUTOSECURE: "autosecure", BIOSECURE: "biosecure", M6: "biosecure", "MK Networks": "mk-networks" };
// Ảnh gốc độ phân giải cao / thư mục ảnh: không đưa vào thư viện tài liệu (ảnh web đã tối ưu nằm ở public/img)
const HIDDEN_IN_LIBRARY = [/\/Image\//, /\/Product Photos\//, / - Copy\./];

function guessType(path: string, ext: string): DocType {
  const p = path.normalize("NFC").toLowerCase();
  if (p.includes("datasheet")) return "datasheet";
  if (p.includes("hdsd") || p.includes("hướng dẫn")) return "hdsd";
  if (p.includes("catalog")) return "catalog";
  if (ext === "pptx") return "slide";
  if (["png", "jpg", "jpeg", "mp4"].includes(ext)) return "media";
  return "other";
}

/* ---------- Tải toàn bộ, liên kết ---------- */
function load() {
  const products = readDir("Products", ProductSchema);
  const solutions = readDir("Solutions", SolutionSchema);
  const docsMeta = readArray("Documents/documents.json", DocumentSchema);
  const ai = readArray("AI/algorithms.json", AiSchema);
  const series = readArray("Site/series.json", SeriesSchema).sort((a, b) => a.order - b.order);
  const company = parse(CompanySchema, readJson(join(DATA, "Site/company.json")), "Data/Site/company.json");
  const home = parse(HomeSchema, readJson(join(DATA, "Site/home.json")), "Data/Site/home.json");
  const manifest = readManifest();

  const docs = new Map<string, Doc>();
  const makeDoc = (path: string, meta: Partial<Doc> = {}): Doc => {
    const key = pathKey(path);
    const m = manifest[key];
    const ext = (key.split(".").pop() || "").toLowerCase();
    return {
      path: key,
      url: m?.url ?? fileUrl(key),
      ext,
      title: meta.title || key.split("/").pop()!.replace(/\.[^.]+$/, ""),
      type: meta.type ?? guessType(key, ext),
      description: meta.description ?? "",
      series: meta.series ?? "",
      products: meta.products ?? [],
      size: m?.size ?? 0,
    };
  };
  const docFor = (path: string, meta?: { title?: string; type?: DocType }): Doc => {
    const key = pathKey(path);
    let d = docs.get(key);
    if (!d) {
      d = makeDoc(key, meta);
      docs.set(key, d);
    }
    return d;
  };

  for (const m of docsMeta) docs.set(pathKey(m.path), makeDoc(m.path, m));
  // File có trên đĩa nhưng chưa có mô tả: vẫn đưa vào thư viện
  for (const key of Object.keys(manifest)) {
    if (docs.has(key) || HIDDEN_IN_LIBRARY.some((r) => r.test(key))) continue;
    const folder = key.split("/").slice(2).find((x) => FOLDER_SERIES[x]);
    docs.set(key, makeDoc(key, { series: folder ? FOLDER_SERIES[folder] : "" }));
  }

  const productMap = new Map<string, ProductFull>();
  for (const p of products) {
    if (productMap.has(p.slug)) throw new Error(`[Data] Trùng slug sản phẩm: ${p.slug}`);
    const documents = p.documents.map((d) => docFor(d.path, d));
    for (const d of documents) if (!d.products.includes(p.slug)) d.products.push(p.slug);
    productMap.set(p.slug, { ...p, documents, sources: p.sources.map((s) => docFor(s)) });
  }
  // Tài liệu gắn với sản phẩm từ phía documents.json
  for (const d of docs.values()) {
    for (const slug of d.products) {
      const p = productMap.get(slug);
      if (p && !p.documents.some((x) => x.path === d.path)) p.documents.push(d);
    }
  }

  const solutionList: SolutionFull[] = solutions
    .map((s) => ({ ...s, products: s.products.filter((x) => productMap.has(x)), documents: s.documents.map((d) => docFor(d.path, d)), sources: s.sources.map((x) => docFor(x)) }))
    .sort((a, b) => a.order - b.order);
  const solutionMap = new Map(solutionList.map((s) => [s.slug, s]));
  // Liên kết hai chiều: sản phẩm khai báo ở giải pháp cũng hiện "Giải pháp liên quan" ở trang sản phẩm
  for (const s of solutionList) for (const slug of s.products) {
    const p = productMap.get(slug)!;
    if (!p.solutions.includes(s.slug)) p.solutions.push(s.slug);
  }
  for (const p of productMap.values()) p.solutions = p.solutions.filter((s) => solutionMap.has(s));

  const seriesOrder = series.map((s) => s.id);
  const productList = [...productMap.values()].sort(
    (a, b) => seriesOrder.indexOf(a.series) - seriesOrder.indexOf(b.series) || a.model.localeCompare(b.model),
  );
  const documents = [...docs.values()].sort((a, b) => (a.series || "zz").localeCompare(b.series || "zz") || a.title.localeCompare(b.title));
  const aiList: AiFull[] = ai.map((a) => ({ ...a, sources: a.sources.map((x) => docFor(x)) }));

  return { products: productList, productMap, solutions: solutionList, solutionMap, documents, ai: aiList, series, company, home };
}

let cache: ReturnType<typeof load> | null = null;
export function getData() {
  return (cache ??= load());
}

export const getProducts = () => getData().products;
export const getProduct = (slug: string) => getData().productMap.get(slug);
export const getSolutions = () => getData().solutions;
export const getSolution = (slug: string) => getData().solutionMap.get(slug);
export const getDocuments = () => getData().documents;
export const getAi = () => getData().ai;
export const getSeries = (): Series[] => getData().series;
export const getCompany = (): Company => getData().company;
export const getHome = (): Home => getData().home;
export const seriesName = (id: string) => getData().series.find((s) => s.id === id)?.name ?? id;

/* ---------- Bản rút gọn cho Client Component ---------- */
export type ProductCardData = Pick<ProductFull, "slug" | "model" | "name" | "series" | "category" | "resolution" | "ipRating" | "image" | "aiFeatures"> & { seriesName: string; searchText: string };
export function toCard(p: ProductFull): ProductCardData {
  const specText = Object.values(p.specs).flat().map((r) => r.join(" ")).join(" ");
  return {
    slug: p.slug, model: p.model, name: p.name, series: p.series, category: p.category, resolution: p.resolution,
    ipRating: p.ipRating, image: p.image, aiFeatures: p.aiFeatures, seriesName: seriesName(p.series),
    searchText: `${p.model} ${p.name} ${p.category} ${p.summary} ${p.aiFeatures.join(" ")} ${specText}`,
  };
}
