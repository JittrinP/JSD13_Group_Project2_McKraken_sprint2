import { useCallback, useState } from "react";
import mockProducts from "../../assets/mockData/mockProducts";
import ProductFilterBar from "./_components/ProductFilterBar";
import AllProducts from "./_components/AllProducts";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const handleSearchChange = useCallback(
    (e) => setSearchTerm(e.target.value),
    [],
  );
  const handleTypeChange = useCallback(
    (e) => setSelectedType(e.target.value),
    [],
  );
  const handleGroupChange = useCallback((group) => setSelectedGroup(group), []);

  const q = searchTerm.trim().toLowerCase();
  const filteredProducts = mockProducts.filter((product) => {
    if (!product.is_active) return false;

    const matchesSearch =
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);

    const matchesType =
      selectedType === "all" ||
      (selectedType === "curated_collections"
        ? product.is_popular
        : product.product_type === selectedType);

    const matchesGroup =
      selectedGroup === "All" ||
      (selectedGroup === "curated_collections"
        ? product.is_popular
        : product.product_type === selectedGroup);

    return matchesSearch && matchesType && matchesGroup;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-primary whitespace-nowrap">
          All product
        </h1>

        <ProductFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          selectedGroup={selectedGroup}
          onGroupChange={handleGroupChange}
        />
      </div>

      <div className="min-h-[60vh] pb-12">
        <AllProducts products={filteredProducts} />
      </div>
    </div>
  );
}
