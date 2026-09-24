import { NavLink } from "react-router-dom";
import { User, Truck, Flower2, MapPin, Heart } from "lucide-react";

// paths ตรงนี้ต้องตรงกับ children route ที่ประกาศไว้ใต้ "/customer-dashboard"
// (account, purchases, bouquet, address, favorite) ใน App.jsx / router config
const menuItems = [
  { id: "account", name: "My Account", path: "account", Icon: User },
  { id: "purchases", name: "Purchase", path: "purchases", Icon: Truck },
  { id: "bouquet", name: "Bouquet", path: "bouquet", Icon: Flower2 },
  { id: "address", name: "My Address", path: "address", Icon: MapPin },
  // { id: "favorite", name: "Favorite", path: "favorite", Icon: Heart },
];

export default function AsideCustomer() {
  return (
    <aside
      className="
        w-full
        lg:sticky lg:top-[24px] lg:w-[280px] lg:shrink-0 lg:self-start
        lg:rounded-[12px] lg:border lg:border-[rgba(219,217,217,0.5)]
        lg:bg-white lg:p-[20px]
      "
    >
      <nav>
        <ul
          className="
            flex w-full snap-x snap-mandatory gap-[10px]
            overflow-x-auto overscroll-x-contain scroll-px-[16px] pb-[4px]
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            lg:flex-col lg:gap-[6px] lg:overflow-x-visible lg:pb-0
          "
        >
          {menuItems.map((item) => (
            <li key={item.id} className="shrink-0 snap-start lg:w-full lg:shrink">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-[12px] rounded-[1000px] px-[20px] py-[8px]
                   font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold transition-colors
                   lg:w-full lg:justify-start lg:rounded-[8px] lg:px-[14px] lg:py-[12px] lg:text-[15px] lg:font-normal ${
                     isActive
                       ? "bg-[#2E2E2E] text-white lg:bg-[#3F4B3B]"
                       : "bg-[#F2F2F2] text-[#4A4A4A] lg:bg-transparent lg:text-[#4A4A4A] lg:hover:bg-[#3F4B3B] lg:hover:text-white"
                   }`
                }
              >
                <item.Icon className="hidden size-[18px] shrink-0 lg:block" strokeWidth={2} />
                <span className="whitespace-nowrap">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}