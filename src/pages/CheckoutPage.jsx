import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import OrderConfirmed from "../components/OrderConfirmed";
import PaymentQRModal from "../components/PaymentQRModal"; // popup โชว์ QR PromptPay ตอนกด Confirmed Order[cite: 30]

import qrcode from "../assets/images/payment-qrcode.svg";
import alipay from "../assets/images/payment-alipay.svg";
import jcb from "../assets/images/payment-jcb.svg";
import mastercard from "../assets/images/payment-mastercard.svg";
import visa from "../assets/images/payment-visa.svg";
import unionpay from "../assets/images/payment-unionpay.svg";
const paymentMethods = [qrcode, alipay, jcb, mastercard, visa, unionpay];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"; // ที่อยู่ backend อ่านจากไฟล์ .env[cite: 30]

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, summary, giftNote, placeOrder } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [qrData, setQrData] = useState(null); // เก็บ { id, qrImageUrl } ที่ได้จาก backend หลังสร้าง PaymentIntent[cite: 30]
  const [showQR, setShowQR] = useState(false); // true = กำลังโชว์ modal QR อยู่[cite: 30]

  const defaultAddress = user?.shipping_addresses?.find(
    (address) => address.is_default,
  ) || user?.shipping_addresses?.[0];

  const deliveryAddress = defaultAddress
    ? `${defaultAddress.address}, ${defaultAddress.sub_district}, ${defaultAddress.district}, ${defaultAddress.province} ${defaultAddress.postal_code}`
    : null;

  // ราคาทั้งหมดมาจาก backend (GET /cart) ให้ตรงกับที่ backend คิด[cite: 30]
  // service fee = 100 ต่อช่อ custom, delivery fee = 10 (0 ถ้าตะกร้าว่าง) ดู utils/pricing.js ใน backend[cite: 30]
  const subTotal = summary.subtotal;
  const deliveryFee = summary.delivery_fee;
  const serviceFee = summary.service_fee;
  const grandTotal = summary.total;

  const handlePlaceOrder = async () => {
    // กดปุ่ม Confirmed Order แล้ว "ยัง" ไม่ถือว่า order สำเร็จ ต้องรอจ่ายเงินผ่านก่อน (ดู handlePaymentSuccess ด้านล่าง)[cite: 30]
    if (!isLoggedIn || !deliveryAddress) return;

    try {
      const res = await fetch(`${API_BASE}/payments/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, email: user?.email }), // ส่งยอดรวม + email ผู้ใช้จริงไปให้ Stripe สร้าง PaymentIntent[cite: 30]
      });
      const data = await res.json();
      if (!data.success) return; // ยิงไม่สำเร็จก็แค่หยุดเงียบๆ ไปก่อน (ยังไม่ต้องทำ error UI ในรอบนี้)[cite: 30]

      setQrData({ id: data.id, qrImageUrl: data.qrImageUrl }); // เก็บ id + รูป QR ไว้ส่งต่อให้ modal[cite: 30]
      setShowQR(true); // เปิด modal โชว์ QR[cite: 30]
    } catch (err) {
      console.error("Failed to create payment intent", err);
    }
  };

  const handlePaymentSuccess = async () => {
    // ฟังก์ชันนี้จะถูกเรียกจาก PaymentQRModal ก็ต่อเมื่อ poll เจอสถานะ "succeeded" แล้วเท่านั้น[cite: 30]
    try {
      // [UPDATE] เตรียมโครงสร้างข้อมูลที่ต้องใช้บันทึกลง order.model.js
      const deliveryPayload = {
        delivery_date: new Date(),
        time_slot: "09:00 - 18:00",
        recipient_name: `${user?.profile?.first_name || ""} ${user?.profile?.last_name || ""}`.trim() || "Customer",
        recipient_phone: defaultAddress?.phone || "0000000000",
        shipping_address: {
          address_line: defaultAddress?.address || "N/A",
          sub_district: defaultAddress?.sub_district || "N/A",
          district: defaultAddress?.district || "N/A",
          province: defaultAddress?.province || "N/A",
          postal_code: defaultAddress?.postal_code || "00000",
        },
      };

      // [UPDATE] ยิง API สร้าง Order ลง MongoDB จริง
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          delivery_info: deliveryPayload,
          gift_note: giftNote,
        }),
      });

      const data = await res.json();

      if (data.success) {
        placeOrder(); // ค่อย place order จริงตอนนี้ (เคลียร์ตะกร้าใน Context)
        setShowQR(false); // ปิด modal QR[cite: 30]
        setShowConfirmed(true); // เปิดหน้า Order Confirmed ต่อ[cite: 30]
      } else {
        alert(data.message || "Failed to create order");
      }
    } catch (err) {
      console.error("Order creation failed", err);
      alert("Something went wrong while placing the order.");
    }
  };

  if (items.length === 0 && !showConfirmed) {
    return (
      <main className="p-8 text-neutral/90">
        <h1 className="text-3xl font-bold font-display mb-4">Summary</h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/4 text-center">
          <p className="mb-4">ยังไม่มีสินค้าในตะกร้า</p>
          <Link to="/cart" className="text-primary underline">
            กลับไปที่ตะกร้า
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-8 text-neutral/90">
      <h1 className="text-3xl font-bold font-display mb-4">Summary</h1>

      {/* Table header — เฉพาะ desktop เพราะมือถือใช้การ์ดแบบ stacked แทน */}
      <section className="hidden sm:flex flex-row justify-between bg-white rounded-2xl px-8 py-4 mb-4 shadow-lg shadow-black/4 text-neutral/90 font-semibold text-xl">
        <h2 className="px-4">Product</h2>
        <div className="flex flex-row gap-14">
          <h2>Quantity</h2>
          <h2>Total Price</h2>
        </div>
      </section>

      <section className="Productlist flex flex-col gap-4 text-neutral/90 font-semibold">
        {items.map((item, idx) => (
          <div
            key={item.product_id || idx}
            className="ProductCard bg-white rounded-2xl shadow-lg shadow-black/4 text-neutral/90 overflow-hidden"
          >
            {/* Mobile layout: รูปซ้าย, ขวาเป็นชื่อบรรทัดบน + Qty/ราคาบรรทัดล่าง */}
            <div className="flex sm:hidden flex-row gap-4 px-4 py-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0">
                <img
                  src={item.images?.[0] || "https://placehold.co/62x62?text=Bouquet"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-sm font-normal text-neutral/70">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-semibold">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop layout: เดิม ไม่แตะ */}
            <div className="hidden sm:flex flex-row justify-between items-center gap-4 px-6 py-4 text-xl font-semibold">
              <div className="flex flex-row items-center gap-4 min-w-0">
                <div className="w-30 h-30 bg-gray-200 rounded-lg shrink-0">
                  <img
                    src={item.images?.[0] || "https://placehold.co/62x62?text=Bouquet"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="truncate">{item.name}</p>
              </div>
              <div className="flex flex-row justify-end gap-24">
                <p>{item.quantity}</p>
                <p className="px-4">
                  {formatPrice(item.unit_price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="Fee flex flex-col gap-4 bg-white rounded-2xl px-6 sm:px-8 py-6 mt-4 shadow-lg shadow-black/4 text-neutral/90 font-semibold text-lg sm:text-xl">
        <div className="flex flex-row justify-between items-center">
          <p>Service fee</p>
          <p className="px-4">{formatPrice(serviceFee)}</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p>Delivery fee</p>
          <p className="px-4">{formatPrice(deliveryFee)}</p>
        </div>
      </section>

      <section className="flex flex-row justify-between items-center bg-white rounded-2xl px-6 sm:px-8 py-6 mt-4 shadow-lg shadow-black/4 text-neutral/90 font-semibold text-lg sm:text-xl">
        <p>Grand Total</p>
        <p className="px-4">{formatPrice(grandTotal)}</p>
      </section>

      {giftNote && (
        <section className="Gift-Note mt-8">
          <h1 className="text-3xl font-bold mb-4">Gift Note</h1>
          <div className="font-semibold text-neutral/90 text-xl bg-white rounded-2xl px-6 sm:px-8 py-4 shadow-lg shadow-black/4">
            <p>{giftNote}</p>
          </div>
        </section>
      )}

      <section className="Deli-Address mt-8">
        <h1 className="text-3xl font-bold mb-4">
          Delivery Address
        </h1>
        <div className="font-semibold text-neutral/90 text-xl bg-white rounded-2xl px-6 sm:px-8 py-4 shadow-lg shadow-black/4">
          {isLoggedIn && deliveryAddress ? (
            <>
              <p className="mb-2">{deliveryAddress}</p>
              <p>Phone: {defaultAddress.phone || "N/A"}</p>
            </>
          ) : (
            <p>Please log in to Checkout.</p>
          )}
        </div>
      </section>

      <section className="Payment-Method mt-8">
        <h1 className="text-3xl font-bold mb-4">Payment Method</h1>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white rounded-2xl p-4">
          <ul className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6">
            {paymentMethods.map((method, index) => (
              <li key={index}>
                <img
                  src={method}
                  alt={`Payment Method ${index + 1}`}
                  className="w-14 h-14 sm:w-20 sm:h-20"
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center sm:items-end p-4 gap-2 w-full sm:w-auto">
            <button
              onClick={handlePlaceOrder}
              disabled={!isLoggedIn || !deliveryAddress}
              className="text-xl bg-primary p-2 w-50 rounded-full text-[#FFFFFF] shadow-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
            >
              Confirmed Order
            </button>
            {showQR && qrData && ( // โชว์ modal นี้เฉพาะตอนมี QR data แล้วเท่านั้น[cite: 30]
              <PaymentQRModal
                qrImageUrl={qrData.qrImageUrl}
                paymentIntentId={qrData.id}
                amount={grandTotal} // โชว์ยอดที่ต้องจ่ายเหนือ QR ให้เช็คก่อนสแกน[cite: 30]
                onSuccess={handlePaymentSuccess} // จ่ายผ่านแล้ว -> ไป place order จริง[cite: 30]
                onCancel={() => setShowQR(false)} // กดปิดเอง -> แค่ปิด modal เฉยๆ[cite: 30]
              />
            )}
            {showConfirmed && (
              <OrderConfirmed onClose={() => setShowConfirmed(false)} />
            )}
            <Link
              to="/cart"
              className="text-xl text-center border-solid p-2 w-50 rounded-full text-primary shadow-md hover:text-primary/80"
            >
              Cancel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}