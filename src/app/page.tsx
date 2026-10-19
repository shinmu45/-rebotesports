import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Trophy, Heart, ArrowRight, CheckCircle, Flame, Star, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import YoutubeLive from '@/components/YoutubeLive';
import { EventItem, SiteSettings } from '@/types';

// Datos por defecto (mientras se sincroniza Supabase en producción)
const initialEvents: EventItem[] = [
  {
    id: 'evt-combo-1',
    slug: 'combo-trilogia-solidaria',
    title: 'Pase Trilogía Solidaria (3 Días)',
    subtitle: 'Acceso Total: Basket + Festival Familiar + Expo Running 8K',
    description: 'Disfruta de los tres grandes eventos deportivos y familiares con un solo pase unificado de $20. Todo lo recaudado suma alimentos no perecederos y juguetes para niños y familias asistidas en Aragua, La Guaira y centros de salud.',
    category: 'Combo',
    event_date: '20, 21 y 22 de Noviembre',
    event_time: 'A partir de las 8:00 AM',
    location: 'Maracay, Edo. Aragua',
    venue: 'Polideportivo Las Delicias y Concha Acústica',
    price_usd: 20.00,
    banner_url: '/img/running-hero.jpeg',
    is_featured: true,
    is_combo: true,
    status: 'activo',
    requires_kit: true
  },
  {
    id: 'evt-running-2',
    slug: 'running-vzla-8k',
    title: 'Running VZLA 8K — Solidarios con La Guaira',
    subtitle: 'Carrera 8K, Caminata y Gran Expo de Patrocinantes',
    description: 'El gran cierre dominical. Recorrido atlético certificado de 8K por las principales arterias de Maracay, con punto de partida en el Polideportivo Las Delicias y expo de stands.',
    category: 'Running',
    event_date: 'Domingo 22 de Noviembre',
    event_time: '08:00 AM (Salida oficial)',
    location: 'Maracay, Edo. Aragua',
    venue: 'Polideportivo de Las Delicias',
    price_usd: 15.00,
    banner_url: '/img/running-promo.jpeg',
    is_featured: true,
    is_combo: false,
    status: 'activo',
    requires_kit: true
  },
  {
    id: 'evt-basket-3',
    slug: 'torneo-cuadrangular-basket',
    title: 'Cuadrangular de Baloncesto Libre',
    subtitle: 'Selecciones de Aragua, Guárico, Ocumare de la Costa y Bahía de Cata',
    description: 'Encuentro estelar de baloncesto de alta intensidad con las selecciones líderes de la costa y el centro del país. Arranque de los motores de la gran trilogía.',
    category: 'Baloncesto',
    event_date: 'Viernes 20 de Noviembre',
    event_time: '10:00 AM',
    location: 'Maracay, Edo. Aragua',
    venue: 'Polideportivo de Las Delicias',
    price_usd: 10.00,
    banner_url: '/img/basket-bullking.jpeg',
    is_featured: false,
    is_combo: false,
    status: 'activo',
    requires_kit: false
  },
  {
    id: 'evt-festival-4',
    slug: 'festival-familia-amamos-vzla',
    title: 'Festival a la Familia "Amamos a Venezuela"',
    subtitle: 'Concierto en vivo, recreación y centro de acopio solidario',
    description: 'Jornada integral con agrupaciones musicales locales, actividades recreativas para niños y entrega solidaria coordinada con el Servicio Social de Iglesias Cristianas de Aragua.',
    category: 'Familiar',
    event_date: 'Sábado 21 de Noviembre',
    event_time: '02:00 PM',
    location: 'Maracay, Edo. Aragua',
    venue: 'Concha Acústica de Maracay',
    price_usd: 5.00,
    banner_url: '/img/running-cronograma.jpeg',
    is_featured: false,
    is_combo: false,
    status: 'activo',
    requires_kit: false
  }
];

