import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { AiBrowser, AiBrowserView, type AiItem } from "@/components/ai/ai-browser";
import { getAiFeatures, getProduct } from "@/lib/data";

export const metadata: Metadata = { title: "Tính năng AI" };

export default function AiPage() {
  const items: AiItem[] = getAiFeatures().map((f) => ({
    id: f.id, name: f.name, nameVi: f.nameVi, group: f.group, keywords: f.keywords,
    products: f.products.map((slug) => ({ slug, model: getProduct(slug)!.model })),
    // Mô tả trùng nhau giữa các tài liệu chỉ giữ một lần
    descriptions: f.algorithms
      .filter((a, i, all) => a.description && all.findIndex((x) => x.description === a.description) === i)
      .map((a) => ({ text: a.description, source: a.sources[0] ? { url: a.sources[0].url, label: a.sources[0].path.split("/").pop()! } : undefined })),
    notes: [...new Set(f.algorithms.flatMap((a) => a.supportedOn))].map((x) => `Tài liệu thuật toán ghi: ${x}`),
  }));
  return (
    <>
      <PageHero image="/img/scenes/ai.jpg" crumbs={[{ label: "Tính năng AI" }]} eyebrow="AI xử lý tại biên" title="Tính năng AI" lead="Danh sách tính năng AI dùng chung cho sản phẩm, bộ lọc và tìm kiếm: tên tiếng Việt kèm tên tiếng Anh, model hỗ trợ theo datasheet và mô tả theo tài liệu thuật toán." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<AiBrowserView items={items} initialQuery="" />}>
          <AiBrowser items={items} />
        </Suspense>
      </main>
    </>
  );
}
