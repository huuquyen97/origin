// Danh sách sản phẩm đang chọn để so sánh, lưu trong trình duyệt (tiện ích cá nhân).
import { useSyncExternalStore } from "react";

const KEY = "mkv-compare";
const EVENT = "mkv:compare";
export const MAX_COMPARE = 4;

function raw(): string {
  try {
    return localStorage.getItem(KEY) || "[]";
  } catch {
    return "[]";
  }
}

export function readCompare(): string[] {
  try {
    const v = JSON.parse(raw());
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function writeCompare(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX_COMPARE)));
  } catch {
    /* trình duyệt chặn storage: bỏ qua */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Danh sách đang chọn; khi render trên server luôn rỗng. */
export function useCompare(): string[] {
  const s = useSyncExternalStore(subscribe, raw, () => "[]");
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
