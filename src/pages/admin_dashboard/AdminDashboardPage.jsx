import { Outlet } from "react-router-dom";
import AsideAdmin from "./_components/AsideAdmin";

export default function AdminDashboardPage() {
  return (
    <div>
      <AsideAdmin />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
