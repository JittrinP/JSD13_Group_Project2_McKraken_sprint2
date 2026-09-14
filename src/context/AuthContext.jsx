import { createContext, useContext, useEffect, useState } from "react";
import mockUser from "../assets/mockData/mockUser";

// วิธีใช้ในหน้าอื่นๆ:
// import { useAuth } from "../context/AuthContext";
// const { user, isLoggedIn, users, login, logout, register, resetPassword } = useAuth();

const AuthContext = createContext(null);
const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // "users" คือรายชื่อ account ทั้งหมดที่ระบบรู้จัก (mock ไว้ก่อน + คนที่สมัครใหม่ระหว่าง session นี้)
  // ตั้งใจไม่ persist ลง localStorage (B-lite) — refresh แล้ว user ที่เพิ่งสมัครจะหายไป รอวันต่อ MongoDB backend จริงค่อยเปลี่ยนเป็น fetch แทน — Albert
  const [users, setUsers] = useState(mockUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function register(newUser) {
    setUsers((prev) => [...prev, newUser]);
  }

  // ใช้กับ flow "ลืมรหัสผ่าน" — ถ้าไม่เจอ email ที่ตรงกันเลย จะไม่ทำอะไร (เงียบๆ)
  // ตั้งใจไม่บอกว่า email มีอยู่จริงไหม เพื่อไม่ leak ข้อมูลว่า email นี้สมัครไว้หรือเปล่า — Albert
  function resetPassword(email, newPasswordHash) {
    setUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === email.toLowerCase()
          ? { ...u, password_hash: newPasswordHash }
          : u,
      ),
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        users,
        login,
        logout,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
