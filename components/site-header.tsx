"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Menu, Search, X } from "lucide-react";
import { NAV, T } from "@/lib/strings";
import { UserMenu } from "./auth/user-menu";
import { openSearch } from "./search-dialog";

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const useScrolled = () => useSyncExternalStore(subscribe, () => window.scrollY > 24, () => false);

/** Header cố định kiểu Hikvision: trong suốt chữ trắng trên hero tối, cuộn xuống thì nền trắng chữ #333. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const solid = useScrolled() || open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300 ${
        solid ? "bg-white text-ink shadow-[0_1px_0_var(--color-line)]" : "bg-gradient-to-b from-black/45 to-transparent text-white"
      }`}
    >
      <nav aria-label="Điều hướng chính" className="container-x flex h-[76px] items-center justify-between gap-6">
        {/* Logo trong pill trắng để giữ nguyên màu thương hiệu trên nền tối (cao 36px = +20%) */}
        <Link href="/" aria-label="MK Vision — Trang chủ" className="inline-flex h-[52px] shrink-0 items-center rounded-full bg-white py-2 pl-3 pr-4">
          <Image src="/brand/mk-vision.png" alt="MK Vision" width={72} height={36} priority className="h-9 w-auto" />
        </Link>
        <div className="hidden h-full items-stretch gap-8 lg:flex xl:gap-10">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={`nav-link ${solid ? "hover:text-brand-navy aria-[current=page]:text-brand-navy" : "text-white/90 hover:text-white"}`}>
              {n.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Ô tìm kiếm Ctrl K: cao 53px, rộng 252px, chữ 16px (+20%) */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Tìm kiếm"
            className={`inline-flex h-[53px] min-w-[53px] items-center justify-center gap-3 rounded-full px-3.5 text-base transition-colors lg:min-w-[252px] lg:justify-start lg:pl-5 lg:pr-2.5 ${
              solid ? "border border-line bg-surface text-muted hover:border-line-2" : "bg-white text-muted"
            }`}
          >
            <Search className="size-[19px] text-ink" aria-hidden />
            <span className="mr-auto hidden lg:inline">{T.searchPlaceholder}</span>
            <kbd className="hidden h-7 items-center rounded-md border border-line bg-white px-2 font-sans text-[14px] text-muted lg:inline-flex">Ctrl K</kbd>
          </button>
          <button
            type="button"
            className={`inline-flex size-[53px] items-center justify-center rounded-full border lg:hidden ${solid ? "border-line bg-white text-ink" : "border-white/25 bg-white/12 text-white"}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <UserMenu solid={solid} />
        </div>
      </nav>
      <div id="mobile-nav" className={`border-t border-line bg-white px-4 pb-4 pt-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,.25)] lg:hidden ${open ? "grid" : "hidden"}`}>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={isActive(n.href) ? "page" : undefined}
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center border-b border-line text-base font-semibold text-ink last:border-b-0 aria-[current=page]:text-brand-navy"
          >
            {n.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
