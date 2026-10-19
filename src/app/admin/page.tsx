'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Calendar, Download, Search, CheckCircle, XCircle, 
  Clock, Shield, DollarSign, Settings, Plus, RefreshCw, ArrowLeft, Eye 
} from 'lucide-react';
import { Registration, EventItem, SiteSettings } from '@/types';
import { exportRegistrationsToExcel } from '@/lib/excelExport';

// Participantes de ejemplo para visualización inmediata
const mockRegistrations: Registration[] = [
  {
    id: 'reg-1',
    event_name: 'Pase Trilogía Solidaria (3 Días)',
    code: 'RB-829144',
    full_name: 'Carlos Eduardo Mendoza',
    id_doc: 'V-19845123',
    email: 'carlos.mendoza@gmail.com',
    phone: '0414-1234567',
    age: 29,
    gender: 'Masculino',
    shirt_size: 'L',
    modality: 'Carrera 8K',
    payment_method: 'pagomovil',
    payment_reference: '084920',
    payment_amount_usd: 20,
    payment_amount_bs: 900,
    status: 'aprobado',
    created_at: new Date().toISOString()
  },
  {
    id: 'reg-2',
    event_name: 'Running VZLA 8K — Solidarios con La Guaira',
    code: 'RB-492102',
    full_name: 'Mariangel Gómez',
    id_doc: 'V-24510982',
    email: 'mariangel.g@hotmail.com',
    phone: '0412-9876543',
    age: 24,
    gender: 'Femenino',
    shirt_size: 'S',
    modality: 'Caminata 8K',
    payment_method: 'zelle',
    payment_reference: 'ZLL-98214',
    payment_amount_usd: 15,
    status: 'pendiente',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'reg-3',
    event_name: 'Cuadrangular de Baloncesto Libre',
    code: 'RB-110294',
    full_name: 'José Gregorio Salazar',
    id_doc: 'V-16200114',
    email: 'jsalazar@araguaball.com',
    phone: '0424-3456789',
    age: 32,
    gender: 'Masculino',
    modality: 'Espectador General',
    payment_method: 'efectivo',
    payment_amount_usd: 10,
    status: 'pendiente',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'settings'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Estados de configuración editables
  const [bcvRate, setBcvRate] = useState(45.00);
  const [youtubeLive, setYoutubeLive] = useState('https://www.youtube.com/embed/live_stream?channel=UCexample');
  const [adminEmail, setAdminEmail] = useState('notificaciones@rebotesports.com');

  // Filtrado de participantes
  const filtered = registrations.filter(r => {
    const matchesSearch = 
      r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id_doc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: 'aprobado' | 'rechazado' | 'pendiente') => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg({ ...selectedReg, status: newStatus });
    }
  };

  const handleExport = () => {
    exportRegistrationsToExcel(filtered, `Participantes_ReboteSports_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      
      {/* Topbar Admin */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" /> Ver Web
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="font-black text-sm uppercase tracking-wider text-white">
              Panel Administrativo <span className="text-orange-500">Rebote Sports</span>
            </h1>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'registrations' 
                ? 'bg-orange-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Participantes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'settings' 
                ? 'bg-orange-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Configuración & Pagos
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        
        {/* TAB 1: GESTIÓN DE PARTICIPANTES */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Tarjetas de Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 font-medium">Total Inscritos</span>
                <div className="text-2xl font-black text-white mt-1">{registrations.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-emerald-400 font-medium">Pagos Aprobados</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {registrations.filter(r => r.status === 'aprobado').length}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-amber-400 font-medium">Por Verificar</span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {registrations.filter(r => r.status === 'pendiente').length}
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-orange-400 font-medium">Recaudación Estimada</span>
                <div className="text-2xl font-black text-orange-400 mt-1">
                  ${registrations.reduce((acc, r) => acc + (r.payment_amount_usd || 0), 0)} USD
                </div>
              </div>
            </div>

            {/* Barra de Filtros & Botón de Exportación */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, código o cédula..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-orange-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none w-full sm:w-auto"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="rechazado">Rechazados</option>
                </select>
              </div>

              {/* Botón Exportar a Excel */}
              <button
                onClick={handleExport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" /> Exportar a Excel ({filtered.length})
              </button>
            </div>

            {/* Tabla de Registros */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">Código / Fecha</th>
                      <th className="py-4 px-6">Participante</th>
                      <th className="py-4 px-6">Evento / Modalidad</th>
                      <th className="py-4 px-6">Pago & Ref</th>
                      <th className="py-4 px-6">Talla</th>
                      <th className="py-4 px-6">Estatus</th>
                      <th className="py-4 px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-black text-orange-400 block">{item.code}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(item.created_at).toLocaleDateString('es-VE')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-sm">{item.full_name}</div>
                          <div className="text-[11px] text-slate-400">{item.id_doc} • {item.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-200">{item.event_name}</div>
                          <div className="text-[10px] text-orange-400">{item.modality || 'General'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">${item.payment_amount_usd} USD</div>
                          <div className="text-[10px] text-slate-400 uppercase">
                            {item.payment_method} {item.payment_reference ? `(Ref: ${item.payment_reference})` : ''}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                            {item.shirt_size || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.status === 'aprobado'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'rechazado'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status !== 'aprobado' && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'aprobado')}
                                title="Aprobar Pago"
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {item.status !== 'rechazado' && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'rechazado')}
                                title="Rechazar Pago"
                                className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedReg(item)}
                              title="Ver Ficha Completa"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CONFIGURACIÓN GENERAL & PAGOS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Configuración del Sistema
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ajusta la tasa BCV, el correo de notificaciones automáticas y el enlace del YouTube Live.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Tasa de Cambio BCV (Bs. por USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bcvRate}
                  onChange={(e) => setBcvRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Correo Electrónico para Recibir Nuevas Inscripciones *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  A esta dirección le llegará una alerta inmediata cada vez que alguien complete el formulario.
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  URL del Video o Transmisión en Vivo de YouTube
                </label>
                <input
                  type="text"
                  value={youtubeLive}
                  onChange={(e) => setYoutubeLive(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => alert('¡Configuración guardada exitosamente!')}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal Ficha de Participante */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-800">
              <span className="font-mono font-black text-orange-400 text-lg">{selectedReg.code}</span>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-white text-sm font-bold">
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div><strong className="text-slate-400">Atleta:</strong> <span className="text-white font-bold">{selectedReg.full_name}</span></div>
              <div><strong className="text-slate-400">Cédula:</strong> <span className="text-white">{selectedReg.id_doc}</span></div>
              <div><strong className="text-slate-400">Teléfono:</strong> <span className="text-white">{selectedReg.phone}</span></div>
              <div><strong className="text-slate-400">Correo:</strong> <span className="text-white">{selectedReg.email}</span></div>
              <div><strong className="text-slate-400">Evento:</strong> <span className="text-orange-400 font-bold">{selectedReg.event_name}</span></div>
              <div><strong className="text-slate-400">Talla Franela:</strong> <span className="text-white">{selectedReg.shirt_size || 'N/A'}</span></div>
              <div><strong className="text-slate-400">Método de Pago:</strong> <span className="text-white uppercase">{selectedReg.payment_method} - Ref: {selectedReg.payment_reference || 'N/A'}</span></div>
              <div><strong className="text-slate-400">Monto:</strong> <span className="text-emerald-400 font-bold">${selectedReg.payment_amount_usd} USD</span></div>
              <div><strong className="text-slate-400">Estatus Actual:</strong> <span className="uppercase font-bold text-white">{selectedReg.status}</span></div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleUpdateStatus(selectedReg.id, 'aprobado')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
              >
                Aprobar Inscripción
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReg.id, 'rechazado')}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
