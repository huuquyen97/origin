import type { Metadata } from "next";
import { PageHero } from "@/components/hero";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { getProducts, seriesName } from "@/lib/data";
import { INV } from "@/lib/strings";

export const metadata: Metadata = { title: INV.title };

/** Khung trang sinh tĩnh; số tồn tải phía client từ /api/ton-kho */
export default function InventoryPage() {
  const products = getProducts().map((p) => ({ slug: p.slug, model: p.model, name: p.name, seriesName: seriesName(p.series) }));
  return (
    <>
      <PageHero
        image="/img/scenes/control-room-1.jpg"
        crumbs={[{ label: INV.title }]}
        eyebrow="Số liệu kho"
        title="Tồn kho theo model"
      />
      <main className="container-x py-12 md:py-14">
        <InventoryTable products={products} />
      </main>
    </>
  );
}
