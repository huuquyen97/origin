"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = { slug: string; model: string; name: string; seriesName: string; image: string };

export function ProductCarousel({ title, items }: { title: string; items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => {
    const el = ref.current;
    const w = (el?.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 300;
    el?.scrollBy({ left: (w + 14) * d, behavior: "smooth" });
  };
  const navBtn = "round-nav border border-line bg-white text-ink hover:border-ink";
  return (
    <>
      <div className="section-head reveal">
        <h2 className="heading-1">{title}</h2>
        <div className="flex gap-2.5">
          <button type="button" className={navBtn} onClick={() => scroll(-1)} aria-label="Trước"><ChevronLeft className="size-5" /></button>
          <button type="button" className={navBtn} onClick={() => scroll(1)} aria-label="Sau"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <div
        ref={ref}
        className="scrollbar-none -mx-4 grid snap-x snap-mandatory auto-cols-[minmax(250px,78%)] grid-flow-col gap-3.5 overflow-x-auto scroll-px-4 px-4 pb-1 sm:auto-cols-[calc((100%-28px)/2.4)] md:-mx-6 md:scroll-px-6 md:px-6 lg:-mx-8 lg:auto-cols-[calc((100%-64px-42px)/3.3)] lg:scroll-px-8 lg:px-8"
      >
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/san-pham/${p.slug}`}
            className="shade-product group relative isolate flex aspect-[4/5] snap-start flex-col justify-end overflow-hidden rounded-xl2 bg-surface transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]"
          >
            {p.image && <Image src={p.image} alt={p.name || p.model} fill sizes="(min-width: 980px) 340px, 78vw" className="-z-20 object-contain px-7 pb-[118px] pt-7 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]" />}
            <div className="grid gap-2 p-5">
              <span className="tag justify-self-start">{p.seriesName}</span>
              <div className="text-xl font-bold tabular-nums">{p.model}</div>
              <div className="text-[15px] text-muted">{p.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
