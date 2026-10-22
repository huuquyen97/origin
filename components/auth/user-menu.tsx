"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { AUTH } from "@/lib/strings";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** Nút tài khoản trên header: chữ cái đầu tên, mở menu có email và Đăng xuất. Ẩn khi chưa có phiên. */
export function UserMenu({ solid }: { solid: boolean }) {
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const user = data?.user;
  if (!user) return null;
  const name = user.name || user.email || "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${AUTH.signedInAs}: ${name}`}
        title={name}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex size-[53px] items-center justify-center rounded-full text-[15px] font-bold transition-colors ${
          solid ? "border border-line bg-brand-navy text-white" : "border border-white/40 bg-white/15 text-white hover:bg-white/25"
        }`}
      >
        {initials(name)}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+10px)] w-[280px] overflow-hidden rounded-xl2 border border-line bg-white text-ink shadow-[var(--shadow-soft)]">
          <div className="grid gap-0.5 border-b border-line px-4 py-3.5">
            <span className="text-[13px] text-muted">{AUTH.signedInAs}</span>
            <span className="truncate text-[15px] font-semibold">{user.name}</span>
            <span className="truncate text-[14px] text-muted">{user.email}</span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ redirectTo: "/dang-nhap" })}
            className="flex min-h-12 w-full items-center gap-2.5 px-4 text-left text-[15px] font-semibold hover:bg-surface"
          >
            <LogOut className="size-[18px]" aria-hidden />
            {AUTH.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
