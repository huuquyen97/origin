import "server-only";
import { getAi, getDocuments, getProducts, getSolutions, seriesName } from "@/lib/data";
import { DOC_TYPE_LABEL, type SearchGroup } from "@/lib/strings";
import { norm } from "./normalize";

export type SearchItem = {
  type: SearchGroup;
  url: string;
  external: boolean;
  title: string;
  sub: string;
  thumb: string;
  mono: string;
  /** các trường đã chuẩn hoá (bỏ dấu) cho Fuse.js */
  nt: string;
  nk: string;
  nx: string;
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const p of getProducts()) {
    const sn = seriesName(p.series);
    const specText = Object.values(p.specs).flat().map((r) => r.join(" ")).join(" ");
    items.push({
      type: "Sản phẩm", url: `/san-pham/${p.slug}`, external: false, title: `${p.model} — ${p.name}`,
      sub: [sn, p.category, p.resolution].filter(Boolean).join(" · "), thumb: p.image, mono: p.model,
      nt: norm(`${p.model} ${p.name}`), nk: norm(`${sn} ${p.category} ${p.resolution} ${p.ipRating} ${p.aiFeatures.join(" ")} ${p.features.join(" ")}`), nx: norm(`${p.summary} ${specText}`),
    });
  }
  for (const s of getSolutions()) {
    items.push({
      type: "Giải pháp", url: `/giai-phap/${s.slug}`, external: false, title: s.name,
      sub: [s.shortName, s.industry].filter(Boolean).join(" · "), thumb: "", mono: (s.shortName || s.name).slice(0, 3).toUpperCase(),
      nt: norm(`${s.name} ${s.shortName}`), nk: norm(`${s.industry} ${s.relatedSeries.map(seriesName).join(" ")}`),
      nx: norm(`${s.summary} ${s.painPoints.join(" ")} ${s.modules.map((m) => `${m.name} ${m.description}`).join(" ")} ${s.features.join(" ")}`),
    });
  }
  for (const a of getAi()) {
    items.push({
      type: "Thuật toán AI", url: `/thuat-toan-ai?q=${encodeURIComponent(a.name)}`, external: false, title: a.name,
      sub: [a.nameVi, a.category].filter(Boolean).join(" · "), thumb: "", mono: "AI",
      nt: norm(`${a.name} ${a.nameVi}`), nk: norm(a.category), nx: norm(a.description),
    });
  }
  for (const d of getDocuments()) {
    items.push({
      type: "Tài liệu", url: d.url, external: true, title: d.title,
      sub: [DOC_TYPE_LABEL[d.type], d.series ? seriesName(d.series) : ""].filter(Boolean).join(" · "), thumb: "", mono: d.ext.toUpperCase(),
      nt: norm(d.title), nk: norm(`${d.series} ${DOC_TYPE_LABEL[d.type]} ${d.products.join(" ")}`), nx: norm(`${d.description} ${d.path}`),
    });
  }
  return items;
}
