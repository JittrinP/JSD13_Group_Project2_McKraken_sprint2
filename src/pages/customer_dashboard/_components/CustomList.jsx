import { SquarePen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDesigns, deleteDesign } from "../../../lib/customDesignApi";
import { useCart } from "../../../context/CartContext";

export default function CustomList() {
  const navigate = useNavigate();
  // ตะกร้าตัวเดียวกับปุ่ม Add to cart ของ ProductCard (ช่อ custom ใช้ design._id เป็น key ใน product_id)
  const { items, addCustomToCart, increaseQty, decreaseQty } = useCart();
  const [customList, setCustomList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // โหลด saved design ทั้งหมดของ user ที่ login อยู่ตอน component เปิดขึ้นมาครั้งแรก
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const data = await getDesigns();
        setCustomList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your saved bouquets.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDesigns();
  }, []);

  //สร้าง edit handler ให้ไปที่ส่วนที่ path / (Home) แล้วเราจะส่ง
  const editHandler = (id) => {
    navigate(`/?edit=${id}#customDesign`);
  };
  //สร้าง delete handler — ลบผ่าน API จริงก่อน สำเร็จแล้วค่อยตัดออกจาก local state
  const deleteHandler = async (id) => {
    try {
      await deleteDesign(id);
      setCustomList((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };
  return (
    <>
      <div className="text-primary">
        {/* หัวข้อ */}
        <h2 className="font-display text-2xl font-bold ">Bouquet</h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-neutral/60">Loading your bouquets...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        ) : customList.length === 0 ? (
          <p className="mt-4 text-sm text-neutral/60">You haven't saved any custom bouquets yet.</p>
        ) : (
        <div className="mt-4 flex flex-col gap-6 lg:m-4 lg:gap-0 lg:max-h-125 lg:overflow-auto lg:rounded-2xl lg:border lg:border-[#929B91]/30 lg:bg-background">
          {/* หัวตาราง: แสดงเฉพาะ lg ขึ้นไป */}
          <div className="hidden lg:grid grid-cols-12 font-body p-2 border-b border-[#929B91]/30">
            <div className="col-span-1 text-center">Preset</div>
            <div className="col-span-4 pl-2">Product</div>
            <div className="col-span-3">Detail</div>
            <div className="col-span-2 text-center">Add to cart</div>
            <div className="col-span-1 text-center">Edit</div>
            <div className="col-span-1 text-center">Delete</div>
          </div>

          {/* customList: card (mobile) -> แถวของ grid 12 คอลัมน์ (lg) */}
          {customList.map((design) => {
            // จำนวนช่อนี้ในตะกร้า 0 = ยังไม่ได้เพิ่ม โชว์ปุ่ม Add to cart / มากกว่า 0 = โชว์ปุ่ม - จำนวน + (เหมือน ProductCard)
            const cartItem = items.find((i) => i.product_id === design._id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
            <div
              key={design._id}
              className="flex gap-6 rounded-2xl border border-[#929B91]/30 bg-background p-6 shadow-sm lg:grid lg:grid-cols-12 lg:items-center lg:gap-0 lg:rounded-none lg:border-0 lg:border-b lg:p-4 lg:shadow-none lg:last:border-b-0"
            >
              {/* เลข preset (lg: คอลัมน์แรกสุด / mobile: ซ่อน ไปโชว์เป็น badge เหนือชื่อแทน) ช่อเก่าที่ยังไม่มี preset โชว์ "-" */}
              <div className="hidden lg:col-span-1 lg:block lg:text-center lg:font-body">
                {design.preset ?? "-"}
              </div>

              {/* รูป (lg: คอลัมน์แรกของ Product) */}
              <img
                src="https://placehold.co/140x140"
                alt={design.design_name}
                className="h-35 w-35 shrink-0 object-cover lg:col-span-1 lg:h-15.5 lg:w-15.5"
              />

              {/* mobile: คอลัมน์ขวาของ card / lg: contents ให้ลูกเป็น grid item ของแถวเลย */}
              <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                {/* ชื่อ design + description (lg: คอลัมน์ที่ 2-4 ของ Product) description ตัวเล็กและจางกว่าชื่อ */}
                <div className="min-w-0 lg:col-span-3 lg:pr-4">
                  <span className="text-xs text-neutral/60 lg:hidden">
                    Preset {design.preset ?? "-"}
                  </span>
                  <h3 className="font-display text-xl font-semibold lg:font-body lg:text-base lg:font-normal">
                    {design.design_name}
                  </h3>
                  {design.design_description && (
                    <p className="mt-0.5 text-sm text-neutral/60 line-clamp-2">
                      {design.design_description}
                    </p>
                  )}
                </div>

                {/* Detail ใส่บูลเล็ทโดยใส่ class ไปเพราะว่า tailwind มันลบออกหมดเลย */}
                <ul className="list-disc list-inside text-sm lg:col-span-3 lg:text-base">
                  {design.components.map((item) => {
                    // backend populate ให้แล้ว inventory_item_id เลยเป็น object { _id, name, ... } ไม่ใช่แค่ id string
                    const inv = item.inventory_item_id;
                    return (
                      <li key={item._id}>
                        {`${inv?.name || "ไม่พบสินค้า"} x ${item.quantity}`}
                      </li>
                    );
                  })}
                </ul>

                {/* mobile: ปุ่มชิดขวาล่าง / lg: contents ให้ปุ่มแต่ละอันเป็นช่องของตาราง */}
                <div className="mt-auto flex flex-wrap items-center justify-end gap-3 pt-2 lg:contents">
                  {/* Add to cart (lg: 2 คอลัมน์ หลัง Detail ก่อน Edit) กดแล้วเปลี่ยนเป็นปุ่ม - จำนวน + เหมือน ProductCard */}
                  <div className="lg:col-span-2 lg:justify-self-center">
                    {quantity === 0 ? (
                      <button
                        onClick={() => addCustomToCart(design)}
                        className="h-9 rounded-full bg-primary px-4 text-xs font-medium text-white transition-all duration-200 hover:cursor-pointer hover:opacity-95 hover:shadow-sm active:scale-95"
                      >
                        Add to cart
                      </button>
                    ) : (
                      <div className="flex h-9 w-28 items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-2 text-sm">
                        <button
                          onClick={() => decreaseQty(design._id)}
                          className="rounded-full px-2.5 py-0.5 font-medium text-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-900 active:scale-75"
                        >
                          -
                        </button>
                        <span className="select-none text-xs font-medium text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(design._id)}
                          className="rounded-full px-2.5 py-0.5 font-medium text-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-900 active:scale-75"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral/30 bg-background text-neutral transition-colors hover:cursor-pointer hover:bg-secondary lg:col-span-1 lg:justify-self-center lg:border-none lg:bg-transparent"
                    onClick={() => {
                      editHandler(design._id);
                    }}
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>

                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive text-white transition-opacity hover:cursor-pointer hover:opacity-90 lg:col-span-1 lg:justify-self-center"
                    onClick={() => {
                      deleteHandler(design._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        )}
      </div>
    </>
  );
}
