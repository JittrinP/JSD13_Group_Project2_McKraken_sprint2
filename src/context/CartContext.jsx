import { createContext, useContext, useState } from "react";

// วิธีใช้ในหน้า Product:
// import { useCart } from "../context/CartContext";
// const { addToCart } = useCart();
// <button onClick={() => addToCart(product)}>Add to Cart</button>

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [giftNote, setGiftNote] = useState("");
  const [orders, setOrders] = useState([]);     // 📍-เก็บประวัติออเดอร์

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product._id);

      if (existing) {
        return prev.map((i) =>
          i.product_id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [
        ...prev,
        {
          product_id: product._id,
          item_type: "standard_product",
          name: product.name,
          description: product.description,
          images: product.images,
          unit_price: product.base_price,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQty(productId) {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQty(productId) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  }

// --------- 
 function placeOrder({ deliveryAddress, serviceFee = 0, deliveryFee = 10 }) {
    const subTotal = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const grandTotal = subTotal + serviceFee + deliveryFee;

    const newOrder = {
      order_id: crypto.randomUUID(),
      items,            // snapshot ของตะกร้า ณ ตอนกดสั่ง
      giftNote,
      deliveryAddress,
      subTotal,
      serviceFee,
      deliveryFee,
      grandTotal,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setItems([]);
    setGiftNote("");

    return newOrder; // ส่งกลับไปให้ CheckoutPage ใช้เปิด modal ทันที
  }
// --------- 

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items: items.filter(Boolean),
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        giftNote,
        setGiftNote,
        orders,       // 📍
        placeOrder,   // 📍
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
