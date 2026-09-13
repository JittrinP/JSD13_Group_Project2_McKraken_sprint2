import mockProducts from "../assets/mockData/mockProducts";
import ProductCard from "./ProductCard";

export default function PopularProducts() {
  const popularList = mockProducts.filter(
    (product) => product.is_popular && product.is_active,
  );

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-primary">
          Curated Collections
        </h2>
        <a
          href="/products"
          className="text-xs text-primary hover:underline whitespace-nowrap"
        >
          View all collections
        </a>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {popularList.slice(0, 3).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
