import { supabase } from "./supabase";
import type { Court, Reservation } from "./data";
import { courtFromRow, reservationFromRow, type CourtRow, type ReservationRow } from "./supabase-types";

// -- Courts --

export async function fetchCourts(): Promise<(Court & { isActive: boolean })[]> {
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .order("id");
  if (error) throw error;
  return (data as CourtRow[]).map(courtFromRow);
}

export async function fetchActiveCourts(): Promise<Court[]> {
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .eq("is_active", true)
    .order("id");
  if (error) throw error;
  return (data as CourtRow[]).map(courtFromRow);
}

export async function updateCourtPrices(
  courtId: string,
  pricePerHour: number,
  peakPricePerHour: number
): Promise<void> {
  const { error } = await supabase
    .from("courts")
    .update({ price_per_hour: pricePerHour, peak_price_per_hour: peakPricePerHour })
    .eq("id", courtId);
  if (error) throw error;
}

export async function toggleCourtActive(courtId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from("courts")
    .update({ is_active: isActive })
    .eq("id", courtId);
  if (error) throw error;
}

// -- Reservations --

export async function fetchReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as ReservationRow[]).map(reservationFromRow);
}

export async function fetchReservationsByDateRange(
  dateFrom: string,
  dateTo: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("date", dateFrom)
    .lte("date", dateTo)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as ReservationRow[]).map(reservationFromRow);
}

export async function fetchReservationsForCourtAndDate(
  courtId: string,
  date: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("court_id", courtId)
    .eq("date", date)
    .neq("status", "cancelada");
  if (error) throw error;
  return (data as ReservationRow[]).map(reservationFromRow);
}

export async function createReservation(reservation: {
  code: string;
  courtId: string;
  sport: string;
  date: string;
  time: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  amount: number;
  status: string;
}): Promise<Reservation> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      code: reservation.code,
      court_id: reservation.courtId,
      sport: reservation.sport,
      date: reservation.date,
      time: reservation.time,
      duration: reservation.duration,
      customer_name: reservation.customerName,
      customer_phone: reservation.customerPhone,
      customer_email: reservation.customerEmail,
      payment_method: reservation.paymentMethod,
      amount: reservation.amount,
      status: reservation.status,
    })
    .select()
    .single();
  if (error) throw error;
  return reservationFromRow(data as ReservationRow);
}

export async function updateReservationStatus(
  id: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
