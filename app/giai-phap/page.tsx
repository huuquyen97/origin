import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { ScenarioExplorer, ScenarioExplorerView } from "@/components/solutions/scenario-explorer";
import { SolutionsBrowser, SolutionsBrowserView } from "@/components/solutions/solutions-browser";
import { getSceneData, getSolutions } from "@/lib/data";
import { SCENE } from "@/lib/strings";

export const metadata: Metadata = { title: "Giải pháp" };

export default function SolutionsPage() {
  const scenes = getSceneData();
  const sols = getSolutions().map(({ slug, name, shortName, industry, summary, cover }) => ({ slug, name, shortName, industry, summary, cover }));
  return (
    <>
      <PageHero image="/img/scenes/solutions.jpg" crumbs={[{ label: "Giải pháp" }]} eyebrow="Giải pháp theo ngành" title="Giải pháp MK Vision" lead="Bài toán, kiến trúc, phân hệ chức năng và sản phẩm đề xuất cho từng ngành, kèm slide để giới thiệu với khách hàng." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<SolutionsBrowserView solutions={sols} initialIndustry="" />}>
          <SolutionsBrowser solutions={sols} />
        </Suspense>

        <section id="kich-ban" className="mt-16 scroll-mt-24 border-t border-line pt-12" aria-labelledby="scene-h">
          <h2 id="scene-h" className="heading-2 mb-2">{SCENE.title}</h2>
          <p className="mb-6 text-[15px] text-muted">{SCENE.lead}</p>
          <Suspense fallback={<ScenarioExplorerView scenes={scenes} />}>
            <ScenarioExplorer scenes={scenes} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
