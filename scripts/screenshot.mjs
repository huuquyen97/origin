// Chụp screenshot desktop (1440px) + mobile (375px) để theo dõi tiến độ giao diện.
// Dùng Chrome cài sẵn trên máy, chạy headless.
// node scripts/screenshot.mjs <tên> <url> [chiều cao desktop]
// VD: node scripts/screenshot.mjs 01-home http://localhost:3000/ 6400
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const [name, url, h = "6000"] = process.argv.slice(2);
if (!name || !url) {
  console.error("Cách dùng: node scripts/screenshot.mjs <tên> <url> [chiều cao]");
  process.exit(1);
}

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));
if (!CHROME) throw new Error("Không tìm thấy Chrome/Edge");

const outDir = resolve("screenshots");
mkdirSync(outDir, { recursive: true });
const profile = join(tmpdir(), "mkv-shot-profile");
const base = ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`, "--virtual-time-budget=6000"];
const run = (args) => execFileSync(CHROME, [...base, ...args], { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }).toString();

// Desktop
run([`--window-size=1440,${h}`, `--screenshot=${join(outDir, `${name}-desktop.png`)}`, url]);

// Mobile: Chrome trên Windows có chiều rộng cửa sổ tối thiểu ~500px nên đặt trang vào iframe 375px
const frame = join(tmpdir(), "mkv-mobile-frame.html");
writeFileSync(frame, `<!doctype html><body style="margin:0;background:#d4d4d4;padding:16px"><iframe src="${url}" style="width:375px;height:${h}px;border:0;background:#fff;display:block"></iframe></body>`);
run(["--allow-file-access-from-files", `--window-size=407,${Number(h) + 32}`, `--screenshot=${join(outDir, `${name}-mobile.png`)}`, `file:///${frame.replace(/\\/g, "/")}`]);

console.log(`Đã lưu screenshots/${name}-desktop.png và screenshots/${name}-mobile.png`);
