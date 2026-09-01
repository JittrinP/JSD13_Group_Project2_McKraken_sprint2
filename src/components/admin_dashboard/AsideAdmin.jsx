import { NavLink } from "react-router-dom";

import dashboardIcon from "../../assets/asideadmin/dashboard.svg";
import productIcon from "../../assets/asideadmin/product.svg";
import ordersIcon from "../../assets/asideadmin/orders.svg";
import contentIcon from "../../assets/asideadmin/content.svg";

const menuItems = [
  { id: "overview", name: "Dashboard", path: "overview", icon: dashboardIcon },
  { id: "product-edit", name: "Product", path: "product-edit", icon: productIcon },
  { id: "order-list", name: "Orders", path: "order-list", icon: ordersIcon },
  { id: "content-edit", name: "ContentIcon", path: "content-edit", icon: contentIcon },
];

export default function AsideAdmin() {
  return (
    <aside className="w-[322px] rounded-[12px] border border-[rgba(219,217,217,0.5)] bg-[#F4F7F8] p-[25px]">
      <nav>
        <ul className="flex w-full flex-col gap-[4px]">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-[12px] rounded-[8px] p-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[16px] leading-[24px] transition-colors ${
                    isActive
                      ? "bg-[#475586] text-white"
                      : "text-[#4A4A4A] hover:bg-[#475586] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={item.icon}
                      alt=""
                      className={`size-[16px] shrink-0 transition-all ${
                        isActive
                          ? "brightness-0 invert"
                          : "group-hover:brightness-0 group-hover:invert"
                      }`}
                    />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
