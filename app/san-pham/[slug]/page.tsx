import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Columns3, Download, Info } from "lucide-react";
import { PageHero } from "@/components/hero";
import { DocRow, ProductCard, ProductMedia, SolutionCard } from "@/components/cards";
import { CopyLinkButton, CopySpecsButton } from "@/components/products/copy-buttons";
import { getProduct, getProducts, getSolution, seriesName, toCard } from "@/lib/data";
import { SPEC_GROUPS } from "@/lib/data/schema";
import { SPEC_GROUP_LABEL, T } from "@/lib/strings";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.model} — ${p.name}` : "Không tìm thấy sản phẩm" };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const sName = seriesName(p.series);
  const groups = [...SPEC_GROUPS.filter((g) => p.specs[g]?.length), ...Object.keys(p.specs).filter((g) => !(SPEC_GROUPS as readonly string[]).includes(g))];
  const datasheet = p.sources[0] ?? p.documents.find((d) => d.type === "datasheet");
  const sols = p.solutions.map(getSolution).filter((s) => s !== undefined);
  const related = getProducts().filter((x) => x.series === p.series && x.slug !== p.slug).slice(0, 4);
  const keyFacts = [["Dòng", sName], ["Loại", p.category], ["Độ phân giải", p.resolution], ["Chuẩn bảo vệ", p.ipRating]];

  const specText = [`${p.model} — ${p.name}`, `Dòng: ${sName}`];
  for (const g of groups) {
    specText.push("", `[${SPEC_GROUP_LABEL[g] ?? g}]`);
    for (const [k, v] of p.specs[g]) specText.push(`${k}: ${v || T.missing}`);
  }
  if (datasheet) specText.push("", `Nguồn: ${datasheet.path.split("/").pop()}`);

  return (
    <>
      <PageHero image="/img/scenes/products.jpg" crumbs={[{ href: "/san-pham", label: "Sản phẩm" }, { href: `/san-pham?series=${p.series}`, label: sName }]} eyebrow="Chi tiết sản phẩm" title={p.model} lead={p.name} />
      <main className="container-x py-12 md:py-14">
        <div className="grid gap-7 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-5">
            <ProductMedia image={p.image} model={p.model} alt={p.name || p.model} className="aspect-square rounded-xl3 [&_img]:p-9" />
            <dl className="mt-3.5 grid grid-cols-2 gap-2.5">
              {keyFacts.map(([k, v]) => (
                <div key={k} className="rounded-[14px] bg-surface px-3.5 py-3">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 text-[14.5px] font-semibold tabular-nums">{v || T.missing}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="min-w-0">
            <div className="grid gap-3.5">
              <div className="flex flex-wrap gap-1.5">
                <span className="tag">{sName}</span>
                {p.status && <span className="tag tag-navy">{p.status}</span>}
                {p.updatedAt && <span className="tag">Cập nhật: {p.updatedAt}</span>}
              </div>
              {p.summary && <p className="lead !text-ink-2">{p.summary}</p>}
              <div className="mt-1.5 flex flex-wrap gap-2">
                {datasheet && <a className="btn btn-dark" href={datasheet.url} target="_blank" rel="noopener"><Download /> Datasheet</a>}
                <CopySpecsButton text={specText.join("\n")} />
                <Link className="btn btn-ghost" href={`/so-sanh?ids=${p.slug}`}><Columns3 /> So sánh</Link>
                <CopyLinkButton />
              </div>
            </div>

            <div className={`mt-6 flex gap-2.5 rounded-2xl px-4 py-3.5 text-[13.5px] ${datasheet ? "bg-brand-navy-50 text-brand-navy-600" : "bg-[#fbf6e8] text-[#7a5a12]"}`}>
              <Info className="mt-0.5 size-[17px] shrink-0" />
              {datasheet ? (
                <span>Thông số dưới đây lấy nguyên văn từ <a className="underline underline-offset-2" href={datasheet.url} target="_blank" rel="noopener">{datasheet.path.split("/").pop()}</a>. Ô “{T.missing}” nghĩa là datasheet không ghi.</span>
              ) : (
                <span>Chưa có datasheet gốc cho sản phẩm này.</span>
              )}
            </div>

            {p.features.length > 0 && (
              <section className="mt-9">
                <h3 className="mb-3.5 text-lg">Điểm nổi bật</h3>
                <ul className="check-list">{p.features.map((h) => <li key={h}>{h}</li>)}</ul>
              </section>
            )}

            {p.aiFeatures.length > 0 && (
              <section className="mt-9">
                <h3 className="mb-3.5 text-lg">Tính năng AI</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.aiFeatures.map((a) => <Link key={a} className="pill" href={`/thuat-toan-ai?q=${encodeURIComponent(a)}`}>{a}</Link>)}
                </div>
              </section>
            )}

            <section className="mt-9">
              <h3 className="mb-3.5 text-lg">Thông số kỹ thuật</h3>
              {groups.length ? (
                groups.map((g, i) => (
                  <details key={g} open={i < 3} className="group mb-3 overflow-hidden rounded-2xl border border-line bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 bg-surface px-4 py-3.5 text-[14.5px] font-semibold [&::-webkit-details-marker]:hidden">
                      <span>{SPEC_GROUP_LABEL[g] ?? g}<span className="ml-2 text-[12.5px] font-medium text-faint">{p.specs[g].length}</span></span>
                      <ChevronDown className="size-4 text-muted transition group-open:rotate-180" />
                    </summary>
                    <table className="w-full border-collapse text-sm max-sm:block">
                      <tbody className="max-sm:block">
                        {p.specs[g].map(([k, v], j) => (
                          <tr key={`${k}-${j}`} className="border-t border-line max-sm:block max-sm:px-4 max-sm:py-2.5">
                            <th scope="row" className="w-[38%] px-4 py-2.5 text-left align-top font-medium text-muted max-sm:block max-sm:w-full max-sm:p-0 max-sm:text-[12.5px]">{k}</th>
                            <td className="px-4 py-2.5 align-top tabular-nums [overflow-wrap:anywhere] max-sm:block max-sm:p-0">{v || T.missing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                ))
              ) : (
                <div className="rounded-xl2 border border-dashed border-line-2 px-5 py-10 text-center text-muted"><b className="mb-1 block text-ink">Chưa có thông số</b>Datasheet chưa được nhập.</div>
              )}
            </section>

            {p.notes && (
              <div className="mt-9 flex gap-2.5 rounded-2xl bg-[#fbf6e8] px-4 py-3.5 text-[13.5px] text-[#7a5a12]">
                <Info className="mt-0.5 size-[17px] shrink-0" />
                <span><b>Ghi chú dữ liệu:</b> {p.notes}</span>
              </div>
            )}

            {p.documents.length > 0 && (
              <section className="mt-9">
                <h3 className="mb-3.5 text-lg">Tài liệu</h3>
                <div className="grid gap-2">{p.documents.map((d) => <DocRow key={d.path} d={d} />)}</div>
              </section>
            )}

            {sols.length > 0 && (
              <section className="mt-9">
                <h3 className="mb-3.5 text-lg">Giải pháp liên quan</h3>
                <div className="grid gap-3.5 sm:grid-cols-2">{sols.map((s) => <SolutionCard key={s.slug} s={s} />)}</div>
              </section>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="pt-12">
            <div className="mb-8 flex items-end justify-between gap-5">
              <h2 className="heading-2">Cùng dòng {sName}</h2>
              <Link className="btn btn-ghost btn-sm" href={`/san-pham?series=${p.series}`}>Xem tất cả</Link>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">{related.map((x) => <ProductCard key={x.slug} p={toCard(x)} />)}</div>
          </section>
        )}
      </main>
    </>
  );
}
