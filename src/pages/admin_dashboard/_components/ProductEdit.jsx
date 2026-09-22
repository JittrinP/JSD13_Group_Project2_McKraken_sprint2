import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ImageIcon,
  Search,
  Star,
  ChevronDown,
  MinusCircle
} from "lucide-react";

// ==========================================
// 1. CONSTANTS & STYLES
// ==========================================
const PRODUCT_CATEGORY_STYLES = {
  bouquet_set: "bg-[#FFF6ED] text-[#C25E00]",
  single_item: "bg-[#F3F4F6] text-[#4B5563]",
};

const INVENTORY_CATEGORY_STYLES = {
  flower: "bg-[#FDF2F8] text-[#BE185D]",
  wrapping_paper: "bg-[#F0FDF4] text-[#15803D]",
  vase: "bg-[#EFF6FF] text-[#1D4ED8]",
};

const EMPTY_PRODUCT_FORM = {
  _id: "",
  name: "",
  product_type: "bouquet_set",
  is_active: true,
  is_popular: false,
  images: "",
  description: "",
  base_price: 0,
  tags: "",
  components: [],
};

const EMPTY_INVENTORY_FORM = {
  _id: "",
  name: "",
  category: "flower",
  stock_quantity: 0,
  cost_price: 0,
  attributes: {
    color: "",
    origin: "local",
  },
};

// ==========================================
// 2. DATA HOOK (Backend API & MongoDB Integration)
// ==========================================
// API Base URL - สามารถแก้ไขให้ตรงกับ Port / Domain ของ Backend ได้
const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

