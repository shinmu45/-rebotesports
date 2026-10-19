'use client';

import React from 'react';
import { Video, Radio, PlayCircle, ExternalLink } from 'lucide-react';

interface YoutubeLiveProps {
  liveUrl?: string;
  channelName?: string;
}

export default function YoutubeLive({ 
  liveUrl = 'https://www.youtube.com/embed/live_stream?channel=UCexample',
  channelName = 'Rebote Sports Oficial'
}: YoutubeLiveProps) {

  // Si se provee una URL normal de video de youtube, convertir a embed si es necesario
  let embedSrc = liveUrl;
  if (liveUrl.includes('watch?v=')) {
    const videoId = liveUrl.split('watch?v=')[1]?.split('&')[0];
    embedSrc = `https://www.youtube.com/embed/${videoId}`;
  } else if (liveUrl.includes('youtu.be/')) {
    const videoId = liveUrl.split('youtu.be/')[1]?.split('?')[0];
    embedSrc = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <section id="transmisiones" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
      {/* Luces y brillo ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Transmisión en Directo & Contenido
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Canal Oficial <span className="text-red-500">YouTube</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Sigue la cobertura del torneo de Baloncesto, el Festival a la Familia y la emocionante llegada de los 8K con la narración y comentarios al estilo de <strong>{channelName}</strong>.
            </p>
          </div>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 w-fit"
          >
            <Video className="w-4 h-4" /> Visitar Canal Oficial <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reproductor Responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Pantalla principal del Streaming */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={embedSrc}
                title="Transmisión en Vivo Rebote Sports"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-5 flex items-center justify-between bg-slate-900/90 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-500">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Señal Oficial en Vivo</h4>
                  <p className="text-xs text-slate-400">Desde el Polideportivo Las Delicias y Concha Acústica de Maracay</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                1080p HD
              </span>
            </div>
          </div>

          {/* Barra Lateral: Programas & Cobertura */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-orange-500" />
                Programación Especial
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>Viernes 20 Nov - 10:00 AM</span>
                    <span className="text-orange-400 font-bold">En Directo</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Cuadrangular de Basket Libre</h5>
                  <p className="text-slate-400 mt-1">Ocumare de la Costa vs. Cata / Aragua vs. Guárico.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>Sábado 21 Nov - 2:00 PM</span>
                    <span className="text-slate-500">Especial</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Festival a la Familia "Amamos a Vzla"</h5>
                  <p className="text-slate-400 mt-1">Conciertos, testimonios y centro de acopio solidario.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>Domingo 22 Nov - 8:00 AM</span>
                    <span className="text-red-400 font-bold">Transmisión Estelar</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Running Vzla 8K: La Gran Carrera</h5>
                  <p className="text-slate-400 mt-1">Salida en vivo, recorrido por Maracay y podio de ganadores.</p>
                </div>
              </div>
            </div>

            {/* Banner de Radio & Alianza */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/20 text-xs text-slate-300">
              <span className="font-bold text-orange-400 block mb-1">📻 Transmisión Radial Conjunta</span>
              Sintoniza también a través de <strong>Caliente 103.3 FM</strong> y la cobertura especial de la <strong>Antesala Tigrera</strong>.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
