// หน้าตาของรูป AI preview ในหน้า Custom design (logic อยู่ใน useDesignPreview.js)

// รูป AI + caption (จำนวนจริงที่เลือก) + ป้ายเตือนถ้ารูปไม่ตรงกับช่อปัจจุบัน
export function PreviewImage({ entry, isStale, isFromHistory, isGenerating, onRegenerate, onShow3D }) {
  const { caption } = entry;
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative">
        <img
          src={entry.image}
          alt={`AI preview: ${caption.flowers.map((f) => `${f.quantity} ${f.name}`).join(", ")}`}
          className="w-full aspect-square object-cover rounded-3xl"
        />
        <button
          onClick={onShow3D}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-secondary/90 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary hover:text-[#FBF9F8] transition-all cursor-pointer"
        >
          View 3D
        </button>
        {isStale && (
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-amber-50/95 border border-amber-300 px-4 py-2 text-xs text-amber-800">
            This photo is for your previous selection. Tap <b>Preview</b> to see the current bouquet.
          </div>
        )}
      </div>

      {/* caption: จำนวนจริง (AI นับดอกไม่เป๊ะ ต้องบอกของจริงเสมอ) */}
      <div className="px-4 py-3 text-xs sm:text-sm text-neutral space-y-1">
        <p>
          <span className="font-semibold text-primary">Size {caption.size}</span>
          {" · "}
          {caption.base}
        </p>
        <p>{caption.flowers.map((f) => `${f.name} × ${f.quantity}`).join(" · ")}</p>
        <p className="text-neutral/60">
          AI-generated preview · the number of flowers may differ slightly.
          {isFromHistory && !isStale && (
            <>
              {" "}
              <button
                onClick={onRegenerate}
                disabled={isGenerating}
                className="underline text-primary hover:opacity-80 cursor-pointer disabled:opacity-50"
              >
                Generate a new one
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// โชว์ทับกรอบรูประหว่างรอ AI (10–60 วิ)
export function PreviewLoading() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-secondary/85 rounded-3xl text-primary text-sm text-center px-6">
      <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="font-semibold">Arranging your bouquet…</p>
      <p className="text-xs text-neutral">This can take up to a minute.</p>
    </div>
  );
}

// แถบรูปเล็กของ history · กดแล้วโชว์รูปนั้น + เปลี่ยนตัวเลือกกลับเป็นช่อนั้น
export function PreviewHistory({ history, shownId, onPick }) {
  if (history.length === 0) return null;
  return (
    <div className="w-full px-4 pb-4">
      <p className="text-xs text-neutral/70 mb-2">Your previews</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onPick(entry)}
            title={entry.caption.flowers.map((f) => `${f.name} × ${f.quantity}`).join(", ")}
            className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
              entry.id === shownId ? "border-primary" : "border-transparent hover:border-primary/40"
            }`}
          >
            <img src={entry.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
