import Image from "next/image";
import Link from "next/link";

type Crumb = { href?: string; label: string };

/** Hero trang con kiểu Hikvision: ảnh tối tràn viền, chừa chỗ cho header cố định (76px). */
export function PageHero({ image, crumbs, eyebrow, title, lead }: { image: string; crumbs: Crumb[]; eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="shade-compact relative isolate overflow-hidden bg-dark text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-3.5 pb-12 pt-[124px] md:pb-16 md:pt-[148px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[14px] text-white/65">
          <Link href="/" className="hover:text-white">Tổng quan</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="contents">
              <span aria-hidden className="opacity-50">/</span>
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <span className="eyebrow eyebrow-dark">{eyebrow}</span>
        <h1 className="heading-1 max-w-[22ch]">{title}</h1>
        {lead && <p className="lead text-white/80">{lead}</p>}
      </div>
    </section>
  );
}