const defaultSettings: SiteSettings = {
  id: 'general',
  site_name: 'Rebote Sports & Eventos',
  bcv_rate: 45.00,
  pagomovil_bank: 'Banco de Venezuela (0102)',
  pagomovil_phone: '0414-4780475',
  pagomovil_id: 'J-29476798-2',
  zelle_email: 'pagos@produccionesberaca.com',
  zelle_holder: 'Producciones Beraca',
  youtube_live_url: 'https://www.youtube.com/embed/live_stream?channel=UCexample',
  youtube_channel_name: 'Rebote Sports Oficial',
  admin_notification_email: 'notificaciones@rebotesports.com',
  support_whatsapp: '584144780475'
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-slate-950 font-sans">
      <Navbar />

      {/* HERO SECTION - ESTILO HIPEREVENTOS DE ALTO IMPACTO */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800">
        
        {/* Fondo con imagen deportiva y gradientes oscuros */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/running-hero.jpeg"
            alt="Running Vzla 8K Hero"
            fill
            className="object-cover object-center opacity-30 filter contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.95)_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            {/* Badge de Trilogía Benéfica */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black uppercase tracking-widest mb-6">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              Gran Trilogía Deportiva & Benéfica • Noviembre 2026
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-6">
              VIVE LA PASIÓN DEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">DEPORTE</span> CON PROPÓSITO
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
              Inscríbete en los eventos oficiales de <strong>Rebote Sports</strong> y <strong>Producciones Beraca</strong>. Tres días inolvidables de Baloncesto, Festival a la Familia y el <strong>Running Vzla 8K</strong> para bendecir a comunidades necesitadas en Aragua y La Guaira.
            </p>

            {/* Tarjeta de Destacado / Pase $20 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/40 shadow-2xl backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 block">
                  Combo Especial Recomendado
                </span>
                <h3 className="text-xl font-black text-white">
                  Pase Trilogía Completa: 3 Eventos por solo $20 USD
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Incluye Basket + Festival + Carrera/Caminata 8K con kit de corredor y medalla.
                </p>
              </div>
              <a
                href="#registro"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all text-center shrink-0"
              >
                Inscribirme en Combo
              </a>
            </div>

            {/* Indicadores / Social Proof */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">3 Días</div>
                <div className="text-xs text-slate-400">Deporte continuo</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-orange-400">8 Kilómetros</div>
                <div className="text-xs text-slate-400">Carrera & Caminata</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">1 Causa</div>
                <div className="text-xs text-slate-400">Solidaridad Social</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 1: EVENTOS DISPONIBLES (ESTILO HIPEREVENTOS) */}
      <section id="eventos" className="py-20 bg-slate-900/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-orange-500">
                Cartelera Oficial
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-1">
                Eventos Disponibles
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Selecciona el evento en el que deseas participar o asegura el Pase Trilogía para disfrutar toda la jornada deportiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialEvents.map((event) => (
              <div 
                key={event.id}
                className={`bg-slate-900 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${
                  event.is_combo 
                    ? 'border-orange-500 shadow-xl shadow-orange-500/10' 
                    : 'border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                {/* Imagen de cabecera */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={event.banner_url}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-slate-700">
                      {event.category}
                    </span>
                    {event.is_combo && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-slate-950">
                        Combo 3 en 1
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-orange-400 font-mono font-black text-lg">
                    ${event.price_usd} USD
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800/80 text-xs text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{event.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  <a
                    href="#registro"
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    Inscribirme en este Evento <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECCIÓN 2: CRONOGRAMA DEPORTIVO OFICIAL */}
      <section id="cronograma" className="py-20 bg-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-orange-500">
                Itinerario Oficial
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-1 mb-6">
                Cronograma del Fin de Semana
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Organízate para no perderte ni un solo minuto de las actividades preparadas en la Concha Acústica de Maracay y el Polideportivo de Las Delicias.
              </p>

              <div className="space-y-6">
                
                {/* Bloque Sábado */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-orange-400 font-black text-base uppercase">
                      <Calendar className="w-5 h-5" /> Sábado 21 de Noviembre
                    </div>
                    <span className="text-xs text-slate-400">Concha Acústica de Maracay</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">10:00 AM - 05:00 PM:</span>
                      <span>Entrega oficial de kits de atletas en la <strong>"Expo Running VZLA"</strong> (Franela, número y chips).</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">02:00 PM:</span>
                      <span>Festival a la Familia "Amamos a Venezuela" con presentaciones artísticas y recepción de donaciones.</span>
                    </div>
                  </div>
                </div>

                {/* Bloque Domingo */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-orange-400 font-black text-base uppercase">
                      <Trophy className="w-5 h-5" /> Domingo 22 de Noviembre
                    </div>
                    <span className="text-xs text-slate-400">Polideportivo de Las Delicias</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">07:00 AM:</span>
                      <span>Recepción, calentamiento y concentración de atletas.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">08:00 AM:</span>
                      <span><strong>Salida oficial de la Carrera Running Vzla 8K.</strong></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">08:15 AM:</span>
                      <span>Salida de la Caminata 8K participativa familiar.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">11:00 AM:</span>
                      <span>Ceremonia oficial de premiación en podio y medallas.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-orange-400 whitespace-nowrap">12:30 PM:</span>
                      <span>Entretenimiento musical de clausura y agradecimientos.</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Flyer Gráfico Responsivo */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <Image
                src="/img/running-cronograma.jpeg"
                alt="Cronograma Running Vzla 8K"
                width={600}
                height={900}
                className="w-full h-auto object-cover"
              />
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 3: CAUSA BENÉFICA Y PROPÓSITO SOLIDARIO */}
      <section id="causa-social" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase font-black tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-3">
              Impacto Humano & Social
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Cada Paso Es Una <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Bendición</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Todos los eventos de esta gran jornada tienen como meta central recaudar insumos, alimentos no perecederos y juguetes para ser canalizados a través del <strong>Servicio Social de Iglesias Cristianas de Aragua</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Comunidades Vulnerables</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atención directa a familias registradas en Turmero, Choroní, Colonia Tovar y zonas afectadas en el estado La Guaira y Distrito Capital.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Hospital Infantil</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El excedente de juguetes y aportes recolectados será entregado directamente a las salas del Hospital Infantil y centros pediátricos de la región.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Expo & Ministerios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feria de stands para empresas patrocinantes, ministerios cristianos y emprendedores que suman su grano de arena a la recuperación del país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: YOUTUBE EN VIVO */}
      <YoutubeLive 
        liveUrl={defaultSettings.youtube_live_url}
        channelName={defaultSettings.youtube_channel_name}
      />

      {/* SECCIÓN 5: FORMULARIO DE REGISTRO EN LÍNEA */}
      <section className="py-20 bg-slate-950 relative border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegistrationForm 
            events={initialEvents} 
            settings={defaultSettings} 
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
              <Image 
                src="/img/rebote-sports-brand.jpeg" 
                alt="Rebote Sports" 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-sm">Rebote Sports</div>
              <p className="text-[11px] text-slate-400">En alianza con Producciones Beraca • RIF: J-29476798-2</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p>Atención al Participante: <strong>0414-4780475</strong> • info@rebotesports.com</p>
            <p className="mt-1 text-slate-600">© 2026 Rebote Sports. Todos los derechos reservados. Desarrollado con Next.js & Supabase.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
