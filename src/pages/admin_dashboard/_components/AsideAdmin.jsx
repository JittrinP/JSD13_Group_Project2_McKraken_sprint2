import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, FileText } from "lucide-react";

const menuItems = [
  { id: "overview", name: "Dashboard", path: "overview", Icon: LayoutDashboard },
  { id: "product-edit", name: "Product", path: "product-edit", Icon: Package },
  { id: "order-list", name: "Orders", path: "order-list", Icon: ShoppingCart },
  { id: "content-edit", name: "Content", path: "content-edit", Icon: FileText },
];

export default function AsideAdmin() {
  return (
    <aside
      className="
        w-full
        lg:w-[322px] lg:rounded-[12px] lg:border lg:border-[rgba(219,217,217,0.5)]
        lg:bg-[#F4F7F8] lg:p-[25px]
      "
    >
      <nav>
        <ul
          className="
            flex w-full snap-x snap-mandatory gap-[10px]
            overflow-x-auto overscroll-x-contain scroll-px-[16px] pb-[4px]
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            lg:flex-col lg:gap-[4px] lg:overflow-x-visible lg:pb-0
          "
        >
          {menuItems.map((item) => (
            <li key={item.id} className="shrink-0 snap-start lg:w-full lg:shrink">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-[12px] rounded-[1000px] px-[20px] py-[4px]
                   font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-semibold leading-[36px] transition-colors
                   lg:w-full lg:justify-start lg:rounded-[8px] lg:p-[12px] lg:font-normal lg:leading-[24px] ${
                     isActive
                       ? "bg-[#475486] text-white lg:bg-[#475586]"
                       : "bg-[#E8F4F4] text-[#586158] lg:bg-transparent lg:text-[#4A4A4A] lg:hover:bg-[#475586] lg:hover:text-white"
                   }`
                }
              >
                <item.Icon className="hidden size-[16px] shrink-0 lg:block" strokeWidth={2} />
                <span className="whitespace-nowrap">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}