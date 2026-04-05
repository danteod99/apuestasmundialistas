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
