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
