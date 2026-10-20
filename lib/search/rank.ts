// Xếp hạng tìm kiếm: khớp model đứng đầu, sau đó mọi cụm từ trong truy vấn phải có mặt (kèm từ đồng nghĩa),
// điểm cao hơn khi khớp ở tiêu đề. Chỉ khi không có kết quả mới dùng tìm gần đúng (Fuse) để bắt lỗi gõ.
import { norm } from "./normalize";

/** Cụm từ (đã bỏ dấu) → các cách gọi tương đương. Áp dụng hai chiều cho cả tiếng Việt và tiếng Anh. */
const SYNONYMS: string[][] = [
  ["khuon mat", "face", "facial"],
  ["nhan dien khuon mat", "face recognition", "fr"],
  ["bien so", "lpr", "anpr", "license plate", "number plate"],
  ["dem nguoi", "people counting", "cross counting"],
  ["dem xe", "vehicle counting", "luu luong"],
  ["xam nhap", "intrusion", "perimeter"],
  ["vuot rao", "line crossing", "hang rao ao"],
  ["dam dong", "crowd", "tu tap"],
  ["hang cho", "queue", "xep hang"],
  ["ban do nhiet", "heat map", "heatmap"],
  ["chuyen dong", "motion"],
  ["tai xe", "driver", "dms", "lai xe"],
  ["buon ngu", "drowsiness", "fleetfocus"],
  ["van tay", "fingerprint"],
  ["can cuoc", "cccd", "e-id", "ekyc"],
  ["camera hanh trinh", "dashcam", "autosecure"],
  ["camera deo nguoi", "body-worn", "body camera", "bwc", "mobisecure"],
  ["dau ghi", "nvr"],
  ["kiem soat ra vao", "access control"],
  ["chuyen mach", "switch"],
  ["cong", "port", "ports"],
  ["ngoai troi", "outdoor"],
  ["hong ngoai", "ir"],
  ["thu phat wifi", "access point", "wi-fi", "wifi"],
  ["ho so nang luc", "profile", "nang luc"],
  ["huong dan", "hdsd", "manual"],
  ["chung nhan", "certificate", "gcn"],
];

const PHRASES = SYNONYMS.flatMap((g) => g.map((p) => ({ p, alts: g }))).sort((a, b) => b.p.length - a.p.length);

/** Tách truy vấn thành các "term"; mỗi term là danh sách cách viết tương đương (chỉ cần khớp một) */
export function terms(query: string): string[][] {
  let q = ` ${norm(query)} `;
  const out: string[][] = [];
  for (const { p, alts } of PHRASES) {
    if (q.includes(` ${p} `)) {
      out.push(alts);
      q = q.replace(` ${p} `, " ");
    }
  }
  for (const w of q.split(" ").filter(Boolean)) out.push([w]);
  return out;
}

const alnum = (s: string) => s.replace(/[^a-z0-9]/g, "");

/** Có từ bắt đầu bằng w trong text (text đã chuẩn hoá) */
function hasWord(text: string, w: string) {
  let i = text.indexOf(w);
  while (i !== -1) {
    if (i === 0 || !/[a-z0-9]/.test(text[i - 1])) return true;
    i = text.indexOf(w, i + 1);
  }
  return false;
}

export type Rankable = { nt: string; nk: string; nx: string; nm: string };

/** Điểm của một mục; 0 = không khớp */
export function score(item: Rankable, ts: string[][], query: string): number {
  let s = 0;
  const q = alnum(norm(query));
  if (item.nm && q.length >= 3) {
    if (item.nm === q) s += 1000;
    else if (item.nm.startsWith(q)) s += 500;
    else if (q.startsWith(item.nm)) s += 300;
  }
  for (const alts of ts) {
    let best = 0;
    for (const a of alts) {
      if (hasWord(item.nt, a)) best = Math.max(best, 6);
      else if (hasWord(item.nk, a)) best = Math.max(best, 3);
      else if (hasWord(item.nx, a)) best = Math.max(best, 1);
    }
    if (!best && s < 300) return 0;
    s += best;
  }
  return s;
}
