import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const idDoc = searchParams.get('id_doc');

  if (!code && !idDoc) {
    return NextResponse.json({ error: 'Parámetros insuficientes' }, { status: 400 });
  }

  try {
    const dbClient = getAdminClient();
    let query = dbClient.from('registrations').select('*');

    if (code) {
      query = query.eq('code', code.toUpperCase().trim());
    } else if (idDoc) {
      query = query.eq('id_doc', idDoc.trim());
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ registration: null }, { status: 404 });
    }

    return NextResponse.json({ registration: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
