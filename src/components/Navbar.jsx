import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // เพิ่ม state คุมเปิด/ปิด popup login — Albert
  const { isLoggedIn } = useAuth(); // เพิ่มเข้ามาเพื่อสลับ UI ตามสถานะ login — Albert

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
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
              {isLoggedIn ? (
                <Link
                  to="/customerdashboard"
                  className="text-neutral hover:opacity-75"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)} // เพิ่มปุ่มเปิด popup login — Albert
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
              <NavLink
                to="/customerdashboard"
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
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setIsLoginOpen(true); // เปิด popup login พร้อมปิดเมนูมือถือ — Albert
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-neutral hover:bg-black/5"
              >
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* เพิ่ม popup login เข้ามาใน Navbar เพื่อให้กดจากไอคอน User ได้ทั้งมือถือและเดสก์ท็อป — Albert */}
      <LoginPage isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
