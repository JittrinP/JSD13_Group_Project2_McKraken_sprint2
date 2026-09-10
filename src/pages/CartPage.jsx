import React from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <>
      <div className="flex flex-col gap-12 bg-gray-400 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">This is Cart Page</h1>
        <Link to="/checkout" className="text-xl bg-white shadow-lg text-center border-solid p-2 w-[200px] rounded-full text-primary shadow-md hover:text-primary/80">
              Checkout
            </Link>
      </div>
    </>
  );
}
