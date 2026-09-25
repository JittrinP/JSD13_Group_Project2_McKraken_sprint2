import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower2, ImagePlus, SendHorizontal, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { askAI, getPreviewQuota } from "../lib/aiApi";

// AI chatbot (Ask AI) — ปุ่มลอยมุมขวาล่าง กดแล้วเปิดกล่องแชท
// backend: POST /api/v1/ai/ask ดู AI_CHATBOT_PLAN.md ข้อ 5 ใน repo backend
// - ต้อง login ก่อนถึงถามได้ (AI ตอบเรื่องตะกร้า / ช่อที่เซฟของคนที่ถามได้)
// - จำบทสนทนาไว้ใน state (ไม่เก็บลง DB / localStorage) refresh หน้าแล้วแชทหาย
// - logout แล้วล้างแชท กันคนถัดไปที่ใช้เครื่องเดียวกันเห็นข้อมูลของคนก่อน

const MAX_QUESTION_LENGTH = 500; // ต้องตรงกับ backend
const HISTORY_SIZE = 6; // ส่งข้อความล่าสุดกี่อันไปให้ AI จำ (backend ก็ตัดที่ 6)

// ปุ่มคำถามตัวอย่างตอนยังไม่มีแชท กดแล้วส่งเลย
const EXAMPLE_QUESTIONS = [
  "ช่อขายดีมีอะไรบ้าง",
  "ช่วยจัดช่อ custom ให้แม่ งบ 800 พร้อมรูปตัวอย่าง",
  "ตะกร้าของฉันรวมเท่าไหร่",
  "ช่อที่ฉันเซฟไว้มีอะไรบ้าง",
];
const MAX_WHO_LENGTH = 50; // ช่อง "ให้ใคร / โอกาส" ในฟอร์มจัดช่อ

