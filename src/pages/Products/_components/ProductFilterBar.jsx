import { memo } from "react";

// ย้าย Static Array ออกมานอก Component เพื่อป้องกันการสร้าง Array ใหม่ทุกครั้งที่ Render
const DEFAULT_GROUPS = ["All", "bouquet_set", "single_item"];

function ProductFilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGroup,
  onGroupChange,
  groups = DEFAULT_GROUPS,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search product..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-gray-200/80 bg-white focus:outline-none focus:border-primary/40 shadow-sm"
        />
      </div>

      {/* Filter Select + PG Pills — group ไว้เพื่อให้ Tablet/Desktop อยู่ในแถวเดียวกัน */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {/* Filter Select */}
        <select
          value={selectedType}
          onChange={onTypeChange}
          className="w-full sm:w-auto px-4 py-2 text-xs rounded-full border border-gray-200/80 bg-white text-neutral focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="all">Filter (All Types)</option>
          <option value="bouquet_set">Bouquet Set</option>
          <option value="single_item">Single Item</option>
        </select>

        {/* Product Group (PG) Pills — Mobile: scroll แนวนอน + ซ่อน scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {groups.map((group) => {
            const isActive = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => onGroupChange(group)}
                className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors duration-75 ${
                  isActive
                    ? "bg-neutral text-white font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {group === "All" ? "All PG" : group.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ครอบด้วย memo ป้องกันการ Render ซ้ำเมื่อ State ไม่เกี่ยวกับ FilterBar
export default memo(ProductFilterBar);
