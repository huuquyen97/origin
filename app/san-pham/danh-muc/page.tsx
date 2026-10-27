import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Info } from "lucide-react";
import { PageHero } from "@/components/hero";
import { CatalogTable, CatalogTableView } from "@/components/products/catalog-table";
import { Shots } from "@/components/solutions/shots";
import { getCatalog, getSeries, productsNotInCatalog } from "@/lib/data";
import { CATALOG, PROFILE } from "@/lib/strings";

export const metadata: Metadata = { title: CATALOG.title };

/** Danh mục model camera IP hiện hành theo hồ sơ năng lực 2026 (tr.44–45): phân hạng series, lọc nhanh, link sang trang model nếu đã có datasheet. */
export default function CatalogPage() {
  const cat = getCatalog();
  const lines = getSeries();
  const missing = productsNotInCatalog();
  const count = (id: string) => cat.models.filter((m) => m.series === id).length;
  const withPage = cat.models.filter((m) => m.slug).length;
  const tableProps = { rows: cat.models, series: cat.series.map(({ id, short }) => ({ id, short })), envLegend: cat.envLegend };

  return (
    <>
      <PageHero
        image="/img/scenes/vsecure-1.jpg"
        crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { label: "Danh mục hiện hành" }]}
        eyebrow={`V-Secure · ${cat.date}`}
        title={cat.title}
        lead={`Phân hạng series A / B / E / S theo mức AI. ${withPage}/${cat.models.length} model đã có trang thông số trên web; các model còn lại chưa có datasheet.`}
      />
      <main className="container-x py-12 md:py-14">
        <section aria-labelledby="series-h">
          <h2 id="series-h" className="heading-2 mb-5">Phân hạng series</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cat.series.map((s) => (
              <div key={s.id} className="card p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[28px] font-bold leading-none text-brand-navy">{s.id}</span>
                  <span className="text-[13px] text-muted">{s.lines ? s.lines.length + " dòng" : `${count(s.id)} model`}</span>
                </div>
                <h3 className="mt-2 text-base">{s.name} · {s.short}</h3>
                <ul className="mt-2 grid gap-1 text-[14px] text-ink-2">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                {s.lines && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.lines.map((l) => {
                      const line = lines.find((x) => x.name === l);
                      return line ? <Link key={l} href={`/san-pham?series=${line.id}`} className="tag tag-navy hover:underline">{l}</Link> : <span key={l} className="tag">{l}</span>;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="models-h" className="mt-12">
          <h2 id="models-h" className="heading-2 mb-5">{cat.models.length} model camera IP</h2>
          <Suspense fallback={<CatalogTableView {...tableProps} initialQ="" />}>
            <CatalogTable {...tableProps} />
          </Suspense>
        </section>

        {missing.length > 0 && (
          <section className="mt-10 note-warn" aria-label={CATALOG.notInCatalog}>
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <b>{CATALOG.notInCatalog}:</b>{" "}
              {missing.map((p, i) => (
                <span key={p.slug}>{i > 0 && ", "}<Link href={`/san-pham/${p.slug}`} className="font-semibold underline">{p.model}</Link></span>
              ))}
              . {CATALOG.notInCatalogNote}
            </div>
          </section>
        )}

        <section aria-labelledby="shots-h" className="mt-12">
          <h2 id="shots-h" className="heading-2 mb-2">Thiết kế tiêu biểu</h2>
          <p className="mb-5 text-[14px] text-muted">{PROFILE.illustration}</p>
          <Shots images={cat.shots.map((s) => s.image)} labels={cat.shots.map((s) => `${s.title} (${s.page})`)} />
        </section>

        <p className="mt-10 text-[13px] text-faint">{PROFILE.source(cat.sourcePages)}</p>
      </main>
    </>
  );
}
