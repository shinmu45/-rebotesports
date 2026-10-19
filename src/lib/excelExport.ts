import * as XLSX from 'xlsx';
import { Registration } from '@/types';

export function exportRegistrationsToExcel(registrations: Registration[], fileName = 'Participantes_ReboteSports.xlsx') {
  const rows = registrations.map((r, index) => ({
    '#': index + 1,
    'Código': r.code,
    'Fecha Registro': new Date(r.created_at).toLocaleString('es-VE'),
    'Evento': r.event_name,
    'Nombre Completo': r.full_name,
    'Cédula / Documento': r.id_doc,
    'Teléfono': r.phone,
    'Email': r.email,
    'Edad': r.age || 'N/A',
    'Género': r.gender || 'N/A',
    'Modalidad': r.modality || 'General',
    'Talla Franela': r.shirt_size || 'N/A',
    'Contacto Emergencia': r.emergency_contact || 'N/A',
    'Teléfono Emergencia': r.emergency_phone || 'N/A',
    'Método de Pago': r.payment_method.toUpperCase(),
    'Referencia': r.payment_reference || 'N/A',
    'Monto USD': r.payment_amount_usd,
    'Monto Bs': r.payment_amount_bs || 0,
    'Estatus': r.status.toUpperCase(),
    'Comprobante URL': r.receipt_url || 'Sin comprobante',
    'Notas': r.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');

  // Ajuste automático de ancho de columnas
  const maxProps = Object.keys(rows[0] || {}).map(key => ({
    wch: Math.max(key.length + 4, 15)
  }));
  worksheet['!cols'] = maxProps;

  XLSX.writeFile(workbook, fileName);
}
