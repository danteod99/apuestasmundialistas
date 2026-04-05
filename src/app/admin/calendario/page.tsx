"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchReservationsByDateRange, fetchCourts } from "@/lib/supabase-queries";
import type { Reservation, Court } from "@/lib/data";
import CalendarGrid from "@/components/admin/CalendarGrid";

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatDate(d);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatWeekLabel(start: string): string {
  const end = addDays(start, 6);
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  if (sm === em) return `${sd} - ${ed} ${MONTH_NAMES[sm - 1]}, ${sy}`;
  return `${sd} ${MONTH_NAMES[sm - 1]} - ${ed} ${MONTH_NAMES[em - 1]}, ${sy}`;
}

export default function AdminCalendario() {
  const todayMonday = getMonday(new Date());
  const [weekStart, setWeekStart] = useState(todayMonday);
  const [courtFilter, setCourtFilter] = useState("all");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  const weekEnd = addDays(weekStart, 6);

  useEffect(() => {
    fetchCourts().then(setCourts);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchReservationsByDateRange(weekStart, weekEnd)
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [weekStart, weekEnd]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => setWeekStart(todayMonday)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-600">Hoy</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 ml-2">
            Semana del {formatWeekLabel(weekStart)}
          </h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        <button onClick={() => setCourtFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            courtFilter === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Todas las Canchas
        </button>
        {courts.map(court => (
          <button key={court.id} onClick={() => setCourtFilter(court.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              courtFilter === court.id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {court.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <CalendarGrid
            reservations={reservations}
            courts={courts}
            weekStart={weekStart}
            courtFilter={courtFilter}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-200" /><span>Alta ocupación (&gt;70%)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-100" /><span>Media (&gt;30%)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-50" /><span>Baja (&lt;30%)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-gray-200" /><span>Disponible</span></div>
      </div>
    </div>
  );
}
