import { useState, useRef, useEffect } from "react";

const DEFAULT_GROUPS = [
  "All",
  "curated_collections",
  "bouquet_set",
  "single_item",
];

const OPTIONS = [
  { value: "all", label: "Filter (All Types)" },
  { value: "curated_collections", label: "Curated Collections" },
  { value: "bouquet_set", label: "Bouquet Set" },
  { value: "single_item", label: "Single Item" },
];

export default function ProductFilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGroup,
  onGroupChange,
  groups = DEFAULT_GROUPS,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    OPTIONS.find((opt) => opt.value === selectedType)?.label ||
    "Filter (All Types)";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap xl:flex-nowrap justify-start xl:justify-end w-full xl:w-auto">
      <div className="relative w-full sm:w-64 group">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search product..."
          className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm rounded-full border border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 hover:border-gray-300 cursor-text"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange({ target: { value: "" } })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-90 transition-all text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto h-10 px-4 text-xs sm:text-sm rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 flex items-center justify-between gap-3 hover:border-gray-300 active:scale-95 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            <span>{currentLabel}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-150">
              {OPTIONS.map((option) => {
                const isSelected = selectedType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onTypeChange({ target: { value: option.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 -m-1 pb-1 sm:pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {groups.map((group) => {
            const isActive = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => onGroupChange(group)}
                className={`h-9 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer flex items-center ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 hover:-translate-y-0.5"
                }`}
              >
                {group === "All"
                  ? "All PG"
                  : group === "curated_collections"
                    ? "Curated Collections"
                    : group.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
