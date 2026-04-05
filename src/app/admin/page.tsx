"use client";
import Link from "next/link";
import { MOCK_RESERVATIONS, getMonthStats, getBookingsBySport, getRevenueLast7Days } from "@/lib/admin-data";
import { COURTS } from "@/lib/data";
import StatCard from "@/components/admin/StatCard";
import BarChart from "@/components/admin/BarChart";

const STATUS_STYLES: Record<string, string> = {
  confirmada: "bg-green-100 text-green-700",
  pendiente: "bg-amber-100 text-amber-700",
  cancelada: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const stats = getMonthStats(MOCK_RESERVATIONS);
  const bookingsBySport = getBookingsBySport(MOCK_RESERVATIONS);
  const revenueDays = getRevenueLast7Days(MOCK_RESERVATIONS);
  const recentReservations = MOCK_RESERVATIONS.filter(r => r.status !== "cancelada").slice(0, 5);

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Ingresos del Mes"
          value={`S/${stats.revenue.toLocaleString()}`}
          subtitle="Solo confirmadas"
          icon={<span>💰</span>}
          borderColor="border-l-green-500"
        />
        <StatCard
          title="Total Reservas"
          value={String(stats.totalBookings)}
          subtitle="Este mes"
          icon={<span>📋</span>}
          borderColor="border-l-blue-500"
        />
        <StatCard
          title="Tasa de Ocupación"
          value={`${stats.occupancyRate}%`}
          subtitle={`${COURTS.length} canchas activas`}
          icon={<span>📊</span>}
          borderColor="border-l-purple-500"
        />
        <StatCard
          title="Cancelaciones"
          value={String(stats.cancellations)}
          subtitle="Este mes"
          icon={<span>❌</span>}
          borderColor="border-l-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <BarChart title="Reservas por Deporte" data={bookingsBySport} variant="horizontal" />
        <BarChart title="Ingresos - Últimos 7 Días" data={revenueDays} variant="vertical" />
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Reservas Recientes</h3>
          <Link href="/admin/reservas" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Código</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Cliente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Cancha</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Fecha</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Monto</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentReservations.map((r) => {
                const court = COURTS.find(c => c.id === r.courtId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-gray-900">{r.code}</td>
                    <td className="px-5 py-3 text-gray-700">{r.customerName}</td>
                    <td className="px-5 py-3 text-gray-600">{court?.name || r.courtId}</td>
                    <td className="px-5 py-3 text-gray-600">{r.date} {r.time}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">S/{r.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
