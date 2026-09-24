import { useState } from "react";
import { Flower2, X, Eye, EyeOff } from "lucide-react";
import { api } from "../../context/AuthContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage({ isOpen, onClose, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      resetForm();
      onSwitchToLogin?.();
    } catch (err) {
      const backendErrorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(backendErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create account"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] rounded-xl border border-[#e4e2e2] bg-background p-5 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)] md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral hover:opacity-75"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col items-center gap-1">
          <Flower2 className="h-9 w-[30px] text-primary" />
          <p className="text-center font-display text-2xl text-primary">
            Atelier de Flora
          </p>
          <p className="text-center font-body text-sm text-[#929b91]">
            Create Your Account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 flex w-full flex-col gap-4 md:mt-6"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-1">
              <label
                htmlFor="register-firstname"
                className="font-body text-sm text-primary"
              >
                First Name
              </label>
              <input
                id="register-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Flora"
                className="h-10 w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-4 font-body text-sm text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label
                htmlFor="register-lastname"
                className="font-body text-sm text-primary"
              >
                Last Name
              </label>
              <input
                id="register-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Bloom"
                className="h-10 w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-4 font-body text-sm text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="register-email"
              className="font-body text-sm text-primary"
            >
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="h-10 w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-4 font-body text-sm text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="register-password"
              className="font-body text-sm text-primary"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-4 pr-10 font-body text-sm text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
                minLength={MIN_PASSWORD_LENGTH}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:opacity-75"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="register-confirm-password"
              className="font-body text-sm text-primary"
            >
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 w-full rounded-lg border border-[#c4c7c1] bg-tertiary px-4 font-body text-sm text-primary placeholder:text-[#c4c7c1] focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="mt-1 flex h-11 w-full items-center justify-center rounded-lg bg-primary font-body text-sm font-semibold tracking-[0.7px] text-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-3 text-center font-body text-sm text-primary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold underline"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
