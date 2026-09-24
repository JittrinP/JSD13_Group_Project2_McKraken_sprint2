// API helpers สำหรับตะกร้า (ยิงไปหา backend จริงที่ /api/v1/cart)
// ทุกเส้นต้อง login (backend ใช้ authen เอา user จาก accessToken cookie) เลยต้องใส่ credentials: "include" ทุก request
// ใช้แค่ใน CartContext.jsx หน้าอื่นให้เรียกผ่าน useCart() แทน ไม่ต้อง import ไฟล์นี้ตรงๆ

const API_BASE = import.meta.env.VITE_API_URL;

// สร้าง Error ที่แนบ status จาก backend ไปด้วย (เช่น 401 = ยังไม่ login / token หมดอายุ, 409 = มีในตะกร้าแล้ว)
// CartContext ใช้ error.status เช็คว่าต้อง alert ให้ login ใหม่ หรือแค่โหลดตะกร้าใหม่
function apiError(res, data, fallbackMessage) {
  const error = new Error(data.message || fallbackMessage);
  error.status = res.status;
  error.data = data;
  return error;
}

// GET ตะกร้าของ user ที่ login อยู่
// ได้ { items (มี unit_price, line_total), gift_note, subtotal, service_fee, delivery_fee, total }
export async function getCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to load cart");
  }
  return data;
}

// POST เพิ่มสินค้าทั่วไป (ถ้ามีในตะกร้าแล้ว backend ตอบ 409 ให้ใช้ updateCartItem แทน)
export async function addProductToCart(productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      item_type: "standard_product",
      product_id: productId,
      quantity,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to add product to cart");
  }
  return data;
}

// POST เพิ่มช่อ custom — customSpecs: { design_id?, design_name, design_description, components: [{ inventory_item_id, quantity }] }
// ถ้ามี design_id และ design นี้อยู่ในตะกร้าแล้ว backend ตอบ 409
export async function addCustomToCart(customSpecs, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      item_type: "custom_product",
      quantity,
      custom_specs: customSpecs,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to add bouquet to cart");
  }
  return data;
}

// PATCH เปลี่ยนจำนวนของ item ในตะกร้า (itemId = _id ของ item ในตะกร้า ไม่ใช่ product_id) ส่ง 0 = ลบ
export async function updateCartItem(itemId, quantity) {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to update quantity");
  }
  return data;
}

// DELETE ลบ item เดียวออกจากตะกร้า
export async function removeCartItem(itemId) {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to remove item");
  }
  return data;
}

// PATCH แก้ gift note ของทั้งตะกร้า (ส่ง "" = ลบข้อความ)
export async function updateGiftNote(giftNote) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ gift_note: giftNote }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to save gift note");
  }
  return data;
}

// DELETE ล้างตะกร้าทั้งหมด (เก็บตะกร้าไว้ ล้างแค่ items กับ gift_note)
export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw apiError(res, data, "Failed to clear cart");
  }
  return data;
}
