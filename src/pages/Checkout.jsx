import React from "react";
import { useState } from 'react';
import OrderConfirmed from "../components/OrderConfirmed";

export default function Checkout() {
const [ showConfirmed, setShowConfirmed] = useState(false)
const handlePlaceOrder = () => {
  setShowConfirmed(true)
}

  return (
    <div className="CheckoutItems flex flex-row justify-end p-4 gap-2">
      <button onClick={handlePlaceOrder} className="btn">Confirmed Order</button>
      {showConfirmed && (
        <OrderConfirmed onClose={() => setShowConfirmed(false)} />
      )}

      <button className="btn">Cancel</button>
    </div>
  );
}
