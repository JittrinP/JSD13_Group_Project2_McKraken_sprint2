import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Careguide from "./_components/Careguide";

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
      <div className="bg-tertiary min-h-screen flex items-center justify-center">
        <Careguide />


        {/* shop detail ไปทำต่อนะครับ ผมขอให้เก็บ id shop-detail ไว้ เอาไว้เชื่อมกับ Footer */}
        <section id="shop-detail" className="min-h-screen p-10">
        
        </section>
      </div>
    </div>
  );
}

