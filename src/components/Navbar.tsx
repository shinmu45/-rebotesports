'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Trophy, Video, Calendar, UserCheck, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo y Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform bg-slate-900">
              <Image 
                src="/img/rebote-sports-brand.jpeg" 
                alt="Rebote Sports Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-black text-xl tracking-wider uppercase text-white">
                REBOTE <span className="text-orange-500">SPORTS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Comunicando el deporte
              </span>
            </div>
          </Link>

          {/* Enlaces de Navegación Desktop */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link href="/#eventos" className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              Eventos
            </Link>
            <Link href="/#cronograma" className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-orange-500" />
              Cronograma
            </Link>
            <Link href="/#causa-social" className="text-slate-300 hover:text-orange-400 transition-colors">
              Causa Benéfica
            </Link>
            <Link href="/#transmisiones" className="text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1.5">
              <Video className="w-4 h-4 text-red-500" />
              En Vivo
            </Link>
          </div>

          {/* Acciones */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/consultar"
              className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              Consultar Ticket
            </Link>
            <Link
              href="/#registro"
              className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Inscribirme Ahora
            </Link>
            <Link 
              href="/admin" 
              title="Panel Administrativo"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Botón Móvil Hamburguesa */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link 
            href="/#eventos" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-orange-400 hover:bg-slate-900"
          >
            Eventos
          </Link>
          <Link 
            href="/#cronograma" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-orange-400 hover:bg-slate-900"
          >
            Cronograma del Fin de Semana
          </Link>
          <Link 
            href="/#causa-social" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-orange-400 hover:bg-slate-900"
          >
            Causa Solidaria
          </Link>
          <Link 
            href="/#transmisiones" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-900 flex items-center gap-2"
          >
            <Video className="w-4 h-4" /> Transmisiones en Vivo
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link 
              href="/consultar"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-200"
            >
              Consultar Mi Registro
            </Link>
            <Link
              href="/#registro"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md"
            >
              Inscribirme Ahora ($20 Trilogía)
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
