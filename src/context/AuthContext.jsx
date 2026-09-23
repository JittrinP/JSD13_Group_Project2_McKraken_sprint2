import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// 1. สร้าง Instance ของ Axios เพื่อตั้งค่าให้แนบ Cookie อัตโนมัติ
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://mckraken-sprint3-backend.onrender.com/api/v1", // เปลี่ยนเป็น Port Backend ของคุณ
  withCredentials: true, // ถ้าไม่เปิดตัวนี้ Cookie จะไม่ถูกส่งไป Backend
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // เมื่อผู้ใช้เปิดเว็บขึ้นมา ให้ยิงไปถาม Backend ทันทีว่ามี Cookie / ล็อกอินอยู่ไหม
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 🚨 1. จุดแก้ลูปนรก: ถ้า URL ที่ยิงไปคือ /auth/refresh แล้วพัง ให้หยุดทันที!
        if (originalRequest.url.includes("/auth/refresh")) {
          setUser(null);
          return Promise.reject(error);
        }

        // 2. ถ้าเป็นเส้นทางอื่นพังด้วย 401 และยังไม่ได้ลอง retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await api.post("/auth/refresh");
            return api(originalRequest);
          } catch (refreshError) {
            setUser(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
    // -------------------------------------------------------------------------

    const fetchMe = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        // ถ้าไม่มี Cookie, หมดอายุ หรือยังไม่ล็อกอิน Backend จะส่ง Error กลับมา
        setUser(null);
      } finally {
        setIsAppLoading(false); // โหลดเสร็จแล้ว ปิดหน้าจอโหลด
      }
    };

    fetchMe();

    // ล้างตัว Interceptor ทิ้งเมื่อ Component ถูกปิด เพื่อไม่ให้มันทำงานซ้อนกันหลายรอบ
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ฟังก์ชัน Login (จะถูกเรียกใช้ในหน้า LoginPage)
  async function login(email, password) {
    // ยิง API ไปหา Backend
    const response = await api.post("/auth/login", { email, password });
    // ถ้าสำเร็จ Backend จะฝัง Cookie ให้เบราว์เซอร์อัตโนมัติ
    // เราแค่เอาข้อมูล Profile มาเก็บลง State
    setUser(response.data.user);
    return response.data;
  }

  // ฟังก์ชัน Logout (จะถูกเรียกใช้ใน Header หรือปุ่ม Logout)
  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null); // ล้าง State User
    }
  }

  // ไม่ต้องใช้ mockUser และไม่ส่งฟังก์ชัน register/resetPassword เข้า Context แล้ว
  // เพราะฟังก์ชันพวกนั้นไม่ต้องเก็บ State ส่วนกลาง (ให้ยิง API ตรงๆ จากหน้าเพจเลย)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAppLoading,
        login,
        logout,
      }}
    >
      {/* ถ้ากำลังเช็ค /me อยู่ ให้แอบ render หน้าจอเปล่าๆ หรือ Loading Spinner ไปก่อน */}
      {isAppLoading ? (
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
