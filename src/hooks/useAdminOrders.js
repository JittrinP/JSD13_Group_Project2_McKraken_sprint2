import { useEffect, useState } from "react";
import { api } from "../context/AuthContext"; // axios ที่แนบ cookie (token) ไปกับทุก request ให้อัตโนมัติ

// ---------- API helpers (เรียก backend /api/v1/admin/orders) ----------

// ดึง order ทีละหน้า params เช่น { page: 1, limit: 10, status: "pending", search: "ORD" }
async function getOrders(params) {
  const res = await api.get("/admin/orders", { params }); // axios แปลง params เป็น ?page=1&limit=10... ให้เอง
  return res.data; // { success, data: [...orders], pagination: {...} }
}

// แก้สถานะ order (backend รับแค่ order_status field เดียว)
async function patchOrderStatus(orderId, status) {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { order_status: status });
  return res.data; // { success, data: order ที่แก้แล้ว }
}

// ลบ order ออกจาก database จริง
async function removeOrder(orderId) {
  const res = await api.delete(`/admin/orders/${orderId}`);
  return res.data; // { success, message }
}

// ---------- แปลงข้อมูลจาก backend ให้เป็นหน้าตาที่ OrderList.jsx ใช้อยู่ ----------

// ต่อที่อยู่ที่เป็น object ให้เป็นข้อความบรรทัดเดียว และข้ามช่องที่ว่าง
function formatAddress(address) {
  if (!address) return ""; // บาง order อาจไม่มีที่อยู่
  return [
    address.address_line,
    address.sub_district,
    address.district,
    address.province,
    address.postal_code,
  ]
    .filter(Boolean) // ตัดช่องที่ว่างหรือ undefined ออก
    .join(", ");
}

function mapOrderFromApi(order) {
  const customer = order.user_id; // populate แล้วเป็น object ของ user หรือเป็น null ถ้า user ถูกลบไปแล้ว
  const fullName = [customer?.profile?.first_name, customer?.profile?.last_name]
    .filter(Boolean)
    .join(" "); // ต่อชื่อ + นามสกุล

  return {
    id: order._id, // id จริงของ MongoDB ใช้ตอนยิง PATCH/DELETE และเป็น key ของแถว
    order_id: order.order_number, // เลข order ที่แสดงบนหน้าจอ เช่น ORD-202609-001
    customer_id: customer?._id || "-", // ถ้าไม่มี user แสดง "-"
    customer_name: fullName || "Unknown customer", // ถ้าไม่มี user หรือไม่มีชื่อ แสดงข้อความแทน
    customer_email: customer?.email || "",
    created_at: order.createdAt, // backend ใช้ createdAt (camelCase) จาก timestamps
    grandTotal: order.payment_pricing?.grand_total ?? 0, // ยอดรวมอยู่ใน payment_pricing
    status: order.order_status,
    deliveryAddress: formatAddress(order.delivery_info?.shipping_address),
    items: (order.items || []).map((item, index) => ({
      product_id: item.product_id || `custom-${index}`, // สินค้า custom ไม่มี product_id เลยสร้าง key แทน กัน key ซ้ำ
      name: item.item_name, // backend ใช้ item_name
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
  };
}

const PAGE_SIZE = 10; // จำนวน order ต่อหน้า

// page, status, search มาจาก state ใน OrderList.jsx เปลี่ยนเมื่อไหร่จะ fetch ใหม่ให้อัตโนมัติ
export function useAdminOrders({ page, status, search }) {
  const [orders, setOrders] = useState([]); // เริ่มเป็น array ว่าง รอ fetch จาก backend มาเติม
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 }); // ข้อมูลการแบ่งหน้าจาก backend
  const [isLoading, setIsLoading] = useState(true); // true ระหว่างรอ backend ตอบ
  const [error, setError] = useState(""); // ข้อความ error ถ้าโหลดไม่สำเร็จ

  // ดึง order ของหน้าปัจจุบันจาก backend แล้วเก็บลง state (ใช้ซ้ำตอน refetch หลังแก้/ลบด้วย)
  async function fetchOrders() {
    setIsLoading(true);
    setError(""); // ล้าง error เก่าก่อนโหลดใหม่
    try {
      const result = await getOrders({
        page,
        limit: PAGE_SIZE,
        status, // "all" = ไม่กรอง (backend จัดการให้)
        search: search.trim() || undefined, // ช่องว่างล้วนไม่ต้องส่งไป (undefined = axios ไม่ใส่ใน URL)
      });
      setOrders(result.data.map(mapOrderFromApi)); // แปลงทุก order ให้เป็นหน้าตาที่ OrderList ใช้
      setPagination(result.pagination);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again."); // ให้ OrderList เอาไปแสดง
    } finally {
      setIsLoading(false); // สำเร็จหรือพังก็เลิกโหลด
    }
  }

  // fetch ใหม่ทุกครั้งที่เปลี่ยนหน้า เปลี่ยน status filter หรือพิมพ์คำค้นหา
  useEffect(() => {
    fetchOrders();
  }, [page, status, search]);

  return {
    orders,
    pagination,
    isLoading,
    error,
    // ยิง PATCH ไป backend แล้วโหลดลิสต์ใหม่ (ไม่แก้ state เอง ให้ข้อมูลตรงกับ database เสมอ)
    updateOrderStatus: async (orderId, status) => {
      await patchOrderStatus(orderId, status); // ถ้าพังจะ throw ออกไปให้ OrderList จับแล้ว alert
      await fetchOrders(); // refetch หน้าเดิม เผื่อ order หลุดจาก status filter ที่เลือกอยู่
    },
    // ยิง DELETE ไป backend แล้วโหลดลิสต์ใหม่
    deleteOrder: async (orderId) => {
      await removeOrder(orderId); // ถ้าพังจะ throw ออกไปให้ OrderList จับแล้ว alert
      await fetchOrders(); // refetch หน้าเดิม
    },
  };
}