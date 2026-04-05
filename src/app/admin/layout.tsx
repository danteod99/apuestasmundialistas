"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Resumen",
  "/admin/reservas": "Gestión de Reservas",
  "/admin/canchas": "Gestión de Canchas",
  "/admin/calendario": "Calendario",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Admin";

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        currentPath={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AdminHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
