"use client";

import { openSearch } from "./search-dialog";

export function OpenSearchButton({ className, children, q }: { className?: string; children: React.ReactNode; q?: string }) {
  return (
    <button type="button" className={className} onClick={() => openSearch(q)}>
      {children}
    </button>
  );
}
