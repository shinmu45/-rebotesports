-- ==============================================================================
-- REBOTE SPORTS - ESQUEMA DE BASE DE DATOS (SUPABASE)
-- Eventos Deportivos & Benéficos "Amamos a Venezuela" / Producciones Beraca
-- ==============================================================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. TABLA DE CONFIGURACIÓN GLOBAL DEL SITIO
create table if not exists public.site_settings (
  id text primary key default 'general',
  site_name text not null default 'Rebote Sports & Eventos',
  bcv_rate numeric(10, 2) not null default 45.00,
  pagomovil_bank text default 'Banco de Venezuela (0102)',
  pagomovil_phone text default '0414-4780475',
  pagomovil_id text default 'J-29476798-2',
  zelle_email text default 'pagos@produccionesberaca.com',
  zelle_holder text default 'Producciones Beraca',
  youtube_live_url text default 'https://www.youtube.com/embed/live_stream?channel=UCexample',
  youtube_channel_name text default 'Rebote Sports Oficial',
  admin_notification_email text default 'notificaciones@rebotesports.com',
  support_whatsapp text default '584144780475',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Fila inicial de configuración
insert into public.site_settings (id)
values ('general')
on conflict (id) do nothing;

-- 3. TABLA DE EVENTOS
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text not null,
  category text not null default 'Deportivo', -- Baloncesto, Familiar, Running, Combo
  event_date text not null,
  event_time text not null,
  location text not null,
  venue text not null,
  price_usd numeric(10, 2) not null default 0.00,
  banner_url text not null,
  is_featured boolean default false,
  is_combo boolean default false,
  status text not null default 'activo', -- activo, agotado, finalizado
  requires_kit boolean default false, -- para tallas de franela
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Eventos Semilla Iniciales
insert into public.events (slug, title, subtitle, description, category, event_date, event_time, location, venue, price_usd, banner_url, is_featured, is_combo, status, requires_kit)
values 
(
  'combo-trilogia-solidaria',
  'Pase Trilogía Solidaria (3 Días)',
  'Acceso Integral: Basket + Festival Familiar + Expo Running 8K',
  'Disfruta de los 3 eventos estelares con un solo pase. Apoya la recolección de alimentos no perecederos y juguetes para las familias afectadas en La Guaira, Aragua, Colonia Tovar y el Hospital Infantil.',
  'Combo',
  '20, 21 y 22 de Noviembre',
  'Desde las 8:00 AM',
  'Maracay, Edo. Aragua',
  'Polideportivo Las Delicias y Concha Acústica',
  20.00,
  '/img/running-hero.jpeg',
  true,
  true,
  'activo',
  true
),
(
  'torneo-cuadrangular-basket',
  'Cuadrangular de Baloncesto Libre',
  'Selecciones de Aragua, Guárico, Ocumare de la Costa y Bahía de Cata',
  'Un día completo de baloncesto de alto calibre con los mejores exponentes de la región central y costera. Actividades de apertura y preparación para la gran jornada benéfica.',
  'Baloncesto',
  'Viernes 20 de Noviembre',
  '10:00 AM',
  'Maracay, Edo. Aragua',
  'Polideportivo de Las Delicias',
  10.00,
  '/img/basket-bullking.jpeg',
  false,
  false,
  'activo',
  false
),
(
  'festival-familia-amamos-vzla',
  'Festival a la Familia "Amamos a Venezuela"',
  'Música en vivo, actividades familiares y jornada de amor social',
  'Gran encuentro familiar con agrupaciones musicales locales, dinámicas recreativas y centro de acopio para el Servicio Social de Iglesias Cristianas de Aragua.',
  'Familiar',
  'Sábado 21 de Noviembre',
  '02:00 PM',
  'Maracay, Edo. Aragua',
  'Concha Acústica de Maracay',
  5.00,
  '/img/running-cronograma.jpeg',
  false,
  false,
  'activo',
  false
),
(
  'running-vzla-8k',
  'Running VZLA 8K - Solidarios con La Guaira',
  'Carrera 8K, Caminata y Gran Expo Comercial / Ministerial',
  'Cierre con broche de oro: carrera oficial 8K, caminata participativa, feria de stands de patrocinantes y ministerios benéficos. Entrega de kits en la Concha Acústica el día anterior.',
  'Running',
  'Domingo 22 de Noviembre',
  'Salida 8:00 AM (Recepción 7:00 AM)',
  'Maracay, Edo. Aragua',
  'Polideportivo Las Delicias',
  15.00,
  '/img/running-promo.jpeg',
  true,
  false,
  'activo',
  true
)
on conflict (slug) do nothing;

-- 4. TABLA DE REGISTROS / PARTICIPANTES
create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete set null,
  event_name text not null,
  code text unique not null, -- Código alfanumérico para el ticket (ej. RB-8K-7492)
  full_name text not null,
  id_doc text not null, -- Cédula o pasaporte
  email text not null,
  phone text not null,
  age integer,
  gender text, -- Masculino / Femenino / Otro
  shirt_size text, -- XS, S, M, L, XL, XXL (para 8K / Combo)
  modality text, -- Carrera 8K, Caminata, Espectador General, Jugador
  emergency_contact text,
  emergency_phone text,
  payment_method text not null, -- pagomovil, zelle, efectivo, transferencia
  payment_reference text,
  payment_amount_usd numeric(10, 2) not null,
  payment_amount_bs numeric(12, 2),
  receipt_url text, -- comprobante subido a Supabase Storage
  status text not null default 'pendiente', -- pendiente, aprobado, rechazado
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices para búsqueda rápida en el admin
create index if not exists idx_registrations_code on public.registrations(code);
create index if not exists idx_registrations_id_doc on public.registrations(id_doc);
create index if not exists idx_registrations_status on public.registrations(status);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);

-- 5. POLÍTICAS DE ACCESO (Row Level Security - RLS)
alter table public.site_settings enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Políticas de lectura pública para la web
create policy "Lectura pública de configuración" on public.site_settings
  for select using (true);

create policy "Lectura pública de eventos" on public.events
  for select using (true);

-- Permitir a usuarios anónimos inscribirse (Insertar en registrations)
create policy "Inscripciones públicas" on public.registrations
  for insert with check (true);

-- Permitir a usuarios consultar su propio registro por código
create policy "Consultar ticket por código" on public.registrations
  for select using (true);

-- Políticas para administradores autenticados (Full Access)
create policy "Admin control total settings" on public.site_settings
  for all using (auth.role() = 'authenticated');

create policy "Admin control total eventos" on public.events
  for all using (auth.role() = 'authenticated');

create policy "Admin control total registros" on public.registrations
  for all using (auth.role() = 'authenticated');

-- 6. BUCKET DE SUPABASE STORAGE PARA COMPROBANTES Y FLYERS
-- Nota: En el dashboard de Supabase -> Storage, crear el bucket 'receipts' y 'flyers' como público.
