import { useState } from "react";
import { Flower2, X } from "lucide-react";
// Import api แทน useAuth
import { api } from "../../context/AuthContext";

const MIN_PASSWORD_LENGTH = 8;

export default function RenewPassword({
  isOpen,
  onClose,
  email,
  onSwitchToLogin,
}) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // เช็คความถูกต้องของรหัสผ่านฝั่งหน้าบ้าน
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // ส่งข้อมูลทั้ง 3 ตัวไปให้ Backend ตรวจสอบ
      await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      // ถ้า Backend ตอบกลับ 200 (สำเร็จ) ให้ล้างฟอร์มแล้วพาไปหน้า Login
      resetForm();
      onSwitchToLogin?.();
    } catch (err) {
      // ถ้า Code ผิด หรือหมดเวลา Backend จะส่ง Error กลับมา
      setError(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
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
        aria-label="Change password"
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
              Welcome to
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-6 p-[10px] pb-8"
        >
          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <label
              htmlFor="renew-code"
              className="w-full font-body text-base text-primary"
            >
              Verification Code
            </label>
            <input
              id="renew-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <label
              htmlFor="renew-new-password"
              className="w-full font-body text-base text-primary"
            >
              New Password
            </label>
            <input
              id="renew-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
          </div>

          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <label
              htmlFor="renew-confirm-password"
              className="w-full font-body text-base text-primary"
            >
              Re-New Password
            </label>
            <input
              id="renew-confirm-password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
          </div>

          {error && (
            <p className="w-full text-center font-body text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-body text-sm font-semibold tracking-[0.7px] text-white"
          >
            {isLoading ? "Changing Password..." : "Change Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}
