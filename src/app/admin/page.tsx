'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Users, Calendar, Download, Search, CheckCircle, XCircle, 
  Clock, Shield, DollarSign, Settings, Plus, RefreshCw, ArrowLeft, Eye, LogOut,
  Trash2, Edit, Check, AlertCircle, Tag, MapPin
} from 'lucide-react';
import { Registration, EventItem, SiteSettings } from '@/types';
import { exportRegistrationsToExcel } from '@/lib/excelExport';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'settings'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
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

  // Estados del Modal Crear Evento
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventSubtitle, setEventSubtitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Running');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('Maracay, Edo. Aragua');
  const [eventVenue, setEventVenue] = useState('Polideportivo de Las Delicias');
  const [eventPriceUsd, setEventPriceUsd] = useState<number | ''>(15);
  const [eventBannerUrl, setEventBannerUrl] = useState('/img/running-promo.jpeg');
  const [eventDescription, setEventDescription] = useState('');
  const [eventRequiresKit, setEventRequiresKit] = useState(true);
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [eventIsCombo, setEventIsCombo] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventError, setEventError] = useState('');

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

      // Cargar eventos existentes
      const { data: evts, error: evtsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (evts && !evtsError) {
        setEvents(evts);
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

  // Crear Nuevo Evento en Supabase
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    setEventError('');

    try {
      if (!eventTitle.trim() || !eventDate.trim() || !eventVenue.trim()) {
        throw new Error('Por favor completa todos los campos obligatorios del evento.');
      }

      // Generar slug limpio
      const generatedSlug = eventTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

      const newEventData = {
        slug: generatedSlug,
        title: eventTitle.trim(),
        subtitle: eventSubtitle.trim() || null,
        description: eventDescription.trim() || 'Evento deportivo oficial.',
        category: eventCategory,
        event_date: eventDate.trim(),
        event_time: eventTime.trim() || 'Por definir',
        location: eventLocation.trim(),
        venue: eventVenue.trim(),
        price_usd: Number(eventPriceUsd) || 0,
        banner_url: eventBannerUrl.trim() || '/img/running-promo.jpeg',
        is_featured: eventIsFeatured,
        is_combo: eventIsCombo,
        status: 'activo',
        requires_kit: eventRequiresKit
      };

      const { data, error } = await supabase
        .from('events')
        .insert([newEventData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEvents(prev => [data, ...prev]);
        setShowEventModal(false);
        // Reset form
        setEventTitle('');
        setEventSubtitle('');
        setEventDescription('');
        setEventDate('');
        setEventTime('');
        alert('¡Evento creado exitosamente y publicado en la base de datos!');
      }
    } catch (err: any) {
      setEventError(err.message || 'Error al crear el evento');
    } finally {
      setSavingEvent(false);
    }
  };

  // Eliminar Evento
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el evento "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(`No se pudo eliminar: ${err.message}`);
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
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'events' 
                  ? 'bg-orange-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" /> Gestión de Eventos ({events.length})
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
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
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
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs cursor-pointer"
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

        {/* TAB 2: GESTIÓN DE EVENTOS (CREAR, EDITAR, PAUSAR) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            
            {/* Cabecera & Botón Crear */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  Próximos Eventos Publicados
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Agrega nuevas carreras, torneos o festivales para que aparezcan en el portal y los usuarios puedan inscribirse.
                </p>
              </div>

              <button
                onClick={() => setShowEventModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Crear Nuevo Evento
              </button>
            </div>

            {/* Listado de Eventos Existentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div className="relative h-44 w-full bg-slate-950">
                    <Image
                      src={evt.banner_url || '/img/running-promo.jpeg'}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-white border border-slate-700">
                        {evt.category}
                      </span>
                      {evt.is_combo && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-slate-950">
                          Combo
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 text-orange-400 font-mono font-black text-sm border border-slate-700">
                      ${evt.price_usd} USD
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white line-clamp-1 mb-1">{evt.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{evt.description}</p>
                      
                      <div className="space-y-1.5 text-[11px] text-slate-300 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-500" />
                          <span>{evt.event_date} - {evt.event_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        Slug: {evt.slug}
                      </span>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.title)}
                        title="Eliminar Evento"
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: CONFIGURACIÓN GENERAL & PAGOS */}
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

      {/* MODAL CREAR NUEVO EVENTO */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex justify-between items-center pb-3 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Publicar Nuevo Evento
                </h3>
              </div>
              <button 
                onClick={() => setShowEventModal(false)} 
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {eventError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{eventError}</span>
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Nombre Oficial del Evento *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ej. Maratón del Sol 10K / Copa Baloncesto Navideña"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subtítulo o Lema</label>
                  <input
                    type="text"
                    value={eventSubtitle}
                    onChange={(e) => setEventSubtitle(e.target.value)}
                    placeholder="Ej. Edición Especial 2026"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Categoría</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  >
                    <option value="Running">Running / Carrera</option>
                    <option value="Baloncesto">Baloncesto</option>
                    <option value="Familiar">Familiar / Concierto</option>
                    <option value="Ciclismo">Ciclismo</option>
                    <option value="Combo">Combo Trilogía</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Fecha del Evento *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Ej. Domingo 20 de Diciembre"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Hora de Inicio</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="Ej. 07:00 AM"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Lugar / Sede *</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="Ej. Polideportivo de Las Delicias"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Precio de Inscripción (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={eventPriceUsd}
                    onChange={(e) => setEventPriceUsd(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="15.00"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Imagen de Portada (URL o /img/...)</label>
                <input
                  type="text"
                  value={eventBannerUrl}
                  onChange={(e) => setEventBannerUrl(e.target.value)}
                  placeholder="/img/running-promo.jpeg o enlace https://..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Descripción Completa</label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Detalles del recorrido, qué incluye el kit, hidratación, etc."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventRequiresKit}
                    onChange={(e) => setEventRequiresKit(e.target.checked)}
                    className="rounded border-slate-700 text-orange-500 focus:ring-0"
                  />
                  <span>Requiere selección de Franela / Kit de Corredor</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventIsCombo}
                    onChange={(e) => setEventIsCombo(e.target.checked)}
                    className="rounded border-slate-700 text-orange-500 focus:ring-0"
                  />
                  <span>Es un Pase Combo (Múltiples Días)</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingEvent ? 'Guardando...' : 'Publicar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ficha de Participante */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-800">
              <span className="font-mono font-black text-orange-400 text-lg">{selectedReg.code}</span>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer">
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
