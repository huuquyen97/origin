import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { ProductBrowser, ProductBrowserView } from "@/components/products/product-browser";
import { getAiFeatures, getCatalog, getProducts, getSeries, toCard } from "@/lib/data";
import { CATALOG } from "@/lib/strings";

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
        <Link href="/san-pham/danh-muc" className="card card-link mb-8 flex-row flex-wrap items-center justify-between gap-3 bg-brand-navy-50 px-5 py-4">
          <span>
            <b className="block text-base text-ink">{CATALOG.link}</b>
            <span className="text-[14px] text-muted">Phân hạng series A / B / E / S theo mức AI · {getCatalog().date}</span>
          </span>
          <ArrowRight className="size-5 text-brand-navy" aria-hidden />
        </Link>
        <Suspense fallback={<ProductBrowserView products={products} series={series} aiFeatures={aiFeatures} initial={{}} />}>
          <ProductBrowser products={products} series={series} aiFeatures={aiFeatures} />
        </Suspense>
      </main>
    </>
  );
}
