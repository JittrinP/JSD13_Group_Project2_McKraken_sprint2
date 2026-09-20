import mockProducts from "../assets/mockData/mockProducts";
import ProductCard from "./ProductCard";

export default function PopularProducts() {
  const popularList = mockProducts.filter(
    (product) => product.is_popular && product.is_active,
  );

  return (
    <section className="w-full">
      {/* ปรับเป็น max-w-7xl เพื่อให้ตรงแนวเดียวกับ Navbar */}
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-primary">
          Curated Collections
        </h2>
        <a
          href="/products"
          className="text-xs text-primary hover:underline whitespace-nowrap font-medium"
        >
          View all collections
        </a>
      </div>

      <div className="max-w-5xl mx-auto flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 md:pb-0 scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {popularList.slice(0, 3).map((product) => (
          <div
            key={product._id}
            className="w-[78%] xs:w-[80%] md:w-full flex-shrink-0 snap-start flex"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
