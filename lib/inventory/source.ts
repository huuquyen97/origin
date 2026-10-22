import "server-only";
import { readFile, stat } from "node:fs/promises";
import { GoogleAuth } from "google-auth-library";
import { parseCsv } from "./parse";

/** Nguồn tồn kho: Google Sheet (thật) hoặc file CSV trên máy (chạy thử). */
export type InventorySource = {
  kind: "google" | "file";
  sheetUrl: string | null;
  /** Rẻ: chỉ đọc thời điểm sửa file để biết có cần đọc lại không */
  modifiedTime(): Promise<string>;
  rows(): Promise<string[][]>;
};

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/drive.metadata.readonly"];

function googleSource(sheetId: string): InventorySource {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const auth = new GoogleAuth({
    scopes: SCOPES,
    ...(json ? { credentials: JSON.parse(json) } : { keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_FILE || undefined }),
  });
  const range = process.env.INVENTORY_SHEET_RANGE || "A1:Z5000";

  const get = async (url: string) => {
    const token = await auth.getAccessToken();
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Google API ${res.status}: ${body.slice(0, 200)}`);
    }
    return res.json();
  };

  return {
    kind: "google",
    sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}`,
    async modifiedTime() {
      const f = await get(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(sheetId)}?fields=modifiedTime&supportsAllDrives=true`);
      return String(f.modifiedTime);
    },
    async rows() {
      const v = await get(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}?valueRenderOption=FORMATTED_VALUE`,
      );
      return ((v.values ?? []) as unknown[][]).map((r) => r.map((c) => String(c ?? "")));
    },
  };
}

function fileSource(path: string): InventorySource {
  return {
    kind: "file",
    sheetUrl: null,
    async modifiedTime() {
      return (await stat(path)).mtime.toISOString();
    },
    async rows() {
      return parseCsv(await readFile(path, "utf8"));
    },
  };
}

/** null = chưa cấu hình (web ẩn phần tồn kho) */
export function getSource(): InventorySource | null {
  if (process.env.INVENTORY_SHEET_ID) return googleSource(process.env.INVENTORY_SHEET_ID);
  if (process.env.INVENTORY_LOCAL_FILE) return fileSource(process.env.INVENTORY_LOCAL_FILE);
  return null;
}
