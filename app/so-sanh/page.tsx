import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { Compare, CompareView, type CompareProduct } from "@/components/products/compare-view";
import { aiFeatureName, getProducts, getSeries, toCard } from "@/lib/data";
import { specLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "So sánh sản phẩm" };

export default function ComparePage() {
  // Nhãn thông số đổi sang nhãn chuẩn để các datasheet đặt tên khác nhau vẫn xếp cùng hàng
  const products: CompareProduct[] = getProducts().map((p) => ({
    ...toCard(p),
    aiNames: p.ai.map(aiFeatureName),
    specs: Object.fromEntries(Object.entries(p.specs).map(([g, rows]) => [g, rows.map(([k, v]) => [specLabel(k), v] as [string, string])])),
    unconfirmed: Object.fromEntries(p.unconfirmed.filter((u) => u.label).map((u) => [`${u.group}|${specLabel(u.label)}`, u.note])),
  }));
  const props = { products, series: getSeries().map((s) => ({ id: s.id, name: s.name })) };
  return (
    <>
      <PageHero image="/img/scenes/products.jpg" crumbs={[{ label: "So sánh" }]} eyebrow="Công cụ" title="So sánh sản phẩm" lead="Đặt 2–4 model cạnh nhau. Các dòng thông số khác nhau được tô nổi để bạn tư vấn nhanh." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<CompareView {...props} initial={{}} />}>
          <Compare {...props} />
        </Suspense>
      </main>
    </>
  );
}
