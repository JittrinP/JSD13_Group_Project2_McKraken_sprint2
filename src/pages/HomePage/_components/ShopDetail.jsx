import React from "react";

// SVG รูปสัญลักษณ์ดอกไม้ (ใช้สี primary #586158)
const FlowerLogoIcon = () => (
  <svg
    width="140"
    height="140"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    {/* เกษรกลาง */}
    <circle cx="50" cy="38" r="7" stroke="currentColor" strokeWidth="5" fill="none" />
    
    {/* กลีบดอกไม้ 4 กลีบ */}
    <circle cx="50" cy="22" r="9" stroke="currentColor" strokeWidth="5" fill="none" />
    <circle cx="50" cy="54" r="9" stroke="currentColor" strokeWidth="5" fill="none" />
    <circle cx="34" cy="38" r="9" stroke="currentColor" strokeWidth="5" fill="none" />
    <circle cx="66" cy="38" r="9" stroke="currentColor" strokeWidth="5" fill="none" />
    
    {/* ก้านดอกไม้ */}
    <path d="M50 63V85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    
    {/* ใบไม้ซ้าย-ขวา */}
    <path
      d="M50 78C42 78 35 70 35 68C35 68 43 65 50 78Z"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M50 78C58 78 65 70 65 68C65 68 57 65 50 78Z"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function ShopDetail() {
  return (
    // กำหนด id="shop-detail" เพื่อรองรับการ Scroll มาจาก Footer.jsx (<Link to="/#shop-detail">)
    <section id="shop-detail" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-tertiary">
      <div className="max-w-6xl mx-auto bg-secondary rounded-3xl p-8 sm:p-12 md:p-16 shadow-sm border border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ฝั่งซ้าย: ข้อมูลร้าน ประวัติ ที่อยู่ และเวลาเปิดทำการ (8 คอลัมน์บนจอใหญ่) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* หัวข้อ Rooted in Nature */}
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-bold mb-6 tracking-wide">
                Rooted in Nature
              </h2>

              {/* ข้อความบรรยายเรื่องราวของร้าน Atelier de Flora */}
              <p className="font-body text-neutral text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                Atelier de Flora began as a small botanical journal, cataloging the subtle
                beauty of changing seasons. Today, our studio is dedicated to translating
                that natural warmth into handcrafted arrangements that celebrate life's
                quiet, meaningful moments.
              </p>
            </div>

            {/* ส่วนด้านล่าง: Visit Us และ Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/10">
              {/* Visit Us */}
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-body text-neutral font-semibold text-sm">
                    Visit Us
                  </h4>
                  <p className="font-body text-neutral/80 text-sm mt-1">
                    123/111 Bangkok Thailand
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-body text-neutral font-semibold text-sm">
                    Hours
                  </h4>
                  <p className="font-body text-neutral/80 text-sm mt-1">
                    Tue - Sat: 10am - 6pm
                  </p>
                  <p className="font-body text-neutral/80 text-sm">
                    Sun - Mon: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: รูปสัญลักษณ์โลโก้ดอกไม้ในวงกลม 350x350 (5 คอลัมน์บนจอใหญ่) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-70 h-70 sm:w-87.5 sm:h-87.5 rounded-full bg-tertiary flex items-center justify-center shadow-inner border border-black/5">
              <FlowerLogoIcon />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}