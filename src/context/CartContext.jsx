import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../lib/cartApi";

// วิธีใช้ในหน้า Product:
// import { useCart } from "../context/CartContext";
// const { addToCart } = useCart();
// <button onClick={() => addToCart(product)}>Add to Cart</button>
//
// ตะกร้าเก็บที่ backend (/api/v1/cart) แล้ว ไม่ใช่ state ในเครื่อง refresh หน้า / เปิดเว็บใหม่ ตะกร้ายังอยู่
// หลักการ: ทุกครั้งที่เพิ่ม/ลด/ลบ → ยิง API → โหลดตะกร้าใหม่ (GET) ให้ราคาที่แสดงตรงกับ backend เสมอ

const CUSTOM_PLACEHOLDER_IMAGE = "https://placehold.co/140x140"; // ช่อ custom ไม่มีรูป ใช้ placeholder เดียวกับหน้า CustomList

const LOGIN_REQUIRED_MESSAGE = "Please log in to add items to your cart. Use the Login button at the top of the page.";

// ObjectId ของ MongoDB = ตัวอักษร 0-9 a-f ยาว 24 ตัว ใช้แยก id จริงออกจาก id ของ mock data (เช่น "p01")
const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/;

const EMPTY_SUMMARY = { subtotal: 0, service_fee: 0, delivery_fee: 0, total: 0 };

