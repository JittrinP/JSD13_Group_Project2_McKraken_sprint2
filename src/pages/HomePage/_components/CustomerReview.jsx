import React from "react";
import { mockCustomerReviews } from "../../../assets/mockData/mockCMR"; 

// ฟังก์ชันสำหรับวาดดาว Star Rating (รองรับทั้งดาวเต็ม และ ดาวครึ่ง)
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // ดาวเต็ม
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 fill-primary text-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else if (rating >= i - 0.5) {
      // ดาวครึ่ง
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-primary fill-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id={`half-star-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-star-${i})`}
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      );
    } else {
      // ดาวว่าง
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-gray-300 fill-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
  }
  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default function CustomerReview() {
  // กรองข้อมูล: คัดลอก Array กรองคะแนนจากมากไปน้อย และดึงมาแค่ 3 อันดับแรก
  const topReviews = [...mockCustomerReviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-tertiary">
      <div className="max-w-7xl mx-auto">
        {/* หัวข้อ Section อ้างอิงจาก Typography & Design */}
        <h2 className="font-display text-3xl md:text-4xl text-center text-primary font-bold mb-12 tracking-wide">
          Notes from our Friends
        </h2>

        {/* ตารางแสดงการ์ดคำรีวิวของลูกค้า */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topReviews.map((review) => (
            <div
              key={review.id}
              className="bg-secondary rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div>
                {/* 1. Star Rating */}
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* 2. ข้อความรีวิว (Font: Plus Jakarta Sans / Italic) */}
                <p className="font-body italic text-neutral text-base leading-relaxed mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* 3. ส่วนข้อมูลลูกค้าและสินค้า */}
              <div className="flex items-center space-x-3 pt-4 border-t border-black/5 mt-auto">
                {/* รูป Profile Avatar พร้อม Fallback */}
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-body text-neutral font-medium text-sm shrink-0 ${
                    review.avatar ? "hidden" : ""
                  }`}
                >
                  {review.customerName ? review.customerName.charAt(0) : "C"}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-body text-neutral font-semibold text-sm truncate">
                    {review.customerName}
                  </h4>
                  <p className="font-body text-neutral/70 text-xs truncate">
                    {review.productName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}