import { useState } from "react";

const mockPurchases = [
  {
    id: "1",
    name: "Cozy Meadow Bouquet",
    status: "Process",
    quantity: 3,
    price: 32.0,
    canCancel: true,
  },
  {
    id: "2",
    name: "Cozy Meadow Bouquet",
    status: "in progress",
    quantity: 3,
    price: 32.0,
    canCancel: false,
  },
  {
    id: "3",
    name: "Cozy Meadow Bouquet",
    status: "Process",
    quantity: 3,
    price: 32.0,
    canCancel: true,
  },
];

export default function PurchaseItem() {
  const [purchases, setPurchases] = useState(mockPurchases);

  const handleCancel = (id) => {
    console.log("Cancel order ID:", id);
  };

  return (
    <div className="text-primary">
      <h2 className="font-display text-2xl font-bold">Purchases</h2>

      <div className="mt-4 flex flex-col gap-6 lg:m-4 lg:gap-0 lg:max-h-125 lg:overflow-auto lg:rounded-2xl lg:border lg:border-[#929B91]/30 lg:bg-background">
        <div className="hidden lg:grid grid-cols-9 font-body p-2 border-b border-[#929B91]/30">
          <div className="col-span-4 pl-2">Product</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {purchases.map((item) => {
          const isShipping =
            item.status === "in progress" || item.status === "Shipped";

          return (
            <div
              key={item.id}
              className="flex gap-6 rounded-2xl border border-[#929B91]/30 bg-background p-6 shadow-sm lg:grid lg:grid-cols-9 lg:items-center lg:gap-0 lg:rounded-none lg:border-0 lg:border-b lg:p-4 lg:pl-10 lg:shadow-none lg:last:border-b-0"
            >
              <img
                src="https://placehold.co/62x62?text=62×62"
                alt={item.name}
                className="h-20 w-20 shrink-0 rounded-lg object-cover lg:col-span-1 lg:h-15.5 lg:w-15.5"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                <h3 className="font-display text-xl font-semibold lg:col-span-3 lg:font-body lg:text-base lg:font-normal">
                  {item.name}
                </h3>
                <div className="flex items-center text-sm lg:col-span-2 lg:justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      isShipping
                        ? "bg-primary text-white"
                        : "bg-[#E5E7E4] text-[#4A554D]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isShipping ? "bg-white" : "bg-[#4A554D]"
                      }`}
                    ></span>
                    {item.status}
                  </span>
                </div>

                <div className="text-sm font-medium lg:col-span-1 lg:text-center lg:text-base">
                  <span className="inline lg:hidden text-neutral/70">
                    จำนวน:{" "}
                  </span>
                  {item.quantity}
                </div>

                <div className="text-sm font-bold lg:col-span-1 lg:text-center lg:text-base">
                  ${item.price.toFixed(2)}
                </div>

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
        })}
      </div>
    </div>
  );
}
