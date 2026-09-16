import { useState } from "react";
import { Flower2, X } from "lucide-react";

export default function ForgetPassword({ isOpen, onClose, onCodeSent }) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // ไม่เช็คว่า email มีอยู่จริงไหม (ตั้งใจ ไม่บอกว่า account นี้มีอยู่หรือเปล่า)
    // mock ไปก่อนว่า "ส่ง code แล้ว" แล้วพาไปหน้า Renew ทันที — Albert
    onCodeSent?.(email);
    setEmail("");
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Forget password"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[454px] rounded-3xl bg-background px-12 py-2 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral hover:opacity-75"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col items-center gap-[10px] px-[10px] py-[30px]">
          <Flower2 className="h-[42px] w-9 text-primary" />
          <div className="flex w-full flex-col items-center gap-[10px]">
            <p className="w-full text-center font-display text-[28px] font-bold text-primary">
              Atelier de Flora
            </p>
            <p className="w-full text-center font-body text-base text-primary">
              Please fill your account, we'll send a verification code to
              your email
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-6 p-[10px] pb-8"
        >
          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <label
              htmlFor="forget-email"
              className="w-full font-body text-base text-primary"
            >
              User account
            </label>
            <input
              id="forget-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@example.com"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-body text-sm font-semibold tracking-[0.7px] text-white"
          >
            Reset Password →
          </button>
        </form>
      </div>
    </div>
  );
}
