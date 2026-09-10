import { memo, useMemo } from "react";
import mockProducts from "../assets/mockData/mockProducts";
import ProductCard from "./ProductCard";

function PopularProducts() {
  // ดึงเฉพาะสินค้าที่เปิดใช้งาน (is_active) และเป็นสินค้ายอดนิยม (is_popular)
  // ใช้ useMemo + memo เพื่อไม่ให้ filter ใหม่ทุกครั้งที่ parent re-render
  const popularList = useMemo(
    () =>
      mockProducts.filter((product) => product.is_popular && product.is_active),
    [],
  );

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-primary">
          Curated Collections
        </h2>
        <a
          href="/products"
          className="text-xs text-gray-500 hover:underline whitespace-nowrap"
        >
          View all collections
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {popularList.slice(0, 3).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showQuantity={false}
          />
        ))}
      </div>
    </section>
  );
}

// ครอบด้วย memo ป้องกัน Re-render ที่ไม่จำเป็นเมื่อผู้ใช้กรองสินค้าในหน้า /products
export default memo(PopularProducts);
