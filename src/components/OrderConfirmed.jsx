import React from "react";
import checkIcon from "../assets/orderconfirmed/check.svg";

export default function OrderConfirmed({ onClose }) {
  return (
    <div className="fixed inset-0 bg-tertiary/50 text-neutral/90 z-50 overflow-y-auto">
      <div className="px-4 py-10 md:w-[520px] mx-auto min-h-screen flex flex-col justify-center">
        <div className="relative flex flex-col p-5 w-full h-auto items-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] rounded-3xl bg-white">
          {/* ปุ่มปิด อยู่ในการ์ด */}
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
            <p className="">Order number : 1011009954789453</p>
            <p className="">Purchase date : 24 Aug 2026</p>
          </div>
          <div className="grid grid-row divide-y-2 devide-solid divide-primary/40 items-center bg-[#FFFFFF] w-full h-auto rounded-3xl px-5">
            <div className="text-center text-2xl font-bold font-display py-5 w-full">
              Order Sumary
            </div>
            <div className="text-center py-2 w-full">
              <h2 className="font-semibold">Order</h2>
              <ul className="flex flex-col gap-1 font-body">
                <li className="flex flex-row justify-between px-2">
                  <p className="">Products 1</p>
                  <p className="">THB 600.00</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="">Quantity: 10 pcs</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="">Products 2</p>
                  <p className="">THB 350.00</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="">Quantity: 5 pcs</p>
                </li>
              </ul>
            </div>
            <div className="text-center py-2 w-full">
              <h2 className="font-semibold">Delivery Address</h2>
              <p className="text-left">
                132 ,ChalermPrakiate Rama9 Rd <br />
                Dokmai ,Prawet,
                <br />
                Bangkok 10250
              </p>
            </div>
            <div className="text-center text-neutral/90 py-5 w-full">
              <ul className="flex flex-col gap-1">
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-lg">Service fee</p>
                  <p className="font-body">THB 20.00</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-lg">Delivery fee</p>
                  <p className="font-body">THB 20.00</p>
                </li>
                <li className="flex flex-row justify-between px-2">
                  <p className="font-display text-xl font-semibold">
                    Total Paid
                  </p>
                  <p className="font-body">THB 1,000.00</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-2">
            <ul className="flex flex-col items-center justify-center gap-2">
              <li>
                <button
                  className="bg-primary p-2 w-[210px] rounded-full text-[#FFFFFF] shadow-md hover:bg-primary/90"
                  href="#myOder"
                >
                  View my order
                </button>
              </li>
              <li>
                <button
                  className="border-1 border-solid p-2 w-[210px] rounded-full text-primary shadow-md hover:text-primary/80"
                  href="#myOder"
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
