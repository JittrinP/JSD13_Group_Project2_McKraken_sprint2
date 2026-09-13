import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Careguide from "./_components/Careguide";
import CustomerReview from "./_components/CustomerReview";

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
        <Careguide />
        <CustomerReview />

        {/* shop detail ไปทำต่อนะครับ ผมขอให้เก็บ id shop-detail ไว้ เอาไว้เชื่อมกับ Footer */}
        <section id="shop-detail" className="min-h-screen p-10">
        
        </section>
      </div>
    </div>
  );
}

