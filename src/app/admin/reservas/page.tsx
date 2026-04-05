"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchReservations, fetchCourts } from "@/lib/supabase-queries";
import { SPORTS_INFO, type Sport, type Reservation, type Court } from "@/lib/data";

const STATUS_STYLES: Record<string, string> = {
  confirmada: "bg-green-100 text-green-700",
  pendiente: "bg-amber-100 text-amber-700",
  cancelada: "bg-red-100 text-red-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Tarjeta",
  yape: "Yape",
  plin: "Plin",
};

const PER_PAGE = 10;

export default function AdminReservas() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    Promise.all([fetchReservations(), fetchCourts()])
      .then(([res, cts]) => {
        setReservations(res);
        setCourts(cts);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...reservations];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.code.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q)
      );
    }
    if (sportFilter) result = result.filter(r => r.sport === sportFilter);
    if (statusFilter) result = result.filter(r => r.status === statusFilter);
    if (dateFrom) result = result.filter(r => r.date >= dateFrom);
    if (dateTo) result = result.filter(r => r.date <= dateTo);

    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * (a.date + a.time).localeCompare(b.date + b.time);
      return mul * (a.amount - b.amount);
    });

    return result;
  }, [reservations, search, sportFilter, statusFilter, dateFrom, dateTo, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  function toggleSort(field: "date" | "amount") {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  function resetFilters() {
    setSearch(""); setSportFilter(""); setStatusFilter("");
    setDateFrom(""); setDateTo(""); setPage(0);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-gray-900">Todas las Reservas</h2>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {filtered.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar código o cliente..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto sm:flex-1 sm:max-w-xs"
          />
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <select value={sportFilter} onChange={e => { setSportFilter(e.target.value); setPage(0); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Todos los deportes</option>
            {(Object.keys(SPORTS_INFO) as Sport[]).map(s => (
              <option key={s} value={s}>{SPORTS_INFO[s].label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Todos los estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">Limpiar</button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Código</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Cancha</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Deporte</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => toggleSort("date")}>
                  Fecha {sortField === "date" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Hora</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => toggleSort("amount")}>
                  Monto {sortField === "amount" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Pago</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((r) => {
                const court = courts.find(c => c.id === r.courtId);
                const sportInfo = SPORTS_INFO[r.sport];
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{r.code}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{r.customerName}</div>
                      <div className="text-xs text-gray-400">{r.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{court?.name || r.courtId}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sportInfo.color }} />
                        <span className="text-gray-600">{sportInfo.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.time}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">S/{r.amount}</td>
                    <td className="px-4 py-3 text-gray-600">{PAYMENT_LABELS[r.paymentMethod]}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No se encontraron reservas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map((r) => {
          const court = courts.find(c => c.id === r.courtId);
          return (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-gray-900">{r.code}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{r.customerName}</p>
              <p className="text-sm text-gray-500">{court?.name} · {r.date} · {r.time}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">{PAYMENT_LABELS[r.paymentMethod]}</span>
                <span className="font-bold text-gray-900">S/{r.amount}</span>
              </div>
            </div>
          );
        })}
        {paginated.length === 0 && (
          <div className="text-center text-gray-400 py-8">No se encontraron reservas</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Anterior
          </button>
          <span className="text-sm text-gray-500">Página {page + 1} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
