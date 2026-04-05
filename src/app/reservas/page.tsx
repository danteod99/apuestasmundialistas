"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { COURTS, SPORTS_INFO, generateTimeSlots, type Court, type TimeSlot, type Sport } from "@/lib/data";

type PaymentMethod = "card" | "yape" | "plin" | null;
type BookingStep = "select" | "payment" | "confirmation";

export default function ReservasPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [selectedSport, setSelectedSport] = useState<Sport | "all">("all");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<BookingStep>("select");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Read court param from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courtId = params.get("court");
    if (courtId) {
      const court = COURTS.find((c) => c.id === courtId);
      if (court) {
        setSelectedCourt(court);
        setSelectedSport(court.sport);
      }
    }
  }, []);

  const filteredCourts = useMemo(() => {
    if (selectedSport === "all") return COURTS;
    return COURTS.filter((c) => c.sport === selectedSport);
  }, [selectedSport]);

  const timeSlots = useMemo(() => {
    if (!selectedCourt) return [];
    return generateTimeSlots(selectedCourt, selectedDate);
  }, [selectedCourt, selectedDate]);

  const handleDateChange = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split("T")[0]);
    setSelectedSlot(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleProceedToPayment = () => {
    if (selectedCourt && selectedSlot) {
      setStep("payment");
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod || !contactName || !contactPhone) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const handleReset = () => {
    setSelectedSlot(null);
    setStep("select");
    setPaymentMethod(null);
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  };

  const reservationCode = useMemo(() => {
    return "AM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="text-lg font-bold text-gray-900">
              Apuestas<span className="text-green-600">Mundialistas</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs / Steps */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <button
            onClick={() => { if (step !== "select") handleReset(); }}
            className={`font-medium ${step === "select" ? "text-green-600" : "text-gray-400 hover:text-green-600 cursor-pointer"}`}
          >
            1. Seleccionar
          </button>
          <span className="text-gray-300">/</span>
          <span className={`font-medium ${step === "payment" ? "text-green-600" : "text-gray-400"}`}>
            2. Pagar
          </span>
          <span className="text-gray-300">/</span>
          <span className={`font-medium ${step === "confirmation" ? "text-green-600" : "text-gray-400"}`}>
            3. Confirmación
          </span>
        </div>

        {step === "select" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar - filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sport filter */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Deporte</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedSport("all"); setSelectedCourt(null); setSelectedSlot(null); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSport === "all" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Todos
                  </button>
                  {Object.entries(SPORTS_INFO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedSport(key as Sport); setSelectedCourt(null); setSelectedSlot(null); }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedSport === key ? "bg-green-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{info.icon}</span> {info.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date picker */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Fecha</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDateChange(-1)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => handleDateChange(1)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center capitalize">
                  {formatDate(selectedDate)}
                </p>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Leyenda</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded bg-green-100 border-2 border-green-400" />
                    <span className="text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded bg-red-100 border-2 border-red-400" />
                    <span className="text-gray-600">Ocupado</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-400" />
                    <span className="text-gray-600">Seleccionado</span>
                  </div>
                </div>
              </div>

              {/* Selection summary */}
              {selectedCourt && selectedSlot && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-3">Tu Reserva</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Cancha:</strong> {selectedCourt.name}</p>
                    <p><strong>Deporte:</strong> {selectedCourt.sportLabel}</p>
                    <p className="capitalize"><strong>Fecha:</strong> {formatDate(selectedDate)}</p>
                    <p><strong>Hora:</strong> {selectedSlot.time}</p>
                    <p className="text-xl font-bold text-green-800 mt-3">S/{selectedSlot.price}.00</p>
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full mt-4 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md"
                  >
                    Proceder al Pago
                  </button>
                </div>
              )}
            </div>

            {/* Main content - grid */}
            <div className="lg:col-span-3">
              {!selectedCourt ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Elige una cancha</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredCourts.map((court) => (
                      <button
                        key={court.id}
                        onClick={() => { setSelectedCourt(court); setSelectedSlot(null); }}
                        className="text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-300 transition-all group"
                      >
                        <div className="h-36 bg-gray-200 overflow-hidden">
                          <img
                            src={court.image}
                            alt={court.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: SPORTS_INFO[court.sport].color }}
                            >
                              {SPORTS_INFO[court.sport].icon} {court.sportLabel}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900">{court.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{court.surface} · {court.capacity}</p>
                          <p className="text-lg font-bold text-green-600 mt-2">Desde S/{court.pricePerHour}/hr</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setSelectedCourt(null); setSelectedSlot(null); }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedCourt.name}</h2>
                        <p className="text-sm text-gray-500">{selectedCourt.sportLabel} · {selectedCourt.surface}</p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: SPORTS_INFO[selectedCourt.sport].color }}
                    >
                      {SPORTS_INFO[selectedCourt.sport].icon} {selectedCourt.sportLabel}
                    </span>
                  </div>

                  {/* Time slots grid */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        Horarios para el {formatDate(selectedDate)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot?.time === slot.time;
                        return (
                          <button
                            key={slot.time}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`relative p-4 rounded-xl text-center transition-all border-2 ${
                              isSelected
                                ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200 shadow-md"
                                : slot.available
                                ? "bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400 hover:shadow-sm cursor-pointer"
                                : "bg-red-50 border-red-200 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <p className={`text-lg font-bold ${isSelected ? "text-blue-700" : slot.available ? "text-gray-900" : "text-gray-400"}`}>
                              {slot.time}
                            </p>
                            <p className={`text-sm font-semibold mt-1 ${isSelected ? "text-blue-600" : slot.available ? "text-green-600" : "text-red-400 line-through"}`}>
                              S/{slot.price}
                            </p>
                            {!slot.available && (
                              <span className="absolute top-2 right-2 text-xs font-medium text-red-500">Ocupado</span>
                            )}
                            {isSelected && (
                              <span className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Facilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourt.features.map((f) => (
                        <span key={f} className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "payment" && selectedCourt && selectedSlot && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Summary */}
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <h2 className="text-xl font-bold mb-4">Resumen de Reserva</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-200">Cancha</p>
                    <p className="font-semibold">{selectedCourt.name}</p>
                  </div>
                  <div>
                    <p className="text-green-200">Deporte</p>
                    <p className="font-semibold">{selectedCourt.sportLabel}</p>
                  </div>
                  <div>
                    <p className="text-green-200">Fecha</p>
                    <p className="font-semibold capitalize">{formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-green-200">Hora</p>
                    <p className="font-semibold">{selectedSlot.time} - {parseInt(selectedSlot.time)}:59</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-500 flex items-center justify-between">
                  <span className="text-green-200">Total a pagar</span>
                  <span className="text-3xl font-bold">S/{selectedSlot.price}.00</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Datos de Contacto</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+51 999 888 777"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Método de Pago</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === "card"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">💳</div>
                      <p className="text-xs font-semibold text-gray-700">Tarjeta</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("yape")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === "yape"
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">📱</div>
                      <p className="text-xs font-semibold text-gray-700">Yape</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("plin")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === "plin"
                          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">📲</div>
                      <p className="text-xs font-semibold text-gray-700">Plin</p>
                    </button>
                  </div>
                </div>

                {/* Card details */}
                {paymentMethod === "card" && (
                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Yape instructions */}
                {paymentMethod === "yape" && (
                  <div className="p-5 bg-purple-50 rounded-xl border border-purple-200 text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4 shadow-inner">
                      <div className="text-center">
                        <p className="text-6xl mb-2">📱</p>
                        <p className="text-xs text-gray-500 font-medium">QR de Yape</p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-700 font-medium">Escanea el QR con tu app de Yape</p>
                    <p className="text-xs text-purple-500 mt-1">O envía S/{selectedSlot.price}.00 al número <strong>999-888-777</strong></p>
                  </div>
                )}

                {/* Plin instructions */}
                {paymentMethod === "plin" && (
                  <div className="p-5 bg-teal-50 rounded-xl border border-teal-200 text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4 shadow-inner">
                      <div className="text-center">
                        <p className="text-6xl mb-2">📲</p>
                        <p className="text-xs text-gray-500 font-medium">QR de Plin</p>
                      </div>
                    </div>
                    <p className="text-sm text-teal-700 font-medium">Escanea el QR con tu app bancaria (Plin)</p>
                    <p className="text-xs text-teal-500 mt-1">O envía S/{selectedSlot.price}.00 al número <strong>999-888-777</strong></p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!paymentMethod || !contactName || !contactPhone || processing}
                    className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all shadow-md ${
                      !paymentMethod || !contactName || !contactPhone || processing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"
                    }`}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Procesando pago...
                      </span>
                    ) : (
                      `Confirmar Pago — S/${selectedSlot.price}.00`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "confirmation" && selectedCourt && selectedSlot && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h2>
              <p className="text-gray-500 mb-6">Tu cancha ha sido reservada exitosamente.</p>

              <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Código</span>
                  <span className="font-bold text-gray-900">{reservationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cancha</span>
                  <span className="font-semibold text-gray-900">{selectedCourt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-semibold text-gray-900 capitalize">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hora</span>
                  <span className="font-semibold text-gray-900">{selectedSlot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pago</span>
                  <span className="font-semibold text-gray-900">
                    {paymentMethod === "card" ? "💳 Tarjeta" : paymentMethod === "yape" ? "📱 Yape" : "📲 Plin"}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-500">Total</span>
                  <span className="text-xl font-bold text-green-600">S/{selectedSlot.price}.00</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Se ha enviado un correo de confirmación a {contactEmail || "tu email"}.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Nueva Reserva
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-center"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
