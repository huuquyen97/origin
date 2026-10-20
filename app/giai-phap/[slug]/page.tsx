import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { PageHero } from "@/components/hero";
import { DocRow, ProductCard } from "@/components/cards";
import { Shots } from "@/components/solutions/shots";
import { getProduct, getSeries, getSolution, getSolutions, toCard } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSolutions().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return { title: s?.name ?? "Không tìm thấy giải pháp" };
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-9 first:mt-0">
    <h3 className="mb-3.5 text-lg">{title}</h3>
    {children}
  </section>
);

export default async function SolutionPage({ params }: Props) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  const prods = s.products.map(getProduct).filter((p) => p !== undefined);
  const series = getSeries().filter((x) => s.relatedSeries.includes(x.id));
  const shots = s.images;

  return (
    <>
      <PageHero image={s.cover || "/img/scenes/solutions.jpg"} crumbs={[{ href: "/giai-phap", label: "Giải pháp" }, { label: s.shortName || s.name }]} eyebrow={s.industry} title={s.name} lead={s.summary} />
      <main className="container-x py-12 md:py-14">
        <div className="grid gap-7 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-12">
          <div className="min-w-0">
            {s.painPoints.length > 0 && (
              <Block title="Bài toán của khách hàng">
                <ol className="grid gap-2.5">
                  {s.painPoints.map((x, i) => (
                    <li key={x} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-[14.5px]">
                      <span className="grid size-6 place-items-center rounded-full bg-brand-navy-50 text-xs font-semibold text-brand-navy">{i + 1}</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ol>
              </Block>
            )}
            {s.architecture && (
              <Block title="Kiến trúc giải pháp">
                <div className="whitespace-pre-line rounded-2xl border border-line bg-surface p-4.5 text-[14.5px] text-ink-2">{s.architecture}</div>
              </Block>
            )}
            {s.modules.length > 0 && (
              <Block title="Phân hệ / chức năng">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {s.modules.map((m) => (
                    <div key={m.name} className="rounded-2xl border border-line bg-white p-4">
                      <div className="mb-1 text-[14.5px] font-semibold">{m.name}</div>
                      <div className="text-[13.5px] text-muted">{m.description}</div>
                    </div>
                  ))}
                </div>
              </Block>
            )}
            {s.features.length > 0 && s.modules.length === 0 && (
              <Block title="Chức năng chính"><ul className="check-list">{s.features.map((x) => <li key={x}>{x}</li>)}</ul></Block>
            )}
            {s.benefits.length > 0 && <Block title="Lợi ích"><ul className="check-list">{s.benefits.map((x) => <li key={x}>{x}</li>)}</ul></Block>}
            {shots.length > 0 && <Block title="Hình ảnh"><Shots images={shots} /></Block>}
            {prods.length > 0 && (
              <Block title="Sản phẩm đề xuất">
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{prods.map((p) => <ProductCard key={p.slug} p={toCard(p)} />)}</div>
              </Block>
            )}
          </div>

          <aside className="grid gap-3 lg:sticky lg:top-5">
            {s.targetCustomers.length > 0 && (
              <div className="rounded-xl2 bg-surface p-5">
                <h4 className="mb-3 text-sm">Khách hàng mục tiêu</h4>
                <div className="flex flex-wrap gap-1.5">{s.targetCustomers.map((x) => <span key={x} className="tag h-auto whitespace-normal py-1">{x}</span>)}</div>
              </div>
            )}
            {series.length > 0 && (
              <div className="rounded-xl2 bg-surface p-5">
                <h4 className="mb-3 text-sm">Dòng sản phẩm liên quan</h4>
                <div className="flex flex-wrap gap-1.5">{series.map((x) => <Link key={x.id} className="pill" href={`/san-pham?series=${x.id}`}>{x.name}</Link>)}</div>
              </div>
            )}
            {s.documents.length > 0 && (
              <div className="rounded-xl2 bg-surface p-5">
                <h4 className="mb-3 text-sm">Tài liệu & slide giới thiệu</h4>
                <div className="grid gap-2">{s.documents.map((d) => <DocRow key={d.path} d={d} />)}</div>
              </div>
            )}
            {s.sources.length > 0 && (
              <div className="flex gap-2.5 rounded-2xl bg-brand-navy-50 px-4 py-3.5 text-[13.5px] text-brand-navy-600">
                <Info className="mt-0.5 size-[17px] shrink-0" />
                <span>
                  Nội dung tóm tắt từ{" "}
                  {s.sources.map((d, i) => (
                    <span key={d.path}>{i > 0 && ", "}<a className="underline underline-offset-2" href={d.url} target="_blank" rel="noopener">{d.path.split("/").pop()}</a></span>
                  ))}
                  .
                </span>
              </div>
            )}
            {s.notes && (
              <div className="flex gap-2.5 rounded-2xl bg-[#fbf6e8] px-4 py-3.5 text-[13.5px] text-[#7a5a12]">
                <Info className="mt-0.5 size-[17px] shrink-0" />
                <span><b>Lưu ý:</b> {s.notes}</span>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
