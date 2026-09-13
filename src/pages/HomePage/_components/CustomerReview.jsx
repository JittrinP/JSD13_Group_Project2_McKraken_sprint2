import React, { useState, useEffect } from "react";
import { mockCustomerReviews } from "../../../assets/mockData/mockCMR"; 

// ฟังก์ชันสำหรับสุ่มเลือก N ชิ้นแบบไม่ซ้ำกัน (Fisher-Yates Shuffle)
const getRandomReviews = (reviews, count = 3) => {
  const shuffled = [...reviews];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// ฟังก์ชันสำหรับวาดดาว Star Rating (รองรับทั้งดาวเต็ม ดาวครึ่ง และดาวว่าง)
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
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
  const [randomReviews, setRandomReviews] = useState([]);

  // สุ่มเลือก 3 รีวิวใหม่ทุกครั้งที่โหลดหน้า หรือ Component Re-render
  useEffect(() => {
    setRandomReviews(getRandomReviews(mockCustomerReviews, 3));
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-tertiary">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-primary font-bold mb-12 tracking-wide">
          Notes from our Friends
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomReviews.map((review) => (
            <div
              key={review.id}
              className="bg-secondary rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div>
                {/* 1. Star Rating */}
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* 2. ข้อความรีวิว */}
                <p className="font-body italic text-neutral text-base leading-relaxed mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* 3. ข้อมูลลูกค้า */}
              <div className="flex items-center space-x-3 pt-4 border-t border-black/5 mt-auto">
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