import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // useNavigate เพิ่มมาเพื่อพากลับหน้า Home หลัง logout — Albert
import {
  Menu,
  X,
  Flower2,
  Search,
  User,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // เพิ่มเข้ามาเพื่อเช็คสถานะ login — Albert
import LoginPage from "./login/LoginPage"; // เพิ่มเข้ามาเพื่อ render popup login — Albert
import RegisterPage from "./login/RegisterPage"; // เพิ่มเข้ามาเพื่อ render popup register — Albert
import ForgetPassword from "./login/ForgetPassword"; // เพิ่มเข้ามาเพื่อ render popup ลืมรหัสผ่าน — Albert
import RenewPassword from "./login/RenewPassword"; // เพิ่มเข้ามาเพื่อ render popup ตั้งรหัสผ่านใหม่ — Albert

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // เก็บเป็นค่าเดียว (null | "login" | "register" | "forgot" | "renew") แทน boolean หลายตัว เพื่อสลับไปมาระหว่าง popup ได้ — Albert
  const [authModal, setAuthModal] = useState(null);
  const [resetEmail, setResetEmail] = useState(""); // เก็บ email ระหว่างขั้นตอน ForgetPassword -> RenewPassword — Albert
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // dropdown ของไอคอน User (Dashboard/Logout) — Albert
  const userMenuRef = useRef(null); // อ้างอิง DOM ของกล่อง dropdown เพื่อใช้เช็คว่าคลิกออกนอกเมนูหรือยัง — Albert
  const { isLoggedIn, logout, user } = useAuth(); // เพิ่ม logout/user เข้ามาด้วย เพื่อทำปุ่ม Logout และเช็ค role ตอนเลือกปลายทาง Dashboard — Albert
  // ปุ่ม Dashboard พาไปคนละหน้าตาม role: admin -> admin dashboard, customer -> customer dashboard — Albert
  const dashboardPath = user?.role === "admin" ? "/admindashboard" : "/customerdashboard";
  const navigate = useNavigate(); // ใช้ใน handleLogout เพื่อพากลับหน้า Home — Albert

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // ปิด dropdown เมื่อคลิกนอกเมนู หรือกด Esc — Albert
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate("/"); // logout แล้วพากลับหน้า Home เสมอ กันค้างอยู่หน้า Dashboard — Albert
  };

  return (
    <>
      <header className="bg-background border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="md:hidden text-neutral hover:opacity-75"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 font-display text-xl sm:text-2xl font-semibold text-primary"
            >
              <Flower2 className="w-6 h-6 text-primary hidden md:inline-block" />
              Atelier de Flora
            </Link>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary pb-1 border-b-2"
                    : "text-neutral"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary pb-1 border-b-2"
                    : "text-neutral"
                }
              >
                Product
              </NavLink>

              <NavLink
                to="/shopblog"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary pb-1 border-b-2"
                    : "text-neutral"
                }
              >
                Blog
              </NavLink>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4 ml-8">
              {/* เดิมเป็น Link ไป /customerdashboard เฉยๆ แก้ให้เช็ค login ก่อน ถ้ายังไม่ login ให้เปิด popup แทน — Albert */}
              {/* login แล้ว: เปลี่ยนเป็น dropdown (Dashboard + Logout) แทน Link ตรงๆ — Albert */}
              {isLoggedIn ? (
                // "relative" ทำให้เป็นจุดอ้างอิงตำแหน่งของ dropdown ข้างล่าง, "flex items-center" กันไม่ให้ไอคอนขยับตำแหน่งแนวตั้งเมื่อเทียบกับตอนยังไม่ login — Albert
                <div className="relative flex items-center" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)} // กดสลับเปิด/ปิด dropdown แทนที่จะ Link ตรงไปหน้า Dashboard เหมือนเดิม — Albert
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                    className="text-neutral hover:opacity-75"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* top-full ให้เด้งลงมาใต้ปุ่มเสมอ (ถ้าไม่มี ตำแหน่งเริ่มต้นจะค้างอยู่แถวเดียวกับปุ่ม ทับกับเมนู Home/Products/Blog) — Albert */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-gray-200/80 bg-background py-1 shadow-lg">
                      <Link
                        to={dashboardPath} // ปลายทางเปลี่ยนตาม role ของ user (ดู dashboardPath ด้านบน) — Albert
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral hover:bg-black/5"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout} // logout + ปิด dropdown + พากลับหน้า Home ในทีเดียว — Albert
                        className="block w-full px-4 py-2 text-left text-sm text-neutral hover:bg-black/5"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModal("login")} // เพิ่มปุ่มเปิด popup login — Albert
                  className="text-neutral hover:opacity-75"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
              <Link to="/cart" className="text-neutral hover:opacity-75">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[80vw] bg-secondary z-50 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 font-display text-2xl font-semibold text-primary">
              <Flower2 className="w-6 h-6 text-primary" />
              Menu
            </div>
            <button
              onClick={closeMenu}
              className="text-neutral hover:opacity-75 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 font-medium">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral hover:bg-black/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Home</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral hover:bg-black/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Products</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink
              to="/shopblog"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral hover:bg-black/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Blog</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            {/* เพิ่มรายการ Account/Login ในเมนูมือถือ เดิมไม่มีทางเข้าถึง login จากมือถือเลย — Albert */}
            {isLoggedIn ? (
              <>
                {/* มือถือไม่มี dropdown เหมือน desktop เลยแสดง Dashboard/Logout เป็น 2 แถวแยกกันตรงๆ ในเมนูสไลด์ออกแทน — Albert */}
                <NavLink
                  to={dashboardPath} // ปลายทางเปลี่ยนตาม role เหมือนฝั่ง desktop — Albert
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral hover:bg-black/5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Account</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu(); // ปิดเมนูมือถือก่อน แล้วค่อย logout (ใช้ handleLogout ตัวเดียวกับ desktop) — Albert
                    handleLogout();
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-neutral hover:bg-black/5"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setAuthModal("login"); // เปิด popup login พร้อมปิดเมนูมือถือ — Albert
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-neutral hover:bg-black/5"
              >
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* เพิ่ม popup login/register เข้ามาใน Navbar เพื่อให้กดจากไอคอน User ได้ทั้งมือถือและเดสก์ท็อป — Albert */}
      {/* authModal เป็นตัวคุมว่าจะโชว์ popup ไหน สลับไป Register จาก Login ได้ (และย้อนกลับ) — Albert */}
      <LoginPage
        isOpen={authModal === "login"}
        onClose={() => setAuthModal(null)}
        onSwitchToRegister={() => setAuthModal("register")}
        onForgotPassword={() => setAuthModal("forgot")}
      />
      <RegisterPage
        isOpen={authModal === "register"}
        onClose={() => setAuthModal(null)}
        onSwitchToLogin={() => setAuthModal("login")}
      />
      <ForgetPassword
        isOpen={authModal === "forgot"}
        onClose={() => setAuthModal(null)}
        onCodeSent={(email) => {
          setResetEmail(email);
          setAuthModal("renew");
        }}
      />
      <RenewPassword
        isOpen={authModal === "renew"}
        onClose={() => setAuthModal(null)}
        email={resetEmail}
        onSwitchToLogin={() => setAuthModal("login")}
      />
    </>
  );
}
