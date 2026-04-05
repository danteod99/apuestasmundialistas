import type { Court, Reservation, Sport, ReservationStatus, PaymentMethod } from "./data";

export interface CourtRow {
  id: string;
  name: string;
  sport: string;
  sport_label: string;
  description: string;
  capacity: string;
  surface: string;
  features: string[];
  image: string;
  price_per_hour: number;
  peak_price_per_hour: number;
  is_active: boolean;
  created_at: string;
}

export interface ReservationRow {
  id: string;
  code: string;
  court_id: string;
  sport: string;
  date: string;
  time: string;
  duration: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
}

export function courtFromRow(row: CourtRow): Court & { isActive: boolean } {
  return {
    id: row.id,
    name: row.name,
    sport: row.sport as Sport,
    sportLabel: row.sport_label,
    description: row.description,
    capacity: row.capacity,
    surface: row.surface,
    features: row.features,
    image: row.image,
    pricePerHour: row.price_per_hour,
    peakPricePerHour: row.peak_price_per_hour,
    isActive: row.is_active,
  };
}

export function reservationFromRow(row: ReservationRow): Reservation {
  return {
    id: row.id,
    code: row.code,
    courtId: row.court_id,
    sport: row.sport as Sport,
    date: row.date,
    time: row.time,
    duration: row.duration,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || "",
    paymentMethod: row.payment_method as PaymentMethod,
    amount: row.amount,
    status: row.status as ReservationStatus,
    createdAt: row.created_at,
  };
}
