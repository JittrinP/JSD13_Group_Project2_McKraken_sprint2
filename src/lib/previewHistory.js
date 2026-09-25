// History ของรูป AI preview เก็บใน localStorage (ดู AI_PREVIEW_PLAN.md ใน backend ข้อ 5.2)
// - แยก key ตาม user (คอมเครื่องเดียวกันหลายบัญชีจะไม่ปนกัน)
// - localStorage จุได้ ~5MB ต่อเว็บ รูปจาก AI ~500KB → ย่อเป็น webp กว้าง 640px ก่อนเก็บ (~50–100KB)
// - เก็บแค่ 10 รูปล่าสุด
// ทุกครั้งที่อ่าน / เขียน localStorage ครอบ try/catch (โหมด private / เต็ม / ถูกปิดไว้ จะ throw ได้)

const MAX_ITEMS = 10;
const IMAGE_WIDTH = 640;

const storageKey = (userId) => `adf-preview-history:${userId}`;

// components → key ที่ใช้เทียบว่า "ช่อเดียวกันไหม"
// เรียงตาม id + รวมจำนวน → เลือกดอกลำดับต่างกันก็ได้ key เดียวกัน
export function previewKeyOf(components) {
  const merged = mergeComponents(components);
  return JSON.stringify(
    [...merged].sort((a, b) => a.inventory_item_id.localeCompare(b.inventory_item_id)),
  );
}

// ดอกเดียวกันเลือกซ้ำ 2 ช่อง (เช่นสต็อกมีดอกไม่ถึง 3 ชนิด) → รวมเป็นรายการเดียว บวกจำนวน
// backend /ai/preview ไม่รับ id ซ้ำ
export function mergeComponents(components) {
  const byId = new Map();
  for (const c of components) {
    const prev = byId.get(c.inventory_item_id);
    byId.set(c.inventory_item_id, {
      inventory_item_id: c.inventory_item_id,
      quantity: (prev?.quantity || 0) + c.quantity,
    });
  }
  return [...byId.values()];
}

export function loadHistory(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// entry = { previewKey, promptVersion, selections, caption, image } → เติม id / createdAt แล้วเก็บไว้บนสุด
// คืน history ใหม่ (ถ้าเก็บลง localStorage ไม่ได้ ยังคืน list ให้ใช้ในหน้านี้ได้ แค่ refresh แล้วหาย)
export async function addToHistory(userId, entry) {
  const smallImage = await shrinkImage(entry.image);
  const item = {
    ...entry,
    image: smallImage,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  let list = [item, ...loadHistory(userId)].slice(0, MAX_ITEMS);

  // พื้นที่เต็ม (QuotaExceededError) → ลบอันเก่าสุดทีละรูปแล้วลองใหม่
  while (list.length > 0) {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(list));
      break;
    } catch {
      if (list.length === 1) break;
      list = list.slice(0, -1);
    }
  }
  return list;
}

// ย่อรูปด้วย <canvas> → webp คุณภาพ 0.8 · ย่อไม่ได้ (browser เก่า) ใช้รูปเดิม
function shrinkImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, IMAGE_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/webp", 0.8));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
