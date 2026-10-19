'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, Ticket, Calendar, CheckCircle2, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Registration } from '@/types';

export default function ConsultarPage() {
  const [code, setCode] = useState('');
  const [idDoc, setIdDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Registration | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch(`/api/search-ticket?code=${encodeURIComponent(code.trim())}&id_doc=${encodeURIComponent(idDoc.trim())}`);
      const data = await res.json();

      if (res.ok && data.registration) {
        setResult(data.registration);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>

        <div className="text-center mb-10">
          <span className="text-xs uppercase font-black tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-3">
            Consulta de Estado
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Consultar Mi <span className="text-orange-500">Inscripción</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Ingresa tu código de registro o número de documento para verificar tu estatus de acreditación.
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Código de Ticket (Ej: RB-123456)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="RB-XXXXXX"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none uppercase font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">O Cédula de Identidad</label>
              <input
                type="text"
                value={idDoc}
                onChange={(e) => setIdDoc(e.target.value)}
                placeholder="Ej. V-20123456"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!code && !idDoc)}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Consultando...' : <><Search className="w-4 h-4" /> Buscar Mi Registro</>}
          </button>
        </form>

        {notFound && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-sm">
            No se encontró ninguna inscripción con los datos proporcionados. Verifica el código o comunícate al soporte por WhatsApp (0414-4780475).
          </div>
        )}

        {result && (
          <div className="bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-orange-400 font-mono font-black text-lg">
                <Ticket className="w-5 h-5" /> {result.code}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                result.status === 'aprobado' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {result.status === 'aprobado' ? 'Cupo Confirmado' : 'Verificación Pendiente'}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">Participante:</span>
                <span className="font-bold text-white text-base">{result.full_name} ({result.id_doc})</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Evento Registrado:</span>
                <span className="font-bold text-orange-400">{result.event_name}</span>
              </div>
              {result.modality && (
                <div>
                  <span className="text-xs text-slate-500 block">Modalidad:</span>
                  <span className="text-slate-300">{result.modality}</span>
                </div>
              )}
              {result.shirt_size && (
                <div>
                  <span className="text-xs text-slate-500 block">Talla de Franela:</span>
                  <span className="text-slate-300 font-bold">{result.shirt_size}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-slate-500 block">Método de Pago Reportado:</span>
                <span className="text-slate-300">{result.payment_method.toUpperCase()} - Ref: {result.payment_reference || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Lleva tu código al momento de retirar tu kit en la Concha Acústica de Maracay.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
