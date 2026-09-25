// API helper ของ AI chatbot (POST /api/v1/ai/ask) ดู AI_CHATBOT_PLAN.md ใน backend
// ใช้ axios instance "api" จาก AuthContext (ไม่ใช้ fetch) เพราะ api มี interceptor
// ที่ยิง /auth/refresh ให้เองตอน accessToken หมดอายุ (15 นาที) → ลูกค้าถามต่อได้ไม่ต้อง login ใหม่
import { api } from "../context/AuthContext";

// question: คำถามล่าสุด
// history: ข้อความก่อนหน้า [{ role: "user" | "assistant", text }] (backend เก็บแค่ 6 อันล่าสุด)
// คืน { answer, sources } — answer เป็น null ได้ถ้า AI ตอบไม่สำเร็จ (แต่ยังมี sources)
// error: axios throw เองถ้า status ไม่ใช่ 2xx ดู error.response.status (401 / 429 / 502 ...)
export async function askAI(question, history = []) {
  const res = await api.post("/ai/ask", { question, history });
  return res.data.data;
}

// admin เท่านั้น (POST /api/v1/ai/sync) ให้ AI รู้จักสินค้า / วัตถุดิบล่าสุด หลังเพิ่ม-แก้-ลบในหน้า Admin
// คืน { embedded, skipped, failed, removed, seconds }
// error: 403 = ไม่ใช่ admin / 409 = มีคนกำลัง sync อยู่
export async function syncAiKnowledge() {
  const res = await api.post("/ai/sync");
  return res.data.data;
}

// ---------------------------------------------------------------------------
// AI Preview: สร้างรูปช่อ custom (ดู AI_PREVIEW_PLAN.md ใน backend ข้อ 4.4)
// ---------------------------------------------------------------------------

// GET /api/v1/ai/preview/quota → { limit: 3, remaining, promptVersion }
export async function getPreviewQuota() {
  const res = await api.get("/ai/preview/quota");
  return res.data.data;
}

// components: [{ inventory_item_id, quantity }] (รูปแบบเดียวกับ /custom-design)
// คืน { image: "data:image/jpeg;base64,...", caption: { size, base, flowers }, promptVersion, limit, remaining }
// ใช้เวลา 10–60 วิ · error: 400 ตัวเลือกไม่ครบ / 409 กำลังสร้างอยู่ / 429 ครบ 3 รูปวันนี้ / 503 ระบบเต็มวันนี้
export async function previewDesign(components) {
  const res = await api.post("/ai/preview", { components }, { timeout: 120000 });
  return res.data.data;
}
