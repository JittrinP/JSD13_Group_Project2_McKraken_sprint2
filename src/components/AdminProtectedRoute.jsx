import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user } = useAuth(); // ดึงข้อมูล user จาก Context ที่สร้างไว้

  // ถ้าไม่มี user (ยังไม่ได้ล็อกอิน) ให้เตะไปหน้า Home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ถ้าล็อกอินแล้ว แต่ role ไม่ใช่ admin ให้เตะไปหน้า Home
  // เช็คชื่อฟิลด์ role ให้ตรงกับที่ Backend ของคุณส่งมานะครับ เช่น user.role หรือ user.userType
  if (user.role !== "admin") {
    return <Navigate to="/customerdashboard" replace />;
  }

  // ถ้าผ่านทั้ง 2 ด่าน อนุญาตให้แสดงผล Component ที่โดนครอบไว้ได้
  return children ? children : <Outlet />;
}
