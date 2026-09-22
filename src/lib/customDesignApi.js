// API helpers สำหรับ custom design (ยิงไปหา backend จริงที่ /api/v1/custom-design)
// backend เอา user มาจาก accessToken cookie (authen middleware) ไม่ใช่จาก userId ใน path
// เพราะงั้น credentials: "include" จำเป็นทุก request ไม่งั้น cookie จะไม่ถูกส่งไปด้วย

const API_BASE = import.meta.env.VITE_API_URL;

// ดึง saved design ทั้งหมดของ user ที่ login อยู่ (GET)
export async function getDesigns() {
  const res = await fetch(`${API_BASE}/api/v1/custom-design`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch custom designs");
  }
  return res.json(); // array ของ design แต่ละอันมี unit_price และ components[].inventory_item_id ถูก populate มาให้แล้ว
}

// ดึง design เดียว (GET) ใช้ตอนกดแก้ไข
export async function getDesign(designId) {
  const res = await fetch(`${API_BASE}/api/v1/custom-design/${designId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch custom design");
  }
  return res.json();
}

// เซฟ design ใหม่ (POST) — designData: { design_name, design_description, components: [{ inventory_item_id, quantity }] }
export async function createDesign(designData) {
  const res = await fetch(`${API_BASE}/api/v1/custom-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(designData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to save custom design");
  }
  return data.design;
}

// แก้ design (PATCH) ส่งแค่ field ที่อยากแก้ก็ได้
export async function updateDesign(designId, designData) {
  const res = await fetch(`${API_BASE}/api/v1/custom-design/${designId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(designData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update custom design");
  }
  return data.design;
}

// ลบ design (DELETE)
export async function deleteDesign(designId) {
  const res = await fetch(`${API_BASE}/api/v1/custom-design/${designId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete custom design");
  }
  return res.json();
}
