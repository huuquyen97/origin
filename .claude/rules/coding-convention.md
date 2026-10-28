---
paths:
  - "app/**/*.{ts,tsx,css}"
  - "components/**/*.{ts,tsx}"
  - "lib/**/*.{ts,tsx,mjs}"
  - "scripts/**"
  - "auth.ts"
  - "proxy.ts"
  - "next.config.ts"
---

# Quy ước code

Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4. Viết code giống code xung quanh: cùng mật độ, cách đặt tên, cách comment.

## Guardrail (đọc trước)

- **Client component không import `lib/data`** (module có `server-only`) ngoài `import type`. Dữ liệu truyền qua props, đã rút gọn.
- **Không gọi `auth()`, `cookies()`, `headers()`, `searchParams` server trong trang / layout.** Mất sinh tĩnh. Phiên lấy qua `useSession()` phía client.
- **Trang dùng `useSearchParams` → cặp `X` + `XView`, bọc `<Suspense fallback={<XView … initial={{}} />}>`.**
- **Không `setState` trong `useEffect` để đọc trình duyệt.** Dùng `useSyncExternalStore` (localStorage, scroll, tồn kho).
- **Chuỗi giao diện ở `lib/strings.ts`**, không rải trong logic. Nhãn thông số / loại ở `lib/labels.ts`.
- **Dữ liệu sai phải làm build dừng** với thông báo `[Data] <file>: <lý do>`. Không nuốt lỗi, không nới schema để qua build.
- **Route API đọc `lib/data` → thêm vào `outputFileTracingIncludes`.** Không thì Production lỗi `ENOENT`.
- **Không thêm dependency** khi chưa được đồng ý; ưu tiên Web API / Node built-in.
- **Không `any`.** Không `// @ts-ignore`, không `eslint-disable` trừ khi có comment lý do.
- **Không để `console.log` gỡ lỗi.** Log server có chủ đích dùng `console.error("[ten-module]", …)`.

## Cấu trúc thư mục

- `app/`: chỉ route (`page.tsx`, `route.ts`, `layout.tsx`, `not-found.tsx`) + `globals.css`. Không đặt component tái dùng ở đây.
- `components/`: theo trang (`home/`, `products/`, `solutions/`, `docs/`, `ai/`, `inventory/`, `auth/`) + file dùng chung ở gốc (`cards.tsx`, `hero.tsx`, `site-header.tsx`…).
- `lib/data/`: `schema.ts` (zod + type) và `index.ts` (đọc, validate, liên kết, getter).
- `lib/search/`: `normalize.ts`, `rank.ts`, `build-index.ts`.
- `lib/inventory/`: nguồn, parse, cache, bản dự phòng, type dùng chung client/server (`types.ts` không có `server-only`).
- `lib/strings.ts`, `lib/labels.ts`, `lib/file-slug.mjs` (dùng chung với scripts Node).
- `scripts/*.mjs`: Node ESM thuần, chạy trực tiếp bằng `node`, không import TypeScript.

## Đặt tên

- File: kebab-case (`catalog-table.tsx`, `use-inventory.ts`, `compare-store.ts`).
- Component: PascalCase, export có tên (`export function CatalogTable`). Không `export default` cho component (trừ `page.tsx` / `layout.tsx` theo Next).
- Hook: `useXxx`. Store: `xxx-store.ts` với `readXxx`, `writeXxx`, `useXxx`.
- Biến thể tĩnh của component đọc URL: hậu tố `View` (`ProductBrowserView`, `ScenarioExplorerView`).
- Type: PascalCase, props inline hoặc `type Props`. Type dữ liệu từ zod: `z.infer` export trong `schema.ts`.
- Hằng: UPPER_SNAKE cho bảng tra (`NAV`, `DOC_STATUS`, `NEEDS`, `KEY_SPEC_LABELS`, `NOT_PUBLISHED`).
- URL route: tiếng Việt không dấu, kebab-case (`/san-pham`, `/thuat-toan-ai`).
- Slug dữ liệu: `^[a-z0-9-]+$`.
- Tham số URL: ngắn, tiếng Anh (`q`, `need`, `ids`, `kb`, `stock`).

## TypeScript

- `strict: true`. Import alias `@/` (gốc dự án).
- Ưu tiên suy luận kiểu; khai báo kiểu ở biên (props, hàm export, dữ liệu API).
- `as const` cho bảng tra để lấy union (`NeedId`, `SearchGroup`).
- `Record<Union, T>` cho map đầy đủ (`DOC_TYPE_LABEL: Record<DocType, string>`).
- Non-null `!` chỉ khi đã kiểm tra ngay trước đó (VD `productMap.get(slug)!` sau khi slug lấy từ chính map).
- Dùng `import type` cho type từ module server.
- Next 16: `params` / `searchParams` là `Promise` → `const { slug } = await params`.

## Server và Client Component

- Mặc định Server Component. `"use client"` chỉ cho phần tương tác: lọc, tìm kiếm, so sánh, slider, lightbox, menu, copy.
- Trang server chuẩn bị dữ liệu rút gọn (`toCard`, `map(...)`) rồi truyền vào client component.
- Không truyền hàm / class / Map qua ranh giới server → client; chỉ dữ liệu JSON.
- Client component nhỏ, đặt sát nơi dùng; phần tĩnh để server render.

