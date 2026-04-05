"use client";
import { useState, useEffect } from "react";
import { fetchCourts, updateCourtPrices, toggleCourtActive } from "@/lib/supabase-queries";
import { SPORTS_INFO, type Court } from "@/lib/data";

interface CourtWithActive extends Court {
  isActive: boolean;
}

export default function AdminCanchas() {
  const [courts, setCourts] = useState<CourtWithActive[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourt, setEditingCourt] = useState<CourtWithActive | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editPeakPrice, setEditPeakPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  async function loadCourts() {
    const data = await fetchCourts();
    setCourts(data as CourtWithActive[]);
  }

  useEffect(() => {
    loadCourts().finally(() => setLoading(false));
  }, []);

  const activeCourts = courts.filter(c => c.isActive);
  const avgPrice = activeCourts.length > 0
    ? Math.round(activeCourts.reduce((s, c) => s + c.pricePerHour, 0) / activeCourts.length)
    : 0;

  async function handleToggle(court: CourtWithActive) {
    const newActive = !court.isActive;
    setCourts(prev => prev.map(c => c.id === court.id ? { ...c, isActive: newActive } : c));
    await toggleCourtActive(court.id, newActive);
  }

  function openEdit(court: CourtWithActive) {
    setEditingCourt(court);
    setEditPrice(court.pricePerHour);
    setEditPeakPrice(court.peakPricePerHour);
  }

  async function saveEdit() {
    if (!editingCourt) return;
    setSaving(true);
    await updateCourtPrices(editingCourt.id, editPrice, editPeakPrice);
    setCourts(prev => prev.map(c =>
      c.id === editingCourt.id
        ? { ...c, pricePerHour: editPrice, peakPricePerHour: editPeakPrice }
        : c
    ));
    setEditingCourt(null);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{courts.length}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Canchas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{activeCourts.length}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Activas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">S/{avgPrice}</p>
          <p className="text-xs text-gray-500 uppercase font-semibold">Precio Promedio/hr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courts.map((court) => {
          const sportInfo = SPORTS_INFO[court.sport];
          return (
            <div key={court.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${!court.isActive ? "opacity-60" : ""}`}>
              <div className="relative h-40">
                <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: sportInfo.color }}>{sportInfo.label}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{court.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{court.surface} · {court.capacity}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div><span className="text-gray-400">Normal: </span><span className="font-bold text-gray-900">S/{court.pricePerHour}</span></div>
                  <div><span className="text-gray-400">Punta: </span><span className="font-bold text-amber-600">S/{court.peakPricePerHour}</span></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleToggle(court)} className="flex items-center gap-2">
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${!court.isActive ? "bg-gray-300" : "bg-green-500"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${!court.isActive ? "left-1" : "left-5"}`} />
                    </div>
                    <span className={`text-xs font-semibold ${!court.isActive ? "text-gray-400" : "text-green-600"}`}>
                      {court.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </button>
                  <button onClick={() => openEdit(court)} className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Editar Precios
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditingCourt(null)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Editar {editingCourt.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio por Hora (S/)</label>
                <input type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Hora Punta (S/)</label>
                <input type="number" value={editPeakPrice} onChange={e => setEditPeakPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                <p><strong>Superficie:</strong> {editingCourt.surface}</p>
                <p><strong>Capacidad:</strong> {editingCourt.capacity}</p>
                <p><strong>Deporte:</strong> {editingCourt.sportLabel}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingCourt(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancelar</button>
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