// Gemini ชอบใส่ **ตัวหนา** แบบ markdown มา แต่เราแสดงเป็นข้อความธรรมดา เลยเอาเครื่องหมายออก
// กันอีกชั้น: ถ้ามีคำว่า DESIGN_JSON (ข้อมูลช่อสำหรับปุ่ม Generate preview) หลุดมา ตัดตั้งแต่ตรงนั้นทิ้ง
// ปกติ backend ตัดให้แล้ว ลูกค้าไม่ควรเห็นข้อความนี้เลย
function cleanAnswer(text) {
  const designIndex = text.search(/DESIGN_JSON/i);
  const visible = designIndex === -1 ? text : text.slice(0, designIndex);
  return visible.replace(/\*\*/g, "").replace(/```(json)?/g, "").trim();
}

// แปลง error จาก axios เป็นข้อความที่ลูกค้าอ่านรู้เรื่อง
function errorMessage(err) {
  const status = err.response?.status;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 429) return "You're asking too fast. Please wait a moment and try again.";
  return "Something went wrong. Please try again.";
}

export default function ChatWidget() {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // { role: "user" | "assistant", text, sources?, isFallback? }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // AI Preview ในแชท (ดู AI_PREVIEW_PLAN.md ใน backend ข้อ 6.2)
  const [previewQuota, setPreviewQuota] = useState(null); // { limit, remaining }
  const [confirmDesign, setConfirmDesign] = useState(null); // ช่อที่กำลังถามยืนยันก่อนสร้างรูป
  const [showDesignForm, setShowDesignForm] = useState(false); // ฟอร์ม 2 ช่อง (ให้ใคร + งบ)
  const [designWho, setDesignWho] = useState("");
  const [designBudget, setDesignBudget] = useState("");
  const [designHint, setDesignHint] = useState(""); // AI จัดช่อไม่ได้ → แนะนำให้ปรับงบ

  // ช่อล่าสุดที่ AI แนะนำในแชทนี้ (ใช้กับปุ่มถาวร "Design + preview")
  const latestDesign = [...messages].reverse().find((m) => m.design)?.design || null;

  // เปิดแชท → เช็คโควตารูปที่เหลือวันนี้ (โชว์ใน badge / กล่องยืนยัน)
  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;
    getPreviewQuota()
      .then(setPreviewQuota)
      .catch(() => setPreviewQuota(null));
  }, [isOpen, isLoggedIn]);

  // logout → ล้างแชท (ข้อมูลตะกร้า / ช่อที่เซฟอยู่ในคำตอบ ห้ามค้างให้คนต่อไปเห็น)
  useEffect(() => {
    if (!isLoggedIn) {
      setMessages([]);
      setInput("");
      setError("");
      setConfirmDesign(null);
      setShowDesignForm(false);
      setDesignHint("");
    }
  }, [isLoggedIn]);

  // มีข้อความใหม่ / กำลังรอคำตอบ → เลื่อนลงล่างสุดเอง
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // กด Esc ปิดกล่องแชท
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // คืน design ที่ AI แนะนำ (หรือ null) ให้ฟอร์มจัดช่อเอาไปเปิดกล่องยืนยันต่อ
  async function sendQuestion(rawQuestion) {
    const question = rawQuestion.trim();
    if (!question || loading) return null;

    // history = แชทก่อนหน้า (ยังไม่รวมคำถามนี้) ไม่ส่งข้อความสำรองตอน AI ล่ม เพราะไม่มีประโยชน์ให้ AI จำ
    const history = messages
      .filter((m) => !m.isFallback)
      .slice(-HISTORY_SIZE)
      .map(({ role, text }) => ({ role, text }));

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { answer, sources, design } = await askAI(question, history);
      setMessages((prev) => [
        ...prev,
        answer
          ? { role: "assistant", text: cleanAnswer(answer), sources, design: design || null }
          : {
              // AI ตอบไม่สำเร็จ แต่ backend ยังส่งสินค้าที่น่าจะเกี่ยวมาให้
              role: "assistant",
              // backend ลอง model สำรองครบแล้วยังไม่ได้ = ส่วนใหญ่ Google ล่มชั่วคราว (503 high demand)
              text: "The AI is very busy right now. Please try again in a moment. Here are some items that might help.",
              sources,
              isFallback: true,
            },
      ]);
      return answer ? design || null : null;
    } catch (err) {
      setError(errorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ปุ่มถาวร "Design + preview": มีช่อที่ AI แนะนำแล้ว → ยืนยันเลย / ยังไม่มี → ฟอร์ม 2 ช่อง
  function handleDesignButton() {
    setDesignHint("");
    if (latestDesign) setConfirmDesign(latestDesign);
    else setShowDesignForm(true);
  }

  // ฟอร์ม 2 ช่อง → ส่งเป็นคำถามปกติ (ใช้ rate limit ของ /ask ไม่หักโควตารูป) → มีช่อ → เปิดกล่องยืนยันต่อให้
  async function handleDesignForm(e) {
    e.preventDefault();
    const who = designWho.trim();
    const budget = Number(designBudget);
    if (!who || !Number.isInteger(budget) || budget < 1) return;
    setShowDesignForm(false);
    const design = await sendQuestion(`ช่วยจัดช่อ custom ให้${who} งบ ${budget} บาท`);
    if (design) setConfirmDesign(design);
    else setDesignHint("AI couldn't arrange a bouquet this time. Try another budget or occasion.");
  }

  // ยืนยัน → ปิดแชท ไปหน้า Home ส่วน Custom design เติมตัวเลือก (+ สร้างรูปถ้ายังมีโควตา)
  // Customdesign.jsx อ่าน location.state.aiDesign แล้วเรียก preview.generate() ตัวเดียวกับปุ่ม Preview
  function openInDesigner(design, autoPreview) {
    setConfirmDesign(null);
    setIsOpen(false);
    navigate("/", { state: { aiDesign: design, autoPreview } });
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuestion(input);
  }

  // Enter = ส่ง / Shift+Enter = ขึ้นบรรทัดใหม่
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(input);
    }
  }

  return (
    <>
      {/* ปุ่มลอยมุมขวาล่าง (z-40 ต่ำกว่า popup login / QR ที่เป็น z-50 จะได้ไม่บังกัน) */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close Ask AI" : "Open Ask AI"}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:cursor-pointer active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {/* กล่องแชท — mobile: เต็มจอ / lg: กล่องลอยเหนือปุ่ม */}
      {isOpen && (
        <section
          aria-label="Ask AI chat"
          className="fixed inset-0 z-50 flex flex-col bg-background text-neutral lg:inset-auto lg:bottom-22 lg:right-4 lg:h-130 lg:w-90 lg:rounded-2xl lg:border lg:border-[#929B91]/30 lg:shadow-2xl"
        >
          {/* หัวกล่อง */}
          <header className="flex items-center justify-between border-b border-[#929B91]/30 px-4 py-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold">Ask AI</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Ask AI"
              className="rounded-full p-1 text-neutral/70 hover:cursor-pointer hover:bg-secondary hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {!isLoggedIn ? (
            // ยังไม่ login: ไม่เรียก API เลย
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <Sparkles className="h-10 w-10 text-primary/60" />
              <p className="font-body text-sm text-neutral/80">
                Please log in to use Ask AI. Use the Login button at the top of the page.
              </p>
            </div>
          ) : (
            <>
              {/* รายการข้อความ */}
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 font-body text-sm">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="rounded-2xl bg-secondary px-4 py-3 text-neutral/90">
                      Hi! Ask me about our bouquets, custom designs, prices, or your cart.
                      You can ask in Thai or English.
                      <br />
                      Tap <b>Design + preview</b> and I'll arrange a bouquet and show you a photo
                      ({previewQuota?.limit ?? 3} per day).
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => sendQuestion(q)}
                          className="rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary hover:cursor-pointer hover:bg-primary hover:text-white"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* whitespace-pre-line = ขึ้นบรรทัดใหม่ตาม \n ในคำตอบ (บรรทัดคิดราคาของ AI) */}
                    <p
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 ${
                        m.role === "user"
                          ? "rounded-br-sm bg-primary text-white"
                          : "rounded-bl-sm bg-secondary text-neutral/90"
                      }`}
                    >
                      {m.text}
                    </p>

                    {/* AI แนะนำช่อ custom (backend ตรวจแล้ว) → ปุ่มสร้างรูป */}
                    {m.design && (
                      <button
                        type="button"
                        onClick={() => {
                          setDesignHint("");
                          setConfirmDesign(m.design);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:cursor-pointer hover:bg-primary hover:text-white"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        Generate preview
                      </button>
                    )}

                    {/* การ์ดสินค้า / วัตถุดิบที่ AI พูดถึง */}
                    {m.sources?.length > 0 && (
                      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                        {m.sources.map((s) => (
                          <SourceCard key={s._id} source={s} onOpen={() => setIsOpen(false)} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <p className="w-fit animate-pulse rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-neutral/60">
                    Typing...
                  </p>
                )}
                {error && <p className="text-center text-xs text-destructive">{error}</p>}
                {designHint && <p className="text-center text-xs text-neutral/70">{designHint}</p>}
                <div ref={bottomRef} />
              </div>

              {/* กล่องยืนยันก่อนสร้างรูป */}
              {confirmDesign && (
                <DesignConfirm
                  design={confirmDesign}
                  quota={previewQuota}
                  onConfirm={() => openInDesigner(confirmDesign, true)}
                  onOpenOnly={() => openInDesigner(confirmDesign, false)}
                  onCancel={() => setConfirmDesign(null)}
                />
              )}

              {/* ฟอร์ม 2 ช่อง: ให้ AI จัดช่อ (ตอนยังไม่มีช่อที่ AI แนะนำ) */}
              {showDesignForm && !confirmDesign && (
                <form
                  onSubmit={handleDesignForm}
                  className="space-y-2 border-t border-[#929B91]/30 bg-secondary px-4 py-3 font-body text-sm"
                >
                  <p className="font-semibold text-primary">Let AI arrange a bouquet</p>
                  <input
                    value={designWho}
                    onChange={(e) => setDesignWho(e.target.value)}
                    maxLength={MAX_WHO_LENGTH}
                    required
                    placeholder="For whom / occasion (e.g. Mom's birthday)"
                    className="w-full rounded-xl border border-[#929B91]/40 bg-white px-3 py-2 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={designBudget}
                    onChange={(e) => setDesignBudget(e.target.value)}
                    required
                    placeholder="Budget (฿)"
                    className="w-full rounded-xl border border-[#929B91]/40 bg-white px-3 py-2 focus:border-primary focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDesignForm(false)}
                      className="rounded-full px-3 py-1.5 text-xs text-neutral/70 hover:cursor-pointer hover:text-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:cursor-pointer hover:opacity-90 disabled:opacity-40"
                    >
                      Ask AI to arrange
                    </button>
                  </div>
                </form>
              )}

              {/* ปุ่มถาวร: บอกลูกค้าว่ามี feature นี้ตั้งแต่เปิดแชท */}
              {!confirmDesign && !showDesignForm && (
                <div className="flex justify-start border-t border-[#929B91]/30 px-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDesignButton}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-body text-xs font-semibold text-primary hover:cursor-pointer hover:bg-primary hover:text-white disabled:opacity-40"
                  >
                    🌸 Design + preview
                    {previewQuota && (
                      <span className="font-normal opacity-70">
                        {previewQuota.remaining}/{previewQuota.limit}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* ช่องพิมพ์ */}
              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2 border-t border-[#929B91]/30 p-3"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={MAX_QUESTION_LENGTH}
                  rows={1}
                  placeholder="Ask anything about our flowers..."
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-[#929B91]/40 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </>
  );
}

// กล่องยืนยันก่อนสร้างรูป: สรุปช่อ + ราคาจริงจาก backend + โควตาที่เหลือวันนี้
// (ไม่ใช้ window.confirm เพราะโชว์รายละเอียด / ปุ่มหลายแบบไม่ได้)
function DesignConfirm({ design, quota, onConfirm, onOpenOnly, onCancel }) {
  const noQuota = quota?.remaining === 0;
  return (
    <div className="space-y-2 border-t border-[#929B91]/30 bg-secondary px-4 py-3 font-body text-sm">
      <p className="font-semibold text-primary">Create a preview photo of this bouquet?</p>
      <ul className="space-y-0.5 text-xs text-neutral/90">
        <li>Base: {design.base.name}</li>
        {design.flowers.map((f) => (
          <li key={f._id}>
            {f.name} × {f.quantity}
          </li>
        ))}
      </ul>
      <p className="text-xs text-neutral/70">
        Total ฿{design.price.total} (ingredients ฿{design.price.ingredients} + service fee ฿
        {design.price.service_fee}, delivery not included)
      </p>
      <p className="text-xs text-neutral/70">
        {noQuota
          ? "You have used all previews for today. Try again tomorrow."
          : quota
            ? `Previews left today: ${quota.remaining}/${quota.limit} · takes up to a minute`
            : "Takes up to a minute."}
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1.5 text-xs text-neutral/70 hover:cursor-pointer hover:text-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onOpenOnly}
          className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:cursor-pointer hover:bg-primary hover:text-white"
        >
          Open in designer
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={noQuota}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate preview
        </button>
      </div>
    </div>
  );
}

// การ์ดเล็กใต้คำตอบ: สินค้าสำเร็จรูป → ไปหน้า Products / วัตถุดิบ → ไปหน้า Home (มีส่วน custom design)
// ยังไม่มีหน้า /products/:id เลยพาไปหน้ารวมก่อน
function SourceCard({ source, onOpen }) {
  const isProduct = source.type === "product";
  return (
    <Link
      to={isProduct ? "/products" : "/"}
      onClick={onOpen}
      className="flex w-40 shrink-0 items-center gap-2 rounded-xl border border-[#929B91]/30 bg-white p-2 hover:border-primary"
    >
      {source.image ? (
        <img src={source.image} alt={source.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          <Flower2 className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-neutral">{source.name}</p>
        <p className="text-xs text-neutral/60">
          ฿{source.price}
          {isProduct ? "" : " / unit"}
        </p>
      </div>
    </Link>
  );
}