function useStoreData() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // [FETCH] ดึงข้อมูล ทั้ง Products และ Inventory จาก MongoDB
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // --- ตัวอย่างการยิง API จริงไปยัง Backend ---
      // const resProducts = await fetch(`${API_BASE_URL}/products`);
      // const productsData = await resProducts.json();
      // const resInventory = await fetch(`${API_BASE_URL}/inventory`);
      // const inventoryData = await resInventory.json();
      // setProducts(productsData);
      // setInventory(inventoryData);

      // [Mock Data เริ่มต้นสำหรับการทดสอบ UI]
      setProducts([
        {
          _id: "p1",
          name: "Red Rose Passion Bouquet",
          description: "Premium red rose",
          images: ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200"],
          product_type: "bouquet_set",
          base_price: 1290,
          is_active: true,
          is_popular: true,
          components: [
            { inventory_item_id: "inv01", quantity_required: 12 },
            { inventory_item_id: "inv02", quantity_required: 1 }
          ]
        }
      ]);
      setInventory([
        { _id: "inv01", name: "Ecuadorian Red Rose", category: "flower", cost_price: 18, stock_quantity: 640, attributes: { color: "red", origin: "imported" } },
        { _id: "inv02", name: "Kraft Wrapping Paper", category: "wrapping_paper", cost_price: 12, stock_quantity: 300, attributes: { color: "brown", origin: "local" } },
        { _id: "inv03", name: "Out of Stock Item", category: "vase", cost_price: 10, stock_quantity: 0, attributes: { color: "clear", origin: "local" } }
      ]);
    } catch (error) {
      console.error("Error fetching data from MongoDB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // [SAVE/UPDATE] บันทึกหรือแก้ไขข้อมูล Product ไปยัง MongoDB
  const saveProduct = async (data, isEditing) => {
    try {
      const url = isEditing
        ? `${API_BASE_URL}/products/${data._id}`
        : `${API_BASE_URL}/products`;
      const method = isEditing ? "PUT" : "POST";

      console.log(`[MongoDB] ${method} Product Data:`, data);

      // --- ตัวอย่างการยิง API บันทึกข้อมูล ---
      /*
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save product");
      */

      fetchData(); // Reload ข้อมูลหลังบันทึกสำเร็จ
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // [SAVE/UPDATE] บันทึกหรือแก้ไขข้อมูล Inventory ไปยัง MongoDB
  const saveInventory = async (data, isEditing) => {
    try {
      const url = isEditing
        ? `${API_BASE_URL}/inventory/${data._id}`
        : `${API_BASE_URL}/inventory`;
      const method = isEditing ? "PUT" : "POST";

      console.log(`[MongoDB] ${method} Inventory Data:`, data);

      // --- ตัวอย่างการยิง API บันทึกข้อมูล ---
      /*
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save inventory");
      */

      fetchData(); // Reload ข้อมูลหลังบันทึกสำเร็จ
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  // [DELETE] ลบข้อมูลตาม ID ใน MongoDB
  const deleteItem = async (id, type) => {
    try {
      const endpoint = type === "products" ? "products" : "inventory";
      const url = `${API_BASE_URL}/${endpoint}/${id}`;

      console.log(`[MongoDB] DELETE ${type} ID:`, id);

      // --- ตัวอย่างการยิง API ลบข้อมูล ---
      /*
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to delete ${type}`);
      */

      fetchData(); // Reload ข้อมูลหลังลบสำเร็จ
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  return { products, inventory, saveProduct, saveInventory, deleteItem, isLoading };
}

const SelectInput = memo(({ value, onChange, options, className = "" }) => (
  <div className={`relative w-full ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white border border-neutral-200/50 rounded-xl px-3.5 py-2.5 text-sm font-medium text-D-text focus:outline-none focus:ring-1 focus:ring-D-text/30 cursor-pointer pr-9 shadow-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 text-neutral-400 pointer-events-none" />
  </div>
));
SelectInput.displayName = "SelectInput";

// ==========================================
// 3. DELETE CONFIRMATION MODAL
// ==========================================
const DeleteConfirmModal = memo(({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 relative border border-neutral-200/40 shadow-xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6">
          <span className="text-[11px] font-bold text-red-500 uppercase">
            Delete Item
          </span>
          <h2 className="font-serif text-2xl text-D-text mt-1">
            Are you sure?
          </h2>
        </div>
        <p className="text-sm text-neutral-600 mb-8">
          Do you really want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-neutral-200/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
});
DeleteConfirmModal.displayName = "DeleteConfirmModal";

// ==========================================
// 4. DYNAMIC FORM MODAL COMPONENT
// ==========================================
const ItemFormModal = memo(({ isOpen, onClose, initialData, onSubmit, type, inventoryList }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(formData._id);
  const isProduct = type === "product";

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (field.startsWith("attributes.")) {
        const attrKey = field.split(".")[1];
        return { ...prev, attributes: { ...prev.attributes, [attrKey]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const processedData = { ...formData };
    if (isProduct && typeof formData.tags === "string") {
      processedData.tags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    // จัดการแปลงข้อมูล Image URL ให้อยู่ในรูปแบบ Array สำหรับ MongoDB
    if (isProduct && typeof formData.images === "string") {
      processedData.images = formData.images ? [formData.images] : [];
    }

    onSubmit(processedData, isEditing);
    onClose();
  };

  const productComponents = (isProduct && Array.isArray(formData.components)) ? formData.components : [];

  const addComponent = () => {
    if (productComponents.length >= 10) return alert("Maximum 10 components allowed.");
    setFormData(prev => ({
      ...prev,
      components: [...productComponents, { inventory_item_id: "", quantity_required: 1 }]
    }));
  };

  const removeComponent = (index) => {
    setFormData(prev => ({
      ...prev,
      components: productComponents.filter((_, i) => i !== index)
    }));
  };

  const updateComponent = (index, field, value) => {
    const newComps = [...productComponents];
    newComps[index][field] = value;
    setFormData(prev => ({ ...prev, components: newComps }));
  };

  const availableInventory = (inventoryList || []).filter(item => {
    const hasStock = item.stock_quantity > 0;
    const isAlreadySelected = productComponents.some(comp => comp.inventory_item_id === item._id);
    return hasStock || isAlreadySelected;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-6 sm:p-8 relative my-8 border border-neutral-200/40 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6">
          <span className="text-[11px] font-bold text-neutral-400 uppercase">
            NEW ITEMS
          </span>
          <h2 className="font-serif text-3xl text-D-text mt-1">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h2>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <Label className="text-[11px] font-bold text-neutral-500 uppercase">
              {isProduct ? "Product Name *" : "Item Name *"}
            </Label>
            <Input
              required
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-[#FBF9F6] border-neutral-200/40 h-11 text-D-text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold text-neutral-500 uppercase">Category</Label>
              {isProduct ? (
                <SelectInput
                  value={formData.product_type || "bouquet_set"}
                  onChange={(val) => handleChange("product_type", val)}
                  options={[
                    { value: "bouquet_set", label: "Bouquet Set" },
                    { value: "single_item", label: "Single Item" },
                  ]}
                />
              ) : (
                <SelectInput
                  value={formData.category || "flower"}
                  onChange={(val) => handleChange("category", val)}
                  options={[
                    { value: "flower", label: "Flower" },
                    { value: "wrapping_paper", label: "Wrapping Paper" },
                    { value: "vase", label: "Vase" },
                  ]}
                />
              )}
            </div>

            <div>
              <Label className="text-[11px] font-bold text-neutral-500 uppercase">Status</Label>
              {isProduct ? (
                <SelectInput
                  value={String(formData.is_active ?? true)}
                  onChange={(val) => handleChange("is_active", val === "true")}
                  options={[
                    { value: "true", label: "Available" },
                    { value: "false", label: "Not Available" },
                  ]}
                />
              ) : (
                <SelectInput
                  value={String((formData.stock_quantity ?? 0) > 0)}
                  onChange={(val) => handleChange("stock_quantity", val === "true" ? (formData.stock_quantity > 0 ? formData.stock_quantity : 1) : 0)}
                  options={[
                    { value: "true", label: "Available" },
                    { value: "false", label: "Out of stock" },
                  ]}
                />
              )}
            </div>
          </div>

          {isProduct ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Base Price</Label>
                  <Input type="number" min="0" value={formData.base_price || 0} onChange={(e) => handleChange("base_price", Number(e.target.value))} className="bg-[#FBF9F6] h-11" />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Image URL</Label>
                  <Input value={Array.isArray(formData.images) ? formData.images[0] || "" : formData.images || ""} onChange={(e) => handleChange("images", e.target.value)} className="bg-[#FBF9F6] h-11" />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-neutral-500 uppercase">Description</Label>
                <Input value={formData.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="bg-[#FBF9F6] h-11" />
              </div>

              <div className="flex items-center space-x-3 rounded-xl border border-neutral-200/40 p-3 bg-[#FBF9F6]">
                <Checkbox id="is_popular" checked={formData.is_popular || false} onCheckedChange={(checked) => handleChange("is_popular", checked)} />
                <Label htmlFor="is_popular" className="text-xs font-semibold text-D-text cursor-pointer">
                  Featured in Popular <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                </Label>
              </div>

              <div className="border border-neutral-200/40 rounded-xl p-4 bg-neutral-50/50">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Components (Max 10)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addComponent} disabled={productComponents.length >= 10}>
                    + Component
                  </Button>
                </div>
                {productComponents.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <select
                      className="flex-1 bg-white border border-neutral-200/50 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-D-text/30"
                      value={comp.inventory_item_id}
                      onChange={(e) => updateComponent(idx, "inventory_item_id", e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Item...</option>
                      {availableInventory.map(inv => (
                        <option key={inv._id} value={inv._id}>
                          {inv.name} {inv.stock_quantity === 0 ? "(Out of stock)" : ""}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number" min="1" placeholder="Qty"
                      value={comp.quantity_required}
                      onChange={(e) => updateComponent(idx, "quantity_required", Number(e.target.value))}
                      className="w-20 bg-white h-9"
                      required
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeComponent(idx)} className="text-red-500">
                      <MinusCircle className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
                {productComponents.length === 0 && (
                  <div className="text-sm text-neutral-400 text-center py-2">No components added yet.</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Cost Price</Label>
                  <Input type="number" min="0" value={formData.cost_price ?? 0} onChange={(e) => handleChange("cost_price", Number(e.target.value))} className="bg-[#FBF9F6] h-11" required />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Stock Quantity</Label>
                  <Input type="number" min="0" value={formData.stock_quantity ?? 0} onChange={(e) => handleChange("stock_quantity", Number(e.target.value))} className="bg-[#FBF9F6] h-11" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Color</Label>
                  <Input value={formData.attributes?.color || ""} onChange={(e) => handleChange("attributes.color", e.target.value)} className="bg-[#FBF9F6] h-11" />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-neutral-500 uppercase">Origin</Label>
                  <SelectInput
                    value={formData.attributes?.origin || "local"}
                    onChange={(val) => handleChange("attributes.origin", val)}
                    options={[
                      { value: "local", label: "Local" },
                      { value: "imported", label: "Imported" },
                    ]}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-neutral-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-neutral-200/50">
              Cancel
            </Button>
            <Button type="submit" className="bg-D-text hover:bg-[#38436c] text-white rounded-xl px-6">
              {isEditing ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});
ItemFormModal.displayName = "ItemFormModal";

// ==========================================
// 5. MAIN COMPONENT
// ==========================================
export default function ProductEdit() {
  const { products, inventory, saveProduct, saveInventory, deleteItem } = useStoreData();
  const [activeTab, setActiveTab] = useState("product");

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const isProductTab = activeTab === "product";
  const currentData = isProductTab ? products : inventory;

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();
    return currentData.filter((item) => {
      const matchSearch = !query || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);

      const itemCat = isProductTab ? item.product_type : item.category;
      const matchCat = category === "all" || itemCat === category;

      let matchStatus = true;
      if (status !== "all") {
        if (isProductTab) {
          matchStatus = status === "available" ? item.is_active : !item.is_active;
        } else {
          matchStatus = status === "available" ? item.stock_quantity > 0 : item.stock_quantity === 0;
        }
      }
      return matchSearch && matchCat && matchStatus;
    });
  }, [currentData, search, category, status, isProductTab]);

  const stats = useMemo(() => {
    if (isProductTab) {
      return {
        total: products.length,
        available: products.filter((p) => p.is_active).length,
        not_available: products.filter((p) => !p.is_active).length,
        popular: products.filter((p) => p.is_popular).length,
      };
    } else {
      return {
        total: inventory.length,
        available: inventory.filter((i) => i.stock_quantity > 0).length,
        out_of_stock: inventory.filter((i) => i.stock_quantity === 0).length,
      };
    }
  }, [products, inventory, isProductTab]);

  const handleOpenModal = useCallback((item = null) => {
    if (item) {
      setActiveItem(item);
    } else {
      setActiveItem(isProductTab ? EMPTY_PRODUCT_FORM : EMPTY_INVENTORY_FORM);
    }
    setIsOpen(true);
  }, [isProductTab]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setActiveItem(null);
  }, []);

  const handleSubmitModal = useCallback((data, isEditing) => {
    if (isProductTab) saveProduct(data, isEditing);
    else saveInventory(data, isEditing);
  }, [isProductTab, saveProduct, saveInventory]);

  const handleOpenDeleteModal = useCallback((item) => {
    setDeleteModal({ isOpen: true, item });
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, item: null });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.item) {
      deleteItem(deleteModal.item._id, isProductTab ? "products" : "inventory");
    }
    handleCloseDeleteModal();
  }, [deleteModal.item, isProductTab, deleteItem, handleCloseDeleteModal]);

  useEffect(() => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 sm:p-8 text-neutral-800">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex space-x-2 border-b border-neutral-200/50 pb-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("product")}
            className={`text-lg font-serif rounded-none border-b-2 px-4 py-2 hover:bg-transparent ${isProductTab ? "border-D-text text-D-text" : "border-transparent text-neutral-400"}`}
          >
            Products
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("inventory")}
            className={`text-lg font-serif rounded-none border-b-2 px-4 py-2 hover:bg-transparent ${!isProductTab ? "border-D-text text-D-text" : "border-transparent text-neutral-400"}`}
          >
            Inventory
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200/40 shadow-none">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl text-D-text">
                {isProductTab ? "Products" : "Inventory"}
              </h1>
              <Badge className="bg-D-text/10 text-D-text border-0">
                {stats.total} Total
              </Badge>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {isProductTab
                ? "Manage, curate, and publish botanical products."
                : "Manage, curate, and check botanical inventory."}
            </p>
            <div className="flex gap-4 text-xs text-neutral-500 mt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                {stats.available} Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                {isProductTab ? `${stats.not_available} Not Available` : `${stats.out_of_stock} Out of stock`}
              </span>
              {isProductTab && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {stats.popular} Popular
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-D-text hover:bg-[#38436c] text-white rounded-xl px-5 py-2.5 shadow-none"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add item
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <Input
              placeholder="Search name..."
              className="pl-9 bg-white border border-neutral-200/50 rounded-xl text-sm h-10 text-D-text shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SelectInput
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "All Categories" },
              ...(isProductTab
                ? [{ value: "bouquet_set", label: "Bouquet Set" }, { value: "single_item", label: "Single Item" }]
                : [{ value: "flower", label: "Flower" }, { value: "wrapping_paper", label: "Wrapping Paper" }, { value: "vase", label: "Vase" }]
              )
            ]}
          />
          <SelectInput
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "available", label: "Available" },
              { value: "unavailable", label: isProductTab ? "Not Available" : "Out of stock" },
            ]}
          />
        </div>

        <Card className="border border-neutral-200/40 shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-50/40 border-b border-neutral-100">
                <TableRow className="border-b border-neutral-100/70 hover:bg-transparent">
                  <TableHead className="w-12 pl-6">
                    <Checkbox className="rounded-md border-neutral-200" />
                  </TableHead>
                  {isProductTab && (
                    <TableHead className="w-16 text-[11px] font-bold text-neutral-400">COVER</TableHead>
                  )}
                  <TableHead className="text-[11px] font-bold text-neutral-400">NAME & DESCRIPTION</TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400">CATEGORY</TableHead>

                  {/* แสดงคอลัมน์ Best Price เฉพาะหน้า Tab Product */}
                  {isProductTab && (
                    <TableHead className="text-[11px] font-bold text-neutral-400">BEST PRICE</TableHead>
                  )}

                  {/* แสดงคอลัมน์ Stock Quantity เฉพาะหน้า Tab Inventory */}
                  {!isProductTab && (
                    <TableHead className="text-[11px] font-bold text-neutral-400">STOCK QUANTITY</TableHead>
                  )}

                  <TableHead className="text-[11px] font-bold text-neutral-400">STATUS</TableHead>
                  {isProductTab && (
                    <TableHead className="text-[11px] font-bold text-neutral-400">EDITORIAL PICK</TableHead>
                  )}
                  <TableHead className="text-right pr-6 text-[11px] font-bold text-neutral-400">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const itemName = item.name;
                  const itemDesc = isProductTab ? item.description : "";
                  const itemCategory = isProductTab ? item.product_type : item.category;

                  const isAvailable = isProductTab ? item.is_active : (item.stock_quantity > 0);
                  const statusLabel = isAvailable ? "Available" : (isProductTab ? "Not Available" : "Out of stock");
                  const catStyleMap = isProductTab ? PRODUCT_CATEGORY_STYLES : INVENTORY_CATEGORY_STYLES;

                  return (
                    <TableRow key={item._id} className="hover:bg-neutral-50/30 border-b border-neutral-100/60">
                      <TableCell className="pl-6">
                        <Checkbox className="rounded-md border-neutral-200" />
                      </TableCell>

                      {isProductTab && (
                        <TableCell>
                          {item.images && item.images[0] ? (
                            <img src={item.images[0]} alt={itemName} className="w-10 h-10 object-cover rounded-xl border border-neutral-100" />
                          ) : (
                            <div className="w-10 h-10 bg-neutral-100/60 rounded-xl flex items-center justify-center text-neutral-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </TableCell>
                      )}

                      <TableCell>
                        <div className="font-serif font-medium text-D-text line-clamp-1">{itemName}</div>
                        {itemDesc && <div className="text-xs text-neutral-400 line-clamp-1">{itemDesc}</div>}
                      </TableCell>

                      <TableCell>
                        <Badge className={`capitalize rounded-lg px-2.5 py-1 text-xs font-normal border-0 ${catStyleMap[itemCategory] || "bg-neutral-100"}`}>
                          {itemCategory?.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>

                      {/* แสดงข้อมูล Best Price (base_price) ในหน้า Products */}
                      {isProductTab && (
                        <TableCell className="font-medium text-sm text-D-text">
                          ฿{item.base_price?.toLocaleString() || 0}
                        </TableCell>
                      )}

                      {/* แสดงข้อมูล Stock Quantity (stock_quantity) ในหน้า Inventory */}
                      {!isProductTab && (
                        <TableCell className="font-medium text-sm text-D-text">
                          {item.stock_quantity?.toLocaleString() || 0}
                        </TableCell>
                      )}

                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium capitalize">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-600" : "bg-neutral-400"}`} />
                          {statusLabel}
                        </div>
                      </TableCell>

                      {isProductTab && (
                        <TableCell>
                          {item.is_popular ? (
                            <div className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#B45309] rounded-md px-2 py-0.5 text-xs">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Popular
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-300">-</span>
                          )}
                        </TableCell>
                      )}

                      <TableCell className="text-right pr-6 space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)} className="h-8 w-8 text-neutral-400 hover:text-D-text">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(item)} className="h-8 w-8 text-neutral-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {isOpen && (
        <ItemFormModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          initialData={activeItem}
          onSubmit={handleSubmitModal}
          type={activeTab}
          inventoryList={inventory}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.item?.name}
      />
    </div>
  );
}