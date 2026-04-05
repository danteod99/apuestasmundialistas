"use client";
import { useMemo } from "react";
import type { Reservation, Court } from "@/lib/data";

interface CalendarGridProps {
  reservations: Reservation[];
  courts: Court[];
  weekStart: string;
  courtFilter: string;
}

const STATUS_COLORS: Record<string, string> = {
  confirmada: "bg-green-200 text-green-800",
  pendiente: "bg-amber-100 text-amber-700",
  cancelada: "bg-red-100 text-red-700",
};

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 8);

export default function CalendarGrid({ reservations, courts, weekStart, courtFilter }: CalendarGridProps) {
  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const reservationMap = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach(r => {
      const key = `${r.date}-${r.time}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return map;
  }, [reservations]);

  function getCellData(date: string, hour: number) {
    const timeStr = `${String(hour).padStart(2, "0")}:00`;
    const key = `${date}-${timeStr}`;
    const all = reservationMap.get(key) || [];

    if (courtFilter === "all") {
      const booked = all.filter(r => r.status !== "cancelada").length;
      return { booked, total: courts.length, reservations: all };
    } else {
      const courtRes = all.find(r => r.courtId === courtFilter);
      return { booked: courtRes ? 1 : 0, total: 1, reservations: courtRes ? [courtRes] : [] };
    }
  }

  function formatDateShort(dateStr: string) {
    const parts = dateStr.split("-");
    return `${parts[2]}/${parts[1]}`;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-xl overflow-hidden">
          <div className="bg-gray-50 p-2 text-xs font-semibold text-gray-400 text-center">Hora</div>
          {weekDates.map((date, i) => {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
            const isToday = date === todayStr;
            return (
              <div
                key={date}
                className={`p-2 text-center text-xs font-semibold ${isToday ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}`}
              >
                <div>{DAY_NAMES[i]}</div>
                <div className={`text-sm font-bold ${isToday ? "text-green-700" : "text-gray-900"}`}>
                  {formatDateShort(date)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="bg-gray-200 grid gap-px rounded-b-xl overflow-hidden">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-px">
              <div className="bg-gray-50 p-2 text-xs font-medium text-gray-500 text-center flex items-center justify-center">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDates.map(date => {
                const cell = getCellData(date, hour);
                const occupancy = cell.total > 0 ? cell.booked / cell.total : 0;

                let bgClass = "bg-white";
                if (cell.booked > 0 && courtFilter === "all") {
                  if (occupancy > 0.7) bgClass = "bg-green-200";
                  else if (occupancy > 0.3) bgClass = "bg-green-100";
                  else bgClass = "bg-green-50";
                } else if (cell.booked > 0 && courtFilter !== "all") {
                  const status = cell.reservations[0]?.status || "confirmada";
                  bgClass = STATUS_COLORS[status]?.split(" ")[0] || "bg-green-100";
                }

                return (
                  <div
                    key={`${date}-${hour}`}
                    className={`${bgClass} p-1.5 text-center min-h-[40px] flex items-center justify-center hover:ring-1 hover:ring-green-400 transition-all`}
                  >
                    {courtFilter === "all" ? (
                      cell.booked > 0 && (
                        <span className="text-xs font-medium text-gray-700">
                          {cell.booked}/{cell.total}
                        </span>
                      )
                    ) : (
                      cell.reservations[0] && (
                        <span className="text-xs font-medium truncate px-1">
                          {cell.reservations[0].customerName.split(" ")[0]}
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
