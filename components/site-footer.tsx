import Image from "next/image";
import Link from "next/link";
import { getCompany, getDocuments, getProducts, getSeries, getSolutions } from "@/lib/data";
import { T } from "@/lib/strings";

export function SiteFooter() {
  const c = getCompany();
  const series = getSeries();
  const sols = getSolutions().slice(0, 6);
  const col = (title: string, items: { href: string; label: string; external?: boolean }[]) => (
    <div>
      <h4 className="mb-3 text-base font-bold text-white">{title}</h4>
      {items.map((i) =>
        i.external ? (
          <a key={i.href} href={i.href} target="_blank" rel="noopener" className="block py-1.5 text-[15px] text-white/70 transition-colors hover:text-white">{i.label}</a>
        ) : (
          <Link key={i.href} href={i.href} className="block py-1.5 text-[15px] text-white/70 transition-colors hover:text-white">{i.label}</Link>
        ),
      )}
    </div>
  );

  return (
    <footer className="bg-footer text-white">
      <div className="container-x pb-7 pt-14 md:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
        <div>
          <span className="inline-flex rounded-full bg-white px-4 py-2"><Image src="/brand/mk-vision.png" alt="MK Vision" width={80} height={40} className="h-10 w-auto" /></span>
          <p className="mt-4 max-w-[42ch] text-[15px] text-white/70">{T.footerText}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="btn btn-outline-light btn-sm" href={`mailto:${c.email}`}>{c.email}</a>
            <a className="btn btn-primary btn-sm" href={`tel:${c.hotline.replace(/\s/g, "")}`}>Hotline {c.hotline}</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
          {col("Dòng sản phẩm", series.map((s) => ({ href: `/san-pham?series=${s.id}`, label: s.name })))}
          {col("Giải pháp", sols.map((s) => ({ href: `/giai-phap/${s.slug}`, label: s.shortName || s.name })))}
          {col("Tra cứu", [
            { href: "/san-pham", label: "Tất cả sản phẩm" },
            { href: "/so-sanh", label: "So sánh" },
            { href: "/thuat-toan-ai", label: "Tính năng AI" },
            { href: "/tai-lieu", label: "Thư viện tài liệu" },
            { href: "/ton-kho", label: "Tồn kho" },
          ])}
          {col("Công ty", [
            { href: "https://mkvision.com/", label: "mkvision.com", external: true },
            { href: "/tai-lieu?type=profile", label: "Hồ sơ năng lực" },
            { href: "/tai-lieu?type=certificate", label: "Chứng nhận" },
          ])}
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5 text-[13.5px] text-white/55">
        <span>© {new Date().getFullYear()} {c.name} · {T.internalOnly}</span>
        <span>
          Dữ liệu: {getProducts().length} sản phẩm · {getSolutions().length} giải pháp · {getDocuments().length} tài liệu
        </span>
      </div>
      </div>
    </footer>
  );
}
