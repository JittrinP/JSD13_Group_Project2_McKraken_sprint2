import { useCallback, useMemo, useState } from "react";
import mockProducts from "../../assets/mockData/mockProducts";
import ProductFilterBar from "./_components/ProductFilterBar";
import AllProducts from "./_components/AllProducts";
import PopularProducts from "../../components/PopularProducts";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("All");

  // useCallback: event handlers ที่ส่งเป็น props ลงไปใน FilterBar ไม่สร้างฟังก์ชันใหม่ทุก Render
  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleTypeChange = useCallback((e) => setSelectedType(e.target.value), []);
  const handleGroupChange = useCallback((group) => setSelectedGroup(group), []);

  // กรองข้อมูลสินค้าตาม Search, Filter และ Product Group (PG)
  // trim + toLowerCase ครั้งเดียว ลด work ต่อ keystroke
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mockProducts.filter((product) => {
      if (!product.is_active) return false;

      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      const matchesType =
        selectedType === "all" || product.product_type === selectedType;

      const matchesGroup =
        selectedGroup === "All" || product.product_type === selectedGroup;

      return matchesSearch && matchesType && matchesGroup;
    });
  }, [searchTerm, selectedType, selectedGroup]);

  return (
    <>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        <ProductFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          selectedGroup={selectedGroup}
          onGroupChange={handleGroupChange}
        />

        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-primary mb-6">
          All product
        </h1>

        {/* ล็อคความสูงขั้นต่ำ + ใช้ [contain:content] ป้องกัน Layout Shift / Reflow ทั้งหน้า */}
        <div className="min-h-[60vh] [contain:content]">
          <AllProducts products={filteredProducts} />
        </div>
      </div>

      {/* Curated Collections — Popular Products Section */}
      <PopularProducts />
    </>
  );
}
