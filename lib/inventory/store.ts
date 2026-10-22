import "server-only";
import { getProducts } from "@/lib/data";
import { parseRows } from "./parse";
import { getSource } from "./source";
import { modelKey, type InventoryResponse, type StockItem } from "./types";

const POLL_MS = Math.max(15, Number(process.env.INVENTORY_POLL_SECONDS) || 60) * 1000;
const LOW = Number(process.env.INVENTORY_LOW_STOCK) || 10;

type Snapshot = { items: Record<string, StockItem>; unmatched: InventoryResponse["unmatched"]; warnings: string[] };

/** Bộ nhớ đệm trong tiến trình server (next start chạy 1 tiến trình, không cần database) */
const state: { snap?: Snapshot; modified?: string; checkedAt: number; error?: string; inflight?: Promise<void> } = { checkedAt: 0 };

function toSnapshot(rows: string[][]): Snapshot {
  const { byKey, warnings } = parseRows(rows);
  const slugOf = new Map<string, string>();
  for (const p of getProducts()) {
    slugOf.set(modelKey(p.model), p.slug);
    slugOf.set(modelKey(p.slug), p.slug);
  }
  const items: Snapshot["items"] = {};
  const unmatched: Snapshot["unmatched"] = [];
  for (const [key, it] of byKey) {
    const slug = slugOf.get(key);
    if (!slug) unmatched.push({ model: it.model, qty: it.qty });
    else items[slug] = { qty: it.qty, warehouses: it.warehouses, notes: it.notes };
  }
  return { items, unmatched, warnings };
}

async function refresh() {
  const src = getSource()!;
  try {
    // Chỉ đọc lại cả bảng khi file đã đổi kể từ lần trước
    const modified = await src.modifiedTime();
    if (!state.snap || modified !== state.modified) {
      state.snap = toSnapshot(await src.rows());
      state.modified = modified;
    }
    state.error = undefined;
  } catch (e) {
    state.error = e instanceof Error ? e.message : String(e);
    console.error("[ton-kho]", state.error);
  } finally {
    state.checkedAt = Date.now();
  }
}

export async function getInventory(): Promise<InventoryResponse> {
  const src = getSource();
  const base = { lowThreshold: LOW, sheetUrl: src?.sheetUrl ?? null, source: src?.kind ?? null };
  if (!src) return { ...base, configured: false, updatedAt: null, checkedAt: null, stale: false, error: null, warnings: [], items: {}, unmatched: [] };

  if (Date.now() - state.checkedAt >= POLL_MS) {
    state.inflight ??= refresh().finally(() => (state.inflight = undefined));
    await state.inflight;
  }
  return {
    ...base,
    configured: true,
    updatedAt: state.modified ?? null,
    checkedAt: state.checkedAt ? new Date(state.checkedAt).toISOString() : null,
    stale: Boolean(state.error && state.snap),
    error: state.error ?? null,
    warnings: state.snap?.warnings.slice(0, 20) ?? [],
    items: state.snap?.items ?? {},
    unmatched: state.snap?.unmatched ?? [],
  };
}