## Mẫu đọc URL (bắt buộc)

```tsx
/** Đọc ?q=; bọc trong <Suspense fallback={<XView … initialQ="" />}> */
export function CatalogTable(props: Props) {
  return <CatalogTableView {...props} initialQ={useSearchParams().get("q") ?? ""} />;
}
export function CatalogTableView({ rows, initialQ }: Props & { initialQ: string }) { … }
```

- Trang: `<Suspense fallback={<XView {...props} initial={{}} />}><X {...props} /></Suspense>`.
- Ghi URL: `router.replace(qs ? \`${pathname}?${qs}\` : pathname, { scroll: false })`; không `push` (không làm đầy lịch sử).

## State

- `useState` cho state cục bộ; khởi tạo từ prop `initial` (lazy initializer).
- Trình duyệt (localStorage, scroll, kích thước): `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`; server snapshot trả giá trị mặc định ổn định.
- localStorage: luôn bọc `try/catch` (chế độ riêng tư / bị chặn), giới hạn dữ liệu (`MAX_COMPARE = 4`).
- Dữ liệu dùng chung nhiều chỗ (tồn kho): một store module + một request, nhiều component đọc (`useInventory()`).
- `useMemo` chỉ khi tính toán nặng hoặc cần tham chiếu ổn định; không bọc mọi thứ.
- Không thêm Redux / Zustand / React Query.

## Lớp dữ liệu (`lib/data`)

- `getData()` đọc toàn bộ `/Data` một lần (cache trong tiến trình), validate zod, liên kết, trả object bất biến.
- Getter ngắn: `getProducts()`, `getProduct(slug)`, `getSolutions()`, `getCatalog()`, `getScenarios()`, `getFeatureShots(slug)`…
- Lỗi validate: `parse(Schema, json, "Data/…/file.json")` → ném lỗi có tên file. Lỗi liên kết: `fail(file, msg)`.
- Liên kết model: `modelKey()` (viết hoa, chỉ chữ + số), không so khớp gần đúng.
- Thêm file dữ liệu mới: schema trong `schema.ts` → đọc + kiểm liên kết trong `load()` → getter → kiểm thêm trong `scripts/check-data.mjs` nếu cần kiểm file / ảnh tồn tại.
- Trường mới không bắt buộc: `.default(...)` để dữ liệu cũ vẫn hợp lệ.
- Đọc JSON: bỏ BOM đầu file (`replace(/^﻿/, "")`).
- Đường dẫn tài liệu: `fileUrl()` / `pathKey()` từ `lib/file-slug.mjs`; không ghép URL thủ công (tên tiếng Việt NFC/NFD).

## Chuỗi và nhãn

- `T` (chung), `NAV`, `DOC_STATUS`, `DOC_TYPE_LABEL`, `SPEC_GROUP_LABEL`, `INV`, `PROFILE`, `CATALOG`, `SCENE`, `AUTH`, `SEARCH_GROUPS`.
- Thêm nhóm chuỗi theo tính năng: `export const TEN = { … }` + comment một dòng nguồn / phạm vi.
- Nhãn hiển thị dữ liệu nguyên văn → `lib/labels.ts` (`catLabel`, `specLabel`), không sửa JSON.
- Ngày giờ: `vnDateTime(iso)` (múi giờ `Asia/Ho_Chi_Minh`).
- Chuỗi trong JSX ngắn, gắn chặt bố cục (VD tiêu đề section một trang) được phép viết trực tiếp nếu chỉ dùng một chỗ; chuỗi lặp lại / thông báo / nhãn → `lib/strings.ts`.

## Tailwind và CSS

- Tailwind v4: token trong `@theme`, class thành phần trong `@layer components` (`app/globals.css`). Không có `tailwind.config`.
- Dùng token (`text-muted`, `bg-surface`, `border-line`), không hex. Giá trị tuỳ ý `[...]` chỉ khi không có token (VD `pt-[124px]`, `max-w-[22ch]`).
- Class điều kiện: template string ngắn hoặc `aria-*` / `data-*` variant (`aria-[current=page]:text-brand-navy`); không thêm `clsx`.
- Trạng thái giao diện qua thuộc tính ARIA (`aria-pressed`, `aria-selected`) để CSS và a11y dùng chung.
- Không CSS module, không styled-components, không inline `style` trừ biến CSS (`--tab-ms`) hoặc toạ độ động (hotspot `%`).

## Component

- Props tối thiểu, dữ liệu đã rút gọn. Không truyền nguyên `ProductFull` xuống client.
- Hàm render phụ trong component dùng hàm thường (`const modelCell = (r) => …`), không khai báo component lồng (gây remount).
- `key` ổn định (slug, model, id), không dùng index khi danh sách lọc / sắp xếp.
- Ảnh: `next/image`; link nội bộ: `next/link`.
- Nút: `<button type="button">`; link điều hướng: `<Link>`; không dùng `div onClick`.
- Icon lucide `aria-hidden` + chữ hoặc `aria-label`.

