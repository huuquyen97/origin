import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { CompareView } from "@/components/products/compare-view";
import { getProducts, getSeries, seriesName } from "@/lib/data";

export const metadata: Metadata = { title: "So sánh sản phẩm" };

export default function ComparePage() {
  const products = getProducts().map((p) => ({
    slug: p.slug, model: p.model, name: p.name, series: p.series, seriesName: seriesName(p.series), category: p.category,
    resolution: p.resolution, ipRating: p.ipRating, image: p.image, aiFeatures: p.aiFeatures, specs: p.specs,
  }));
  return (
    <>
      <PageHero image="/img/scenes/products.jpg" crumbs={[{ label: "So sánh" }]} eyebrow="Công cụ" title="So sánh sản phẩm" lead="Đặt 2–4 model cạnh nhau. Các dòng thông số khác nhau được tô nổi để bạn tư vấn nhanh." />
      <main className="container-x py-12 md:py-14">
        <Suspense>
          <CompareView products={products} series={getSeries().map((s) => ({ id: s.id, name: s.name }))} />
        </Suspense>
      </main>
    </>
  );
}
