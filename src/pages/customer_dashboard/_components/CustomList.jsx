import { SquarePen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDesigns, deleteDesign } from "../../../lib/customDesignApi";

export default function CustomList() {
  const navigate = useNavigate();
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
          <div className="hidden lg:grid grid-cols-9 font-body p-2 border-b border-[#929B91]/30">
            <div className="col-span-4 pl-2">Product</div>
            <div className="col-span-3">Detail</div>
            <div className="col-span-1 text-center">Edit</div>
            <div className="col-span-1 text-center">Delete</div>
          </div>

          {/* customList: card (mobile) -> แถวของ grid 9 คอลัมน์ (lg) */}
          {customList.map((design) => (
            <div
              key={design._id}
              className="flex gap-6 rounded-2xl border border-[#929B91]/30 bg-background p-6 shadow-sm lg:grid lg:grid-cols-9 lg:items-center lg:gap-0 lg:rounded-none lg:border-0 lg:border-b lg:p-4 lg:pl-10 lg:shadow-none lg:last:border-b-0"
            >
              {/* รูป (lg: คอลัมน์แรกของ Product) */}
              <img
                src="https://placehold.co/140x140"
                alt={design.design_name}
                className="h-35 w-35 shrink-0 object-cover lg:col-span-1 lg:h-15.5 lg:w-15.5"
              />

              {/* mobile: คอลัมน์ขวาของ card / lg: contents ให้ลูกเป็น grid item ของแถวเลย */}
              <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                {/* ชื่อ design (lg: คอลัมน์ที่ 2-4 ของ Product) */}
                <h3 className="font-display text-xl font-semibold lg:col-span-3 lg:font-body lg:text-base lg:font-normal">
                  {design.design_name}
                </h3>

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
                <div className="mt-auto flex justify-end gap-3 pt-2 lg:contents">
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
          ))}
        </div>
        )}
      </div>
    </>
  );
}
