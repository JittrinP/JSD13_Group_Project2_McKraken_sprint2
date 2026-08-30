import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
// import { MOCK_PRODUCTS, addToCart } from "../mock-data/product-cart"; // เดิมใช้กับ DEV block ด้านล่าง เก็บไว้อ้างอิง

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = item.unit_price * item.quantity;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-black/5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-row gap-4 sm:gap-6 relative">
      <div className="w-24 h-24 sm:w-36 sm:h-36 bg-gray-200/80 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-500 font-medium text-sm sm:text-base border border-black/5">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-base sm:text-xl font-bold text-[#586158] tracking-tight">
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(item.product_id)}
              aria-label={`Remove ${item.name} from cart`}
              className="text-[#4A4A4A]/50 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#4A4A4A]/70 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="inline-flex items-center bg-[#586158] text-white text-xs sm:text-sm rounded-lg px-2 py-1 gap-2.5 shadow-sm">
            <button
              onClick={() => onDecrease(item.product_id)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease ${item.name}`}
              className="hover:opacity-80 font-bold px-1 py-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="font-medium">{item.quantity}</span>
            <button
              onClick={() => onIncrease(item.product_id)}
              aria-label={`Increase ${item.name}`}
              className="hover:opacity-80 font-bold px-1 py-0.5"
            >
              +
            </button>
          </div>
          <span className="font-semibold text-base sm:text-lg text-[#4A4A4A]">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <Cart />
    </CartProvider>
  );
}
// TODO: ตอน ProductsPage พร้อมใช้งานจริง ให้ย้าย <CartProvider> ไปครอบที่ Layout.jsx
// แทน เพื่อให้ ProductsPage กับ CartPage แชร์ตะกร้าเดียวกันได้ข้ามหน้า

function Cart() {
  const navigate = useNavigate();
  const { items, increaseQty, decreaseQty, removeItem } = useCart();
  const [giftNote, setGiftNote] = useState("");

  const subTotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  function handleCheckout() {
    if (items.length === 0) return;
    console.log(items, giftNote);
    navigate("/checkout", { state: { items, giftNote } });
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#4A4A4A] antialiased">
      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/*
          DEV ONLY (ปิดใช้งานแล้ว) — เดิมจำลองการกด Add to Cart จากหน้า Product
          ตอนนี้ใช้ CartContext (src/context/CartContext.jsx) แทนแล้ว
          เก็บโค้ดเดิมไว้อ้างอิงเผื่อจำเป็นต้องย้อนกลับมาดู

          <div className="mb-6 p-3 rounded-xl border border-dashed border-[#586158]/40 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-[#586158]">DEV:</span>
            {MOCK_PRODUCTS.map((product) => (
              <button
                key={product._id}
                onClick={() => setItems((prev) => addToCart(prev, product))}
                className="text-[12px] px-3 py-1.5 rounded-lg bg-white border border-black/10 hover:border-[#586158]"
              >
                + {product.name}
              </button>
            ))}
            <button
              onClick={() => setItems([])}
              className="text-[12px] px-3 py-1.5 rounded-lg bg-white border border-black/10 hover:border-red-400 hover:text-red-500 ml-auto"
            >
              ล้างตะกร้า
            </button>
          </div>
        */}

        {/* Page Title & Actions */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-[#586158] font-bold tracking-tight">
            Your Cart
          </h1>
        </div>

        {/* Cart Grid Layout: Stacked on Mobile, 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Item List Section (2 cols on Desktop) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Edit Icon */}
            <div className="flex justify-end pr-1">
              <button
                aria-label="Edit cart"
                className="text-[#4A4A4A]/70 hover:text-[#586158] transition-colors p-1 bg-white/60 sm:bg-transparent rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 border border-black/5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-center text-[#4A4A4A]/60">
                ยังไม่มีของในตะกร้า
              </div>
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* Items Summary Card */}
          <div className="lg:col-span-1 lg:mt-9">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#586158] mb-3 tracking-tight">
                  Items Summary
                </h2>
                <label
                  htmlFor="gift-note"
                  className="block text-[13px] text-[#4A4A4A]/80 font-medium mb-1"
                >
                  Add a Gift note :
                </label>
                <textarea
                  id="gift-note"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write your message here..."
                  rows={3}
                  className="w-full text-[13px] text-[#4A4A4A] placeholder:text-[#4A4A4A]/40 placeholder:italic bg-white/60 border border-black/10 rounded-lg p-2 resize-none focus:outline-none focus:border-[#586158]/50"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[14px] font-medium text-[#4A4A4A]">
                    Sub-Total:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#4A4A4A]">
                    {formatPrice(subTotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-[#586158] text-white rounded-xl py-3.5 px-4 text-[14px] font-medium hover:bg-[#586158]/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#586158]"
                >
                  Check Out →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
