"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { SearchItem } from "@/lib/search/build-index";
import { norm } from "@/lib/search/normalize";
import { SEARCH_GROUPS, T } from "@/lib/strings";

const EVENT = "mkv:search";

export function openSearch(q = "") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: q }));
}

let indexPromise: Promise<SearchItem[]> | null = null;
const loadIndex = () => (indexPromise ??= fetch("/search-index.json").then((r) => r.json()));

export function SearchDialog({ suggestions }: { suggestions: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const show = useCallback((query = "") => {
    setQ(query);
    setSel(0);
    setOpen(true);
    loadIndex().then(setIndex);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail || "");
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((document.activeElement as HTMLElement | null)?.tagName ?? "");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) loadIndex().then(setIndex);
          return !o;
        });
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        show();
      } else if (e.key === "Escape") close();
    };
    window.addEventListener(EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    // Link chia sẻ: /#tim=tu-khoa
    const m = location.hash.match(/^#tim=(.*)$/);
    const t = m ? setTimeout(() => show(decodeURIComponent(m[1]))) : undefined;
    return () => {
      clearTimeout(t);
      window.removeEventListener(EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [show, close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setTimeout(() => input.current?.focus(), 20);
  }, [open]);

  const fuse = useMemo(
    () => (index ? new Fuse(index, { keys: [{ name: "nt", weight: 3 }, { name: "nk", weight: 1.5 }, { name: "nx", weight: 1 }], threshold: 0.34, ignoreLocation: true, minMatchCharLength: 2 }) : null),
    [index],
  );

  const results = useMemo(() => {
    const nq = norm(q);
    if (!nq || !fuse) return [];
    const ranked = fuse.search(nq, { limit: 30 }).map((r, i) => [r.item, i] as const);
    return ranked.sort((a, b) => SEARCH_GROUPS.indexOf(a[0].type) - SEARCH_GROUPS.indexOf(b[0].type) || a[1] - b[1]).map((x) => x[0]);
  }, [q, fuse]);

  const go = (r: SearchItem) => {
    close();
    if (r.external) window.open(r.url, "_blank", "noopener");
    else router.push(r.url);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (sel + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      setSel(n);
      list.current?.querySelector(`[data-i="${n}"]`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[sel]);
    }
  };

  if (!open) return null;

  let i = -1;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0f0e0c]/50 p-2.5 backdrop-blur-sm md:px-5 md:pt-[10vh]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="flex max-h-[calc(100vh-20px)] w-full max-w-[680px] flex-col overflow-hidden rounded-xl2 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,.45)] md:max-h-[76vh]">
        <div className="flex items-center gap-3 border-b border-line pl-4.5 pr-3">
          <Search className="size-[19px] shrink-0 text-muted" aria-hidden />
          <input
            ref={input}
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onInputKey}
            placeholder={T.searchModalPlaceholder}
            aria-label="Từ khóa tìm kiếm"
            autoComplete="off"
            className="h-[60px] min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={close}>Esc</button>
        </div>
        <div ref={list} role="listbox" className="overflow-y-auto overscroll-contain p-2">
          {!norm(q) ? (
            <>
              <div className="px-2.5 pb-1 pt-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-faint">Gợi ý</div>
              <div className="flex flex-wrap gap-1.5 px-2.5 pb-3.5 pt-1.5">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="pill" onClick={() => { setQ(s); input.current?.focus(); }}>{s}</button>
                ))}
              </div>
            </>
          ) : !index ? (
            <div className="px-4 py-8 text-center text-sm text-muted">Đang tải chỉ mục…</div>
          ) : !results.length ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              Không tìm thấy kết quả cho “{q}”.
              <br />
              Thử tìm theo model (VB50FB1V), loại (Bullet, Body-worn) hoặc tính năng (LPR, khuôn mặt).
            </div>
          ) : (
            SEARCH_GROUPS.map((g) => {
              const items = results.filter((r) => r.type === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <div className="px-2.5 pb-1 pt-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-faint">{g}</div>
                  {items.map((r) => {
                    i++;
                    const idx = i;
                    const body = (
                      <>
                        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-surface-2 text-[11px] font-bold text-ink-2">
                          {r.thumb ? <img src={r.thumb} alt="" className="size-full object-contain mix-blend-multiply" /> : r.mono.slice(0, 4)}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14.5px] font-medium leading-snug [overflow-wrap:anywhere]">{r.title}</span>
                          <span className="block truncate text-[12.5px] text-muted">{r.sub}</span>
                        </span>
                        <span className="text-faint">{r.external && <ArrowUpRight className="size-3.5" />}</span>
                      </>
                    );
                    const cls = "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl p-2.5 hover:bg-surface aria-selected:bg-surface";
                    return r.external ? (
                      <a key={r.url} href={r.url} target="_blank" rel="noopener" data-i={idx} role="option" aria-selected={idx === sel} className={cls} onClick={close}>{body}</a>
                    ) : (
                      <Link key={r.url} href={r.url} data-i={idx} role="option" aria-selected={idx === sel} className={cls} onClick={close}>{body}</Link>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="flex gap-3.5 border-t border-line px-4 py-2.5 text-xs text-faint">
          <span>↑ ↓ chọn</span>
          <span>Enter mở</span>
          <span>Esc đóng</span>
        </div>
      </div>
    </div>
  );
}