// แปลง item จาก backend ให้หน้าตาเหมือนตอนเป็น state ในเครื่อง หน้า CartPage / ProductCard / CheckoutPage จะได้ไม่ต้องแก้เยอะ
// product_id ตรงนี้ใช้เป็น "key" ไว้หา item เท่านั้น:
//   - สินค้าทั่วไป = _id ของ product (backend populate มาเป็น object เลยต้องดึง _id ออกมา)
//   - ช่อ custom   = design_id (ถ้ากดมาจาก CustomList) ไม่มีก็ใช้ _id ของ item ในตะกร้าแทน
// ส่วน _id คือ id ของ item ในตะกร้า ใช้ตอนยิง PATCH / DELETE
function toCartItem(item) {
  if (item.item_type === "standard_product") {
    const product = item.product_id || {};
    return {
      _id: item._id,
      product_id: product._id,
      item_type: item.item_type,
      name: product.name,
      description: product.description,
      images: product.images?.length ? product.images : [CUSTOM_PLACEHOLDER_IMAGE],
      unit_price: item.unit_price,
      line_total: item.line_total,
      quantity: item.quantity,
    };
  }

  const specs = item.custom_specs || {};
  return {
    _id: item._id,
    product_id: specs.design_id || item._id,
    item_type: item.item_type,
    name: specs.design_name,
    description: specs.design_description,
    images: [CUSTOM_PLACEHOLDER_IMAGE],
    unit_price: item.unit_price,
    line_total: item.line_total,
    quantity: item.quantity,
    custom_specs: specs,
  };
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY); // ราคาจาก backend: subtotal, service_fee, delivery_fee, total
  const [giftNote, setGiftNote] = useState("");
  const [cartError, setCartError] = useState("");
  const [orders, setOrders] = useState([]);     // 📍-เก็บประวัติออเดอร์

  // โหลดตะกร้าจาก backend มาเก็บใน state
  //
  // ทำไมครอบด้วย useCallback:
  // ปกติทุกครั้งที่ component render ใหม่ function ที่เขียนข้างในจะถูก "สร้างใหม่" ทุกรอบ
  // useCallback(fn, []) = บอก React ว่า "ใช้ function ตัวเดิมตลอด ไม่ต้องสร้างใหม่" ([] = ไม่มีค่าไหนที่ทำให้ต้องสร้างใหม่)
  // ต้องใช้เพราะ loadCart อยู่ใน dependency ของ useEffect ด้านล่าง [isLoggedIn, loadCart]
  // ถ้าไม่ครอบ: loadCart → setItems → render ใหม่ → loadCart ถูกสร้างใหม่ → useEffect คิดว่าเปลี่ยน → เรียก loadCart อีก → วนไม่จบ (ยิง API รัวๆ)
  const loadCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      setItems(data.items.map(toCartItem));
      setSummary({
        subtotal: data.subtotal,
        service_fee: data.service_fee,
        delivery_fee: data.delivery_fee,
        total: data.total,
      });
      setGiftNote(data.gift_note || "");
      setCartError("");
    } catch (err) {
      console.error(err);
      setCartError("Could not load your cart.");
    }
  }, []);

  // login แล้วโหลดตะกร้า / logout แล้วล้างตะกร้าที่แสดงอยู่ (ของใน backend ยังอยู่ login ใหม่ก็กลับมา)
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setItems([]);
      setSummary(EMPTY_SUMMARY);
      setGiftNote("");
    }
  }, [isLoggedIn, loadCart]);

  // ตัวช่วยครอบทุกการแก้ตะกร้า: ยังไม่ login → alert ให้ไป login ก่อน / login แล้ว → ยิง API แล้วโหลดตะกร้าใหม่
  // คืนค่า true = สำเร็จ, false = ไม่สำเร็จ (หน้าที่เรียกใช้เช็คได้ เช่นหน้า Home จะเปิด popup Success เฉพาะตอน true)
  async function runCartAction(action) {
    if (!isLoggedIn) {
      alert(LOGIN_REQUIRED_MESSAGE);
      return false;
    }
    let success = true;
    try {
      await action();
    } catch (err) {
      // 401 = token หมดอายุ (15 นาที) ให้ login ใหม่
      if (err.status === 401) {
        alert(LOGIN_REQUIRED_MESSAGE);
        return false;
      }
      success = false;
      // 409 = มีในตะกร้าแล้ว (เช่นกดเร็วๆ 2 ครั้ง) ไม่ใช่ error จริง แค่โหลดตะกร้าใหม่ให้ตรงกัน
      if (err.status !== 409) {
        console.error(err);
        setCartError(err.message);
      }
    }
    await loadCart();
    return success;
  }

  // หา item ในตะกร้าจาก key (product._id หรือ design._id)
  function findItem(key) {
    return items.find((i) => i.product_id === key);
  }

  function addToCart(product) {
    // เช็ค login ก่อน ให้คนที่ยังไม่ login เห็นข้อความให้ไป login (ไม่งั้นจะเห็นข้อความ product ด้านล่างแทน)
    if (!isLoggedIn) {
      alert(LOGIN_REQUIRED_MESSAGE);
      return;
    }
    // [PRODUCT TODO]: หน้า Products / PopularProducts ยังใช้ mockProducts ที่ id เป็น "p01" ไม่ใช่ ObjectId ส่งไป backend จะ error
    // คนที่ทำ product: ทำ GET /api/v1/products (product.routes.js ยังว่าง) แล้วให้หน้า Products ดึงจาก API พอได้ _id จริงแล้วลบ if นี้ออกได้เลย
    if (!OBJECT_ID_PATTERN.test(product._id)) {
      alert("Products can't be added to the cart yet. Only saved custom bouquets are supported for now.");
      return;
    }
    return runCartAction(() => {
      const existing = findItem(product._id);
      return existing
        ? cartApi.updateCartItem(existing._id, existing.quantity + 1)
        : cartApi.addProductToCart(product._id);
    });
  }

  // เพิ่มช่อ custom ที่เซฟไว้ (จากหน้า CustomList) ส่ง design_id ไปด้วย backend จะได้รู้ว่ามาจาก design ไหน
  // สูตรช่อส่งไปเป็นสำเนา ถ้า design ถูกแก้/ลบทีหลัง ช่อในตะกร้าจะไม่เปลี่ยนตาม
  function addCustomToCart(design) {
    return runCartAction(() => {
      const existing = findItem(design._id);
      if (existing) {
        return cartApi.updateCartItem(existing._id, existing.quantity + 1);
      }
      return cartApi.addCustomToCart({
        design_id: design._id,
        design_name: design.design_name,
        design_description: design.design_description,
        // populate มาแล้ว inventory_item_id เป็น object ส่งแค่ _id ให้ตรง schema ของ cart
        components: design.components.map((c) => ({
          inventory_item_id: c.inventory_item_id?._id,
          quantity: c.quantity,
        })),
      });
    });
  }

  // เพิ่มช่อที่ประกอบเองจากหน้า Home (Customdesign.jsx) ยังไม่ได้เซฟเป็น design เลยไม่มี design_id
  // customSpecs: { design_name?, design_description?, components: [{ inventory_item_id, quantity }] }
  // ไม่ส่ง design_name มา backend ตั้งชื่อให้เป็น "Custom design N" / กดซ้ำได้ช่อใหม่เพิ่มในตะกร้าทุกครั้ง
  function addBouquetToCart(customSpecs) {
    return runCartAction(() => cartApi.addCustomToCart(customSpecs));
  }

  function increaseQty(key) {
    const item = findItem(key);
    if (!item) return;
    return runCartAction(() => cartApi.updateCartItem(item._id, item.quantity + 1));
  }

  // ลดเหลือ 0 = backend ลบ item ออกให้เอง
  function decreaseQty(key) {
    const item = findItem(key);
    if (!item) return;
    return runCartAction(() => cartApi.updateCartItem(item._id, item.quantity - 1));
  }

  function removeItem(key) {
    const item = findItem(key);
    if (!item) return;
    return runCartAction(() => cartApi.removeCartItem(item._id));
  }

  // พิมพ์ gift note ใช้ setGiftNote (เก็บในเครื่อง) แล้วเรียก saveGiftNote ตอนพิมพ์เสร็จ (onBlur) ค่อยบันทึกลง backend
  // ไม่ยิงทุกตัวอักษรที่พิมพ์ เพราะจะยิง API ถี่เกินไป
  function saveGiftNote() {
    return runCartAction(() => cartApi.updateGiftNote(giftNote));
  }

  function clearCart() {
    return runCartAction(() => cartApi.clearCart());
  }

// ---------
 function placeOrder({ deliveryAddress, serviceFee = 0, deliveryFee = 10 }) {
    const subTotal = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const grandTotal = subTotal + serviceFee + deliveryFee;

    const newOrder = {
      order_id: crypto.randomUUID(),
      items,            // snapshot ของตะกร้า ณ ตอนกดสั่ง
      giftNote,
      deliveryAddress,
      subTotal,
      serviceFee,
      deliveryFee,
      grandTotal,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    // [ORDER TODO]: ตอนนี้ยังไม่มี order API เลยให้ frontend ล้างตะกร้าใน backend เอง
    // พอมี POST /orders แล้ว ให้ backend ล้างตะกร้าตอนสร้าง order แทน แล้วลบบรรทัดนี้ออก (ดู comment ที่ DELETE /cart ใน carts.routes.js)
    clearCart();

    return newOrder; // ส่งกลับไปให้ CheckoutPage ใช้เปิด modal ทันที
  }
// ---------

  return (
    <CartContext.Provider
      value={{
        items: items.filter(Boolean),
        summary,
        cartError,
        addToCart,
        addCustomToCart,
        addBouquetToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        giftNote,
        setGiftNote,
        saveGiftNote,
        orders,       // 📍
        placeOrder,   // 📍
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
