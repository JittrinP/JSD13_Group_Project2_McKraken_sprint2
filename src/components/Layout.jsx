import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Checkout from "../pages/CheckoutPage";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
