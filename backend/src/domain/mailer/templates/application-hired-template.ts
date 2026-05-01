export interface ApplicationStatusUpdatedPayload {
  candidateName: string;
  jobPosition: string;
}

export const getApplicationHiredTemplate = (
  payload: ApplicationStatusUpdatedPayload,
): string => {
  if (!payload.candidateName) throw new Error('Template requires candidateName');
  if (!payload.jobPosition) throw new Error('Template requires jobPosition');

  const title = '¡Felicidades! Has sido seleccionado';
  const statusColor = '#4caf50';
  const messageHtml = `
      <p>Nos complace informarte que has sido seleccionado para el puesto de <strong>${payload.jobPosition}</strong>.</p>
      <div class="status-box" style="border-left-color: ${statusColor};">
        <p><strong>Estado:</strong> Contratado 🎉</p>
      </div>
      <p>En breve nos pondremos en contacto contigo para indicarte los siguientes pasos en tu proceso de incorporación.</p>
    `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - HireFlow</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: #667eea;
          font-size: 22px;
          margin-top: 0;
        }
        .status-box {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .status-box p {
          margin: 0 0 10px 0;
          font-size: 15px;
          color: #444;
        }
        .status-box p:last-child {
          margin-bottom: 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 HireFlow</h1>
        </div>
        <div class="content">
          <h2>Hola ${payload.candidateName},</h2>
          ${messageHtml}
          <p>Saludos cordiales,<br>El equipo de HireFlow</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático de HireFlow. Por favor, no respondas a este correo.</p>
          <p>&copy; ${new Date().getFullYear()} HireFlow. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
