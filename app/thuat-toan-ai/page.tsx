import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/hero";
import { AiBrowser, AiBrowserView } from "@/components/ai/ai-browser";
import { getAi } from "@/lib/data";

export const metadata: Metadata = { title: "Thuật toán AI" };

export default function AiPage() {
  const items = getAi().map((a) => ({
    name: a.name, nameVi: a.nameVi, category: a.category, description: a.description, supportedOn: a.supportedOn,
    source: a.sources[0] ? { url: a.sources[0].url, label: a.sources[0].path.split("/").pop()! } : undefined,
  }));
  return (
    <>
      <PageHero image="/img/scenes/ai.jpg" crumbs={[{ label: "Thuật toán AI" }]} eyebrow="Edge AI" title="Thuật toán AI trên camera" lead="Danh mục thuật toán AI của MK Vision, mô tả chức năng và thiết bị hỗ trợ, theo tài liệu AI Function Description." />
      <main className="container-x py-12 md:py-14">
        <Suspense fallback={<AiBrowserView items={items} initialQuery="" />}>
          <AiBrowser items={items} />
        </Suspense>
      </main>
    </>
  );
}
