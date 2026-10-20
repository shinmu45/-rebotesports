import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const category = formData.get('category') as string;
    const event_date = formData.get('event_date') as string;
    const event_time = formData.get('event_time') as string;
    const location = formData.get('location') as string;
    const venue = formData.get('venue') as string;
    const price_usd = Number(formData.get('price_usd')) || 0;
    const description = formData.get('description') as string;
    const banner_url = (formData.get('banner_url') as string) || '/img/running-promo.jpeg';
    const requires_kit = formData.get('requires_kit') === 'true';
    const is_combo = formData.get('is_combo') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const file = formData.get('file') as File | null;

    if (!title || !event_date || !venue) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const adminSupabase = getAdminClient();
    let finalBannerUrl = banner_url;

    // Si viene un archivo de imagen, subirlo usando credenciales admin en el servidor
    if (file && typeof file !== 'string' && file.size > 0) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `flyer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `flyers/${cleanFileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from('flyers')
        .upload(filePath, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Error subiendo flyer a Storage:', uploadError);
        return NextResponse.json({ error: `Error subiendo imagen: ${uploadError.message}` }, { status: 500 });
      }

      const { data: publicUrlData } = adminSupabase.storage
        .from('flyers')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        finalBannerUrl = publicUrlData.publicUrl;
      }
    }

    // Generar slug
    const generatedSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newEvent = {
      slug: generatedSlug,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      description: description ? description.trim() : 'Evento deportivo oficial.',
      category: category || 'Running',
      event_date: event_date.trim(),
      event_time: event_time ? event_time.trim() : 'Por definir',
      location: location ? location.trim() : 'Maracay, Edo. Aragua',
      venue: venue.trim(),
      price_usd,
      banner_url: finalBannerUrl,
      is_featured,
      is_combo,
      status: 'activo',
      requires_kit
    };

    const { data, error } = await adminSupabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      console.error('Error insertando evento en Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (err: any) {
    console.error('Error en POST /api/events:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
