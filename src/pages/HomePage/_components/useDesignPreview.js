// logic ของปุ่ม Preview (AI สร้างรูปช่อ) ในหน้า Custom design — ดู AI_PREVIEW_PLAN.md ใน backend ข้อ 5
// แยกออกมาจาก Customdesign.jsx จะได้แตะไฟล์ของเพื่อนน้อยที่สุด
import { useEffect, useState } from "react";
import { getPreviewQuota, previewDesign } from "../../../lib/aiApi";
import {
  addToHistory,
  loadHistory,
  mergeComponents,
  previewKeyOf,
} from "../../../lib/previewHistory";

// components: ช่อที่เลือกอยู่ตอนนี้ [{ inventory_item_id, quantity }]
// selections: state ของหน้า Custom design (เก็บไว้ใน history เผื่อกดรูปเก่าแล้วเติมตัวเลือกกลับ)
// onRestoreSelections(selections): ให้หน้า Custom design เปลี่ยนตัวเลือกกลับเป็นช่อของรูปใน history
export function useDesignPreview({ components, selections, user, onRestoreSelections }) {
  const userId = user?._id;
  const [history, setHistory] = useState(() => loadHistory(userId));
  const [shown, setShown] = useState(null); // รูปที่กำลังโชว์ (1 รายการจาก history)
  const [isFromHistory, setIsFromHistory] = useState(false); // true = โชว์รูปเดิม ไม่ได้สร้างใหม่
  const [quota, setQuota] = useState(null); // { limit, remaining, promptVersion }
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // เปลี่ยนบัญชี / login / logout → เปลี่ยนไปใช้ history ของคนนั้น
  // ทำตอน render (ไม่ใช้ useEffect) ตามที่ React แนะนำ จะได้ไม่ render ซ้ำ 2 รอบ
  const [historyOwner, setHistoryOwner] = useState(userId);
  if (historyOwner !== userId) {
    setHistoryOwner(userId);
    setHistory(loadHistory(userId));
    setShown(null);
    setError("");
    setQuota(null);
  }

  // เช็คโควตาจาก backend (API ภายนอก → ใช้ useEffect) · เช็คไม่ได้ไม่เป็นไร ยังกด Preview ได้
  useEffect(() => {
    if (!userId) return;
    getPreviewQuota()
      .then(setQuota)
      .catch(() => setQuota(null));
  }, [userId]);

  const currentKey = previewKeyOf(components);
  // รูปที่โชว์ไม่ใช่ช่อที่เลือกอยู่ตอนนี้ → ป้ายเตือน
  const isStale = Boolean(shown) && shown.previewKey !== currentKey;

  // force = true → สร้างรูปใหม่แม้เคยสร้างช่อนี้แล้ว (ปุ่ม "Generate a new one")
  async function generate({ force = false } = {}) {
    if (!userId) {
      setError("Please log in to preview your bouquet.");
      return;
    }
    setError("");

    // ช่อเดิม + template รุ่นเดิม → ใช้รูปใน history ไม่ต้องรอ ไม่เสียโควตา (seed เดิมก็ไม่ได้รูปเดิมเป๊ะ)
    if (!force) {
      const cached = history.find(
        (h) => h.previewKey === currentKey && h.promptVersion === quota?.promptVersion,
      );
      if (cached) {
        setShown(cached);
        setIsFromHistory(true);
        return;
      }
    }

    setIsGenerating(true);
    try {
      const data = await previewDesign(mergeComponents(components));
      const newHistory = await addToHistory(userId, {
        previewKey: currentKey,
        promptVersion: data.promptVersion,
        selections,
        caption: data.caption,
        image: data.image,
      });
      setHistory(newHistory);
      setShown(newHistory[0]);
      setIsFromHistory(false);
      setQuota({ limit: data.limit, remaining: data.remaining, promptVersion: data.promptVersion });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 401) setError("Please log in to preview your bouquet.");
      else if (status === 429) {
        setError(message || "You have used all previews for today. Please try again tomorrow.");
        setQuota((q) => (q ? { ...q, remaining: 0 } : q));
      } else if ([400, 409, 503].includes(status) && message) setError(message);
      else setError("Preview is not available right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  // กดรูปในแถบ history → โชว์รูปนั้น + เปลี่ยนตัวเลือกกลับเป็นช่อนั้น (ป้ายเตือนจะหายเพราะตรงกันแล้ว)
  function showFromHistory(entry) {
    setShown(entry);
    setIsFromHistory(true);
    setError("");
    if (entry.selections) onRestoreSelections(entry.selections);
  }

  // กลับไปดูโมเดล 3D
  function hidePreview() {
    setShown(null);
  }

  return {
    shown,
    isStale,
    isFromHistory,
    history,
    quota,
    isGenerating,
    error,
    generate,
    showFromHistory,
    hidePreview,
  };
}
