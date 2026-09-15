import { useCallback } from "react";
import { useCart } from "../context/CartContext";

const DEFAULT_IMAGE = "https://placehold.co/400x300/png";

function getOptimizedImageUrl(src) {
  const imageSrc = src || DEFAULT_IMAGE;
  if (imageSrc.startsWith("https://images.unsplash.com/")) {
    const sep = imageSrc.includes("?") ? "&" : "?";
    return `${imageSrc}${sep}auto=format&fit=crop&w=600&q=75`;
  }
  return imageSrc;
}

export default function ProductCard({ product }) {
  const { items, addToCart, increaseQty, decreaseQty } = useCart();

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
    <div className="product-card group border border-gray-100 rounded-2xl p-3 sm:p-3.5 bg-secondary shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col justify-between w-full max-w-sm sm:max-w-none mx-auto">
      <div>
        <div className="relative mb-3 rounded-xl overflow-hidden aspect-[4/4] w-full bg-gray-50">
          <img
            src={getOptimizedImageUrl(product.images[0])}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute bottom-2.5 right-2.5 bg-white/95 text-neutral text-xs px-2.5 py-1 rounded-full font-medium shadow-sm pointer-events-none">
            ${product.base_price.toFixed(2)}
          </span>
        </div>
        <h3 className="product-title font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
          {product.name}
        </h3>
        <p className="product-desc text-xs text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 h-12 ">
        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            className="btn-add-cart w-1/2 h-9 text-xs bg-primary text-white px-3 rounded-full font-medium transition-all duration-200 hover:opacity-95 hover:shadow-sm active:scale-95 cursor-pointer animate-in fade-in zoom-in-95"
          >
            Add to cart
          </button>
        ) : (
          <div className="qty-counter flex items-center justify-between gap-2 w-1/2 h-9 border border-gray-200 rounded-full px-2 text-sm bg-white transition-all duration-200 animate-in fade-in zoom-in-90">
            <button
              onClick={handleDecrease}
              className="font-medium px-2.5 py-0.5 rounded-full transition-all duration-150 hover:bg-gray-100 active:scale-75 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              -
            </button>
            <span
              key={quantity}
              className="font-medium text-xs select-none text-gray-800 animate-in fade-in zoom-in-75 duration-150"
            >
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="font-medium px-2.5 py-0.5 rounded-full transition-all duration-150 hover:bg-gray-100 active:scale-75 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
