import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import OrderConfirmed from "../components/OrderConfirmed";

import qrcode from "../assets/images/payment-qrcode.svg";
import alipay from "../assets/images/payment-alipay.svg";
import jcb from "../assets/images/payment-jcb.svg";
import mastercard from "../assets/images/payment-mastercard.svg";
import visa from "../assets/images/payment-visa.svg";
import unionpay from "../assets/images/payment-unionpay.svg";
const paymentMethods = [qrcode, alipay, jcb, mastercard, visa, unionpay];

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, giftNote, placeOrder } = useCart();
  const [showConfirmed, setShowConfirmed] = useState(false);

  const subTotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );
  const deliveryFee = items.length > 0 ? 10 : 0;
  const serviceFee = 0;
  const grandTotal = subTotal + deliveryFee + serviceFee;

  const handlePlaceOrder = () => {
    placeOrder({
      deliveryAddress:
        "123 Market Street, Suite 400 San Francisco, CA 94105 United States",
      serviceFee,
      deliveryFee,
    });
    setShowConfirmed(true);
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
        {items.map((item) => (
          <div
            key={item.product_id}
            className="ProductCard bg-white rounded-2xl shadow-lg shadow-black/4 text-neutral/90 overflow-hidden"
          >
            {/* Mobile layout: รูปซ้าย, ขวาเป็นชื่อบรรทัดบน + Qty/ราคาบรรทัดล่าง */}
            <div className="flex sm:hidden flex-row gap-4 px-4 py-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                <img
                  src={item.images?.[0]}
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
                <div className="w-30 h-30 bg-gray-200 rounded-lg flex-shrink-0">
                  <img
                    src={item.images?.[0]}
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
          <p className="mb-2">
            123 Market Street, Suite 400 San Francisco, CA 94105 United States
          </p>
          <p>Phone: +1 (415) 555-0199</p>
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
              className="text-xl bg-primary p-2 w-[200px] rounded-full text-[#FFFFFF] shadow-md hover:bg-primary/90"
            >
              Confirmed Order
            </button>
            {showConfirmed && (
              <OrderConfirmed onClose={() => setShowConfirmed(false)} />
            )}
            <Link
              to="/cart"
              className="text-xl text-center border-solid p-2 w-[200px] rounded-full text-primary shadow-md hover:text-primary/80"
            >
              Cancel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}