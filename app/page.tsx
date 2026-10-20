import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SolutionCard } from "@/components/cards";
import { Explorer } from "@/components/home/explorer";
import { FeatureSlider } from "@/components/home/feature-slider";
import { HeroSearch } from "@/components/home/hero-search";
import { ProductCarousel } from "@/components/home/product-carousel";
import { OpenSearchButton } from "@/components/open-search-button";
import { getHome, getProduct, getProducts, getSeries, getSolutions, seriesName } from "@/lib/data";

export default function HomePage() {
  const home = getHome();
  const products = getProducts();
  const series = getSeries().map((s) => ({ ...s, count: products.filter((p) => p.series === s.id).length }));
  const featured = home.featuredProducts.map(getProduct).filter((p) => p !== undefined);

  return (
    <>
      <header className="shade-hero relative isolate flex min-h-[min(760px,92vh)] flex-col overflow-hidden rounded-xl3 bg-dark text-white">
        <Image src="/img/scenes/hero.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <SiteHeader />
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)] content-end gap-5.5 px-5 pb-6 pt-18 md:px-12 md:pb-7 md:pt-30">
          <span className="eyebrow eyebrow-dark">Cổng tra cứu nội bộ · Sales & Presales</span>
          <h1 className="heading-display max-w-[16ch]">Hỏi gì về sản phẩm, có ngay câu trả lời.</h1>
          <p className="lead text-white/75">
            Thông số, tính năng AI, giải pháp và tài liệu chính thống của MK Vision ở một nơi. Tìm bằng model, nhu cầu khách hàng hay tên tài liệu, không cần gõ dấu.
          </p>
          <HeroSearch />
          <div className="scrollbar-none mt-1.5 flex gap-2 overflow-x-auto border-t border-white/15 pt-4.5" aria-label="Dòng sản phẩm">
            {series.map((s, i) => (
              <Link
                key={s.id}
                href={`/san-pham?series=${s.id}`}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl border px-4 text-[13px] backdrop-blur-md transition ${i === 0 ? "border-white bg-white text-ink" : "border-white/12 bg-white/8 text-white/90 hover:bg-white/16"}`}
              >
                {s.name}
                <span className="opacity-60">{s.count}</span>
              </Link>
            ))}
            <Link href="/giai-phap" className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl border border-white/12 bg-white/8 px-4 text-[13px] text-white/90 backdrop-blur-md transition hover:bg-white/16">
              Giải pháp phần mềm
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mt-2.5 rounded-xl3 bg-surface">
          <section className="container-x py-16 md:py-24">
            <div className="reveal mb-8 grid gap-3">
              <span className="eyebrow">Danh mục</span>
              <h2 className="heading-2">Từ nhu cầu khách hàng <br className="max-sm:hidden" />đến đúng dòng sản phẩm</h2>
            </div>
            <Explorer series={series} />
          </section>
        </div>

        <section className="container-x py-18 md:py-26">
          <div className="reveal mb-8 grid justify-items-center gap-3 text-center">
            <span className="eyebrow">Giải pháp</span>
            <h2 className="heading-1">Biến bài toán của khách hàng <br className="max-sm:hidden" />thành cấu hình đề xuất.</h2>
            <p className="lead mx-auto">Mỗi giải pháp có mô tả bài toán, kiến trúc, phân hệ chức năng và sản phẩm đề xuất, kèm slide để gửi khách.</p>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {getSolutions().slice(0, 3).map((s) => <SolutionCard key={s.slug} s={s} />)}
          </div>
          <div className="mt-7 flex justify-center"><Link className="btn btn-ghost" href="/giai-phap">Xem tất cả giải pháp</Link></div>
        </section>

        <section className="container-x" aria-label="Điểm nhấn công nghệ">
          <FeatureSlider slides={home.features} />
        </section>

        <section className="container-x py-18 md:py-26">
          <ProductCarousel
            eyebrow="Sản phẩm"
            title="Thiết bị cho mọi hiện trường."
            items={featured.map((p) => ({ slug: p.slug, model: p.model, name: p.name, image: p.image, seriesName: seriesName(p.series) }))}
          />
        </section>

        <section className="container-x pb-18 md:pb-26">
          <div className="mb-8 grid gap-3">
            <span className="eyebrow">Năng lực</span>
            <h2 className="heading-2">Làm chủ công nghệ. <br className="max-sm:hidden" />Sản xuất tại Việt Nam.</h2>
            <p className="lead">Số liệu trích từ hồ sơ năng lực của MK Vision.</p>
          </div>
          <div className="grid gap-3.5 md:grid-cols-12">
            {home.stats.slice(0, 4).map((s, i) => (
              <div key={s.value} className={`shade-bottom relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden rounded-xl2 bg-dark p-6 text-white ${i === 0 || i === 3 ? "md:col-span-5" : "md:col-span-7"}`}>
                {s.image && <Image src={s.image} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="-z-20 object-cover" />}
                <div className="text-[clamp(48px,6vw,76px)] font-semibold leading-none tracking-[-0.05em] tabular-nums">{s.value}</div>
                <div>
                  <div className="max-w-[34ch] text-[16.5px] font-medium tracking-tight">{s.label}</div>
                  {s.sub && <div className="mt-2.5 text-[12.5px] text-white/60">{s.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container-x">
          <div className="cta-glow relative isolate overflow-hidden rounded-xl3 bg-dark px-5.5 py-16 text-center text-white md:px-10 md:py-24">
            <h2 className="heading-1 mx-auto max-w-[16ch]">Khách hỏi gì, tra là có.</h2>
            <p className="mx-auto mb-7 mt-4 max-w-[48ch] text-white/70">
              Mở thư viện tài liệu để lấy datasheet, slide và chứng nhận gửi khách, hoặc nhấn{" "}
              <kbd className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-sans text-xs text-white">Ctrl K</kbd> để tìm ở bất kỳ trang nào.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link className="btn btn-light" href="/tai-lieu">Thư viện tài liệu</Link>
              <OpenSearchButton className="btn btn-glass">Tìm kiếm nhanh</OpenSearchButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
