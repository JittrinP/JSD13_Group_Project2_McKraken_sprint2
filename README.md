# Atelier de Flora — Frontend 🌸

ร้านดอกไม้ออนไลน์ของทีม **McKraken** (JSD#13 Group Project, กลุ่ม GP02)
ซื้อช่อดอกไม้สำเร็จรูป, **ออกแบบช่อเอง (custom design)** พร้อม preview 3D และ **AI Preview (รูปช่อสมจริง)**, มี **AI chatbot "Ask AI"** ช่วยแนะนำ / จัดช่อตามงบ

| | ลิงก์ |
|---|---|
| เว็บจริง (Vercel) | https://jsd-13-group-project2-mc-kraken-spr.vercel.app |
| Backend API (Render) | https://mckraken-sprint3-backend.onrender.com/api/v1 |
| Backend repo | https://github.com/JittrinP/McKraken_sprint3_Backend |
| Presentation | https://github.com/Mali-r/GP02-Data-system |

---

## Feature

### ลูกค้า (customer)
| Feature | หน้า / component | รายละเอียด |
|---|---|---|
| สมัคร / Login / ลืมรหัสผ่าน / ตั้งรหัสใหม่ | `components/login/*` | เปิดเป็น popup จาก Navbar, ใช้ cookie (httpOnly) + refresh token อัตโนมัติ |
| หน้าแรก | `pages/HomePage` | Custom design, Curated collections (สินค้า popular), Care guide, รีวิวลูกค้า, Shop blog |
| **Custom design** | `HomePage/_components/Customdesign.jsx` | เลือก base (กระดาษห่อ/แจกัน) + ดอกไม้ 3 ชนิด + จำนวน, preview 3D (`@google/model-viewer`, ลากหมุนได้), **Save เป็น preset 1–5**, Add to cart |
| **AI Preview** | `useDesignPreview.js`, `PreviewPanel.jsx`, `lib/previewHistory.js` | ปุ่ม **Preview** ข้างปุ่ม Save → AI สร้างรูปช่อสมจริงแทนโมเดล 3D (ต้อง login, **3 รูป/วัน**) · caption บอกจำนวนดอกจริง · เปลี่ยนตัวเลือกหลัง preview → ป้ายเตือน "รูปไม่ตรงกับช่อ" · history 10 รูปล่าสุด (กดเพื่อดู + เติมตัวเลือกกลับ, ช่อเดิมไม่เสียโควตา) · **Save แล้วรูปติดไปกับช่อ** (เห็นใน Custom List) |
| สินค้า | `pages/Products` | ค้นหา + filter ตามประเภท / curated collections |
| ตะกร้า | `pages/CartPage.jsx` | เพิ่ม/ลดจำนวน, ลบ, gift note (สูงสุด 200 ตัวอักษร) — **ราคาคิดที่ backend** · ช่อ custom ที่เซฟพร้อมรูปแสดงรูป AI *(PR `custom-image-order` รอ merge)* |
| Checkout + จ่ายเงิน | `pages/CheckoutPage.jsx`, `PaymentQRModal.jsx` | สรุปยอด (ค่าบริการช่อ custom ฿100/ช่อ, ค่าส่ง ฿10) → QR **PromptPay ผ่าน Stripe** → รอสถานะ succeeded |
| Customer dashboard | `pages/customer_dashboard` | บัญชี, ที่อยู่จัดส่ง (CRUD), **ช่อที่เซฟไว้** พร้อมรูป AI (แก้ไข / ลบ / ใส่ตะกร้า), ประวัติการสั่งซื้อ (ยกเลิกได้ตอน pending / processing) |
| Shop blog | `pages/ShopBlogPage.jsx` | บทความดูแลดอกไม้ ฯลฯ |
| **Ask AI chatbot** | `components/ChatWidget.jsx` | ปุ่มลอยมุมขวาล่าง (ต้อง login) ถามสินค้า/ราคา, **"ช่วยจัดช่อ custom งบ X"** (มีฟอร์ม 2 ช่อง: ให้ใคร/โอกาส + งบ), ถามตะกร้า/ช่อที่เซฟของตัวเอง, จำบทสนทนา · AI แนะนำช่อแล้วมีปุ่ม **Generate preview** → พาไปหน้า Custom design เติมตัวเลือกให้ + สร้างรูปอัตโนมัติ |

### แอดมิน (admin)
| Feature | component | รายละเอียด |
|---|---|---|
| Overview | `admin_dashboard/_components/Overview.jsx` | การ์ด 4 ใบ (Total Sales / Customers / Flower Stock / Orders), กราฟ Sale Statistic (7 / 30 / 90 วัน), Shipment Status, Top 5 Flowers, Recent Order (recharts) — *การ์ด + กราฟยอดขาย: PR `sprint3-admin-dashboard` รอ merge* |
| จัดการสินค้า | `ProductEdit.jsx` | CRUD สินค้า (แท็บ Products), วัตถุดิบ (แท็บ Inventory), **ปุ่ม Sync AI** |
| รายการ order | `OrderList.jsx` | ดู / ค้นหา / กรอง / เปลี่ยนสถานะ / ลบ order (แบ่งหน้า) |
| จัดการ content | `ContentEdit.jsx` | จัดการบทความ blog |

### สถานะการต่อ API (ณ 2026-09-26)
| ส่วน | สถานะ |
|---|---|
| Auth, สินค้า, ตะกร้า, custom design, AI Preview, ที่อยู่, รีวิว, blog (หน้าลูกค้า), payment, order (Purchases), AI chatbot | ✅ ต่อ API จริง |
| Admin Overview, OrderList, ProductEdit (รวมแท็บ Inventory) | ✅ ต่อ API จริง |
| Admin ContentEdit | ⏳ ยังใช้ mock data (`src/assets/mockData`) |

---

## Tech stack

| ส่วน | ใช้ |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 (`createBrowserRouter`) |
| Styling | Tailwind CSS v4 (mobile-first, breakpoint หลัก `lg`), shadcn/ui, tw-animate-css |
| HTTP | axios (instance `api` ใน `AuthContext` — แนบ cookie + refresh token อัตโนมัติ) และ `fetch` บางส่วน |
| Form | react-hook-form + zod |
| Chart | recharts (หน้า admin) |
| 3D | `@google/model-viewer` (preview ช่อดอกไม้ `flower.glb`) |
| AI | เรียกผ่าน backend ทั้งหมด (Gemini สำหรับแชท, Cloudflare FLUX.2 สำหรับรูป) — frontend ไม่มี API key |
| เก็บในเครื่อง | `localStorage` — history รูป AI preview (ย่อเป็น webp 640px ด้วย `<canvas>`, แยกตาม user) |
| Icon | lucide-react, hugeicons |
| Lint | oxlint |
| Deploy | Vercel (`vercel.json` rewrite ทุก path ไป `index.html` สำหรับ SPA) |

---

## โครงสร้างโฟลเดอร์

```
src/
├── App.jsx                 # routes ทั้งหมด (createBrowserRouter)
├── main.jsx
├── index.css               # design tokens (สี / ฟอนต์) — ดูหัวข้อ Design system
├── components/
│   ├── Layout.jsx          # ครอบทุกหน้า: AuthProvider → CartProvider → Navbar / Outlet / Footer (+ ChatWidget)
│   ├── Navbar.jsx, Footer.jsx
│   ├── login/              # LoginPage, RegisterPage, ForgetPassword, RenewPassword (popup)
│   ├── ProductCard.jsx, PopularProducts.jsx, PopShopBlog.jsx
│   ├── PaymentQRModal.jsx, OrderConfirmed.jsx
│   ├── ChatWidget.jsx, SyncAiButton.jsx     # AI chatbot + ปุ่ม Sync AI (admin)
│   └── ui/                 # shadcn components (button, card, table, select, ...)
├── context/
│   ├── AuthContext.jsx     # user, isLoggedIn, login/logout, axios `api` + interceptor refresh token
│   └── CartContext.jsx     # ตะกร้า (ดึงจาก backend), addToCart / addCustomToCart / increase / decrease / gift note
├── lib/                    # ตัวเรียก API แยกตามเรื่อง
│   ├── cartApi.js, customDesignApi.js, productApi.js
│   ├── aiApi.js            # askAI, syncAiKnowledge, previewDesign, getPreviewQuota
│   ├── previewHistory.js   # history รูป AI ใน localStorage (10 รูปล่าสุด, ย่อรูป)
│   └── utils.js
├── hooks/useAdminOrders.js
├── pages/
│   ├── HomePage/           # HomePage + Customdesign, Careguide, CustomerReview, ShopDetail
│   │   └── _components/    # useDesignPreview.js (logic ปุ่ม Preview), PreviewPanel.jsx (รูป / loading / history)
│   ├── Products/           # ProductsPage + filter bar
│   ├── CartPage.jsx, CheckoutPage.jsx, ShopBlogPage.jsx
│   ├── customer_dashboard/ # Account, Address, CustomList (ช่อที่เซฟ), PurchasesItems
│   └── admin_dashboard/    # Overview, ProductEdit, OrderList, ContentEdit
└── assets/                 # รูป, โมเดล 3D, mockData (ส่วนที่ยังไม่ต่อ API)
```

### Routes
| Path | หน้า | ข้อมูลที่ต้อง login (backend ตรวจ) |
|---|---|---|
| `/` | Home (custom design อยู่ที่นี่, `/?edit=<designId>` = แก้ช่อที่เซฟ) | Save design / Add to cart |
| `/products` | สินค้าทั้งหมด | — |
| `/shopblog` | บทความ | — |
| `/cart`, `/checkout` | ตะกร้า / ชำระเงิน | ✅ customer |
| `/customerdashboard/account` · `address` · `bouquet` · `purchases` | Customer dashboard | ✅ customer |
| `/admindashboard/overview` · `product-edit` · `order-list` · `content-edit` | Admin dashboard | ✅ admin (เพิ่ม/แก้/ลบสินค้า) |

> ⚠️ ตอนนี้ frontend **ยังไม่มี route guard** — เปิด URL หน้า dashboard ได้แม้ไม่ login แต่ข้อมูลจะโหลด/บันทึกไม่ได้ เพราะ backend ตรวจสิทธิ์ทุก API ที่ต้องใช้ (`authen`, `authorize(["admin"])`)

---

## วิธีรันในเครื่อง

ต้องรัน backend ก่อน (ดู README ของ backend repo) — ค่า default backend อยู่ที่ `http://localhost:3001`

```bash
npm install
# สร้างไฟล์ .env (ห้าม commit)
npm run dev        # http://localhost:5173
```

`.env`
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | dev server + HMR |
| `npm run build` | build ไป `dist/` |
| `npm run preview` | เปิดดูไฟล์ที่ build แล้ว |
| `npm run lint` | ตรวจโค้ดด้วย oxlint |

> Login ต้องให้ browser ส่ง cookie ข้าม origin (5173 → 3001) — backend ตั้ง CORS `credentials: true` ไว้ให้ `localhost:5173–5175` และโดเมน Vercel แล้ว

---

## Design system (ตาม Figma)

กำหนดใน `src/index.css` (`@theme`) ใช้เป็น class ของ Tailwind ได้เลย เช่น `bg-primary`, `text-neutral`, `font-display`

| Token | สี | ใช้กับ |
|---|---|---|
| `primary` | `#586158` | ปุ่ม, หัวข้อ, ลิงก์ |
| `secondary` | `#F9F6F0` | พื้นการ์ด |
| `accent` / `tertiary` | `#F3F3F0` | พื้นหลัง section |
| `neutral` | `#4A4A4A` | ตัวอักษรหลัก |
| `background` / `base-100` | `#FBF9F8` | พื้นหลังหน้า |
| `destructive` | `#8F4748` | ลบ / error |
| `D-background` / `D-text` | `#F4F7F8` / `#475486` | หน้า Admin dashboard |

| ฟอนต์ | ใช้กับ |
|---|---|
| **Literata** (`font-display`) | หัวข้อ |
| **Plus Jakarta Sans** (`font-body`) | เนื้อหา |

ราคาแสดงเป็นเงินบาท `฿` ทั้งเว็บ

---

## ทีม McKraken

| สมาชิก | งานหลักฝั่ง frontend |
|---|---|
| Jittrin P. | Cart (ต่อ API), Custom design, CustomList, AI chatbot (ChatWidget, Sync AI), AI Preview, Admin Overview, Footer, Shop blog |
| Albert Phonbut | Login / Register / Forget / Renew password, Cart page UI, AsideAdmin, Address, Review, Stripe payment, Admin Overview (การ์ด + กราฟยอดขาย) |
| Maliwan Rodsomrit | Landing, Customer dashboard (Account, Aside), Checkout, OrderConfirmed, OrderList, Products / ShopBlog ต่อ API, ContentEdit |
| วิทวัส ภิระบรรณ์ | Navbar, Products page, PopProducts, PurchasesItems, Auth ต่อ API, Product CRUD |
| Poramet N. | Homepage, CustomerAddress, ProductEdit (admin), Custom product (3D) |

การทำงาน: แบ่ง sprint + kanban บน Miro → แยก branch ต่อ feature → Pull Request → review → merge เข้า `main`
