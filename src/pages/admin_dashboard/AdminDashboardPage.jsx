import { Outlet } from "react-router-dom";
import AsideAdmin from "./_components/AsideAdmin";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col text-D-text md:flex-row gap-4 m-4 md:m-6">
      <AsideAdmin />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
