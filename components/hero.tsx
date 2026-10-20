import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./site-header";

type Crumb = { href?: string; label: string };

/** Hero trang con: ảnh tối, nav nằm trong hero (phong cách Primefold). */
export function PageHero({ image, crumbs, eyebrow, title, lead }: { image: string; crumbs: Crumb[]; eyebrow: string; title: string; lead?: string }) {
  return (
    <header className="shade-compact relative isolate overflow-hidden rounded-xl3 bg-dark text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <SiteHeader />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3.5 px-5 pb-9 pt-14 md:px-12 md:pb-11 md:pt-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
          <Link href="/" className="hover:text-white">Tổng quan</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="contents">
              <span aria-hidden className="opacity-50">/</span>
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <span className="eyebrow eyebrow-dark">{eyebrow}</span>
        <h1 className="heading-1 max-w-[20ch]">{title}</h1>
        {lead && <p className="lead text-white/75">{lead}</p>}
      </div>
    </header>
  );
}
