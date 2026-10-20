"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { openSearch } from "../search-dialog";

export function HeroSearch() {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); openSearch(q); }}
      className="flex w-full max-w-[620px] items-center gap-2 rounded-full bg-white py-1.5 pl-4.5 pr-1.5 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,.5)]"
    >
      <Search className="size-[18px] shrink-0 text-muted" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="VD: bullet 8MP, camera đeo người, nhận diện khuôn mặt…"
        aria-label="Tìm kiếm sản phẩm, giải pháp, tài liệu"
        className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
      />
      <button className="btn btn-dark max-sm:px-4" type="submit">Tìm kiếm</button>
    </form>
  );
}
