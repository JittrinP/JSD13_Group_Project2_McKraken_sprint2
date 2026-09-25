// API helpers สำหรับ custom design (ยิงไปหา backend จริงที่ /api/v1/custom-design)
// backend เอา user มาจาก accessToken cookie (authen middleware) ไม่ใช่จาก userId ใน path
// เพราะงั้น credentials: "include" จำเป็นทุก request ไม่งั้น cookie จะไม่ถูกส่งไปด้วย

const API_BASE = import.meta.env.VITE_API_URL;

// สร้าง Error ที่แนบ status + code จาก backend ไปด้วย
// เช่น 409 + code "PRESET_TAKEN" = preset เลขนี้มีช่ออื่นอยู่แล้ว หน้า Customdesign ใช้เช็คเพื่อถามยืนยันเซฟทับ
function apiError(res, data, fallbackMessage) {
  const error = new Error(data.message || fallbackMessage);
  error.status = res.status;
  error.code = data.code;
  error.data = data;
  return error;
}

// ดึง saved design ทั้งหมดของ user ที่ login อยู่ (GET)
export async function getDesigns() {
  const res = await fetch(`${API_BASE}/custom-design`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch custom designs");
  }
  return res.json(); // array ของ design แต่ละอันมี unit_price และ components[].inventory_item_id ถูก populate มาให้แล้ว
}

// ดึง design เดียว (GET) ใช้ตอนกดแก้ไข
export async function getDesign(designId) {
  const res = await fetch(`${API_BASE}/custom-design/${designId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch custom design");
  }
  return res.json();
}

// เซฟ design ใหม่ (POST) — designData: { design_name, design_description, preset (1-5), overwrite?, components: [{ inventory_item_id, quantity }],
//                                      preview_image? (data URL รูป AI), preview_prompt_version? }
// คืน design + image_saved (true = รูปขึ้นแล้ว / false = ช่อเซฟได้แต่รูปอัปไม่สำเร็จ / null = ไม่ได้ส่งรูป)
export async function createDesign(designData) {
  const res = await fetch(`${API_BASE}/custom-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(designData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to save custom design");
  }
  return { ...data.design, image_saved: data.image_saved };
}

// แก้ design (PATCH) ส่งแค่ field ที่อยากแก้ก็ได้
export async function updateDesign(designId, designData) {
  const res = await fetch(`${API_BASE}/custom-design/${designId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(designData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to update custom design");
  }
  return { ...data.design, image_saved: data.image_saved };
}

// ลบ design (DELETE)
export async function deleteDesign(designId) {
  const res = await fetch(`${API_BASE}/custom-design/${designId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete custom design");
  }
  return res.json();
}
