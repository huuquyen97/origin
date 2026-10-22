import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { get, put } from "@vercel/blob";
import type { InventoryResponse } from "./types";

/** Bản đọc thành công gần nhất: dùng khi Google lỗi hoặc instance mới khởi động (Vercel cold start) */
export type Snapshot = {
  sourceId: string;
  modified: string;
  fetchedAt: string;
  items: InventoryResponse["items"];
  unmatched: InventoryResponse["unmatched"];
  warnings: string[];
};

type Store = { kind: "blob" | "file"; read(): Promise<Snapshot | null>; write(s: Snapshot): Promise<void> };

const BLOB_PATH = "inventory/last-good.json";

/** Vercel Blob (private): bền vững, dùng chung mọi instance serverless */
const blobStore: Store = {
  kind: "blob",
  async read() {
    const r = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!r || r.statusCode !== 200) return null;
    return JSON.parse(await new Response(r.stream).text()) as Snapshot;
  },
  async write(s) {
    await put(BLOB_PATH, JSON.stringify(s), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  },
};

/** File trên đĩa: server nội bộ / máy dev. Trên Vercel không có Blob thì chỉ ghi được /tmp (mất khi instance tắt). */
const FILE_PATH = process.env.INVENTORY_CACHE_FILE || (process.env.VERCEL ? join(tmpdir(), "inventory-last-good.json") : ".data/inventory-last-good.json");
const fileStore: Store = {
  kind: "file",
  async read() {
    try {
      return JSON.parse(await readFile(FILE_PATH, "utf8")) as Snapshot;
    } catch {
      return null;
    }
  },
  async write(s) {
    await mkdir(dirname(FILE_PATH), { recursive: true });
    await writeFile(FILE_PATH, JSON.stringify(s));
  },
};

export const lastGood: Store = process.env.BLOB_READ_WRITE_TOKEN ? blobStore : fileStore;
