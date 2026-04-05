import type { Reservation, Sport } from "./data";
import { SPORTS_INFO } from "./data";

export function getMonthStats(reservations: Reservation[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthReservations = reservations.filter(r => {
    const d = new Date(r.date + "T00:00:00");
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const confirmed = monthReservations.filter(r => r.status === "confirmada");
  const revenue = confirmed.reduce((sum, r) => sum + r.amount, 0);
  const cancellations = monthReservations.filter(r => r.status === "cancelada").length;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const totalSlots = dayOfMonth * 9 * 16; // days so far * courts * hours
  const occupancyRate = totalSlots > 0 ? Math.round((confirmed.length / totalSlots) * 100) : 0;

  return {
    revenue,
    totalBookings: monthReservations.length,
    occupancyRate: Math.min(occupancyRate, 100),
    cancellations,
  };
}

export function getBookingsBySport(reservations: Reservation[]) {
  const counts: Record<Sport, number> = { futbol7: 0, futbol9: 0, futbol11: 0, voley: 0, basquet: 0 };
  reservations.forEach(r => {
    if (r.status !== "cancelada") counts[r.sport]++;
  });
  return (Object.keys(counts) as Sport[]).map(sport => ({
    label: SPORTS_INFO[sport].label,
    value: counts[sport],
    color: SPORTS_INFO[sport].color,
  }));
}

export function getRevenueLast7Days(reservations: Reservation[]) {
  const days: { label: string; value: number; color: string }[] = [];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    const dayRevenue = reservations
      .filter(r => r.date === dateStr && r.status === "confirmada")
      .reduce((sum, r) => sum + r.amount, 0);
    days.push({
      label: dayNames[d.getDay()],
      value: dayRevenue,
      color: "#22c55e",
    });
  }
  return days;
}
