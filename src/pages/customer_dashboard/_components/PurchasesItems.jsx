import { useState, useEffect } from "react";
import { api } from "../../../context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";

function formatPrice(value) {
  return `฿${Number(value || 0).toFixed(2)}`;
}

export default function PurchaseItem() {
  const [ordersList, setOrdersList] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/orders/my-orders");
      const orders = res.data.orders || res.data;

      const formattedOrders = orders.map((order) => {
        let uiStatus = "Pending";
        if (
          order.order_status === "processing" ||
          order.status === "processing"
        )
          uiStatus = "In Progress";
        else if (order.order_status === "shipped" || order.status === "shipped")
          uiStatus = "Shipped";
        else if (
          order.order_status === "completed" ||
          order.status === "completed"
        )
          uiStatus = "Completed";
        else if (
          order.order_status === "cancelled" ||
          order.status === "cancelled"
        )
          uiStatus = "Cancelled";

        const orderNumberDisplay = order.order_number;
        const createdAt = order.created_at || order.createdAt;

        const paymentPricing = order.payment_pricing || {};
        const serviceFee = Number(paymentPricing.service_fee || 0);
        const deliveryFee = Number(paymentPricing.delivery_fee || 0);
        const backendGrandTotal = Number(paymentPricing.grand_total || 0);

        return {
          ...order,
          uiStatus,
          orderNumberDisplay,
          createdAt,
          serviceFee,
          deliveryFee,
          backendGrandTotal,
          canCancel: uiStatus === "Pending" || uiStatus === "In Progress",
          items: order.items.map((item, index) => ({
            id: `${order._id}-${item.product_id?._id || index}`,
            name: item.item_name || item.name,
            quantity: item.quantity,
            price: item.unit_price,
            image:
              item.product_id?.images?.[0] ||
              item.custom_specs?.preview_image_url ||
              "https://placehold.co/62x62?text=Custom+Bouquet",
          })),
        };
      });
      setOrdersList(formattedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const isConfirmed = window.confirm(
      "Do you want to cancel this entire order?",
    );
    if (!isConfirmed) return;

    try {
      await api.patch(`/orders/${orderId}/cancel`);
      alert("Order cancelled successfully");
      fetchMyOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const StatusBadge = ({ status }) => {
    const isCancelled = status === "Cancelled";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize ${
          isCancelled
            ? "bg-[#F8E6E6] text-[#8F4748]"
            : "bg-[#E5E7E4] text-[#4A554D]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${isCancelled ? "bg-[#8F4748]" : "bg-neutral"}`}
        ></span>
        {status}
      </span>
    );
  };

  return (
    <div className="text-primary">
      <h2 className="font-display text-2xl font-bold">Purchases</h2>

      {isLoading ? (
        <div className="mt-8 text-center text-neutral/60 font-body">
          Loading orders...
        </div>
      ) : (
        <div className="mt-4 flex flex-col rounded-2xl border border-[#929B91]/30 bg-background shadow-sm lg:m-4 lg:max-h-[125rem] lg:overflow-auto p-4 lg:p-0">
          <div className="hidden lg:grid grid-cols-9 font-body p-3 border-b border-[#929B91]/30 lg:sticky lg:top-0 lg:z-10 lg:bg-background text-primary text-sm font-semibold">
            <div className="col-span-9 pl-2">Order</div>
          </div>

          {ordersList.length === 0 ? (
            <div className="p-12 text-center text-neutral/60 font-body">
              No order history
            </div>
          ) : (
            ordersList.map((order) => {
              const isExpanded = expandedOrders[order._id];

              const calculatedSubtotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              );
              const displayGrandTotal =
                order.backendGrandTotal > 0
                  ? order.backendGrandTotal
                  : calculatedSubtotal + order.serviceFee + order.deliveryFee;

              return (
                <div
                  key={order._id}
                  className="border-b border-[#929B91]/30 last:border-b-0 overflow-hidden"
                >
                  {/* --- ส่วนหัว Order --- */}
                  <div
                    className="flex items-center justify-between p-4 bg-[#F9FAFA] cursor-pointer hover:bg-[#F2F4F4] transition-colors"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm lg:text-base text-primary">
                        Order: #{order.orderNumberDisplay}
                      </span>
                      <span className="text-xs text-neutral/60 font-body mt-0.5">
                        {order.createdAt &&
                        !isNaN(new Date(order.createdAt).getTime())
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Unknown Date"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        <StatusBadge status={order.uiStatus} />
                      </div>
                      <div className="text-neutral/50 ml-2 transition-transform duration-300">
                        {isExpanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- ส่วนรายการสินค้า --- */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col pb-6">
                        <div className="hidden lg:grid grid-cols-9 font-body px-4 py-3 border-b border-[#929B91]/20 text-primary text-xs tracking-wide font-semibold bg-white">
                          <div className="col-span-5 pl-2">Product</div>
                          <div className="col-span-2 text-center">Status</div>
                          <div className="col-span-1 text-center">Quantity</div>
                          <div className="col-span-1 text-center">Price</div>
                        </div>

                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col py-4 px-4 lg:grid lg:grid-cols-9 lg:items-center border-b border-[#929B91]/10 last:border-b-0 lg:py-4 lg:px-2 gap-4 lg:gap-0"
                          >
                            <div className="lg:col-span-5 flex items-center gap-4 pl-0 lg:pl-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-xl object-cover shrink-0 lg:h-12 lg:w-12"
                              />
                              <h3 className="font-display text-base font-medium lg:font-body lg:text-sm lg:font-normal text-primary">
                                {item.name}
                              </h3>
                            </div>

                            <div className="flex flex-col gap-2 lg:hidden">
                              <div className="flex justify-between items-center">
                                <StatusBadge status={order.uiStatus} />
                                <div className="font-body text-sm text-neutral/70">
                                  {item.quantity} Item :{" "}
                                  <span className="font-bold text-primary">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="hidden lg:flex lg:col-span-2 justify-center">
                              <StatusBadge status={order.uiStatus} />
                            </div>

                            <div className="hidden lg:block lg:col-span-1 text-center text-sm font-medium text-neutral/80">
                              {item.quantity}
                            </div>

                            <div className="hidden lg:block lg:col-span-1 text-center text-sm font-bold text-neutral/80">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        ))}

                        <div className="mt-6 px-4 lg:px-8 flex flex-col items-end gap-2 text-sm text-neutral/60 font-body">
                          <div className="flex justify-between w-56">
                            <span>Service fee</span>
                            <span>{formatPrice(order.serviceFee)}</span>
                          </div>
                          <div className="flex justify-between w-56 mb-2">
                            <span>Delivery fee</span>
                            <span>{formatPrice(order.deliveryFee)}</span>
                          </div>
                          <div className="flex justify-between w-64 text-base font-bold text-primary border-t border-[#929B91]/20 pt-3">
                            <span>Grand total</span>
                            <span>{formatPrice(displayGrandTotal)}</span>
                          </div>

                          {order.canCancel && (
                            <div className="mt-3 flex justify-end w-64">
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="w-full rounded-full cursor-pointer border border-[#8F4748] text-[#8F4748] bg-transparent hover:bg-[#8F4748] hover:text-white px-4 py-2 text-sm font-bold transition-colors"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
