import React, { useState, useEffect } from "react";
import { useAuth, api } from "../../../context/AuthContext";

// ==========================================
// API HELPERS (ยิงไปหา backend จริงที่ /api/v1/user/address ผ่าน `api` instance
// ของ AuthContext — แนบ cookie อัตโนมัติ, userId มาจาก token ฝั่ง backend เอง)
// ==========================================

// ดึงที่อยู่ทั้งหมดของ user ที่ login อยู่ (GET)
async function getAddresses() {
  const res = await api.get("/user/address");
  return res.data; // ได้ array ของที่อยู่กลับมาตรงๆ
}

// เพิ่มที่อยู่ใหม่ 1 รายการ (POST)
async function addAddress(addressData) {
  const res = await api.post("/user/address", addressData);
  return res.data.newAddress;
}

// แก้ไขที่อยู่ 1 รายการ (PATCH) — addressData ส่งแค่ field ที่อยากแก้ก็ได้
async function updateAddress(addressId, addressData) {
  const res = await api.patch(`/user/address/${addressId}`, addressData);
  return res.data.updatedAddress;
}

// ลบที่อยู่ 1 รายการ (DELETE)
async function deleteAddress(addressId) {
  const res = await api.delete(`/user/address/${addressId}`);
  return res.data;
}

// แปลง address object จาก backend (recipient_name, address, sub_district, ...) ให้เป็นรูปแบบที่ component นี้ใช้ (name, addressLine, subDistrict, ...)
function mapAddressFromApi(addr) {
  return {
    id: addr._id,
    name: addr.recipient_name,
    phone: addr.phone,
    addressLine: addr.address,
    subDistrict: addr.sub_district || "",
    district: addr.district || "",
    province: addr.province || "",
    postalCode: addr.postal_code || "",
    isDefault: addr.is_default,
  };
}

// backend คืน array ตามลำดับที่เก็บใน database เฉยๆ ไม่ได้เอา default ขึ้นก่อนให้
// ฟังก์ชันนี้ map + เรียงให้ default ขึ้นบนสุดเสมอ ใช้แทน data.map(mapAddressFromApi) ตรงๆ ทุกจุด
function mapAndSortAddresses(data) {
  const mapped = data.map(mapAddressFromApi);
  const defaultItem = mapped.find((item) => item.isDefault);
  const others = mapped.filter((item) => !item.isDefault);
  return defaultItem ? [defaultItem, ...others] : mapped;
}

export default function CustomerAddress() {
  // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ในระบบผ่าน AuthContext
  const { user: currentUser } = useAuth();

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================

  // state ข้อมูลที่อยู่ทั้งหมด เริ่มต้นเป็น array ว่างก่อน รอ useEffect ด้านล่าง fetch จาก API มาเติมให้
  const [addresses, setAddresses] = useState([]);

  // State ควบคุม Modal สำหรับ เพิ่ม/แก้ไข ที่อยู่
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // State ควบคุม Custom Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState(null);

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
  // 1b. โหลดที่อยู่จาก API ตอน component เปิดขึ้นมาครั้งแรก (หรือตอน currentUser เปลี่ยน เช่น login ใหม่)
  // ==========================================
  useEffect(() => {
    // ยังไม่ล็อกอิน ไม่มี session ให้ยิง API เลยข้ามไปก่อน
    if (!currentUser) return;

    getAddresses()
      .then((data) => {
        setAddresses(mapAndSortAddresses(data));
      })
      .catch((err) => console.error(err));
  }, [currentUser]);

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

  const handleOpenDeleteModal = (targetAddr) => {
    if (targetAddr?.isDefault) {
      alert("ไม่สามารถลบที่อยู่หลักได้");
      return;
    }
    setDeletingTarget(targetAddr);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingTarget(null);
  };

  const handleConfirmDelete = async () => {
    // Step 5: ลบที่อยู่ผ่าน API จริง แทนการ filter local state เอง
    if (deletingTarget) {
      try {
        await deleteAddress(deletingTarget.id);
        const data = await getAddresses();
        setAddresses(mapAndSortAddresses(data));
      } catch (err) {
        console.error(err);
        alert("ลบที่อยู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
    }
    handleCloseDeleteModal();
  };

  // ==========================================
  // 4. ADDRESS ACTIONS (บันทึก / ตั้งที่อยู่หลัก)
  // ==========================================

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine) {
      alert("กรุณากรอกข้อมูล ชื่อ-นามสกุล, เบอร์โทรศัพท์ และที่อยู่ให้ครบถ้วน");
      return;
    }

    if (editingAddressId) {
      // Step 4: แก้ไขที่อยู่ผ่าน API จริง แทนการแก้ local state เอง (ฟอร์ม edit ไม่มีช่อง is_default เลยไม่ต้องส่ง)
      try {
        await updateAddress(editingAddressId, {
          recipient_name: formData.name,
          phone: formData.phone,
          address: formData.addressLine,
          sub_district: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postal_code: formData.postalCode,
        });

        const data = await getAddresses();
        setAddresses(mapAndSortAddresses(data));
      } catch (err) {
        console.error(err);
        alert("แก้ไขที่อยู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
    } else {
      // Step 3: เพิ่มที่อยู่ใหม่ผ่าน API จริง แทนการสร้าง object ปลอมเก็บไว้ใน local state
      try {
        await addAddress({
          recipient_name: formData.name,
          phone: formData.phone,
          address: formData.addressLine,
          sub_district: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postal_code: formData.postalCode,
          is_default: addresses.length === 0,
        });

        // ดึงรายการที่อยู่ล่าสุดจาก backend มาแทนของเดิมทั้งหมด กันข้อมูลไม่ตรงกัน (เช่น is_default ของรายการอื่นที่อาจถูกปิดไปพร้อมกัน)
        const data = await getAddresses();
        setAddresses(mapAndSortAddresses(data));
      } catch (err) {
        console.error(err);
        alert("เพิ่มที่อยู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
    }
    handleCloseModal();
  };

  const handleMakeDefault = async (id) => {
    // Step 6: ตั้งที่อยู่หลักผ่าน API จริง — backend มี logic ปิด is_default ของรายการอื่นให้อัตโนมัติอยู่แล้ว (ทดสอบผ่านตอนทำ PATCH)
    try {
      await updateAddress(id, { is_default: true });
      const data = await getAddresses();
      setAddresses(mapAndSortAddresses(data));
    } catch (err) {
      console.error(err);
      alert("ตั้งที่อยู่หลักไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // ==========================================
  // 5. RENDER UI
  // ==========================================
  return (
    <div className="w-full bg-secondary rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
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

      {/* แก้ไขส่วนนี้: ซ่อน Scrollbar ด้วยการแทรก class ของ Tailwind เข้าไป */}
      <div className="max-h-130 overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
          onClick={handleCloseDeleteModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-secondary w-full max-w-sm rounded-2xl p-6 shadow-xl border border-black/10 text-center font-body cursor-default animate-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-neutral/50 hover:text-neutral hover:bg-black/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="font-display text-lg font-bold text-neutral mb-2">
              Confirm Delete
            </h3>
            <p className="text-xs text-neutral/70 mb-6 leading-relaxed">
              คุณต้องการลบที่อยู่นี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลกลับมาได้
            </p>

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