import { Reservation, Sport, COURTS, SPORTS_INFO } from "./data";

const CUSTOMER_NAMES = [
  "Carlos Mendoza", "María García", "Juan Pérez", "Ana Torres", "Luis Ramírez",
  "Sofía Díaz", "Pedro Castillo", "Carmen López", "Diego Flores", "Lucía Vargas",
  "Ricardo Silva", "Fernanda Ruiz", "Andrés Morales", "Valentina Castro", "Jorge Paredes",
  "Isabella Rojas", "Martín Herrera", "Camila Gutiérrez", "Gabriel Ortiz", "Paula Salazar",
];

const CUSTOMER_PHONES = [
  "987654321", "912345678", "956789012", "923456789", "945678901",
  "978901234", "934567890", "967890123", "901234567", "989012345",
  "954321098", "976543210", "943210987", "965432109", "932109876",
  "987612345", "912367890", "956712345", "923467890", "945612378",
];

function seededValue(seed: number, mod: number): number {
  return ((seed * 2654435761) >>> 0) % mod;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function generateReservations(): Reservation[] {
  const reservations: Reservation[] = [];
  const today = new Date(2026, 3, 4); // April 4, 2026 - fixed date for determinism
  const peakHours = [18, 19, 20, 21, 22];
  const paymentMethods: ("card" | "yape" | "plin")[] = ["card", "yape", "plin"];
  const statuses: ("confirmada" | "pendiente" | "cancelada")[] = ["confirmada", "confirmada", "confirmada", "pendiente", "cancelada"];

  for (let dayOffset = -30; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = formatDate(date);

    for (let ci = 0; ci < COURTS.length; ci++) {
      const court = COURTS[ci];
      for (let hour = 8; hour <= 23; hour++) {
        const seed = (dayOffset + 31) * 997 + ci * 131 + hour * 37;
        const shouldBook = seededValue(seed, 100);

        if (shouldBook < 35) {
          const isPeak = peakHours.includes(hour);
          const price = isPeak ? court.peakPricePerHour : court.pricePerHour;
          const nameIdx = seededValue(seed + 1, CUSTOMER_NAMES.length);
          const phoneIdx = seededValue(seed + 2, CUSTOMER_PHONES.length);
          const payIdx = seededValue(seed + 3, paymentMethods.length);
          const statusIdx = seededValue(seed + 4, statuses.length);
          const code = `AM-${String(seededValue(seed + 5, 999999)).padStart(6, "0")}`;

          reservations.push({
            id: `res-${dayOffset + 31}-${ci}-${hour}`,
            code,
            courtId: court.id,
            sport: court.sport,
            date: dateStr,
            time: `${String(hour).padStart(2, "0")}:00`,
            duration: 1,
            customerName: CUSTOMER_NAMES[nameIdx],
            customerPhone: CUSTOMER_PHONES[phoneIdx],
            customerEmail: `${CUSTOMER_NAMES[nameIdx].toLowerCase().replace(/ /g, ".").replace(/[áéíóú]/g, c => ({á:"a",é:"e",í:"i",ó:"o",ú:"u"} as Record<string,string>)[c] || c)}@gmail.com`,
            paymentMethod: paymentMethods[payIdx],
            amount: price,
            status: statuses[statusIdx],
            createdAt: dateStr + `T${String(Math.min(hour - 1, 23)).padStart(2, "0")}:${String(seededValue(seed + 6, 60)).padStart(2, "0")}:00`,
          });
        }
      }
    }
  }

  return reservations.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
}

export const MOCK_RESERVATIONS: Reservation[] = generateReservations();

export function getMonthStats(reservations: Reservation[]) {
  const now = new Date(2026, 3, 4);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthReservations = reservations.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const confirmed = monthReservations.filter(r => r.status === "confirmada");
  const revenue = confirmed.reduce((sum, r) => sum + r.amount, 0);
  const cancellations = monthReservations.filter(r => r.status === "cancelada").length;

  const totalSlots = 4 * COURTS.length * 16; // days so far * courts * hours
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
  const today = new Date(2026, 3, 4);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
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
