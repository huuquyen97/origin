import Link from "next/link";
import { PageHero } from "@/components/hero";

export default function NotFound() {
  return (
    <>
      <PageHero image="/img/scenes/products.jpg" crumbs={[{ label: "404" }]} eyebrow="Không tìm thấy" title="Trang này không tồn tại" lead="Link có thể đã cũ. Thử tìm bằng Ctrl K hoặc quay lại danh sách sản phẩm." />
      <main className="container-x py-12">
        <Link className="btn btn-dark" href="/san-pham">Về danh sách sản phẩm</Link>
      </main>
    </>
  );
}
