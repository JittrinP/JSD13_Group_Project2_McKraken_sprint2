import { memo, useMemo } from "react";
import ProductCard from "../../../components/ProductCard";

function AllProducts({ products }) {
  // ใช้ useMemo ป้องกันการ group ใหม่ทุกครั้งที่ Render (group เฉพาะเมื่อ products เปลี่ยนจริง)
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const type = product.product_type || "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    }, {});
  }, [products]);

  return (
    <section className="flex flex-col gap-8">
      {Object.keys(groupedProducts).length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products found.</p>
      ) : (
        Object.entries(groupedProducts).map(([groupName, groupItems]) => (
          <div key={groupName}>
            <h2 className="text-lg sm:text-xl font-display font-medium text-primary capitalize mb-4">
              {groupName.replace("_", " ")}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {groupItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default memo(AllProducts);
