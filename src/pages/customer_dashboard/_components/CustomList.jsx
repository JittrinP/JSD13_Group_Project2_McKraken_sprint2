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
      <div>
        {/* หัวข้อ */}
        <h2 className="font-display text-2xl font-bold ">Bouquet</h2>
        {/* หัวตาราง */}
        <div className="bg-background border-2 rounded-2xl m-4 max-h-[500px] overflow-auto">
          <div className="grid grid-cols-9 font-body border-b-2">
            <div className="col-span-4 pl-2">Product</div>
            <div className="col-span-3 ">Detail</div>
            <div className="col-span-1 ">Edit</div>
            <div className="col-span-1 ">Delete</div>
          </div>
          {/* customList */}
          {customList.map((design) => (
            <div
              key={design._id}
              className="grid grid-cols-9 border-b-2 p-2 last:border-b-0"
            >
              {/* Products: รูป + ชื่อ design */}
              <div className="col-span-4">
                <div className=" flex flex-row gap-2">
                  <img src="https://placehold.co/62x62" />
                  <span>{design.design_name}</span>
                </div>
              </div>

              <div className="col-span-3">
                {/* Detail ใส่บูลเล็ทโดยใส่ class ไปเพราะว่า tailwind มันลบออกหมดเลย */}
                <ul className="list-disc list-inside">
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

              <div className="col-span-1">
                
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-background border border-neutral/30 text-neutral hover:bg-secondary transition-colors md:bg-transparent md:border-none hover:cursor-pointer"
                    onClick={() => {
                      editHandler(design._id);
                    }}
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
           
              </div>

              <div className="col-span-1">
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
