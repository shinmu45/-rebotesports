export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'Baloncesto' | 'Familiar' | 'Running' | 'Combo' | string;
  event_date: string;
  event_time: string;
  location: string;
  venue: string;
  price_usd: number;
  banner_url: string;
  is_featured: boolean;
  is_combo: boolean;
  status: 'activo' | 'agotado' | 'finalizado';
  requires_kit: boolean;
  created_at?: string;
}

export interface Registration {
  id: string;
  event_id?: string;
  event_name: string;
  code: string;
  full_name: string;
  id_doc: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  shirt_size?: string;
  modality?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  payment_method: 'pagomovil' | 'zelle' | 'transferencia' | 'efectivo' | string;
  payment_reference?: string;
  payment_amount_usd: number;
  payment_amount_bs?: number;
  receipt_url?: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  notes?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  bcv_rate: number;
  pagomovil_bank: string;
  pagomovil_phone: string;
  pagomovil_id: string;
  zelle_email: string;
  zelle_holder: string;
  youtube_live_url: string;
  youtube_channel_name: string;
  admin_notification_email: string;
  support_whatsapp: string;
  updated_at?: string;
}
