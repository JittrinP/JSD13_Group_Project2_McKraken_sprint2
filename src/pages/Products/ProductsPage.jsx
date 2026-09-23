import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../../lib/productApi";
import ProductFilterBar from "./_components/ProductFilterBar";
import AllProducts from "./_components/AllProducts";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [products, setProducts] = useState([]);
  // แยก loading/error state เพื่อให้ผู้ใช้เห็นสถานะระหว่างรอ backend
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSearchChange = useCallback(
    (e) => setSearchTerm(e.target.value),
    [],
  );
  const handleTypeChange = useCallback(
    (e) => setSelectedType(e.target.value),
    [],
  );
  const handleGroupChange = useCallback((group) => setSelectedGroup(group), []);

  useEffect(() => {
    // ยกเลิก request เดิมเมื่อ filter เปลี่ยน ป้องกันผลลัพธ์เก่าทับผลลัพธ์ใหม่
    const controller = new AbortController();
    // dropdown และ group ใช้ filter เดียวกัน จึงเลือกค่าที่จะส่งให้ backend ตาม filter ที่เลือก
    const productType =
      selectedType !== "all" && selectedType !== "curated_collections"
        ? selectedType
        : selectedGroup !== "All" && selectedGroup !== "curated_collections"
          ? selectedGroup
          : undefined;
    const hasConflictingTypeFilters =
      selectedType !== "all" &&
      selectedType !== "curated_collections" &&
      selectedGroup !== "All" &&
      selectedGroup !== "curated_collections" &&
      selectedType !== selectedGroup;
    // curated collections ใน UI เทียบกับสินค้าที่ backend ทำเครื่องหมาย is_popular
    const isPopular =
      selectedType === "curated_collections" ||
      selectedGroup === "curated_collections"
        ? "true"
        : undefined;

    // เริ่มสถานะ loading ใหม่ทุกครั้งที่ search หรือ filter เปลี่ยน
    setIsLoading(true);
    setError("");

    getProducts(
      {
        search: searchTerm.trim(),
        product_type: productType,
        is_popular: isPopular,
      },
      controller.signal,
    )
      .then((nextProducts) => {
        // ถ้าเลือก type สองจุดไม่ตรงกัน ให้รักษาพฤติกรรมเดิมคือไม่แสดงสินค้าใดๆ
        setProducts(hasConflictingTypeFilters ? [] : nextProducts);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError("Unable to load products. Please try again.");
        }
      })
      .finally(() => {
        // ไม่เปลี่ยน state หลัง request ถูกยกเลิกระหว่างเปลี่ยน filter
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    // cleanup ทุกครั้งก่อน effect รอบใหม่หรือ component ถูกถอดออก
    return () => controller.abort();
  }, [searchTerm, selectedType, selectedGroup]);

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
        {/* แยก loading, error และผลลัพธ์ เพื่อให้ UI ไม่แสดงข้อมูลค้างระหว่างโหลด */}
        {isLoading ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-500">{error}</p>
        ) : (
          <AllProducts products={products} />
        )}
      </div>
    </div>
  );
}
