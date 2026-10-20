import { buildSearchIndex } from "@/lib/search/build-index";

// Sinh tĩnh lúc build: /search-index.json, client tải khi mở ô tìm kiếm.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
