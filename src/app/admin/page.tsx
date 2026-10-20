'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Calendar, Download, Search, CheckCircle, XCircle, 
  Clock, Shield, DollarSign, Settings, Plus, RefreshCw, ArrowLeft, Eye, LogOut 
} from 'lucide-react';
import { Registration, EventItem, SiteSettings } from '@/types';
import { exportRegistrationsToExcel } from '@/lib/excelExport';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'settings'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Estados de configuración editables
  const [bcvRate, setBcvRate] = useState(45.00);
  const [youtubeLive, setYoutubeLive] = useState('https://www.youtube.com/embed/0zMK_498_OM');
  const [adminEmail, setAdminEmail] = useState('notificaciones@rebotesports.com');
  const [savingSettings, setSavingSettings] = useState(false);

  // 1. Verificación de Autenticación con Supabase Auth
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUserEmail(session.user.email || null);
        setAuthChecking(false);
        fetchData();
      }
    }
    checkUser();
  }, [router]);

  // 2. Cargar datos reales desde Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar registros de participantes
      const { data: regs, error: regsError } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regs && !regsError) {
        setRegistrations(regs);
      }

      // Cargar configuración actual
      const { data: settings, error: settError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'general')
        .single();

      if (settings && !settError) {
        setBcvRate(Number(settings.bcv_rate) || 45.00);
        setYoutubeLive(settings.youtube_live_url || '');
        setAdminEmail(settings.admin_notification_email || '');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleUpdateStatus = async (id: string, newStatus: 'aprobado' | 'rechazado' | 'pendiente') => {
    // Optimistic UI update
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg({ ...selectedReg, status: newStatus });
    }

    try {
      await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          bcv_rate: bcvRate,
          youtube_live_url: youtubeLive,
          admin_notification_email: adminEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'general');

      if (error) throw error;
      alert('¡Configuración guardada en Supabase exitosamente!');
    } catch (err: any) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleExport = () => {
    exportRegistrationsToExcel(filtered, `Participantes_ReboteSports_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Filtrado de participantes
  const filtered = registrations.filter(r => {
    const matchesSearch = 
      r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id_doc?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Verificando sesión...</span>
        </div>
      </div>
    );
  }

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

        {/* Pestañas de navegación y Sesión */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
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

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Usuario y Logout */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all flex items-center gap-1.5 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Salir</span>
            </button>
          </div>
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
                  ${registrations.reduce((acc, r) => acc + (Number(r.payment_amount_usd) || 0), 0)} USD
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

                <button
                  onClick={fetchData}
                  title="Actualizar datos"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Botón Exportar a Excel */}
              <button
                onClick={handleExport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
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
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                          {loading ? 'Cargando participantes...' : 'No se encontraron inscripciones con ese criterio.'}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
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
                                  className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {item.status !== 'rechazado' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'rechazado')}
                                  title="Rechazar Pago"
                                  className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedReg(item)}
                                title="Ver Ficha Completa"
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
                  disabled={savingSettings}
                  onClick={handleSaveSettings}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingSettings ? 'Guardando en Supabase...' : 'Guardar Cambios'}
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
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs cursor-pointer"
              >
                Aprobar Inscripción
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReg.id, 'rechazado')}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs cursor-pointer"
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
