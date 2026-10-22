import { NextResponse } from "next/server";
import { getInventory } from "@/lib/inventory/store";

// Số tồn kho đọc lúc chạy (proxy.ts đã bắt buộc đăng nhập cho /api/*)
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getInventory(), { headers: { "Cache-Control": "private, max-age=30" } });
}
