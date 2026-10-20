import { z } from "zod";

export const SPEC_GROUPS = ["Image", "Lens", "AI", "Video", "Audio", "Network", "Storage", "Power", "Environment", "Physical", "Other"] as const;

export const DOC_STATUSES = ["public", "internal", "old", "expired"] as const;

export const DOC_TYPES = ["datasheet", "brochure", "slide", "hdsd", "certificate", "catalog", "srs", "ai", "profile", "architecture", "media", "other"] as const;

const docType = z.string().transform((t) => ((DOC_TYPES as readonly string[]).includes(t) ? (t as (typeof DOC_TYPES)[number]) : "other"));

export const DocRefSchema = z.object({
  title: z.string(),
  type: docType,
  path: z.string().min(1),
});

export const ProductSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug chỉ gồm a-z, 0-9, dấu gạch ngang"),
  model: z.string().min(1),
  name: z.string(),
  series: z.string().min(1),
  category: z.string(),
  resolution: z.string(),
  ipRating: z.string(),
  summary: z.string(),
  features: z.array(z.string()),
  aiFeatures: z.array(z.string()),
  specs: z.record(z.string(), z.array(z.tuple([z.string(), z.string()]))),
  solutions: z.array(z.string()),
  documents: z.array(DocRefSchema),
  image: z.string(),
  status: z.enum(["", "đang bán", "ngừng bán", "sắp ra mắt"]).or(z.string()),
  updatedAt: z.string(),
  sources: z.array(z.string()),
  notes: z.string(),
  /** Thông số đang xung đột giữa các tài liệu; group/label rỗng = cấp sản phẩm */
  unconfirmed: z.array(z.object({ group: z.string(), label: z.string(), note: z.string() })).default([]),
});

export const SolutionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number(),
  name: z.string().min(1),
  shortName: z.string(),
  industry: z.string().min(1),
  summary: z.string(),
  painPoints: z.array(z.string()),
  architecture: z.string(),
  modules: z.array(z.object({ name: z.string(), description: z.string() })),
  features: z.array(z.string()),
  benefits: z.array(z.string()),
  targetCustomers: z.array(z.string()),
  relatedSeries: z.array(z.string()),
  products: z.array(z.string()),
  documents: z.array(DocRefSchema),
  cover: z.string(),
  images: z.array(z.string()),
  sources: z.array(z.string()),
  notes: z.string(),
  /** Cấu hình đề xuất: hạng mục theo tài liệu; product chỉ điền khi tài liệu nêu đúng model */
  configuration: z.array(z.object({ item: z.string(), product: z.string().default(""), note: z.string().default("") })).default([]),
});

export const DocumentSchema = z.object({
  path: z.string().min(1),
  title: z.string(),
  type: docType,
  description: z.string(),
  series: z.string(),
  products: z.array(z.string()),
  status: z.enum(["public", "internal", "old"]).default("internal"),
  statusNote: z.string().default(""),
  /** YYYY-MM-DD; validTo đã qua thì tài liệu tự chuyển "Hết hạn" */
  validFrom: z.string().default(""),
  validTo: z.string().default(""),
});

export const AiSchema = z.object({
  name: z.string().min(1),
  nameVi: z.string(),
  category: z.string(),
  description: z.string(),
  supportedOn: z.array(z.string()),
  sources: z.array(z.string()),
  feature: z.string(),
});

/** Từ điển tính năng AI chuẩn; aliases = chuỗi nguyên văn trong aiFeatures của sản phẩm */
export const AiFeatureSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nameVi: z.string().min(1),
  group: z.string(),
  keywords: z.array(z.string()),
  aliases: z.array(z.string()),
});

export const SeriesSchema = z.object({
  id: z.string(),
  order: z.number(),
  name: z.string(),
  aliases: z.array(z.string()),
  kind: z.string(),
  tagline: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  certifications: z.array(z.string()),
  image: z.string(),
  solution: z.string(),
});

export const CompanySchema = z.object({
  name: z.string(),
  email: z.string(),
  hotline: z.string(),
  about: z.string(),
  milestones: z.array(z.object({ year: z.string(), text: z.string() })),
  capabilities: z.array(z.string()),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  factory: z.string(),
  certifications: z.array(z.string()),
  partners: z.array(z.string()),
  sources: z.array(z.string()),
});

export const HomeSchema = z.object({
  features: z.array(z.object({ eyebrow: z.string(), quote: z.string(), who: z.string(), role: z.string(), image: z.string(), href: z.string(), cta: z.string() })),
  featuredProducts: z.array(z.string()),
  stats: z.array(z.object({ value: z.string(), label: z.string(), sub: z.string().optional(), image: z.string().optional() })),
  searchSuggestions: z.array(z.string()),
});

export type DocType = (typeof DOC_TYPES)[number];
export type DocStatus = (typeof DOC_STATUSES)[number];
export type AiFeature = z.infer<typeof AiFeatureSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Solution = z.infer<typeof SolutionSchema>;
export type DocumentMeta = z.infer<typeof DocumentSchema>;
export type AiAlgorithm = z.infer<typeof AiSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Home = z.infer<typeof HomeSchema>;
