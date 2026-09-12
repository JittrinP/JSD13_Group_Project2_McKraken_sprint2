import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Checkout from "../pages/CheckoutPage";
import { CartProvider } from "../context/CartContext"; // เพิ่มไว้ล่วงหน้าให้ ProductsPage/CheckoutPage ใช้ตะกร้าร่วมกัน — Albert
import { AuthProvider } from "../context/AuthContext"; // ให้ Navbar/LoginPage และหน้าอื่นๆ เข้าถึงสถานะ login ร่วมกัน — Albert

export default function Layout() {
  return (
    // เพิ่มไว้ล่วงหน้าให้ ProductsPage/CheckoutPage ใช้ตะกร้าร่วมกัน — Albert
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
