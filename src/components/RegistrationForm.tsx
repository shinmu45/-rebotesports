'use client';

import React, { useState } from 'react';
import { EventItem, SiteSettings } from '@/types';
import { CheckCircle2, AlertCircle, UploadCloud, Copy, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationFormProps {
  events: EventItem[];
  settings: SiteSettings;
  selectedEventId?: string;
}

export default function RegistrationForm({ events, settings, selectedEventId }: RegistrationFormProps) {
  const defaultEvent = events.find(e => e.id === selectedEventId) || events[0];
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(defaultEvent);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [idDoc, setIdDoc] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Masculino');
  const [shirtSize, setShirtSize] = useState('M');
  const [modality, setModality] = useState('Carrera 8K');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pagomovil' | 'zelle' | 'efectivo' | 'transferencia'>('pagomovil');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  
  // UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ code: string; name: string; event: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  const priceBs = Math.round(selectedEvent.price_usd * (settings.bcv_rate || 45));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Generar código único de ticket: RB-XXXX
      const randomCode = `RB-${Math.floor(100000 + Math.random() * 900000)}`;

      const payload = {
        event_id: selectedEvent.id,
        event_name: selectedEvent.title,
        code: randomCode,
        full_name: fullName,
        id_doc: idDoc,
        email: email,
        phone: phone,
        age: age ? Number(age) : null,
        gender: gender,
        shirt_size: selectedEvent.requires_kit ? shirtSize : null,
        modality: selectedEvent.category === 'Running' || selectedEvent.is_combo ? modality : 'Espectador General',
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        payment_amount_usd: selectedEvent.price_usd,
        payment_amount_bs: priceBs,
        receipt_url: '', // comprobante
        status: 'pendiente',
        notes: notes,
        toAdminEmail: settings.admin_notification_email
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu registro.');
      }

      // Lanzar confeti de celebración
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessTicket({
        code: randomCode,
        name: fullName,
        event: selectedEvent.title
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successTicket) {
    return (
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest font-black text-emerald-400 block mb-2">¡Inscripción Exitosa!</span>
        <h3 className="text-3xl font-black text-white mb-2">Bienvenido a la Trilogía Deportiva</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
          Gracias <strong>{successTicket.name}</strong> por unirte a <strong>{successTicket.event}</strong>. Tu registro ha sido enviado para verificación.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tu Código Oficial de Participante:</div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-orange-400 tracking-widest">{successTicket.code}</div>
          <p className="text-xs text-slate-500 mt-2">
            Guarda una captura de este código. Te llegará además un correo con todos los detalles.
          </p>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-xs text-orange-300 text-left mb-6 flex items-start gap-3">
          <Heart className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong>Recordatorio Solidario:</strong> Este evento tiene como meta primordial apoyar al Servicio Social de Iglesias Cristianas de Aragua con insumos, alimentos no perecederos y juguetes para niños y familias afectadas. ¡No olvides llevar tu donativo a la entrada!
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSuccessTicket(null);
              setFullName('');
              setIdDoc('');
              setEmail('');
              setPhone('');
              setPaymentReference('');
            }}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
          >
            Inscribir a otra persona
          </button>
          <a
            href={`https://wa.me/${settings.support_whatsapp}?text=${encodeURIComponent(`Hola! Acabo de registrarme en Rebote Sports con el código ${successTicket.code} para ${successTicket.event}. Adjunto mi comprobante para agilizar.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Enviar Comprobante por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="registro" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase font-black tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-3">
          Registro Oficial en Línea
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Asegura Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Participación</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Completa tus datos para reservar tu cupo y sumarte a esta fiesta de deporte y solidaridad en Maracay.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. SELECCIÓN DE EVENTO */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Paso 1: Selecciona el Evento o Pase
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((evt) => {
              const isSelected = selectedEvent.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-left relative ${
                    isSelected 
                      ? 'bg-gradient-to-br from-orange-950/40 to-slate-900 border-orange-500 ring-2 ring-orange-500/30' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {evt.is_combo && (
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-orange-500 text-slate-950 px-2 py-0.5 rounded-full">
                      Recomendado 3 en 1
                    </span>
                  )}
                  <div className="font-black text-base text-white">{evt.title}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.subtitle || evt.description}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{evt.event_date}</span>
                    <span className="text-lg font-black text-orange-400">${evt.price_usd} USD</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DATOS DEL PARTICIPANTE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Paso 2: Datos Personales del Atleta / Participante
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Cédula o Pasaporte *</label>
              <input
                type="text"
                required
                value={idDoc}
                onChange={(e) => setIdDoc(e.target.value)}
                placeholder="Ej. V-20.123.456"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Correo Electrónico (para tu comprobante) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Teléfono WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0414-1234567"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Edad</label>
              <input
                type="number"
                min="5"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej. 28"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Género</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. MODALIDAD Y TALLA DE FRANELA (SI APLICA PARA 8K O COMBO) */}
        {(selectedEvent.requires_kit || selectedEvent.category === 'Running' || selectedEvent.is_combo) && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Opciones de Corredor & Kit Oficial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Modalidad de Participación</label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                >
                  <option value="Carrera 8K">Carrera 8K (Competitiva)</option>
                  <option value="Caminata 8K">Caminata 8K (Participativa)</option>
                  <option value="Espectador / Aficionado">Espectador / Aporte General</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Talla de Franela Oficial</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setShirtSize(sz)}
                      className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase border transition-all ${
                        shirtSize === sz 
                          ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-md' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Nombre y Parentesco"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Teléfono de Emergencia</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Teléfono de contacto directo"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. INFORMACIÓN DE PAGO */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Paso 3: Método de Pago & Reporte
          </label>

          {/* Selector de método */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { id: 'pagomovil', label: 'Pago Móvil (Bs.)' },
              { id: 'zelle', label: 'Zelle (USD)' },
              { id: 'transferencia', label: 'Transferencia' },
              { id: 'efectivo', label: 'Efectivo en Taquilla' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as any)}
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === method.id
                    ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Datos bancarios del método seleccionado */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs text-slate-400">Monto a pagar:</span>
                <div className="text-xl font-black text-white">
                  ${selectedEvent.price_usd} USD <span className="text-sm font-semibold text-orange-400">/ Aprox. {priceBs.toLocaleString()} Bs.</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Tasa referencial: <span className="text-white font-bold">{settings.bcv_rate} Bs/USD</span>
              </div>
            </div>

            {paymentMethod === 'pagomovil' && (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Banco:</span>
                  <span className="font-semibold">{settings.pagomovil_bank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Teléfono:</span>
                  <span className="font-mono font-bold text-orange-400">{settings.pagomovil_phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">C.I. / RIF:</span>
                  <span className="font-mono font-bold">{settings.pagomovil_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Beneficiario:</span>
                  <span className="font-semibold">Producciones Beraca</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${settings.pagomovil_bank} | ${settings.pagomovil_phone} | ${settings.pagomovil_id}`)}
                  className="mt-2 text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> {copiedBank ? '¡Datos copiados!' : 'Copiar datos de pago móvil'}
                </button>
              </div>
            )}

            {paymentMethod === 'zelle' && (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Correo Zelle:</span>
                  <span className="font-mono font-bold text-orange-400">{settings.zelle_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <span className="font-semibold">{settings.zelle_holder}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(settings.zelle_email)}
                  className="mt-2 text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> {copiedBank ? '¡Correo copiado!' : 'Copiar correo de Zelle'}
                </button>
              </div>
            )}

            {paymentMethod === 'efectivo' && (
              <p className="text-xs text-slate-400">
                Podrás cancelar tu inscripción en divisas o bolívares en efectivo directamente en los puntos autorizados o el día de la entrega de kits en la Concha Acústica de Maracay.
              </p>
            )}

            {paymentMethod === 'transferencia' && (
              <p className="text-xs text-slate-400">
                Transferencia directa a cuenta corriente Banco de Venezuela a nombre de Producciones Beraca (RIF: {settings.pagomovil_id}).
              </p>
            )}
          </div>

          {/* Campo de Referencia */}
          {paymentMethod !== 'efectivo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Número de Referencia del Pago *
                </label>
                <input
                  type="text"
                  required
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Últimos 4 o 6 dígitos de la referencia"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Observaciones / Notas (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Pago desde cuenta de familiar / Donación extra"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN SUBMIT */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Registrando tu inscripción...
              </span>
            ) : (
              <>
                Confirmar Inscripción Oficial <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 text-center mt-3">
            Al registrarte aceptas las normativas del evento y la entrega de tu aporte benéfico para las familias asistidas por las Iglesias de Aragua.
          </p>
        </div>

      </form>
    </div>
  );
}
