import { useState } from "react";
import { Flower2, X } from "lucide-react";
import mockUser from "../../assets/mockData/mockUser";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage({ isOpen, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = mockUser.find((u) => u.email === email);

    if (!user || user.password_hash !== password) {
      setError("Invalid email or password.");
      return;
    }

    if (user.status === "suspended") {
      setError("This account has been suspended.");
      return;
    }

    setError("");
    setEmail("");
    setPassword("");
    login(user);
    onClose?.();
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login"
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

        <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6 p-[10px] pb-8">
          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <label htmlFor="login-email" className="w-full font-body text-base text-primary">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@example.com"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex w-full flex-col items-center gap-[10px] py-[10px]">
            <div className="flex w-full items-start justify-between">
              <label htmlFor="login-password" className="font-body text-base text-primary">
                Password
              </label>
              <button
                type="button"
                className="border-b border-black font-body text-base text-primary"
              >
                Forget password?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-[17px] py-[14px] font-body text-base text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <p className="w-full text-center font-body text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-body text-sm font-semibold tracking-[0.7px] text-white"
          >
            Login →
          </button>

          <div className="flex h-[25px] items-center justify-center gap-5">
            <p className="font-body text-base text-primary">Don't have an account ?</p>
            <button type="button" className="font-body text-base text-primary underline">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
