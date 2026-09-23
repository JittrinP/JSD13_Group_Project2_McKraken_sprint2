import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, XCircle } from "lucide-react"; // ไอคอนปิด modal, spinner โหลด, และไอคอนผลลัพธ์สำเร็จ/ล้มเหลว เอามาจาก lucide-react ตามที่โปรเจกต์ติดตั้งไว้อยู่แล้ว
import qrcodeIcon from "../assets/images/payment-qrcode.svg"; // ไอคอนตัวเดียวกับที่ใช้แถวช่องทางชำระเงินในหน้า Checkout

const API_BASE = import.meta.env.VITE_API_URL; // ที่อยู่ backend เอาไว้ประกอบ URL ตอนยิง fetch
const POLL_INTERVAL_MS = 2500; // เช็คสถานะทุก 2.5 วินาที (ไม่ถี่ไป ไม่ช้าไป)
const RESULT_DISPLAY_MS = 1500; // โชว์ข้อความสำเร็จ/ล้มเหลวค้างไว้แป๊บนึงก่อนปิด modal ให้คนอ่านทัน

// สถานะจาก Stripe ที่แปลว่า "จ่ายไม่ผ่าน" สำหรับ PromptPay ในโหมด test
// - requires_payment_method: กดปุ่ม Fail ในหน้าทดสอบของ Stripe
// - canceled: กดปุ่ม Expire ในหน้าทดสอบของ Stripe (หรือ QR หมดอายุเอง)
const FAILED_STATUSES = ["requires_payment_method", "canceled"];

export default function PaymentQRModal({
  qrImageUrl, // รูป QR ที่ backend ส่งมาให้โชว์
  paymentIntentId, // id ของรายการจ่ายเงินนี้ ใช้ถาม status
  amount, // ยอดเงินที่ต้องจ่าย โชว์เหนือ QR ให้ผู้ใช้เช็คก่อนสแกน
  onSuccess, // เรียกตอนจ่ายสำเร็จแล้ว (parent จะไปเปิดหน้า Order Confirmed ต่อ)
  onCancel, // เรียกตอนกดปิด modal เอง หรือตอนจ่ายล้มเหลว/หมดอายุ
}) {
  const [paymentState, setPaymentState] = useState("waiting"); // "waiting" | "success" | "failed" คุมว่าตอนนี้จะโชว์ข้อความ/ไอคอนแบบไหน

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/payments/${paymentIntentId}/status`, // ถามสถานะการจ่ายรอบนี้จาก backend
        );
        const data = await res.json();

        if (data.status === "succeeded") {
          clearInterval(interval); // เจอผลแล้ว หยุดถามซ้ำ
          setPaymentState("success"); // โชว์ข้อความจ่ายสำเร็จก่อน
          setTimeout(onSuccess, RESULT_DISPLAY_MS); // รอให้คนเห็นข้อความสักครู่ ค่อยปิด modal ไปหน้า Order Confirmed
        } else if (FAILED_STATUSES.includes(data.status)) {
          clearInterval(interval); // เจอผลแล้ว หยุดถามซ้ำ
          setPaymentState("failed"); // โชว์ข้อความจ่ายไม่สำเร็จก่อน
          setTimeout(onCancel, RESULT_DISPLAY_MS); // รอให้คนเห็นข้อความสักครู่ ค่อยปิด modal (ไม่ place order)
        }
      } catch (err) {
        console.error("Failed to check payment status", err); // เน็ตหลุดหรือ backend ล่มชั่วคราว ไม่ต้อง crash หน้าจอ แค่ log ไว้ แล้ว interval จะลองใหม่รอบถัดไปเอง
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval); // สำคัญมาก: ถ้าไม่เคลียร์ตรงนี้ พอปิด modal แล้ว interval จะยังทำงานอยู่เบื้องหลังต่อไปเรื่อยๆ (memory leak)
  }, [paymentIntentId, onSuccess, onCancel]);

  return (
    <div className="fixed inset-0 bg-tertiary/50 text-neutral/90 z-50 overflow-y-auto">
      {/* overlay เต็มจอ กดอะไรข้างหลังไม่ได้จนกว่าจะปิด modal */}
      <div className="px-4 py-10 md:w-[420px] mx-auto min-h-screen flex flex-col justify-center">
        <div className="relative flex flex-col p-6 w-full items-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] rounded-3xl bg-white">
          <button
            onClick={onCancel} // ปุ่ม ✕ มุมขวาบน ปิด modal เหมือนปุ่ม Cancel ด้านล่าง
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <h1 className="text-2xl font-bold font-display py-2">
            Scan to Pay
          </h1>

          {amount != null && (
            <p className="text-3xl font-bold font-display text-primary mb-4">
              ฿ {Number(amount).toFixed(2)}
            </p>
          )}

          {/* แถวโลโก้ PromptPay คั่นด้วยเส้นซ้าย-ขวา ให้รู้ว่า QR นี้จ่ายผ่าน PromptPay (เอาแค่โลโก้ ไม่ใส่ตัวหนังสือกำกับ) */}
          <div className="flex items-center gap-3 w-full mb-4">
            <span className="h-px flex-1 bg-primary/20" />
            <img src={qrcodeIcon} alt="PromptPay" className="h-10 w-auto" />
            <span className="h-px flex-1 bg-primary/20" />
          </div>

          {/* กรอบ QR ใส่มุมสไตล์ scan-corner ให้ดูเหมือนกำลังสแกนอยู่จริง */}
          <div className="relative p-3">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
            <img
              src={qrImageUrl} // เอา URL รูปจาก backend มาแปะตรงๆ ไม่ต้อง generate QR เอง
              alt="PromptPay QR Code"
              className="w-[240px] h-[240px] rounded-lg"
            />
          </div>

          {paymentState === "waiting" && (
            <p className="flex items-center gap-2 text-neutral/70 font-body mt-4 mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for payment...
            </p>
          )}
          {paymentState === "success" && (
            <p className="flex items-center gap-2 text-green-600 font-body mt-4 mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Payment successful
            </p>
          )}
          {paymentState === "failed" && (
            <p className="flex items-center gap-2 text-red-600 font-body mt-4 mb-6">
              <XCircle className="w-4 h-4" />
              Payment failed
            </p>
          )}

          {paymentState === "waiting" && ( // ซ่อนปุ่ม Cancel ตอนรู้ผลแล้ว กันคนกดซ้อนตอน modal กำลังจะปิดเองอยู่แล้ว
            <button
              onClick={onCancel} // กดยกเลิกกลางทาง ก็แค่ปิด modal เฉยๆ ไม่ยิงลบ PaymentIntent ฝั่ง Stripe
              className="border-1 border-solid p-2 w-[210px] rounded-full text-primary shadow-md hover:text-primary/80"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
