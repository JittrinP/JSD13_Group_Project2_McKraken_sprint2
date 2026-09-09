import { memo, useCallback } from "react";
import { useCart } from "../context/CartContext"; // Albert เพิ่มไว้ล่วงหน้าให้ผูกกับตะกร้า — รอแจ้งทีม

const DEFAULT_IMAGE = "https://placehold.co/309x208/png";

// เพิ่มพารามิเตอร์ resize/compress ให้รูป Unsplash โหลดเฉพาะขนาดที่การ์ดใช้จริง (~309x208)
function getOptimizedImageUrl(src) {
  const imageSrc = src || DEFAULT_IMAGE;
  if (imageSrc.startsWith("https://images.unsplash.com/")) {
    const sep = imageSrc.includes("?") ? "&" : "?";
    return `${imageSrc}${sep}auto=format&fit=crop&w=400&q=60`;
  }
  return imageSrc;
}

function ProductCard({ product, showQuantity = true }) {
  const { items, addToCart, increaseQty, decreaseQty } = useCart(); // Albert เพิ่มไว้ล่วงหน้าให้ผูกกับตะกร้า — รอแจ้งทีม

  const cartItem = items.find((item) => item.product_id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleDecrease = useCallback(() => {
    decreaseQty(product._id);
  }, [decreaseQty, product._id]);

  const handleIncrease = useCallback(() => {
    increaseQty(product._id);
  }, [increaseQty, product._id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  return (
    <div className="product-card will-change-transform [contain:content] border border-gray-100 rounded-2xl p-3 bg-white shadow-sm">
      <div>
        <div className="relative mb-3 rounded-xl overflow-hidden">
          <img
            src={getOptimizedImageUrl(product.images[0])}
            alt={product.name}
            width={309}
            height={208}
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover"
          />
          <span className="absolute bottom-2.5 right-2.5 bg-white/95 text-neutral text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
            ${product.base_price.toFixed(2)}
          </span>
        </div>
        <h3 className="product-title font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="product-desc text-xs text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3">
        {showQuantity ? (
          quantity === 0 ? (
            <button
              onClick={handleAddToCart} // Albert เพิ่มไว้ล่วงหน้าให้ผูกกับตะกร้า — รอแจ้งทีม
              className="btn-add-cart w-full text-xs bg-primary text-white px-3 py-1.5 rounded-lg"
            >
              Add to cart
            </button>
          ) : (
            <div className="qty-counter flex items-center justify-between gap-2 w-full border border-gray-200 rounded-lg px-2 py-1 text-sm">
              <button
                onClick={handleDecrease}
                className="hover:opacity-75 font-medium px-2"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={handleIncrease}
                className="hover:opacity-75 font-medium px-2"
              >
                +
              </button>
            </div>
          )
        ) : (
          <button className="w-full py-2 bg-neutral text-white text-xs rounded-lg hover:opacity-90">
            Order Now
          </button>
        )}
      </div>
    </div>
  );
}

// ครอบด้วย memo: การ์ดจะ Re-render เฉพาะเมื่อ props เปลี่ยน ไม่ render ทั้ง Grid ซ้ำเมื่อ filter/state เปลี่ยน
export default memo(ProductCard);
