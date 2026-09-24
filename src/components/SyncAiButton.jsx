import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { syncAiKnowledge } from "../lib/aiApi";

// ปุ่ม "Sync AI" สำหรับหน้า Admin (ใช้ใน ProductEdit.jsx)
// admin กดหลังเพิ่ม / แก้ / ลบสินค้าหรือวัตถุดิบ ให้ AI chatbot รู้จักข้อมูลล่าสุด
// ดู AI_CHATBOT_PLAN.md ข้อ 4.9 / 5.4 ใน repo backend
// ปกติเสร็จในไม่กี่วินาที (ตัวที่ไม่เปลี่ยนจะข้าม) แต่หลังรัน seed ใหม่อาจนาน ~45 วินาที
export default function SyncAiButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  // { type: "success" | "error", text } ข้อความใต้ปุ่มหลัง sync เสร็จ
  const [result, setResult] = useState(null);

  async function handleSync() {
    setIsSyncing(true);
    setResult(null);
    try {
      const { embedded, skipped, failed, removed } = await syncAiKnowledge();
      setResult(
        failed > 0
          ? { type: "error", text: `${failed} item(s) failed. Please click Sync AI again.` }
          : { type: "success", text: `AI updated: ${embedded} changed, ${skipped} unchanged, ${removed} removed.` },
      );
    } catch (err) {
      const status = err.response?.status;
      setResult({
        type: "error",
        text:
          status === 409
            ? "Sync is already running. Please wait a moment."
            : status === 403
              ? "Only admins can sync the AI."
              : "Sync failed. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        title="Click after adding, editing or deleting items so the AI chatbot knows the latest data"
        className="flex items-center gap-1.5 rounded-xl border border-D-text px-5 py-2 text-sm font-medium text-D-text hover:cursor-pointer hover:bg-D-text/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* animate-spin = หมุนไอคอนตอนกำลัง sync */}
        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Syncing..." : "Sync AI"}
      </button>
      {result && (
        <p className={`text-xs ${result.type === "error" ? "text-destructive" : "text-emerald-700"}`}>
          {result.text}
        </p>
      )}
    </div>
  );
}
