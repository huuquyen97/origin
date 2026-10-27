import "server-only";
import { getAiFeatures, getCapability, getCatalog, getDocuments, getProducts, getScenarios, getSolutions, keySpecs, seriesName } from "@/lib/data";
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
  // Model trong danh mục hiện hành chưa có trang thông số: dẫn tới dòng tương ứng trong danh mục
  const cat = getCatalog();
  for (const m of cat.models.filter((x) => !x.slug)) {
    const short = cat.series.find((s) => s.id === m.series)?.short ?? "";
    items.push({
      type: "Sản phẩm", url: `/san-pham/danh-muc?q=${encodeURIComponent(m.model)}`, external: false, title: `${m.model} — Camera IP ${m.form} ${m.mp}`,
      sub: [`Series ${m.series} · ${short}`, m.connect, m.soc, "Chưa có datasheet"].join(" · "), thumb: "", mono: m.model,
      nt: norm(`${m.model} ${m.form}`), nk: norm(`V-Secure camera ${m.form} ${m.mp} ${m.connect} ${m.soc} series ${m.series} ${short}`), nx: "",
      nm: norm(m.model).replace(/[^a-z0-9]/g, ""),
    });
  }
  for (const sc of getScenarios()) {
    items.push({
      type: "Giải pháp", url: `/giai-phap?kb=${sc.id}#kich-ban`, external: false, title: `Kịch bản ứng dụng: ${sc.name}`,
      sub: `${sc.hotspots.length} tình huống · Hồ sơ năng lực 2026`, thumb: "", mono: "KB",
      nt: norm(`kịch bản ${sc.name}`), nk: norm(sc.hotspots.map((h) => h.label).join(" ")), nx: "", nm: "",
    });
  }
  const cap = getCapability();
  items.push({
    type: "Giải pháp", url: "/nang-luc", external: false, title: "Năng lực MK Vision", sub: "Công nghệ lõi · R&D · Sản xuất · Kiểm soát chất lượng", thumb: "", mono: "MKV",
    nt: norm("năng lực MK Vision hồ sơ năng lực"), nk: norm(`${cap.cores.map((c) => c.name).join(" ")} sản xuất nhà máy SMT PCBA phòng sạch ISO 7 R&D EVT DVT PVT`),
    nx: norm(cap.cores.flatMap((c) => c.groups.map((g) => g.name)).join(" ")), nm: "",
  });
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
