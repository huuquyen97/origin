"use client";

import { useSyncExternalStore } from "react";
import type { InventoryResponse } from "@/lib/inventory/types";

/** Một lần gọi /api/ton-kho cho cả trang, tự làm mới mỗi 60 giây khi tab đang mở. */
type State = { data: InventoryResponse | null; failed: boolean; loading: boolean };

const REFRESH_MS = 60_000;
let state: State = { data: null, failed: false, loading: true };
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

const emit = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

async function load() {
  try {
    const res = await fetch("/api/ton-kho", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    emit({ data: (await res.json()) as InventoryResponse, failed: false, loading: false });
  } catch {
    emit({ failed: true, loading: false });
  }
}

const onVisible = () => document.visibilityState === "visible" && load();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) {
    load();
    timer = setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    document.addEventListener("visibilitychange", onVisible);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    }
  };
}

const SERVER: State = { data: null, failed: false, loading: true };

export const useInventory = () => useSyncExternalStore(subscribe, () => state, () => SERVER);
