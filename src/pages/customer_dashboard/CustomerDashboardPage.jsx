import { Outlet } from "react-router-dom";
import AsideCustomer from "./_components/AsideCustomer";

// หน้านี้เป็น "shell" ของ dashboard ฝั่ง customer
// AsideCustomer จะ sticky อยู่ซ้ายมือตลอด ไม่ขยับตามเนื้อหาขวามือ
// ส่วนเนื้อหาขวามือ (My Account / Purchase / Bouquet / My Address / Favorite)
// จะ render ผ่าน <Outlet /> ตาม nested route ที่กำหนดไว้ใน router (เช่น App.jsx)
//
// ตัวอย่าง route config ที่ต้องมีคู่กับไฟล์นี้:
//   <Route path="customer-dashboard" element={<CustomerDashboardPage />}>
//     <Route index element={<Navigate to="account" replace />} />
//     <Route path="account" element={<CustomerAccount />} />
//     <Route path="purchases" element={<PurchasesItems />} />
//     <Route path="bouquet" element={<CustomList />} />
//     <Route path="address" element={<CustomerAddress />} />
//     <Route path="favorite" element={<CustomerFav />} />
//   </Route>

export default function CustomerDashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1290px] flex-col gap-[20px] p-4 lg:flex-row lg:items-start lg:gap-[24px]">
      <AsideCustomer />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}