import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Esta ruta actúa como "Keep-Alive" / Heartbeat ping.
// Al ser llamada periódicamente (ej. vía GitHub Actions, cron job o UptimeRobot),
// ejecuta un SELECT simple en Supabase para evitar que el proyecto entre en pausa (pausing) por inactividad.

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Si configuraste CRON_SECRET, validamos el token de seguridad
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const startTime = Date.now();
    
    // Consulta ligera que despierta el pooler y la instancia de PostgreSQL
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, updated_at')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      console.warn('[Keep-Alive] Ping falló o tabla aún no migrada:', error.message);
      return NextResponse.json({
        status: 'warning',
        message: 'Ping ejecutado pero la base de datos reportó un aviso.',
        error: error.message,
        latencyMs,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    return NextResponse.json({
      status: 'active',
      message: 'Supabase se encuentra activo y respondiendo.',
      latencyMs,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: err.message || 'Error en keep-alive ping',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
