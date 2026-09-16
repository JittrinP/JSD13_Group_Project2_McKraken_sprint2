import ProductCard from "../../../components/ProductCard";

export default function AllProducts({ products }) {
  const groupedProducts = products.reduce((acc, product) => {
    const type = product.product_type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(product);
    return acc;
  }, {});

  return (
    <section className="flex flex-col gap-10">
      {Object.keys(groupedProducts).length === 0 ? (
        <p className="text-center text-gray-500 py-12 text-sm sm:text-base">
          No products found.
        </p>
      ) : (
        Object.entries(groupedProducts).map(([groupName, groupItems]) => (
          <div key={groupName}>
            <h2 className="text-lg sm:text-xl font-display font-semibold text-primary capitalize mb-5">
              {groupName.replace("_", " ")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
