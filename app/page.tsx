import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Explorer } from "@/components/home/explorer";
import { FeatureSlider } from "@/components/home/feature-slider";
import { HeroSearch } from "@/components/home/hero-search";
import { ProductCarousel } from "@/components/home/product-carousel";
import { OpenSearchButton } from "@/components/open-search-button";
import { getHome, getProduct, getProducts, getSeries, getSolutions, seriesName } from "@/lib/data";

/** Trang chủ, bố cục tham khảo hikvision.com/vn: hero tràn viền chữ giữa, section tiêu đề đậm + "Xem thêm", card ảnh tối, section nền đen. */
export default function HomePage() {
  const home = getHome();
  const products = getProducts();
  const series = getSeries().map((s) => ({ ...s, count: products.filter((p) => p.series === s.id).length }));
  const featured = home.featuredProducts.map(getProduct).filter((p) => p !== undefined);
  const solutions = getSolutions().slice(0, 4);

  return (
    <>
      <section className="shade-hero relative isolate flex min-h-[min(760px,100svh)] flex-col overflow-hidden bg-dark text-white">
        <Image src="/img/scenes/hero.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="container-x grid flex-1 content-center justify-items-center gap-5 pb-10 pt-[128px] text-center md:gap-6 md:pt-[150px]">
          <span className="eyebrow eyebrow-dark">Cổng tra cứu nội bộ  - MK Vision Docs</span>
          <h1 className="heading-display max-w-[18ch]">Hỏi gì về sản phẩm, có ngay câu trả lời.</h1>
          <p className="lead text-white/85">
            Thông số, tính năng AI, giải pháp và tài liệu chính thống của MK Vision ở một nơi. Tìm bằng model, nhu cầu khách hàng hay tên tài liệu.
          </p>
          <HeroSearch />
        </div>
        {/* Lối tắt theo dòng: thanh tab kiểu chỉ báo slide của Hikvision, vạch sáng chạy khi rê chuột */}
        <nav aria-label="Dòng sản phẩm" className="container-x pb-7">
          <div className="scrollbar-none grid auto-cols-[minmax(132px,1fr)] grid-flow-col gap-4 overflow-x-auto md:gap-6">
            {series.map((s) => (
              <Link key={s.id} href={`/san-pham?series=${s.id}`} className="tab-btn text-white/75 hover:text-white">
                <span>{s.name}</span>
                <span className="text-[13px] font-normal opacity-75">{s.count} model</span>
                <span className="tab-bar" />
              </Link>
            ))}
            <Link href="/giai-phap" className="tab-btn text-white/75 hover:text-white">
              <span>Giải pháp</span>
              <span className="text-[13px] font-normal opacity-75">{getSolutions().length} giải pháp</span>
              <span className="tab-bar" />
            </Link>
          </div>
        </nav>
      </section>

      <main>
        <section className="container-x py-16 md:py-24">
          <div className="section-head reveal">
            <h2 className="heading-1">Giải pháp theo ngành</h2>
            <Link className="link-more" href="/giai-phap">Xem tất cả <ArrowRight /></Link>
          </div>
          <div className="scrollbar-none -mx-4 grid auto-cols-[minmax(260px,80%)] grid-flow-col gap-4 overflow-x-auto px-4 sm:auto-cols-[calc((100%-16px)/2)] md:mx-0 md:px-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-6">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/giai-phap/${s.slug}`} className="image-card aspect-[4/5]">
                {s.cover && <Image src={s.cover} alt="" fill sizes="(min-width: 1024px) 340px, 80vw" className="-z-20 object-cover" />}
                <div className="grid gap-2 p-6">
                  <span className="text-[13px] font-semibold text-white/75">{s.industry}</span>
                  <h3 className="text-[22px] leading-snug md:text-2xl">{s.shortName || s.name}</h3>
                  <div className="reveal-more">
                    <div>
                      <p className="line-clamp-3 pt-1 text-[15px] text-white/85">{s.summary}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">Tìm hiểu thêm <ArrowRight className="size-4" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-dark py-16 text-white md:py-24">
          <div className="container-x">
            <div className="section-head reveal">
              <h2 className="heading-1">Danh mục sản phẩm</h2>
              <Link className="link-more link-more-light" href="/san-pham">Xem tất cả sản phẩm <ArrowRight /></Link>
            </div>
            <Explorer series={series} />
          </div>
        </section>

        <section className="container-x py-16 md:py-24">
          <ProductCarousel
            title="Sản phẩm tiêu biểu"
            items={featured.map((p) => ({ slug: p.slug, model: p.model, name: p.name, image: p.image, seriesName: seriesName(p.series) }))}
          />
        </section>

        <section className="container-x" aria-label="Điểm nhấn công nghệ">
          <FeatureSlider slides={home.features} />
        </section>

        <section className="container-x py-16 md:py-24">
          <div className="reveal mb-8 grid justify-items-center gap-3 text-center md:mb-10">
            <h2 className="heading-1">Năng lực MK Vision</h2>
            <p className="lead">Làm chủ công nghệ, sản xuất tại Việt Nam. Số liệu trích từ hồ sơ năng lực của MK Vision.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            {home.stats.slice(0, 4).map((s, i) => (
              <div key={s.value} className={`image-card min-h-[320px] p-6 md:p-8 ${i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5"}`}>
                {s.image && <Image src={s.image} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="-z-20 object-cover" />}
                <div className="text-[clamp(44px,5vw,64px)] font-bold leading-none tabular-nums">{s.value}</div>
                <div className="mt-3 max-w-[40ch] text-lg font-bold leading-snug">{s.label}</div>
                {s.sub && <div className="mt-2 text-[14px] text-white/70">{s.sub}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-dark text-white">
          <div className="cta-glow container-x relative isolate py-16 text-center md:py-24">
            <h2 className="heading-1 mx-auto max-w-[20ch]">Khách hỏi gì, tra là có.</h2>
            <p className="mx-auto mb-8 mt-4 max-w-[56ch] text-base text-white/80">
              Mở thư viện tài liệu để lấy datasheet, slide và chứng nhận gửi khách, hoặc nhấn{" "}
              <kbd className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-sm text-white">Ctrl K</kbd> để tìm ở bất kỳ trang nào.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link className="btn btn-primary" href="/tai-lieu">Thư viện tài liệu</Link>
              <OpenSearchButton className="btn btn-outline-light">Tìm kiếm nhanh</OpenSearchButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
