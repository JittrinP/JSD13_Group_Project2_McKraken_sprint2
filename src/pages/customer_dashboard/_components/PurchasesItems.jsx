import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext";

export default function PurchaseItem() {
  const { orders } = useCart();

  // แปลงโครงสร้างจาก orders ใน CartContext -> เป็นรายการสินค้าแต่ละชิ้นสำหรับแสดงผล
  const getRealPurchases = () =>
    orders?.flatMap((order) =>
      order.items.map((item, index) => ({
        id: `${order.order_id}-${item.product_id || index}`,
        order_id: order.order_id,
        name: item.name,
        status: order.status === "confirmed" ? "in progress" : order.status,
        quantity: item.quantity,
        price: item.unit_price,
        canCancel: order.status === "confirmed" || order.status === "Process",
        image: item.images?.[0] || "https://placehold.co/62x62?text=62×62",
      })),
    ) || [];

  // เก็บรายการออเดอร์ลง state
  const [purchases, setPurchases] = useState(getRealPurchases);

  // อัปเดตรายการเมื่อมีการสั่งซื้อใหม่เข้ามาจาก CartContext
  useEffect(() => {
    setPurchases(getRealPurchases());
  }, [orders]);

  // ฟังก์ชัน Cancel
  const handleCancel = (itemId) => {
    const isConfirmed = window.confirm("Do you want to cancel this order?");
    if (!isConfirmed) return;

    setPurchases((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: "Cancelled", canCancel: false }
          : item,
      ),
    );
  };

  return (
    <div className="text-primary">
      <h2 className="font-display text-2xl font-bold">Purchases</h2>

      {/* Container ตารางพร้อมการเลื่อน (Scroll) */}
      <div className="mt-4 flex flex-col gap-6 lg:m-4 lg:gap-0 lg:max-h-125 lg:overflow-auto lg:rounded-2xl lg:border lg:border-[#929B91]/30 lg:bg-background">
        {/* หัวตาราง (Sticky Header) */}
        <div className="hidden lg:grid grid-cols-9 font-body p-2 border-b border-[#929B91]/30 lg:sticky lg:top-0 lg:z-10 lg:bg-background">
          <div className="col-span-4 pl-2">Product</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* กรณีไม่มีคำสั่งซื้อเลย */}
        {purchases.length === 0 ? (
          <div className="p-12 text-center text-neutral/60 font-body">
            No order history
          </div>
        ) : (
          /* รายการสินค้า */
          purchases.map((item) => {
            const isShipping =
              item.status === "In Progress" || item.status === "Shipped";
            const isCancelled = item.status === "Cancelled";

            return (
              <div
                key={item.id}
                className="flex gap-6 rounded-2xl border border-[#929B91]/30 bg-background p-6 shadow-sm lg:grid lg:grid-cols-9 lg:items-center lg:gap-0 lg:rounded-none lg:border-0 lg:border-b lg:p-4 lg:pl-10 lg:shadow-none lg:last:border-b-0"
              >
                {/* รูปสินค้า */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 shrink-0 rounded-lg object-cover lg:col-span-1 lg:h-15.5 lg:w-15.5"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                  {/* ชื่อสินค้า + เลข Order ID */}
                  <div className="lg:col-span-3 flex flex-col justify-center">
                    <h3 className="font-display text-xl font-semibold lg:font-body lg:text-base lg:font-normal">
                      {item.name}
                    </h3>
                    {item.order_id && (
                      <span className="text-xs text-neutral/50 font-mono mt-0.5">
                        Order: #{item.order_id.slice(0, 8)}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center text-sm lg:col-span-2 lg:justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        isShipping
                          ? "bg-primary text-white"
                          : isCancelled
                            ? "bg-red-100 text-destructive"
                            : "bg-[#E5E7E4] text-[#4A554D]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isShipping
                            ? "bg-white"
                            : isCancelled
                              ? "bg-destructive"
                              : "bg-[#4A4A4A]"
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="text-sm font-medium lg:col-span-1 lg:text-center lg:text-base">
                    <span className="inline lg:hidden text-neutral/70">
                      จำนวน:{" "}
                    </span>
                    {item.quantity}
                  </div>

                  {/* Price */}
                  <div className="text-sm font-bold lg:col-span-1 lg:text-center lg:text-base">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Action (Cancel Button) */}
                  <div className="mt-auto flex justify-end pt-2 lg:contents lg:justify-self-center">
                    {item.canCancel ? (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="text-sm font-medium text-destructive transition-opacity hover:underline hover:opacity-80 lg:col-span-1 lg:justify-self-center cursor-pointer"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-neutral/40 cursor-not-allowed lg:col-span-1 lg:justify-self-center">
                        Cancel
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
