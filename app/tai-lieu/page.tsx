import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { DocsBrowser, DocsBrowserView } from "@/components/docs/docs-browser";
import { getDocuments, getProduct, getSeries } from "@/lib/data";

export const metadata: Metadata = { title: "Thư viện tài liệu" };

export default function DocsPage() {
  const series = getSeries();
  const docs = getDocuments().map((d) => ({
    path: d.path, url: d.url, ext: d.ext, title: d.title, type: d.type, description: d.description,
    topic: series.find((s) => s.id === d.series)?.name ?? (d.series || "Chung"),
    products: d.products.map(getProduct).filter((p) => p !== undefined).map((p) => ({ slug: p.slug, model: p.model })),
  }));
  return (
    <>
      <PageHero image="/img/scenes/docs.jpg" crumbs={[{ label: "Tài liệu" }]} eyebrow="Thư viện" title="Tài liệu chính thống" lead="Datasheet, catalogue, slide, hướng dẫn sử dụng và chứng nhận. Mở trực tiếp file gốc, không qua bản sao." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<DocsBrowserView docs={docs} initial={{}} />}>
          <DocsBrowser docs={docs} />
        </Suspense>
      </main>
    </>
  );
}
