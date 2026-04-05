"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AMENITIES, BENEFITS, SPORTS_INFO, type Court } from "@/lib/data";
import { fetchActiveCourts } from "@/lib/supabase-queries";

export default function Home() {
  const sportGroups = Object.entries(SPORTS_INFO);
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    fetchActiveCourts().then(setCourts);
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Disponibilidad en tiempo real
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Reserva tu Cancha<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              en Segundos
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Fútbol 7, 9 y 11, Vóley y Básquet. Consulta horarios, precios y disponibilidad al instante.
            Paga con tarjeta, Yape o Plin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-gray-900 text-lg font-bold rounded-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/30 hover:scale-105"
            >
              Reservar Ahora
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#canchas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              Ver Canchas
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
            {sportGroups.map(([key, info]) => (
              <div key={key} className="flex items-center gap-2 text-green-200 text-sm">
                <span className="text-xl">{info.icon}</span>
                <span>{info.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* AMENITIES BAR */}
      <section className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {AMENITIES.map((a) => (
              <div key={a.label} className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">{a.icon}</span>
                <span className="text-sm font-medium">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para jugar
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Desde la búsqueda hasta el pago, nuestra plataforma simplifica todo el proceso de reserva.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Elige tu Deporte y Cancha",
                desc: "Navega entre Fútbol 7, 9, 11, Vóley o Básquet. Filtra por tipo de superficie, capacidad y facilidades.",
                color: "bg-green-600",
              },
              {
                step: "02",
                title: "Selecciona Fecha y Hora",
                desc: "Visualiza la disponibilidad en tiempo real con nuestra grilla interactiva. Los precios varían según el horario.",
                color: "bg-blue-600",
              },
              {
                step: "03",
                title: "Paga y Confirma",
                desc: "Completa tu reserva pagando con tarjeta de crédito/débito, Yape o Plin. Recibe confirmación instantánea.",
                color: "bg-amber-500",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center text-lg font-bold mb-5`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
              Beneficios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Por qué elegirnos
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Nos enfocamos en brindarte la mejor experiencia deportiva, desde la reserva hasta el pitazo final.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors group">
                <span className="text-3xl flex-shrink-0 mt-1">{b.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CANCHAS */}
      <section id="canchas" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              Nuestras Canchas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Canchas para todos los deportes
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Instalaciones de primer nivel con el mejor mantenimiento. Elige la cancha perfecta para tu partido.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
              <div key={court.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: SPORTS_INFO[court.sport].color }}
                    >
                      {SPORTS_INFO[court.sport].icon} {court.sportLabel}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{court.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{court.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                      👥 {court.capacity}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                      🏟️ {court.surface}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-400">Desde</span>
                      <p className="text-xl font-bold text-green-600">S/{court.pricePerHour}</p>
                      <span className="text-xs text-gray-400">por hora</span>
                    </div>
                    <Link
                      href={`/reservas?court=${court.id}`}
                      className="inline-flex items-center gap-1 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Reservar
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-emerald-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para jugar?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Reserva tu cancha ahora y asegura el mejor horario para tu equipo. Disponibilidad en tiempo real.
          </p>
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 text-gray-900 text-lg font-bold rounded-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/30 hover:scale-105"
          >
            Ir a la Agenda de Reservas
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
