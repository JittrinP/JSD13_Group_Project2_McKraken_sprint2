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
        status: order.status === "confirmed" ? "In Progress" : order.status,
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
      <div className="mt-4 flex flex-col rounded-2xl border border-[#929B91]/30 bg-background p-4 shadow-sm lg:m-4 lg:gap-0 lg:max-h-125 lg:overflow-auto lg:p-0">
        {/* หัวตาราง*/}
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
                className="flex flex-col border-b border-[#929B91]/20 py-4 last:border-b-0 lg:grid lg:grid-cols-9 lg:items-center lg:gap-0 lg:rounded-none lg:border-b lg:border-[#929B91]/30 lg:p-4 lg:pl-10"
              >
                <div className="flex gap-4 lg:contents">
                  <div className="shrink-0 lg:col-span-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover lg:h-15.5 lg:w-15.5"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                    <div className="lg:col-span-3 flex flex-col justify-center">
                      <h3 className="font-display text-lg font-semibold lg:font-body lg:text-base lg:font-normal">
                        {item.name}
                      </h3>
                      {item.order_id && (
                        <span className="text-xs text-neutral/50 font-mono mt-0.5">
                          Order: #{item.order_id.slice(0, 8)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 lg:contents">
                      <div className="flex items-center text-sm lg:col-span-2 lg:justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                            isShipping
                              ? "bg-[#4A554D] text-white"
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

                      {/* Quantity & Price */}
                      <div className="flex items-center text-sm text-neutral/80 lg:contents">
                        {/* Desktop: Quantity */}
                        <div className="hidden lg:block lg:col-span-1 lg:text-center lg:text-base lg:font-medium">
                          {item.quantity}
                        </div>

                        {/* Desktop: Price */}
                        <div className="hidden lg:block lg:col-span-1 lg:text-center lg:text-base lg:font-bold">
                          ฿{item.price.toFixed(2)}
                        </div>

                        <div className="lg:hidden font-body text-sm">
                          <span className="text-neutral/70">
                            {item.quantity} Item :{" "}
                          </span>
                          <span className="font-bold text-neutral">
                            ฿{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action: ปุ่ม Cancel*/}
                    <div className="mt-1 flex justify-end lg:mt-0 lg:contents lg:justify-self-center">
                      {item.canCancel ? (
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="rounded-full bg-[#8C4A4A] px-6 py-1.5 text-sm font-medium text-white transition-opacity hover:cursor-pointer hover:opacity-90 lg:col-span-1 lg:justify-self-center lg:bg-transparent lg:p-0 lg:text-destructive lg:hover:bg-transparent lg:hover:underline"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="rounded-full bg-[#C5CAC3] px-6 py-1.5 text-sm font-medium text-white cursor-not-allowed lg:col-span-1 lg:justify-self-center lg:bg-transparent lg:p-0 lg:text-neutral/40">
                          Cancel
                        </span>
                      )}
                    </div>
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
