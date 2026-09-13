import mockCustom from "../../../assets/mockData/mockCustom";
import mockInventory from "../../../assets/mockData/mockInventory";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomList() {
  const navigate = useNavigate();
  // หาข้อมูล inventory 1 รายการจาก _id (mockCustom เก็บมาแค่ id)
  const [customList, setCustomList] = useState(mockCustom);
  const findInv = (id) => mockInventory.find((inv) => inv._id === id);

  //สร้าง edit handler ให้ไปที่ส่วนที่ path / (Home) แล้วเราจะส่ง
  const editHandler = (id) => {
    navigate(`/?edit=${id}#customDesign`);
  };
  //สร้าง delete handler
  const deleteHandler = (id) => {
    setCustomList((prev) => prev.filter((d) => d._id !== id));
  };
  return (
    <>
      <div className="flex-1 text-primary">
        {/* หัวข้อ */}
        <h2 className="font-display text-3xl font-bold mb-4">
          Bouquet
        </h2>
        {/* หัวตาราง */}
        <div className="bg-background border border-neutral/10 rounded-2xl shadow-sm max-h-[800px] overflow-auto">
          <div className="grid grid-cols-9 font-body text-sm text-neutral/60 px-6 py-4 border-b border-neutral/10">
            <div className="col-span-4">Product</div>
            <div className="col-span-3">Detail</div>
            <div className="col-span-1 text-center">Edit</div>
            <div className="col-span-1 text-center">Delete</div>
          </div>
          {/* customList */}
          {customList.map((design) => (
            <div
              key={design._id}
              className="grid grid-cols-9 items-center border-b border-neutral/10 px-6 py-5 last:border-b-0"
            >
              {/* Products: รูป + ชื่อ design */}
              <div className="col-span-4">
                <div className="flex flex-row items-center gap-3">
                  <img
                    src="https://placehold.co/62x62"
                    className="w-[62px] h-[62px] rounded-lg object-cover shrink-0"
                  />
                  <span className="font-display text-lg font-semibold text-neutral">
                    {design.design_name}
                  </span>
                </div>
              </div>

              <div className="col-span-3">
                {/* Detail ใส่บูลเล็ทโดยใส่ class ไปเพราะว่า tailwind มันลบออกหมดเลย */}
                <ul className="list-disc list-inside font-body text-sm text-neutral/70 space-y-0.5">
                  {design.components.map((item) => {
                    const inv = findInv(item.inventory_item_id);
                    return (
                      <li key={item.inventory_item_id}>
                        {`${inv ? inv.name : `ไม่พบสินค้า ${item.inventory_item_id}`} x ${item.quantity}`}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-neutral/20 text-neutral hover:bg-secondary transition-colors hover:cursor-pointer"
                  onClick={() => {
                    editHandler(design._id);
                  }}
                >
                  <SquarePen className="w-4 h-4" />
                </button>
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-destructive text-white hover:opacity-90 transition-opacity hover:cursor-pointer"
                  onClick={() => {
                    deleteHandler(design._id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
