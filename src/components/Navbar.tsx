"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="text-lg font-bold text-gray-900">
              Apuestas<span className="text-green-600">Mundialistas</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Funcionalidades
            </a>
            <a href="#beneficios" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Beneficios
            </a>
            <a href="#canchas" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Canchas
            </a>
            <Link
              href="/reservas"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md shadow-green-600/20"
            >
              Reservar Ahora
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4 flex flex-col gap-3">
            <a href="#funcionalidades" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-green-600 px-2 py-1">
              Funcionalidades
            </a>
            <a href="#beneficios" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-green-600 px-2 py-1">
              Beneficios
            </a>
            <a href="#canchas" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-green-600 px-2 py-1">
              Canchas
            </a>
            <Link
              href="/reservas"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
            >
              Reservar Ahora
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
