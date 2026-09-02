// Mock data สำหรับ collection "inventory_items" (วัตถุดิบ/สต๊อกในร้าน)
// อ้างอิงจาก ER diagram: 03.ER diagram/er-diagram-flower-shop.excalidraw
//
// หมายเหตุจาก ER:
//   - INVENTORY = ใช้ภายในร้านเท่านั้น ลูกค้าไม่ซื้อตรง
//   - cost_price = "ต้นทุน" (ไม่ใช่ราคาขาย — ราคาขายอยู่ที่ collection products)
//   - _id เหล่านี้ถูกอ้างอิงโดย products.recipe[].inventory_item_id
//     และ users.saved_custom_designs[].components[].inventory_item_id
//
// โครงสร้าง 1 รายการ:
//   _id            : ObjectId (PK)   — mock ใช้ string "invNN"
//   name           : String
//   category       : 'flower' | 'wrapping_paper' | 'vase'
//   cost_price     : Decimal (บาท) — ต้นทุนต่อหน่วย
//   stock_quantity : Int
//   attributes     : { color: String, origin: 'local' | 'imported' }   [EMBEDDED]

const mockInventory = [
  { _id: "inv01", name: "กุหลาบแดงเอกวาดอร์", category: "flower", cost_price: 18, stock_quantity: 640, attributes: { color: "red", origin: "imported" } },
  { _id: "inv02", name: "กระดาษห่อคราฟท์", category: "wrapping_paper", cost_price: 12, stock_quantity: 300, attributes: { color: "brown", origin: "local" } },
  { _id: "inv03", name: "ทิวลิปชมพู", category: "flower", cost_price: 25, stock_quantity: 180, attributes: { color: "pink", origin: "imported" } },
  { _id: "inv04", name: "กระดาษห่อเกาหลี", category: "wrapping_paper", cost_price: 15, stock_quantity: 260, attributes: { color: "cream", origin: "imported" } },
  { _id: "inv05", name: "ลิลลี่ขาว", category: "flower", cost_price: 22, stock_quantity: 150, attributes: { color: "white", origin: "local" } },
  { _id: "inv06", name: "ทานตะวัน", category: "flower", cost_price: 20, stock_quantity: 220, attributes: { color: "yellow", origin: "local" } },
  { _id: "inv07", name: "ไฮเดรนเยียฟ้า", category: "flower", cost_price: 45, stock_quantity: 90, attributes: { color: "blue", origin: "imported" } },
  { _id: "inv08", name: "คาร์เนชั่นชมพู", category: "flower", cost_price: 12, stock_quantity: 400, attributes: { color: "pink", origin: "local" } },
  { _id: "inv09", name: "ริบบิ้นผ้าซาติน", category: "wrapping_paper", cost_price: 8, stock_quantity: 500, attributes: { color: "ivory", origin: "local" } },
  { _id: "inv10", name: "แจกันแก้วทรงสูง", category: "vase", cost_price: 65, stock_quantity: 70, attributes: { color: "clear", origin: "local" } },
  { _id: "inv11", name: "เบบี้บรีธ", category: "flower", cost_price: 15, stock_quantity: 310, attributes: { color: "white", origin: "local" } },
  { _id: "inv12", name: "กล้วยไม้ในกระถางเซรามิก", category: "flower", cost_price: 90, stock_quantity: 40, attributes: { color: "purple", origin: "imported" } },
  { _id: "inv13", name: "โบตั๋นชมพู", category: "flower", cost_price: 70, stock_quantity: 55, attributes: { color: "pink", origin: "imported" } },
  { _id: "inv14", name: "เดซี่เหลือง", category: "flower", cost_price: 9, stock_quantity: 480, attributes: { color: "yellow", origin: "local" } },
  { _id: "inv15", name: "ยูสโตม่าม่วง", category: "flower", cost_price: 16, stock_quantity: 160, attributes: { color: "purple", origin: "local" } },
  { _id: "inv16", name: "มะลิกระถาง", category: "flower", cost_price: 30, stock_quantity: 80, attributes: { color: "white", origin: "local" } },
  { _id: "inv17", name: "กุหลาบส้ม", category: "flower", cost_price: 17, stock_quantity: 240, attributes: { color: "orange", origin: "local" } },
  { _id: "inv18", name: "กุหลาบขาว", category: "flower", cost_price: 16, stock_quantity: 260, attributes: { color: "white", origin: "local" } },
  { _id: "inv19", name: "ใบยูคาลิปตัส", category: "flower", cost_price: 10, stock_quantity: 350, attributes: { color: "green", origin: "local" } },
  { _id: "inv20", name: "ลาเวนเดอร์แห้ง", category: "flower", cost_price: 28, stock_quantity: 120, attributes: { color: "purple", origin: "imported" } },
  { _id: "inv21", name: "กุหลาบพีช (English Rose)", category: "flower", cost_price: 24, stock_quantity: 140, attributes: { color: "peach", origin: "imported" } },
  { _id: "inv22", name: "ดอกสำลี", category: "flower", cost_price: 14, stock_quantity: 200, attributes: { color: "white", origin: "imported" } },
];

export default mockInventory;
