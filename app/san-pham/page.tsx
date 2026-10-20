import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { ProductBrowser, ProductBrowserView } from "@/components/products/product-browser";
import { getAiFeatures, getProducts, getSeries, toCard } from "@/lib/data";

export const metadata: Metadata = { title: "Sản phẩm" };

export default function ProductsPage() {
  const products = getProducts().map(toCard);
  const series = getSeries().map((s) => ({ id: s.id, name: s.name }));
  const aiFeatures = getAiFeatures().filter((f) => f.products.length).map((f) => ({ id: f.id, name: f.nameVi }));
  return (
    <>
      <PageHero
        image="/img/scenes/products.jpg"
        crumbs={[{ label: "Sản phẩm" }]}
        eyebrow="Danh mục sản phẩm"
        title="Tất cả sản phẩm"
        lead="Lọc theo nhu cầu của khách, dòng, loại thiết bị, độ phân giải và tính năng AI."
      />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<ProductBrowserView products={products} series={series} aiFeatures={aiFeatures} initial={{}} />}>
          <ProductBrowser products={products} series={series} aiFeatures={aiFeatures} />
        </Suspense>
      </main>
    </>
  );
}
