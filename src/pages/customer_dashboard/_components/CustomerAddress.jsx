import React, { useState } from "react";
import mockUser from "../../../assets/mockData/mockUser";

export default function CustomerAddress({ currentUser = mockUser[0] }) {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================

  // state ข้อมูลที่อยู่ทั้งหมด
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

    if (initial.length > 0 && !initial.some((a) => a.isDefault)) {
      initial[0].isDefault = true;
    }
    return initial;
  });

  // State ควบคุม Modal สำหรับ เพิ่ม/แก้ไข ที่อยู่
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // State ควบคุม Custom Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState(null); // เก็บข้อมูลที่อยู่ที่กำลังจะถูกลบ

  // State เก็บข้อมูลในฟอร์ม Add/Edit
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
  // 2. MODAL CONTROLLERS (เพิ่ม/แก้ไข ที่อยู่)
  // ==========================================

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
  };

  // ==========================================
  // 3. DELETE MODAL HANDLERS
  // ==========================================

  // เปิด Custom Modal เตือนการลบที่อยู่
  const handleOpenDeleteModal = (targetAddr) => {
    if (targetAddr?.isDefault) {
      alert("ไม่สามารถลบที่อยู่หลักได้");
      return;
    }
    setDeletingTarget(targetAddr);
    setDeleteModalOpen(true);
  };

  // ปิด Custom Delete Modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingTarget(null);
  };

  // กดยืนยันการลบที่อยู่จริง จากปุ่มใน Pop-up
  const handleConfirmDelete = () => {
    if (deletingTarget) {
      setAddresses((prev) => prev.filter((item) => item.id !== deletingTarget.id));
    }
    handleCloseDeleteModal();
  };

  // ==========================================
  // 4. ADDRESS ACTIONS (บันทึก / ตั้งที่อยู่หลัก)
  // ==========================================

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine) {
      alert("กรุณากรอกข้อมูล ชื่อ-นามสกุล, เบอร์โทรศัพท์ และที่อยู่ให้ครบถ้วน");
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) => {
        const target = prev.find((item) => item.id === editingAddressId);
        if (!target) return prev;

        const updatedTarget = { ...target, ...formData };
        const others = prev.filter((item) => item.id !== editingAddressId);

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
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0,
      };

      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [newAddress, ...prev];
        }
        const defaultItem = prev.find((item) => item.isDefault);
        const nonDefaults = prev.filter((item) => !item.isDefault);
        return defaultItem
          ? [defaultItem, newAddress, ...nonDefaults]
          : [newAddress, ...nonDefaults];
      });
    }

    handleCloseModal();
  };

  const handleMakeDefault = (id) => {
    setAddresses((prev) => {
      const updated = prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }));
      const defaultItem = updated.find((item) => item.isDefault);
      const others = updated.filter((item) => !item.isDefault);
      return defaultItem ? [defaultItem, ...others] : updated;
    });
  };

  // ==========================================
  // 5. RENDER UI
  // ==========================================
  return (
    <div className="w-full bg-secondary rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
      {/* ส่วนหัว Component */}
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

      {/* รายการที่อยู่ */}
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

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center space-x-2 text-xs font-body">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-neutral/70 hover:text-neutral transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {!item.isDefault && (
                      <>
                        <span className="text-neutral/30">|</span>
                        {/* ⭐️ เรียกใช้ Custom Delete Modal แทน confirm() ของ Browser */}
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          className="text-red-700/80 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>

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

      {/* ==========================================
          POP-UP 1: MODAL สำหรับ ADD / EDIT ADDRESS
         ========================================== */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-secondary w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-black/10 animate-in fade-in zoom-in duration-150 cursor-default"
          >
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-neutral/60 hover:text-neutral hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display text-xl font-bold text-neutral mb-6">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-semibold text-neutral/80 mb-1">Full Name</label>
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
                <label className="block text-xs font-semibold text-neutral/80 mb-1">Phone Number</label>
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
                <label className="block text-xs font-semibold text-neutral/80 mb-1">Address Detail</label>
                <textarea
                  required
                  rows="2"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="e.g. 128/45 Moo 3, Soi Ramkhamhaeng 24"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">Sub-district / Tambon</label>
                  <input
                    type="text"
                    value={formData.subDistrict}
                    onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                    placeholder="e.g. Hua Mak"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">District / Amphoe</label>
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
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">Province</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="e.g. Bangkok"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral/80 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 10240"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-neutral"
                  />
                </div>
              </div>

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

      {/* ==========================================
          POP-UP 2: CUSTOM DELETE CONFIRMATION MODAL
         ========================================== */}
      {deleteModalOpen && (
        <div
          onClick={handleCloseDeleteModal} // คลิกพื้นหลังเบลอเพื่อปิด Pop-up
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()} // ป้องกันการคลิกข้างในตัว Pop-up ทะลุไปปิด
            className="relative bg-secondary w-full max-w-sm rounded-2xl p-6 shadow-xl border border-black/10 text-center font-body cursor-default animate-in zoom-in-95 duration-150"
          >
            {/* ปุ่ม ✕ มุมขวาบน */}
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-neutral/50 hover:text-neutral hover:bg-black/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ไอคอนแจ้งเตือนสีส้มอ่อน/แดง */}
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            {/* ข้อความยืนยัน */}
            <h3 className="font-display text-lg font-bold text-neutral mb-2">
              Confirm Delete
            </h3>
            <p className="text-xs text-neutral/70 mb-6 leading-relaxed">
              คุณต้องการลบที่อยู่นี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลกลับมาได้
            </p>

            {/* ปุ่ม Cancel และ Delete */}
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="w-1/2 py-2.5 rounded-full border border-black/20 text-neutral text-xs font-medium hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}