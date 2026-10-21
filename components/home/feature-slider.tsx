"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Home } from "@/lib/data/schema";

export function FeatureSlider({ slides }: { slides: Home["features"] }) {
  const [cur, setCur] = useState(0);
  const go = (d: number) => setCur((c) => (c + d + slides.length) % slides.length);
  return (
    <div className="relative flex min-h-[420px] overflow-hidden rounded-xl3 bg-dark text-white">
      {slides.map((f, i) => (
        <div
          key={f.quote}
          aria-hidden={i !== cur}
          className={`shade-feature isolate flex flex-col justify-between p-6.5 transition-opacity duration-500 md:px-12 md:py-11 ${i === cur ? "relative flex-1 opacity-100" : "invisible absolute inset-0 opacity-0"}`}
        >
          {f.image && <Image src={f.image} alt="" fill sizes="100vw" className="-z-20 scale-[1.04] object-cover" />}
          <div>
            <span className="eyebrow eyebrow-dark">{f.eyebrow}</span>
            <p className="mt-3.5 max-w-[24ch] text-[clamp(24px,3.2vw,40px)] font-bold leading-[1.2]">{f.quote}</p>
            {f.href && <Link className="btn btn-outline-light mt-6" href={f.href}>{f.cta}</Link>}
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div className="text-[13.5px] text-white/75">
              <b className="block text-[15px] font-semibold text-white">{f.who}</b>
              {f.role}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Trước" className="round-nav bg-white/15 text-white backdrop-blur hover:bg-white/25"><ChevronLeft className="size-5" /></button>
              <button type="button" onClick={() => go(1)} aria-label="Sau" className="round-nav bg-white/15 text-white backdrop-blur hover:bg-white/25"><ChevronRight className="size-5" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
