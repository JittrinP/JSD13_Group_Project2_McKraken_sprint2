import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Careguide from "./_components/Careguide";
import CustomerReview from "./_components/CustomerReview";
import ShopDetail from "./_components/ShopDetail";
import PopularProducts from "../../components/PopularProducts";

export default function HomePage() {

  // เอาไว้ใช้สำหรับ Footer กดที่ contact ให้วิ่งไปที่ shop-detail ที่หน้า homePage
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#shop-detail") {
      document
        .getElementById("shop-detail")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.key]);

  return (
    <div>
      <div className="bg-tertiary min-h-screen flex flex-col items-center justify-center w-full">
        <PopularProducts />
        <Careguide />
        <CustomerReview />
        <ShopDetail />
      </div>
    </div>
  );
}

