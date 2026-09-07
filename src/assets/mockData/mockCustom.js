// Mock data สำหรับ "Custom List" ในหน้า Customer Dashboard
// อ้างอิงจาก ER diagram: 03.ER diagram/er-diagram-flower-shop.excalidraw
//
// ในฐานข้อมูลจริง ข้อมูลชุดนี้คือ field ที่ EMBEDDED อยู่ในเอกสาร users:
//   users.saved_custom_designs : Array  "แบบช่อที่เซฟไว้"
//
// กฎจาก ER (สำคัญ):
//   - เก็บ "แค่สูตร" ไม่เก็บราคา  → แสดงผลด้วยราคาปัจจุบันเสมอ
//   - ช่อ custom ไม่สร้าง product ใหม่ (ตอนสั่งซื้อจะไป snapshot ใน order.items.custom_specs)
//   - components อ้างอิง inventory_items._id (ดูราคา/ชื่อ/สีได้จาก mockInventory.js)
//
// โครงสร้าง 1 รายการ (ตรงตาม ER):
//   design_name : String
//   components  : [{ inventory_item_id : ObjectId (REF → inventory_items._id), quantity : Int }]
//
// ฟิลด์เสริม (ไม่มีใน ER แต่ subdocument ของ Mongo มักมี — ใส่ไว้ให้ frontend ใช้ง่าย):
//   _id        : id ของ design (ใช้เป็น React key)
//   created_at : Date

const mockCustom = [
  {
    _id: "cd01",
    design_name: "ช่อวันครบรอบสีแดงของฉัน",
    components: [
      { inventory_item_id: "inv01", quantity: 12 }, // กุหลาบแดงเอกวาดอร์
      { inventory_item_id: "inv18", quantity: 6 }, //  กุหลาบขาว
      { inventory_item_id: "inv19", quantity: 5 }, //  ใบยูคาลิปตัส
      { inventory_item_id: "inv02", quantity: 1 }, //  กระดาษห่อคราฟท์
    ],
    created_at: "2026-08-05T09:24:00Z",
  },
  {
    _id: "cd02",
    design_name: "ช่อพาสเทลรับปริญญาน้อง",
    components: [
      { inventory_item_id: "inv03", quantity: 10 }, // ทิวลิปชมพู
      { inventory_item_id: "inv11", quantity: 5 }, //  เบบี้บรีธ
      { inventory_item_id: "inv04", quantity: 1 }, //  กระดาษห่อเกาหลี
    ],
    created_at: "2026-08-18T11:40:00Z",
  },
  {
    _id: "cd03",
    design_name: "ช่อทานตะวันให้กำลังใจ",
    components: [
      { inventory_item_id: "inv06", quantity: 5 }, //  ทานตะวัน
      { inventory_item_id: "inv14", quantity: 8 }, //  เดซี่เหลือง
      { inventory_item_id: "inv19", quantity: 4 }, //  ใบยูคาลิปตัส
      { inventory_item_id: "inv02", quantity: 1 }, //  กระดาษห่อคราฟท์
    ],
    created_at: "2026-07-22T08:10:00Z",
  },
  {
    _id: "cd04",
    design_name: "ช่อโบตั๋นวันเกิดแม่",
    components: [
      { inventory_item_id: "inv13", quantity: 6 }, //  โบตั๋นชมพู
      { inventory_item_id: "inv09", quantity: 1 }, //  ริบบิ้นผ้าซาติน
    ],
    created_at: "2026-08-28T20:05:00Z",
  },
  {
    _id: "cd05",
    design_name: "ช่อไฮเดรนเยียฟ้าเรียบหรู",
    components: [
      { inventory_item_id: "inv07", quantity: 3 }, //  ไฮเดรนเยียฟ้า
      { inventory_item_id: "inv18", quantity: 6 }, //  กุหลาบขาว
      { inventory_item_id: "inv11", quantity: 3 }, //  เบบี้บรีธ
      { inventory_item_id: "inv04", quantity: 1 }, //  กระดาษห่อเกาหลี
    ],
    created_at: "2026-08-20T13:50:00Z",
  },
  {
    _id: "cd06",
    design_name: "แจกันลาเวนเดอร์ตั้งโต๊ะ",
    components: [
      { inventory_item_id: "inv20", quantity: 2 }, //  ลาเวนเดอร์แห้ง
      { inventory_item_id: "inv10", quantity: 1 }, //  แจกันแก้วทรงสูง
    ],
    created_at: "2026-08-30T18:22:00Z",
  },
];

export default mockCustom;
