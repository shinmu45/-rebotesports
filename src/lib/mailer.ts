import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailPayload {
  toAdminEmail: string;
  userEmail: string;
  participantName: string;
  eventName: string;
  ticketCode: string;
  idDoc: string;
  phone: string;
  shirtSize?: string;
  modality?: string;
  paymentMethod: string;
  paymentRef?: string;
  amountUsd: number;
  amountBs?: number;
  receiptUrl?: string;
}

export async function sendRegistrationEmails(payload: EmailPayload) {
  if (!resend) {
    console.log('[Email Simulation] Resend API Key no configurada. Notificación simulada:', payload);
    return { success: true, simulated: true };
  }

  try {
    // 1. Notificación inmediata al Correo del Administrador
    await resend.emails.send({
      from: 'Rebote Sports <inscripciones@resend.dev>', // Usar dominio verificado o default de pruebas de Resend
      to: [payload.toAdminEmail],
      subject: `🚨 ¡Nueva Inscripción! [${payload.ticketCode}] - ${payload.participantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 25px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px;">Nueva Inscripción Recibida</h2>
              <p style="margin: 5px 0 0 0; color: #f97316; font-weight: bold; font-size: 16px;">${payload.eventName}</p>
            </div>
            <div style="padding: 24px; color: #334155;">
              <p>Hola Administrador, un nuevo participante se ha registrado y espera verificación:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Código:</td><td style="color: #2563eb; font-weight: bold;">${payload.ticketCode}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Participante:</td><td>${payload.participantName}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Cédula:</td><td>${payload.idDoc}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td>${payload.phone}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Correo:</td><td>${payload.userEmail}</td></tr>
                ${payload.modality ? `<tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Modalidad:</td><td>${payload.modality}</td></tr>` : ''}
                ${payload.shirtSize ? `<tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Talla de Franela:</td><td>${payload.shirtSize}</td></tr>` : ''}
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Método de Pago:</td><td>${payload.paymentMethod.toUpperCase()}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Referencia:</td><td style="font-weight: bold; color: #0f172a;">${payload.paymentRef || 'N/A'}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 8px 0; font-weight: bold;">Monto:</td><td style="color: #16a34a; font-weight: bold;">$${payload.amountUsd} USD ${payload.amountBs ? `(~Bs. ${payload.amountBs})` : ''}</td></tr>
              </table>

              ${payload.receiptUrl ? `
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${payload.receiptUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">Ver Comprobante de Pago</a>
                </div>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center;">
                Panel de Administración Rebote Sports • Producciones Beraca
              </div>
            </div>
          </div>
        </div>
      `
    });

    // 2. Comprobante al correo del Participante
    if (payload.userEmail) {
      await resend.emails.send({
        from: 'Rebote Sports <inscripciones@resend.dev>',
        to: [payload.userEmail],
        subject: `🎟️ Tu Registro [${payload.ticketCode}] - ${payload.eventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 25px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0;">¡Inscripción Registrada con Éxito!</h2>
                <p style="margin: 5px 0 0 0; font-size: 15px;">Tu pase para el gran fin de semana deportivo y benéfico</p>
              </div>
              <div style="padding: 24px; color: #334155;">
                <p>Hola <strong>${payload.participantName}</strong>, hemos recibido los detalles de tu registro:</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #f97316; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; font-size: 13px; color: #64748b;">Tu Código Único de Participante:</p>
                  <p style="margin: 4px 0 0 0; font-size: 22px; font-weight: bold; color: #0f172a; letter-spacing: 1px;">${payload.ticketCode}</p>
                </div>
                <p><strong>Evento:</strong> ${payload.eventName}</p>
                <p><strong>Estatus:</strong> <span style="background-color: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">En proceso de verificación</span></p>
                <p style="font-size: 14px; color: #475569;">
                  Una vez validado el pago, tu cupo quedará 100% confirmado. Recuerda llevar contigo este código y tu aporte solidario (alimento no perecedero / juguete) para la entrega en el centro de acopio.
                </p>
                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center;">
                  Rebote Sports & Producciones Beraca • ¡Cada paso cuenta!
                </div>
              </div>
            </div>
          </div>
        `
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error enviando correos con Resend:', error);
    return { success: false, error };
  }
}
