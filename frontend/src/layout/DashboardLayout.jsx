import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-on-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-sidebar-width h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-gutter bg-background">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
