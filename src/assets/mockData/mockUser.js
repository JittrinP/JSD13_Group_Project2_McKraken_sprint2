// Mock data สำหรับ Login / User Account
// อ้างอิงจาก ER diagram: 03.ER diagram/er-diagram-flower-shop.excalidraw (entity USERS)
//
// หมายเหตุ:
//   - password_hash เป็น plain text ในไฟล์นี้เพื่อจำลองการ login ฝั่ง frontend เท่านั้น
//     ของจริงต้อง hash ฝั่ง backend ตอนต่อ API
//   - delete_at สมมติว่ายังไม่มี profile ไหนถูกลบ จึงเป็น null ทั้งหมด
//   - profile และ shipping_addresses เขียนเป็น embedded object/array ตรงตาม ER diagram
//   - shipping_addresses แต่ละคนใส่ไว้ 1 รายการ (is_default: true) เผื่อทีมเพิ่มที่อยู่อื่นทีหลัง

const mockUser = [
  {
    _id: "u01",
    email: "somsri.k@gmail.com",
    password_hash: "somsri123",
    phone_number: "081-234-5678",
    role: "customer",
    status: "active",
    created_at: "2026-01-10T09:00:00Z",
    delete_at: null,
    profile: {
      first_name: "Somsri",
      last_name: "Khamkaew",
      gender: "female",
    },
    shipping_addresses: [
      {
        address: "123/45 Sukhumvit Road",
        phone: "081-234-5678",
        sub_district: "Khlong Tan Nuea",
        district: "Watthana",
        province: "Bangkok",
        postal_code: "10110",
        is_default: true,
      },
    ],
  },
  {
    _id: "u02",
    email: "admin@atelierdeflora.com",
    password_hash: "admin1234",
    phone_number: "089-999-8888",
    role: "admin",
    status: "active",
    created_at: "2025-11-02T09:00:00Z",
    delete_at: null,
    profile: {
      first_name: "Thanakorn",
      last_name: "Wongphaisan",
      gender: "male",
    },
    shipping_addresses: [
      {
        address: "88 Ratchadamnoen Road",
        phone: "089-999-8888",
        sub_district: "Bowon Niwet",
        district: "Phra Nakhon",
        province: "Bangkok",
        postal_code: "10200",
        is_default: true,
      },
    ],
  },
  {
    _id: "u03",
    email: "pichaya.n@hotmail.com",
    password_hash: "pichaya456",
    phone_number: "062-345-1290",
    role: "customer",
    status: "suspended",
    created_at: "2026-03-22T09:00:00Z",
    delete_at: null,
    profile: {
      first_name: "Pichaya",
      last_name: "Naksakul",
      gender: "male",
    },
    shipping_addresses: [
      {
        address: "45 Moo 3 Nimmanhaemin Road",
        phone: "062-345-1290",
        sub_district: "Suthep",
        district: "Mueang Chiang Mai",
        province: "Chiang Mai",
        postal_code: "50200",
        is_default: true,
      },
    ],
  },
  {
    _id: "u04",
    email: "kanyarat.p@gmail.com",
    password_hash: "kanyarat789",
    phone_number: "095-678-1234",
    role: "customer",
    status: "active",
    created_at: "2026-05-14T09:00:00Z",
    delete_at: null,
    profile: {
      first_name: "Kanyarat",
      last_name: "Prasertsuk",
      gender: "female",
    },
    shipping_addresses: [
      {
        address: "7/19 Ngamwongwan Road",
        phone: "095-678-1234",
        sub_district: "Bang Kraso",
        district: "Mueang Nonthaburi",
        province: "Nonthaburi",
        postal_code: "11000",
        is_default: true,
      },
    ],
  },
];

export default mockUser;
