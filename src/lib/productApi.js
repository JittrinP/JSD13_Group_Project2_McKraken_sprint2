// ใช้ base URL จาก .env เพื่อให้ frontend เรียก backend ได้ทั้งตอนพัฒนาและ deploy จริง
const API_BASE = import.meta.env.VITE_API_URL;

export async function getProducts(params = {}, signal) {
  // แปลง filter ที่ส่งเข้ามาเป็น query string โดยไม่ส่งค่าที่ว่างไปให้ backend
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  // signal ใช้ยกเลิก request เก่าเมื่อผู้ใช้เปลี่ยน search/filter อย่างรวดเร็ว
  const response = await fetch(
    `${API_BASE}/products${query ? `?${query}` : ""}`,
    { signal },
  );

  if (!response.ok) {
    // ส่ง error ให้หน้าที่เรียก API จัดการ loading/error state เอง
    throw new Error("Unable to load products");
  }

  const result = await response.json(); // แปลง response เป็น json
  return result.data; // <--- คืนค่าเฉพาะตัว array สินค้าที่อยู่ในคีย์ data ออกไป
}
