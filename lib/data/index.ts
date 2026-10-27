import "server-only";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { z } from "zod";
import { fileUrl, pathKey } from "@/lib/file-slug.mjs";
import { catLabel, kindOf, KEY_SPEC_LABELS, specLabel, type NeedId } from "@/lib/labels";
import {
  AiFeatureSchema, AiSchema, CapabilitySchema, CatalogSchema, CompanySchema, DocumentSchema, FeatureShotSchema, HomeSchema, ProductSchema, ScenariosSchema, SeriesSchema, SolutionSchema,
  type AiAlgorithm, type AiFeature, type Capability, type Catalog, type Company, type DocStatus, type DocType, type FeatureShot, type Home, type Product, type Scenario, type Series, type Solution,
} from "./schema";
import { modelKey } from "@/lib/inventory/types";

const ROOT = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);
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
  /** "expired" được tính từ validTo so với ngày build */
  status: DocStatus;
  statusNote: string;
  validFrom: string;
  validTo: string;
};
/** ai: id tính năng AI chuẩn (Data/AI/features.json) suy từ aiFeatures nguyên văn */
export type ProductFull = Omit<Product, "documents" | "sources"> & { documents: Doc[]; sources: Doc[]; ai: string[] };
export type AiFeatureFull = AiFeature & { products: string[]; algorithms: AiFull[] };
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
  const features = readArray("AI/features.json", AiFeatureSchema);
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
      // File chưa có mô tả trong documents.json: coi là nội bộ cho tới khi được phân loại
      status: meta.validTo && meta.validTo < TODAY ? "expired" : (meta.status ?? "internal"),
      statusNote: meta.statusNote ?? "",
      validFrom: meta.validFrom ?? "",
      validTo: meta.validTo ?? "",
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

  const featureOf = new Map<string, string[]>();
  for (const f of features) for (const a of f.aliases) featureOf.set(a, [...(featureOf.get(a) ?? []), f.id]);

  const productMap = new Map<string, ProductFull>();
  for (const p of products) {
    if (productMap.has(p.slug)) throw new Error(`[Data] Trùng slug sản phẩm: ${p.slug}`);
    const documents = p.documents.map((d) => docFor(d.path, d));
    for (const d of documents) if (!d.products.includes(p.slug)) d.products.push(p.slug);
    const aiIds = [...new Set(p.aiFeatures.flatMap((a) => featureOf.get(a) ?? []))];
    productMap.set(p.slug, { ...p, documents, sources: p.sources.map((s) => docFor(s)), ai: features.map((f) => f.id).filter((id) => aiIds.includes(id)) });
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
  const featureList: AiFeatureFull[] = features.map((f) => ({
    ...f,
    products: productList.filter((p) => p.ai.includes(f.id)).map((p) => p.slug),
    algorithms: aiList.filter((a) => a.feature === f.id),
  }));
  for (const a of aiList) if (!features.some((f) => f.id === a.feature)) throw new Error(`[Data] Data/AI/algorithms.json: "${a.name}" gắn tính năng không có trong features.json — ${a.feature}`);

  // Hồ sơ năng lực 2026: danh mục model, năng lực, kịch bản ngành, ảnh chú thích tính năng
  const catalog = parse(CatalogSchema, readJson(join(DATA, "Site/catalog.json")), "Data/Site/catalog.json");
  const capability = parse(CapabilitySchema, readJson(join(DATA, "Site/capability.json")), "Data/Site/capability.json");
  const scenarios = parse(ScenariosSchema, readJson(join(DATA, "Site/scenarios.json")), "Data/Site/scenarios.json").scenarios;
  const shots = readArray("Site/feature-shots.json", FeatureShotSchema);
  const fail = (file: string, msg: string) => { throw new Error(`[Data] Data/Site/${file}: ${msg}`); };
  for (const m of catalog.models) if (!catalog.series.some((s) => s.id === m.series)) fail("catalog.json", `${m.model} gắn series không có — ${m.series}`);
  for (const sc of scenarios) {
    if (sc.solution && !solutionMap.has(sc.solution)) fail("scenarios.json", `${sc.id} liên kết giải pháp không có — ${sc.solution}`);
    for (const s of [...sc.series, ...sc.hotspots.flatMap((h) => (h.series ? [h.series] : []))]) if (!seriesOrder.includes(s)) fail("scenarios.json", `${sc.id} gắn dòng không có — ${s}`);
    for (const h of sc.hotspots) for (const f of h.features) if (!features.some((x) => x.id === f)) fail("scenarios.json", `${sc.id} / "${h.label}" gắn tính năng không có — ${f}`);
  }
  for (const s of shots) if (!productMap.has(s.product)) fail("feature-shots.json", `sản phẩm không có — ${s.product}`);
  // Model trong danh mục ↔ trang sản phẩm: chỉ khi trùng tên model (không khớp gần đúng)
  const slugByModel = new Map(productList.map((p) => [modelKey(p.model), p.slug]));
  // Danh mục ghi series A (Không AI) nhưng datasheet trên web có tính năng AI: hiện cảnh báo, chờ PM chốt
  const conflictOf = (series: string, slug: string | null) =>
    slug && series === "A" && productMap.get(slug)!.ai.length ? "Danh mục ghi “Không hỗ trợ AI” nhưng datasheet trên web có tính năng AI. Cần PM xác nhận trước khi báo khách." : null;
  const catalogFull = {
    ...catalog,
    models: catalog.models.map((m) => { const slug = slugByModel.get(modelKey(m.model)) ?? null; return { ...m, slug, conflict: conflictOf(m.series, slug) }; }),
  };

  return { products: productList, productMap, solutions: solutionList, solutionMap, documents, ai: aiList, features: featureList, series, company, home, catalog: catalogFull, capability, scenarios, shots };
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
export const getAiFeatures = () => getData().features;
export const aiFeatureName = (id: string) => getData().features.find((f) => f.id === id)?.nameVi ?? id;
export const getSeries = (): Series[] => getData().series;
export const getCompany = (): Company => getData().company;
export const getHome = (): Home => getData().home;
export const seriesName = (id: string) => getData().series.find((s) => s.id === id)?.name ?? id;
export type CatalogFull = Omit<Catalog, "models"> & { models: (Catalog["models"][number] & { slug: string | null; conflict: string | null })[] };
export const getCatalog = (): CatalogFull => getData().catalog;
export const getCapability = (): Capability => getData().capability;
export const getScenarios = (): Scenario[] => getData().scenarios;
export const getFeatureShots = (slug: string): FeatureShot[] => getData().shots.filter((s) => s.product === slug);
/** Kịch bản ngành rút gọn cho Client Component (đã đổi id → tên hiển thị); `solution` lọc theo giải pháp nếu có */
export function getSceneData(solution?: string) {
  const ref = (id: string) => ({ id, name: seriesName(id) });
  return getData().scenarios
    .filter((sc) => !solution || sc.solution === solution)
    .map((sc) => ({
      ...sc,
      solution: sc.solution ? { slug: sc.solution, name: getSolution(sc.solution)!.shortName || getSolution(sc.solution)!.name } : null,
      series: sc.series.map(ref),
      hotspots: sc.hotspots.map((h) => ({
        ...h,
        features: h.features.map((id) => ({ id, name: aiFeatureName(id), count: getData().features.find((f) => f.id === id)?.products.length ?? 0 })),
        series: h.series ? ref(h.series) : null,
      })),
    }));
}
/** Sản phẩm trên web nhưng không có trong danh mục camera hiện hành (chỉ xét dòng V-Secure) — để báo PM đối chiếu */
export const productsNotInCatalog = () => {
  const inCat = new Set(getData().catalog.models.map((m) => m.slug));
  return getData().products.filter((p) => p.series === "v-secure" && !inCat.has(p.slug));
};

/* ---------- Thông số chính, nhu cầu (dùng chung cho card, trang chi tiết, bộ lọc) ---------- */
/** Giá trị của hàng thông số đầu tiên có nhãn hiển thị trùng label */
export function specValue(p: Pick<Product, "specs">, label: string): string {
  for (const rows of Object.values(p.specs)) for (const [k, v] of rows) if (specLabel(k) === label && v) return v;
  return "";
}

/** [nhãn, giá trị] theo loại thiết bị: switch hiện cổng / uplink / PoE thay vì độ phân giải */
export function keySpecs(p: ProductFull): [string, string][] {
  const kind = kindOf(p.category);
  if (kind === "camera") return [["Độ phân giải", p.resolution], ["Chuẩn bảo vệ", p.ipRating]];
  return KEY_SPEC_LABELS[kind].map((l) => [l, specValue(p, l) || (l === "PoE budget" ? specValue(p, "PoE") : "")]);
}

export function needsOf(p: ProductFull): NeedId[] {
  const text = JSON.stringify([p.name, p.summary, p.features, p.specs]);
  const out: NeedId[] = [];
  if (p.ai.includes("lpr")) out.push("lpr");
  if (p.ai.includes("face-recognition")) out.push("face");
  if (/\bPoE\b/i.test(text)) out.push("poe");
  if (/NDAA/i.test(text)) out.push("ndaa");
  if (/IP6[6-9]/.test(p.ipRating) || /outdoor|ngoài trời/i.test(text)) out.push("outdoor");
  return out;
}

/* ---------- Bản rút gọn cho Client Component ---------- */
export type ProductCardData = Pick<ProductFull, "slug" | "model" | "name" | "series" | "category" | "resolution" | "ipRating" | "image" | "ai"> & {
  seriesName: string;
  categoryLabel: string;
  keySpecs: [string, string][];
  needs: NeedId[];
  searchText: string;
};
export function toCard(p: ProductFull): ProductCardData {
  const specText = Object.values(p.specs).flat().map((r) => r.join(" ")).join(" ");
  return {
    slug: p.slug, model: p.model, name: p.name, series: p.series, category: p.category, resolution: p.resolution,
    ipRating: p.ipRating, image: p.image, ai: p.ai, seriesName: seriesName(p.series), categoryLabel: catLabel(p.category),
    keySpecs: keySpecs(p), needs: needsOf(p),
    searchText: `${p.model} ${p.name} ${p.category} ${catLabel(p.category)} ${p.summary} ${p.ai.map(aiFeatureName).join(" ")} ${p.aiFeatures.join(" ")} ${specText}`,
  };
}
