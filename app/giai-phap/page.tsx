import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { SolutionsBrowser, SolutionsBrowserView } from "@/components/solutions/solutions-browser";
import { getSolutions } from "@/lib/data";

export const metadata: Metadata = { title: "Giải pháp" };

export default function SolutionsPage() {
  const sols = getSolutions().map(({ slug, name, shortName, industry, summary, cover }) => ({ slug, name, shortName, industry, summary, cover }));
  return (
    <>
      <PageHero image="/img/scenes/solutions.jpg" crumbs={[{ label: "Giải pháp" }]} eyebrow="Giải pháp theo ngành" title="Giải pháp MK Vision" lead="Bài toán, kiến trúc, phân hệ chức năng và sản phẩm đề xuất cho từng ngành, kèm slide để giới thiệu với khách hàng." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<SolutionsBrowserView solutions={sols} initialIndustry="" />}>
          <SolutionsBrowser solutions={sols} />
        </Suspense>
      </main>
    </>
  );
}
