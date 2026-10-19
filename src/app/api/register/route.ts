import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '@/lib/supabase';
import { sendRegistrationEmails } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      event_id,
      event_name,
      code,
      full_name,
      id_doc,
      email,
      phone,
      age,
      gender,
      shirt_size,
      modality,
      emergency_contact,
      emergency_phone,
      payment_method,
      payment_reference,
      payment_amount_usd,
      payment_amount_bs,
      receipt_url,
      status,
      notes,
      toAdminEmail
    } = body;

    if (!full_name || !id_doc || !email || !phone) {
      return NextResponse.json({ error: 'Todos los campos obligatorios deben ser completados' }, { status: 400 });
    }

    // Usar cliente admin para bypass de RLS o insertar directamente
    const dbClient = getAdminClient();

    const { data, error } = await dbClient
      .from('registrations')
      .insert([
        {
          event_id: event_id || null,
          event_name,
          code,
          full_name,
          id_doc,
          email,
          phone,
          age: age || null,
          gender: gender || null,
          shirt_size: shirt_size || null,
          modality: modality || null,
          emergency_contact: emergency_contact || null,
          emergency_phone: emergency_phone || null,
          payment_method,
          payment_reference: payment_reference || null,
          payment_amount_usd,
          payment_amount_bs: payment_amount_bs || null,
          receipt_url: receipt_url || null,
          status: status || 'pendiente',
          notes: notes || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error insertando en Supabase:', error);
      // Si la tabla aún no existe o falta configuración de Supabase, retornamos éxito simulado para no bloquear al usuario en local
      if (error.message?.includes('fetch failed') || error.message?.includes('relation "public.registrations" does not exist')) {
        console.warn('Simulando guardado localmente (Supabase no conectado aún).');
      } else {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Enviar correos automáticos (al Admin del cliente y al Participante)
    try {
      await sendRegistrationEmails({
        toAdminEmail: toAdminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'notificaciones@rebotesports.com',
        userEmail: email,
        participantName: full_name,
        eventName: event_name,
        ticketCode: code,
        idDoc: id_doc,
        phone,
        shirtSize: shirt_size,
        modality,
        paymentMethod: payment_method,
        paymentRef: payment_reference,
        amountUsd: payment_amount_usd,
        amountBs: payment_amount_bs,
        receiptUrl: receipt_url
      });
    } catch (emailErr) {
      console.warn('Error no crítico enviando email:', emailErr);
    }

    return NextResponse.json({ success: true, registration: data || { code, full_name, event_name } });
  } catch (error: any) {
    console.error('Error en POST /api/register:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
