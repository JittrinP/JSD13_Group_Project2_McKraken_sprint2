import { createContext, useContext, useState } from "react";

// วิธีใช้ในหน้า Product:
// import { useCart } from "../context/CartContext";
// const { addToCart } = useCart();
// <button onClick={() => addToCart(product)}>Add to Cart</button>

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

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
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, increaseQty, decreaseQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
