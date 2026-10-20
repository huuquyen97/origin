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
      <h4 className="mb-3 text-[13px] font-semibold tracking-normal">{title}</h4>
      {items.map((i) =>
        i.external ? (
          <a key={i.href} href={i.href} target="_blank" rel="noopener" className="block py-1.5 text-[13.5px] text-muted hover:text-ink">{i.label}</a>
        ) : (
          <Link key={i.href} href={i.href} className="block py-1.5 text-[13.5px] text-muted hover:text-ink">{i.label}</Link>
        ),
      )}
    </div>
  );

  return (
    <footer className="container-x pb-7 pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
        <div>
          <Image src="/brand/mk-vision.png" alt="MK Vision" width={88} height={44} className="h-11 w-auto" />
          <p className="mt-3.5 max-w-[40ch] text-sm text-muted">{T.footerText}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="btn btn-ghost btn-sm" href={`mailto:${c.email}`}>{c.email}</a>
            <a className="btn btn-dark btn-sm" href={`tel:${c.hotline.replace(/\s/g, "")}`}>Hotline {c.hotline}</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
          {col("Dòng sản phẩm", series.map((s) => ({ href: `/san-pham?series=${s.id}`, label: s.name })))}
          {col("Giải pháp", sols.map((s) => ({ href: `/giai-phap/${s.slug}`, label: s.shortName || s.name })))}
          {col("Tra cứu", [
            { href: "/san-pham", label: "Tất cả sản phẩm" },
            { href: "/so-sanh", label: "So sánh" },
            { href: "/thuat-toan-ai", label: "Thuật toán AI" },
            { href: "/tai-lieu", label: "Thư viện tài liệu" },
          ])}
          {col("Công ty", [
            { href: "https://mkvision.com/", label: "mkvision.com", external: true },
            { href: "/tai-lieu?type=profile", label: "Hồ sơ năng lực" },
            { href: "/tai-lieu?type=certificate", label: "Chứng nhận" },
          ])}
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-5 text-[12.5px] text-faint">
        <span>© {new Date().getFullYear()} {c.name} · {T.internalOnly}</span>
        <span>
          Dữ liệu: {getProducts().length} sản phẩm · {getSolutions().length} giải pháp · {getDocuments().length} tài liệu
        </span>
      </div>
    </footer>
  );
}
