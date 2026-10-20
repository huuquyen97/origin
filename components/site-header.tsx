"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { NAV, T } from "@/lib/strings";
import { openSearch } from "./search-dialog";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const links = NAV.map((n) => (
    <Link
      key={n.href}
      href={n.href}
      aria-current={isActive(n.href) ? "page" : undefined}
      onClick={() => setOpen(false)}
      className="rounded-full px-3.5 py-2 text-[13.5px] text-white/80 transition hover:bg-white/10 hover:text-white aria-[current=page]:bg-white aria-[current=page]:text-ink max-lg:flex max-lg:min-h-11 max-lg:items-center max-lg:rounded-[10px] max-lg:text-[15px] max-lg:aria-[current=page]:bg-white/15 max-lg:aria-[current=page]:text-white"
    >
      {n.label}
    </Link>
  ));

  return (
    <>
      <nav aria-label="Điều hướng chính" className="flex items-center justify-between gap-4 px-3.5 pt-3.5 md:px-5.5 md:pt-4.5">
        <Link href="/" aria-label="MK Vision — Trang chủ" className="inline-flex h-11 shrink-0 items-center rounded-full bg-white py-1.5 pl-2.5 pr-3.5">
          <Image src="/brand/mk-vision.png" alt="MK Vision" width={60} height={30} priority className="h-[30px] w-auto" />
        </Link>
        <div className="hidden items-center gap-0.5 rounded-full border border-white/12 bg-white/8 p-1 backdrop-blur-md lg:flex">{links}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Tìm kiếm"
            className="inline-flex h-11 min-w-11 items-center justify-center gap-2.5 rounded-full bg-white px-3 text-[13.5px] text-muted lg:min-w-[210px] lg:justify-start lg:pl-4 lg:pr-2"
          >
            <Search className="size-4 text-ink" aria-hidden />
            <span className="mr-auto hidden lg:inline">{T.searchPlaceholder}</span>
            <kbd className="hidden h-6 items-center rounded-md border border-line bg-surface px-1.5 font-sans text-[11.5px] text-muted lg:inline-flex">Ctrl K</kbd>
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </nav>
      <div id="mobile-nav" className={`mx-3.5 mt-2.5 rounded-2xl border border-white/12 bg-[#141310]/85 p-2 backdrop-blur-lg lg:hidden ${open ? "grid" : "hidden"}`}>
        {links}
      </div>
    </>
  );
}
