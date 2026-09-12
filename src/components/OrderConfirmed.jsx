import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import checkIcon from "../assets/orderconfirmed/check.svg";

function formatPrice(value) {
  return `THB ${Number(value).toFixed(2)}`;
}

export default function OrderConfirmed({ onClose }) {
  const navigate = useNavigate();
  const { orders } = useCart();
  const order = orders[0]; // ออเดอร์ล่าสุด (place ไปเมื่อกี้)

  if (!order) return null; // กันเคส modal โชว์ทั้งที่ไม่มีออเดอร์

  const handleViewOrder = () => {
    onClose();
    navigate("/customerdashboard"); // ปรับ path ให้ตรงกับ route จริง
  };

  const handleBackToShop = () => {
    onClose();
    navigate("/products"); // ปรับ path ให้ตรงกับ route จริง
  };

  return (
    <div className="fixed inset-0 bg-tertiary/50 text-neutral/90 z-50 overflow-y-auto">
      <div className="px-4 py-10 md:w-[520px] mx-auto min-h-screen flex flex-col justify-center">
        <div className="relative flex flex-col p-5 w-full h-auto items-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] rounded-3xl bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ✕
          </button>

          <img src={checkIcon} alt="" className="w-[90px] h-[90px]" />
          <h1 className="text-2xl font-bold font-display py-5">
            Thank you for you order
          </h1>
          <div className="mb-5">
            <p>Order number : {order.order_id}</p>
            <p>
              Purchase date :{" "}
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-row divide-y-2 devide-solid divide-primary/40 items-center bg-[#FFFFFF] w-full h-auto rounded-3xl px-5">
            <div className="text-center text-2xl font-bold font-display py-5 w-full">
              Order Sumary
            </div>

            <div className="text-center py-2 w-full">
              <h2 className="font-semibold">Order</h2>
              <ul className="flex flex-col gap-1 font-body">
                {order.items.map((item) => (
                  <React.Fragment key={item.product_id}>
                    <li className="flex flex-row justify-between px-2">
                      <p>{item.name}</p>
                      <p>{formatPrice(item.unit_price * item.quantity)}</p>
                    </li>
                    <li className="flex flex-row justify-between px-2">
                      <p>Quantity: {item.quantity} pcs</p>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>

            <div className="text-center py-2 w-full">
              <h2 className="font-semibold">Delivery Address</h2>
              <p className="text-left">{order.deliveryAddress}</p>
            </div>

            <div className="text-center text-neutral/90 py-5 w-full">
              <ul className="flex flex-col gap-1">
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-lg">Service fee</p>
                  <p className="font-body">{formatPrice(order.serviceFee)}</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-lg">Delivery fee</p>
                  <p className="font-body">{formatPrice(order.deliveryFee)}</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-xl font-semibold">Total Paid</p>
                  <p className="font-body">{formatPrice(order.grandTotal)}</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-2">
            <ul className="flex flex-col items-center justify-center gap-2">
              <li>
                <button
                  onClick={handleViewOrder}
                  className="bg-primary p-2 w-[210px] rounded-full text-[#FFFFFF] shadow-md hover:bg-primary/90"
                >
                  View my order
                </button>
              </li>
              <li>
                <button
                  onClick={handleBackToShop}
                  className="border-1 border-solid p-2 w-[210px] rounded-full text-primary shadow-md hover:text-primary/80"
                >
                  Back to shop
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}