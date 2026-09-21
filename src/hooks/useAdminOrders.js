import { useState } from "react";
import { useCart } from "../context/CartContext";
import mockOrders from "../assets/mockData/mockOrder";

function normalizeCartOrder(order, index) {
  return {
    ...order,
    order_id: order.order_id || `LIVE-${index + 1}`,
    customer_id: order.customer_id || "Current customer",
    customer_name: order.customer_name || "Current customer",
    customer_email: order.customer_email || "",
    status: order.status || "pending",
  };
}

export function useAdminOrders() {
  const { orders: placedOrders = [] } = useCart();

  const liveOrders = placedOrders.map(normalizeCartOrder);

  // Replace this adapter with an API request when the order endpoint is ready.
  const [orders, setOrders] = useState(() => [...liveOrders, ...mockOrders]);

  return {
    orders,
    updateOrderStatus: async (orderId, status) => {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.order_id === orderId ? { ...order, status } : order,
        ),
      );
    },
    deleteOrder: async (orderId) => {
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.order_id !== orderId),
      );
    },
  };
}