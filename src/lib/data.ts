export type Sport = "futbol7" | "futbol9" | "futbol11" | "voley" | "basquet";
export type ReservationStatus = "confirmada" | "pendiente" | "cancelada";
export type PaymentMethod = "card" | "yape" | "plin";

export interface Reservation {
  id: string;
  code: string;
  courtId: string;
  sport: Sport;
  date: string;
  time: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface Court {
  id: string;
  name: string;
  sport: Sport;
  sportLabel: string;
  description: string;
  capacity: string;
  surface: string;
  features: string[];
  image: string;
  pricePerHour: number;
  peakPricePerHour: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

export const SPORTS_INFO: Record<Sport, { label: string; icon: string; color: string }> = {
  futbol7: { label: "Fútbol 7", icon: "⚽", color: "#22c55e" },
  futbol9: { label: "Fútbol 9", icon: "⚽", color: "#3b82f6" },
  futbol11: { label: "Fútbol 11", icon: "⚽", color: "#8b5cf6" },
  voley: { label: "Vóley", icon: "🏐", color: "#f59e0b" },
  basquet: { label: "Básquet", icon: "🏀", color: "#ef4444" },
};

export const COURTS: Court[] = [
  {
    id: "f7-1",
    name: "Cancha 1 - F7",
    sport: "futbol7",
    sportLabel: "Fútbol 7",
    description: "Cancha de grass sintético de última generación para partidos de Fútbol 7.",
    capacity: "14 jugadores",
    surface: "Grass Sintético",
    features: ["Iluminación LED", "Camerinos", "Estacionamiento"],
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop",
    pricePerHour: 180,
    peakPricePerHour: 210,
  },
  {
    id: "f7-2",
    name: "Cancha 2 - F7",
    sport: "futbol7",
    sportLabel: "Fútbol 7",
    description: "Cancha profesional con medidas reglamentarias para Fútbol 7.",
    capacity: "14 jugadores",
    surface: "Grass Sintético",
    features: ["Iluminación LED", "WiFi", "Baños"],
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop",
    pricePerHour: 180,
    peakPricePerHour: 210,
  },
  {
    id: "f7-3",
    name: "Cancha 3 - F7",
    sport: "futbol7",
    sportLabel: "Fútbol 7",
    description: "Cancha techada ideal para jugar en cualquier clima.",
    capacity: "14 jugadores",
    surface: "Grass Sintético",
    features: ["Techada", "Iluminación LED", "Cafetería"],
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    pricePerHour: 200,
    peakPricePerHour: 240,
  },
  {
    id: "f9-1",
    name: "Cancha F9 - (1 y 2)",
    sport: "futbol9",
    sportLabel: "Fútbol 9",
    description: "Cancha amplia de Fútbol 9 con dimensiones profesionales.",
    capacity: "18 jugadores",
    surface: "Grass Sintético",
    features: ["Iluminación LED", "Marcador electrónico", "Estacionamiento"],
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
    pricePerHour: 360,
    peakPricePerHour: 420,
  },
  {
    id: "f9-2",
    name: "Cancha F9 - (3 y 4)",
    sport: "futbol9",
    sportLabel: "Fútbol 9",
    description: "Cancha combinada de Fútbol 9 con grass sintético premium.",
    capacity: "18 jugadores",
    surface: "Grass Sintético Premium",
    features: ["Iluminación LED", "Tribunas", "WiFi"],
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600&h=400&fit=crop",
    pricePerHour: 360,
    peakPricePerHour: 420,
  },
  {
    id: "f11-1",
    name: "Cancha Principal - F11",
    sport: "futbol11",
    sportLabel: "Fútbol 11",
    description: "Cancha profesional de Fútbol 11 con medidas FIFA.",
    capacity: "22 jugadores",
    surface: "Grass Natural",
    features: ["Iluminación profesional", "Tribunas", "Camerinos VIP"],
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop",
    pricePerHour: 500,
    peakPricePerHour: 600,
  },
  {
    id: "v-1",
    name: "Cancha Vóley 1",
    sport: "voley",
    sportLabel: "Vóley",
    description: "Cancha de vóley con piso de caucho profesional y red reglamentaria.",
    capacity: "12 jugadores",
    surface: "Caucho Profesional",
    features: ["Iluminación LED", "Red profesional", "Baños"],
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    pricePerHour: 120,
    peakPricePerHour: 150,
  },
  {
    id: "v-2",
    name: "Cancha Vóley 2",
    sport: "voley",
    sportLabel: "Vóley",
    description: "Cancha de vóley arena para partidos recreativos.",
    capacity: "8 jugadores",
    surface: "Arena",
    features: ["Al aire libre", "Duchas", "Estacionamiento"],
    image: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&h=400&fit=crop",
    pricePerHour: 100,
    peakPricePerHour: 130,
  },
  {
    id: "b-1",
    name: "Cancha Básquet 1",
    sport: "basquet",
    sportLabel: "Básquet",
    description: "Cancha de básquetbol con tableros profesionales y piso de madera.",
    capacity: "10 jugadores",
    surface: "Madera",
    features: ["Techada", "Tableros profesionales", "Marcador"],
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    pricePerHour: 150,
    peakPricePerHour: 180,
  },
];

export function generateTimeSlots(court: Court, date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const peakHours = [18, 19, 20, 21, 22];
  const seed = date.split("-").reduce((a, b) => a + parseInt(b), 0) + court.id.charCodeAt(0);

  for (let hour = 8; hour <= 23; hour++) {
    const isPeak = peakHours.includes(hour);
    const price = isPeak ? court.peakPricePerHour : court.pricePerHour;
    const pseudoRandom = ((seed * 31 + hour * 17) % 100);
    const available = pseudoRandom > 30;

    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      available,
      price,
    });
  }

  return slots;
}

export const AMENITIES = [
  { icon: "🅿️", label: "Estacionamiento" },
  { icon: "📶", label: "WiFi" },
  { icon: "🚿", label: "Baños y Duchas" },
  { icon: "☕", label: "Cafetería" },
  { icon: "💡", label: "Iluminación Nocturna" },
  { icon: "🛡️", label: "Seguridad 24/7" },
];

export const BENEFITS = [
  {
    title: "Reserva en Tiempo Real",
    description: "Consulta disponibilidad y precios al instante. Sin llamadas, sin esperas.",
    icon: "⏱️",
  },
  {
    title: "Pagos Seguros",
    description: "Paga con tarjeta, Yape o Plin. Confirmación inmediata de tu reserva.",
    icon: "🔒",
  },
  {
    title: "Multi-Deporte",
    description: "Fútbol 7, 9 y 11, Vóley y Básquet. Todas las canchas en un solo lugar.",
    icon: "🏆",
  },
  {
    title: "Los Mejores Precios",
    description: "Tarifas competitivas con descuentos para horarios fuera de hora punta.",
    icon: "💰",
  },
  {
    title: "Ubicación Premium",
    description: "En el corazón de Lima con fácil acceso y amplio estacionamiento.",
    icon: "📍",
  },
  {
    title: "Instalaciones de Primera",
    description: "Grass sintético de última generación, iluminación LED y camerinos.",
    icon: "✨",
  },
];
