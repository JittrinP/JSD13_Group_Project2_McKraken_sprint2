import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Careguide from "./_components/Careguide";
import CustomerReview from "./_components/CustomerReview";
import ShopDetail from "./_components/ShopDetail";
import PopularProducts from "../../components/PopularProducts";
import PopShopBlog from "../../components/PopShopBlog";

export default function HomePage() {
  // เอาไว้ใช้สำหรับ Footer กดที่ contact ให้วิ่งไปที่ shop-detail ที่หน้า homePage
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#shop-detail") {
      // ใช้ setTimeout เล็กน้อยเพื่อให้มั่นใจว่า DOM ของ ShopDetail เรนเดอร์เสร็จแล้วค่อย Scroll
      setTimeout(() => {
        document
          .getElementById("shop-detail")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash, location.key]);

  return (
    <div>
      <div className="bg-tertiary min-h-screen flex flex-col items-center justify-center w-full">
        <PopularProducts />
        <PopShopBlog />
        <Careguide />
        <CustomerReview />
        <ShopDetail />
      </div>
    </div>
  );
}

