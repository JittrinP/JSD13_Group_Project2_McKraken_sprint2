import React, { useState } from "react";
import mockUser from "../../../assets/mockData/mockUser"; // อ้างอิงไฟล์ mock ข้อมูลผู้ใช้งาน

export default function CustomerAddress({ currentUser = mockUser[0] }) {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================

  // แปลงข้อมูลที่ได้จาก mockUser (หรือ API) ให้อยู่ในรูปแบบ State สำหรับใช้ใน Component
  const [addresses, setAddresses] = useState(() => {
    const initial = (currentUser?.shipping_addresses || []).map((addr, index) => ({
      id: addr.id || `addr-init-${index}`,
      name: `${currentUser?.profile?.first_name || ""} ${currentUser?.profile?.last_name || ""}`.trim() || "Customer Name",
      phone: addr.phone || currentUser?.phone_number || "",
      addressLine: addr.address || "",
      subDistrict: addr.sub_district || "",
      district: addr.district || "",
      province: addr.province || "",
      postalCode: addr.postal_code || "",
      isDefault: addr.is_default || index === 0,
    }));

    // บังคับเงื่อนไข: หากไม่มีที่อยู่ไหนถูกตั้งเป็น Default ให้ตั้งรายการแรกเป็น Default ทันที
    if (initial.length > 0 && !initial.some((a) => a.isDefault)) {
      initial[0].isDefault = true;
    }
    return initial;
  });

  // State ควบคุมการเปิด/ปิด Pop-up Modal และเก็บ ID ของที่อยู่ที่กำลังแก้ไข (null = เพิ่มใหม่)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // State สำหรับเก็บข้อมูล Input ในฟอร์ม Modal
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });

  // ==========================================
  // 2. MODAL CONTROLLERS (เปิด / ปิด)
  // ==========================================

  // เปิด Modal สำหรับ "เพิ่มที่อยู่ใหม่" (ล้างฟอร์ม + ใส่ค่าเริ่มต้นชื่อ/เบอร์โทรจาก User)
  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      name: `${currentUser?.profile?.first_name || ""} ${currentUser?.profile?.last_name || ""}`.trim(),
      phone: currentUser?.phone_number || "",
      addressLine: "",
      subDistrict: "",
      district: "",
      province: "",
      postalCode: "",
    });
    setIsModalOpen(true);
  };

  // เปิด Modal สำหรับ "แก้ไขที่อยู่" (นำข้อมูลที่อยู่ที่เลือกมาใส่ลงในฟอร์ม)
  const handleOpenEditModal = (targetAddr) => {
    setEditingAddressId(targetAddr.id);
    setFormData({
      name: targetAddr.name,
      phone: targetAddr.phone,
      addressLine: targetAddr.addressLine,
      subDistrict: targetAddr.subDistrict,
      district: targetAddr.district,
      province: targetAddr.province,
      postalCode: targetAddr.postalCode,
    });
    setIsModalOpen(true);
  };

  // ปิด Modal และ รีเซ็ต ID ที่แก้ไข
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
  };

  // ==========================================
  // 3. ADDRESS ACTIONS (เพิ่ม / แก้ไข / ลบ / ตั้งหลัก)
  // ==========================================

  // บันทึกที่อยู่ (รองรับทั้งเพิ่มใหม่และการแก้ไข)
  const handleSaveAddress = (e) => {
    e.preventDefault();

    // Validation ตรวจสอบข้อมูลเบื้องต้น
    if (!formData.name || !formData.phone || !formData.addressLine) {
      alert("กรุณากรอกข้อมูล ชื่อ-นามสกุล, เบอร์โทรศัพท์ และที่อยู่ให้ครบถ้วน");
      return;
    }

    if (editingAddressId) {
      // --- กรณีแก้ไขที่อยู่เดิม ---
      setAddresses((prev) => {
        const target = prev.find((item) => item.id === editingAddressId);
        if (!target) return prev;

        const updatedTarget = { ...target, ...formData };
        const others = prev.filter((item) => item.id !== editingAddressId);

        // จัดลำดับ: หากเป็น Default ให้อยู่บนสุดเสมอ หากไม่ใช่ ให้ย้ายมาอยู่บนสุดรองลงมาจาก Default
        if (updatedTarget.isDefault) {
          return [updatedTarget, ...others];
        } else {
          const defaultItem = others.find((item) => item.isDefault);
          const nonDefaults = others.filter((item) => !item.isDefault);
          return defaultItem
            ? [defaultItem, updatedTarget, ...nonDefaults]
            : [updatedTarget, ...nonDefaults];
        }
      });
    } else {
      // --- กรณีเพิ่มที่อยู่ใหม่ ---
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0, // หากยังไม่มีที่อยู่เลย ให้ที่อยู่นี้เป็น Default ทันที
      };

      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [newAddress, ...prev];
        }
        // วางรายการใหม่ไว้บนสุด (ต่อจากที่อยู่หลัก Default)
        const defaultItem = prev.find((item) => item.isDefault);
        const nonDefaults = prev.filter((item) => !item.isDefault);
        return defaultItem
          ? [defaultItem, newAddress, ...nonDefaults]
          : [newAddress, ...nonDefaults];
      });
    }

    handleCloseModal(); // บันทึกเสร็จแล้วปิด Modal
  };

  // เปลี่ยนรายการที่เลือกให้เป็น "ที่อยู่หลัก" (Make Default)
  const handleMakeDefault = (id) => {
    setAddresses((prev) => {
      const updated = prev.map((item) => ({
        ...item,
        isDefault: item.id === id, // เปลี่ยนรายการที่เลือกเป็น true และรายการอื่นเป็น false
      }));

      // ย้ายรายการที่เป็น Default ใหม่ขึ้นมาอยู่ลำดับแรกสุด
      const defaultItem = updated.find((item) => item.isDefault);
      const others = updated.filter((item) => !item.isDefault);
      return defaultItem ? [defaultItem, ...others] : updated;
    });
  };

  // ลบที่อยู่ (มีเงื่อนไขป้องกันการลบที่อยู่หลัก)
  const handleRemove = (id) => {
    const target = addresses.find((item) => item.id === id);
    if (target?.isDefault) {
      alert("ไม่สามารถลบที่อยู่หลักได้");
      return;
    }
    if (confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
      setAddresses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // ==========================================
  // 4. RENDER UI
  // ==========================================
  return (
    <div className="w-full bg-secondary rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
      {/* --- ส่วนหัว Component: ชื่อหน้าและปุ่มเพิ่มที่อยู่ --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral">
          My Address
        </h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary/90 text-white font-body text-sm font-medium py-2.5 px-6 rounded-full transition-all duration-200 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          Add new address
        </button>
      </div>

      {/* --- รายการที่อยู่ ( scrollable เลื่อนดูได้ภายในกรอบ ) --- */}
      <div className="max-h-130 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {addresses.length === 0 ? (
          <div className="text-center py-12 text-neutral/60 font-body">
            ยังไม่มีข้อมูลที่อยู่ กรุณากดเพิ่มที่อยู่ใหม่
          </div>
        ) : (
          addresses.map((item, index) => (
            <div
              key={item.id}
              className={`pb-6 ${
                index !== addresses.length - 1 ? "border-b border-black/10" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* ข้อมูลชื่อ เบอร์โทร และที่อยู่ลูกค้า */}
                <div className="space-y-1.5 flex-1 font-body">
                  <div className="text-base font-bold text-neutral">
                    <span>{item.name}</span>
                    <span className="mx-2 font-normal text-neutral/40">|</span>
                    <span className="font-semibold text-neutral">{item.phone}</span>
                  </div>
                  <p className="text-sm text-neutral/80 leading-relaxed">
                    {item.addressLine}
                    {item.subDistrict ? `, ${item.subDistrict}` : ""}
                    {item.district ? `, ${item.district}` : ""}
                  </p>
                  <p className="text-sm text-neutral/80">
                    {item.province} {item.postalCode}
                  </p>
                </div>

                {/* ปุ่มจัดการ: Edit, Remove, Default Status */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center space-x-2 text-xs font-body">
                    {/* ปุ่มแก้ไข (แสดงทุกรายการ) */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-neutral/70 hover:text-neutral transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {/* ปุ่มลบ (ซ่อนไว้สำหรับรายการที่เป็น Default) */}
                    {!item.isDefault && (
                      <>
                        <span className="text-neutral/30">|</span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-700/80 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>

                  {/* แสดง Badge "Default" หรือ ปุ่มกด "Make default" */}
                  {item.isDefault ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-black/10 text-neutral/50 text-xs font-medium font-body cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral/40"></span>
                      <span>Default</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMakeDefault(item.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-black/10 hover:bg-black/20 text-neutral text-xs font-medium font-body transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral"></span>
                      <span>Make default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- POP-UP MODAL (แสดงเมื่อกด Add หรือ Edit) --- */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal} // คลิกพื้นหลังเบลอเพื่อปิด Modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้การคลิกข้างในตัว Modal ส่ง Event ไปปิด Backdrop
            className="relative bg-secondary w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-black/10 animate-in fade-in zoom-in duration-150 cursor-default"
          >
            {/* ปุ่ม ✕ ปิด Modal มุมขวาบน */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-neutral/60 hover:text-neutral hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* หัวข้อ Modal */}
            <h3 className="font-display text-xl font-bold text-neutral mb-6">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>

            {/* ฟอร์มกรอกข้อมูลที่อยู่ */}
            <form onSubmit={handleSaveAddress} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-semibold text-neutral/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kittisak Pongsawat"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral/80 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0814567890"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral/80 mb-1">
                  Address Detail
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="e.g. 128/45 Moo 3, Soi Ramkhamhaeng 24, Ramkhamhaeng Road"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">
                    Sub-district / Tambon
                  </label>
                  <input
                    type="text"
                    value={formData.subDistrict}
                    onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                    placeholder="e.g. Hua Mak"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">
                    District / Amphoe
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Bang Kapi"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="e.g. Bangkok"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 10240"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
              </div>

              {/* ปุ่มยกเลิก และ ยืนยันในฟอร์ม */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-black/5 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-full border border-black/20 text-neutral text-xs font-medium hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}