## Route API

- `export const dynamic = "force-dynamic"` khi đọc dữ liệu lúc chạy.
- Trả `NextResponse.json(data, { headers: { "Cache-Control": "private, max-age=30" } })` cho dữ liệu sau đăng nhập.
- Proxy đã chặn 401; route không kiểm lại session trừ khi cần danh tính (VD giới hạn lượt chatbot theo email).
- Lỗi nguồn ngoài: ghi `console.error("[ten]", message)`, trả dữ liệu cũ nếu có, không làm sập trang.
- Không trả stack trace / thông điệp lỗi nội bộ cho client.

## Cache và tồn kho

- `unstable_cache(fn, ["key-vN"], { revalidate, tags })`; đổi cấu trúc dữ liệu cache → tăng hậu tố key (`inventory-v2`).
- Không cache trạng thái trong biến module ở code chạy trên Vercel (mỗi instance riêng, mất khi khởi động lại). Ngoại lệ: `getData()` (dữ liệu tĩnh đóng gói cùng function).
- Không ném lỗi khi đã có bản cũ; chỉ ném khi chưa có số liệu nào (để không cache lỗi).
- Chưa dùng `"use cache"` (cần bật Cache Components toàn site).

## Auth

- Cấu hình duy nhất ở `auth.ts`; `proxy.ts` chỉ re-export `auth` + `matcher`.
- Kiểm domain ở `callbacks.signIn` (server): `email_verified`, `hd`, đuôi email. `hd` ở `authorization.params` chỉ là gợi ý.
- `AUTH_DISABLED` chỉ đọc ở `authorized`; không dùng để ẩn / hiện giao diện.

## Scripts Node

- ESM (`"type": "module"`), `node:` prefix cho built-in, chạy từ gốc dự án (`process.cwd()`).
- In kết quả một dòng tóm tắt; lỗi → `process.exit(1)` với thông báo tiếng Việt có tên file.
- Không sửa file trong `Data/MK Vision/`; chỉ đọc / hard link.
- Script dùng một lần (cắt ảnh, trích PDF) → scratchpad, không vào `scripts/`.

## Comment

- Tiếng Việt, ngắn, giải thích **vì sao** (ràng buộc, nguồn, quyết định), không lặp lại code.
- JSDoc một dòng `/** … */` trên hàm / component export có hành vi không hiển nhiên.
- Ghi nguồn dữ liệu / tài liệu khi logic phụ thuộc tài liệu (VD "Danh mục ghi series A nhưng datasheet có AI").
- Không comment TODO không có chủ; việc chưa làm ghi vào CLAUDE.md.

## Định dạng code

- 2 dấu cách, nháy kép, có dấu chấm phẩy, dòng dài được phép (~160–200 ký tự) như code hiện có.
- JSX ngắn viết một dòng; khối dài xuống dòng theo phần tử.
- Import theo thứ tự: thư viện ngoài (`next/*`, `react`, `lucide-react`) → `@/components` → `@/lib`.
- Giữ kiểu xuống dòng hiện có của file (một số file CRLF).

## Lint và build

- `npm run lint`: 0 lỗi. 6 cảnh báo `@next/next/no-img-element` hiện có là cố ý; không thêm.
- ESLint bỏ qua `.next/`, `public/`, `Data/`, `screenshots/`, `lib/generated/`.
- `npm run build` chạy `prebuild` (copy-assets + check-data) → `next build`; mọi lỗi dữ liệu làm build dừng.
- `tsc` chạy trong `next build`; không có lệnh `typecheck` riêng.

## Hiệu năng

- Trang tĩnh, JS client nhỏ: không đưa toàn bộ dữ liệu xuống client khi chỉ cần vài trường.
- Chỉ mục tìm kiếm tải lười khi mở hộp tìm kiếm.
- Ảnh `sizes` đúng bố cục; `priority` chỉ ảnh hero.
- Không fetch dữ liệu tĩnh phía client (đã có lúc build).

## Mẫu code chuẩn trong dự án

Store trình duyệt (theo `compare-store.ts`, `site-header.tsx`):

```ts
const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const useScrolled = () => useSyncExternalStore(subscribe, () => window.scrollY > 24, () => false);
```

Kiểm liên kết dữ liệu (theo `lib/data/index.ts`):

```ts
const fail = (file: string, msg: string) => { throw new Error(`[Data] Data/Site/${file}: ${msg}`); };
for (const s of shots) if (!productMap.has(s.product)) fail("feature-shots.json", `sản phẩm không có — ${s.product}`);
```

Route API (theo `app/api/ton-kho/route.ts`):

```ts
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(await getInventory(), { headers: { "Cache-Control": "private, max-age=30" } });
}
```

## Kiểm tra sau khi sửa code

- Lint + build qua.
- Giao diện: screenshot 1440 / 375 (`AUTH_DISABLED=1`), mở ảnh.
- Tương tác (lọc, lightbox, tab): kiểm bằng trình duyệt / CDP; ảnh mobile của `npm run screenshot` không chạy JS.
- Auth / proxy / API: server không có `AUTH_DISABLED` → 307 / 401.
