import "server-only";
import { getAiFeatures, getDocuments, getProducts, getSolutions, keySpecs, seriesName } from "@/lib/data";
import { catLabel } from "@/lib/labels";
import { DOC_STATUS, DOC_TYPE_LABEL, type SearchGroup } from "@/lib/strings";
import { norm } from "./normalize";

export type SearchItem = {
  type: SearchGroup;
  url: string;
  external: boolean;
  title: string;
  sub: string;
  thumb: string;
  mono: string;
  /** các trường đã chuẩn hoá (bỏ dấu): tiêu đề, từ khoá, nội dung; nm = model chỉ gồm chữ + số */
  nt: string;
  nk: string;
  nx: string;
  nm: string;
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  const features = getAiFeatures();
  const featureText = (ids: string[]) => features.filter((f) => ids.includes(f.id)).map((f) => `${f.nameVi} ${f.name} ${f.keywords.join(" ")}`).join(" ");

  for (const p of getProducts()) {
    const sn = seriesName(p.series);
    const specText = Object.values(p.specs).flat().map((r) => r.join(" ")).join(" ");
    const facts = keySpecs(p).map(([, v]) => v).filter(Boolean);
    items.push({
      type: "Sản phẩm", url: `/san-pham/${p.slug}`, external: false, title: `${p.model} — ${p.name}`,
      sub: [sn, catLabel(p.category), ...facts.filter((v) => v.length <= 24)].join(" · "), thumb: p.image, mono: p.model,
      nt: norm(`${p.model} ${p.name}`),
      nk: norm(`${sn} ${p.category} ${catLabel(p.category)} ${p.resolution} ${p.ipRating} ${featureText(p.ai)} ${p.features.join(" ")}`),
      nx: norm(`${p.summary} ${p.aiFeatures.join(" ")} ${specText}`),
      nm: norm(p.model).replace(/[^a-z0-9]/g, ""),
    });
  }
  for (const s of getSolutions()) {
    items.push({
      type: "Giải pháp", url: `/giai-phap/${s.slug}`, external: false, title: s.name,
      sub: [s.shortName, s.industry].filter(Boolean).join(" · "), thumb: "", mono: (s.shortName || s.name).slice(0, 3).toUpperCase(),
      nt: norm(`${s.name} ${s.shortName}`), nk: norm(`${s.industry} ${s.relatedSeries.map(seriesName).join(" ")} ${s.targetCustomers.join(" ")}`),
      nx: norm(`${s.summary} ${s.painPoints.join(" ")} ${s.modules.map((m) => `${m.name} ${m.description}`).join(" ")} ${s.features.join(" ")}`),
      nm: "",
    });
  }
  for (const f of features) {
    items.push({
      type: "Tính năng AI", url: `/thuat-toan-ai#${f.id}`, external: false, title: f.nameVi,
      sub: [f.name, f.products.length ? `${f.products.length} model` : ""].filter(Boolean).join(" · "), thumb: "", mono: "AI",
      nt: norm(`${f.nameVi} ${f.name}`), nk: norm(`${f.group} ${f.keywords.join(" ")}`),
      nx: norm(f.algorithms.map((a) => a.description).join(" ")),
      nm: "",
    });
  }
  for (const d of getDocuments()) {
    items.push({
      type: "Tài liệu", url: d.url, external: true, title: d.title,
      sub: [DOC_STATUS[d.status].label, DOC_TYPE_LABEL[d.type], d.series ? seriesName(d.series) : ""].filter(Boolean).join(" · "), thumb: "", mono: d.ext.toUpperCase(),
      nt: norm(d.title), nk: norm(`${d.series} ${DOC_TYPE_LABEL[d.type]} ${d.products.join(" ")}`), nx: norm(`${d.description} ${d.path}`),
      nm: "",
    });
  }
  return items;
}
