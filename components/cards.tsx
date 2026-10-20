import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DOC_TYPE_LABEL } from "@/lib/strings";
import type { DocType } from "@/lib/data/schema";

export type ProductCardProps = {
  slug: string;
  model: string;
  name: string;
  seriesName: string;
  category: string;
  resolution: string;
  ipRating: string;
  image: string;
};

export function ProductMedia({ image, model, alt, className = "" }: { image: string; model: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-[#f6f5f2] to-[#ecebe6] ${className}`}>
      {image ? (
        <Image src={image} alt={alt} fill sizes="(min-width: 980px) 360px, 90vw" className="object-contain p-[18px] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-lg font-semibold tracking-tight text-ink-2 [overflow-wrap:anywhere]">{model}</div>
      )}
    </div>
  );
}

export function ProductCard({ p, compare }: { p: ProductCardProps; compare?: React.ReactNode }) {
  const tags = [...new Set([p.category, p.resolution, p.ipRating].filter(Boolean))].slice(0, 3);
  return (
    <div className="card card-link group">
      {compare}
      <Link href={`/san-pham/${p.slug}`} className="flex flex-1 flex-col">
        <div className="px-4 pt-3.5 text-[12.5px] font-medium text-muted">
          {p.seriesName}
        </div>
        <ProductMedia image={p.image} model={p.model} alt={p.name || p.model} className="mx-3 mt-3 aspect-[4/3] rounded-[14px]" />
        <div className="grid flex-1 content-start gap-1.5 p-4">
          <div className="text-base font-semibold tracking-tight tabular-nums">{p.model}</div>
          <div className="line-clamp-3 text-[13.5px] text-muted">{p.name}</div>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 transition group-hover:bg-ink group-hover:text-white"><ArrowRight className="size-3.5" /></span>
        </div>
      </Link>
    </div>
  );
}

export type SolutionCardProps = { slug: string; name: string; shortName: string; industry: string; summary: string; cover: string };

export function SolutionCard({ s }: { s: SolutionCardProps }) {
  return (
    <Link href={`/giai-phap/${s.slug}`} className="card card-link group">
      <div className="px-4 pt-3.5 text-[12.5px] font-medium text-muted">
        {s.industry}
      </div>
      <div className="relative mx-3 mt-3 aspect-[4/3] overflow-hidden rounded-[14px] bg-dark">
        {s.cover ? (
          <Image src={s.cover} alt={s.name} fill sizes="(min-width: 980px) 380px, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_30%_20%,#34322c_0%,#1b1a17_60%)]">
            <div className="grid grid-cols-3 gap-3.5">{Array.from({ length: 9 }, (_, i) => <i key={i} className="size-2.5 rounded-[3px] bg-white/55" />)}</div>
          </div>
        )}
      </div>
      <div className="grid flex-1 content-start gap-1.5 p-4">
        <div className="text-base font-semibold tracking-tight">{s.name}</div>
        <div className="line-clamp-3 text-[13.5px] text-muted">{s.summary}</div>
      </div>
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div>{s.shortName && <span className="tag tag-navy">{s.shortName}</span>}</div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 transition group-hover:bg-ink group-hover:text-white"><ArrowRight className="size-3.5" /></span>
      </div>
    </Link>
  );
}

export type DocRowProps = { url: string; ext: string; title: string; type: DocType; seriesLabel?: string };

export function DocIcon({ ext }: { ext: string }) {
  return <span className="doc-ic" data-ext={ext}>{(ext || "file").toUpperCase()}</span>;
}

export function DocRow({ d }: { d: DocRowProps }) {
  const sub = [DOC_TYPE_LABEL[d.type], d.seriesLabel].filter(Boolean).join(" · ");
  return (
    <a href={d.url} target="_blank" rel="noopener" className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-[14px] border border-line bg-white px-3.5 py-3 transition hover:border-line-2 hover:shadow-sm">
      <DocIcon ext={d.ext} />
      <div className="min-w-0">
        <div className="text-sm font-medium leading-snug [overflow-wrap:anywhere]">{d.title}</div>
        <div className="mt-0.5 text-[12.5px] text-muted">{sub}</div>
      </div>
      <ArrowUpRight className="size-4 text-muted" />
    </a>
  );
}
