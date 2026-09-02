import React from "react";
import { useState } from "react";
import OrderConfirmed from "../components/OrderConfirmed";

export default function CheckoutPage() {
  const [showConfirmed, setShowConfirmed] = useState(false);
  const handlePlaceOrder = () => {
    setShowConfirmed(true);
  };

  return (
    <main className="p-8 text-neutral/90">
      <h1 className="text-3xl font-bold font-display mb-4">Summary</h1>

      <section className="flex flex-row justify-between bg-white px-8 py-4 mb-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
        <h2 className="px-4">Product</h2>
        <div className="flex flex-row gap-14">
          <h2>Quantity</h2>
          <h2>Total Price</h2>
        </div>
      </section>

      <section className="Productlist flex flex-col gap-4 font-display text-neutral/90 font-semibold text-xl">
        <div className="ProductCard flex flex-row justify-between items-center bg-white px-6 py-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
          <div className="flex flex-row items-center">
            <div className="w-30 h-30 bg-gray-200">
              <image src="" alt="" />
            </div>
            <p className="mx-4">Product 1</p>
          </div>
          <div className="flex flex-row gap-24">
            <p>10</p>
            <p className="px-4">$310.00</p>
          </div>
        </div>
        <div className="ProductCard flex flex-row justify-between items-center bg-white px-6 py-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
          <div className="flex flex-row items-center">
            <div className="w-30 h-30 bg-gray-200">
              <image src="" alt="" />
            </div>
            <p className="mx-4">Product 2</p>
          </div>
          <div className="flex flex-row gap-24">
            <p>10</p>
            <p className="px-4">$310.00</p>
          </div>
        </div>
        <div className="ProductCard flex flex-row justify-between items-center bg-white px-6 py-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
          <div className="flex flex-row items-center">
            <div className="w-30 h-30 bg-gray-200">
              <image src="" alt="" />
            </div>
            <p className="mx-4">Product 3</p>
          </div>
          <div className="flex flex-row gap-24">
            <p>10</p>
            <p className="px-4">$310.00</p>
          </div>
        </div>
      </section>

      <section className="Fee flex flex-col gap-4 bg-white px-8 py-6 mt-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
        <div className="flex flex-row justify-between items-center">
          <p>Service fee</p>
          <p className="px-4">$0.00</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p>Delivery fee</p>
          <p className="px-4">$10.00</p>
        </div>
      </section>

      <section className="flex flex-row justify-between items-center bg-white px-8 py-6 mt-4 shadow-lg shadow-black/4 font-display text-neutral/90 font-semibold text-xl">
        <p>Grand Total</p>
        <div className="flex flex-row gap-22">
          <p>10</p>
          <p className="px-4">$310.00</p>
        </div>
      </section>

      <section className="Deli-Address mt-8">
        <h1 className="text-3xl font-bold font-display mb-4">
          Delivery Address
        </h1>
        <div className="font-semibold text-neutral/90 text-xl bg-white px-8 py-4 shadow-lg shadow-black/4">
          <p className="mb-2">
            123 Market Street, Suite 400 San Francisco, CA 94105 United States
          </p>
          <p>Phone: +1 (415) 555-0199</p>
        </div>
      </section>

      <div className="flex flex-row justify-end mt-8 gap-4">
        <div className="flex flex-col items-right p-4 gap-2">
          <button
            onClick={handlePlaceOrder}
            className="text-xl bg-primary p-2 w-[200px] rounded-full text-[#FFFFFF] shadow-md hover:bg-primary/90"
          >
            Confirmed Order
          </button>
          {showConfirmed && (
            <OrderConfirmed onClose={() => setShowConfirmed(false)} />
          )}

          <button className="text-xl border-1 border-solid p-2 w-[200px] rounded-full text-primary shadow-md hover:text-primary/80">
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
