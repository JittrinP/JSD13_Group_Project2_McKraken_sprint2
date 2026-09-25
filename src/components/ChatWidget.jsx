import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flower2, SendHorizontal, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { askAI } from "../lib/aiApi";

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
  "ช่วยจัดช่อ custom ให้แม่ งบ 800",
  "ตะกร้าของฉันรวมเท่าไหร่",
  "ช่อที่ฉันเซฟไว้มีอะไรบ้าง",
];

// Gemini ชอบใส่ **ตัวหนา** แบบ markdown มา แต่เราแสดงเป็นข้อความธรรมดา เลยเอาเครื่องหมายออก
function cleanAnswer(text) {
  return text.replace(/\*\*/g, "");
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

  // logout → ล้างแชท (ข้อมูลตะกร้า / ช่อที่เซฟอยู่ในคำตอบ ห้ามค้างให้คนต่อไปเห็น)
  useEffect(() => {
    if (!isLoggedIn) {
      setMessages([]);
      setInput("");
      setError("");
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

  async function sendQuestion(rawQuestion) {
    const question = rawQuestion.trim();
    if (!question || loading) return;

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
      const { answer, sources } = await askAI(question, history);
      setMessages((prev) => [
        ...prev,
        answer
          ? { role: "assistant", text: cleanAnswer(answer), sources }
          : {
              // AI ตอบไม่สำเร็จ แต่ backend ยังส่งสินค้าที่น่าจะเกี่ยวมาให้
              role: "assistant",
              text: "Sorry, the AI can't answer right now. Here are some items that might help.",
              sources,
              isFallback: true,
            },
      ]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
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
                <div ref={bottomRef} />
              </div>

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
