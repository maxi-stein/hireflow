export interface InterviewDateUpdatedPayload {
  candidateName: string;
  jobPosition: string;
  newScheduledTime: Date;
  meetingLink?: string;
  type: string;
}

export const getInterviewDateUpdatedTemplate = (
  payload: InterviewDateUpdatedPayload,
): string => {
  if (!payload.candidateName) throw new Error('Template requires candidateName');
  if (!payload.jobPosition) throw new Error('Template requires jobPosition');
  if (!payload.newScheduledTime) throw new Error('Template requires newScheduledTime');
  if (!payload.type) throw new Error('Template requires type');

  const formattedDate = new Date(payload.newScheduledTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Entrevista Reprogramada - HireFlow</title>
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
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .info-box p {
          margin: 0 0 10px 0;
          font-size: 15px;
          color: #444;
        }
        .info-box p:last-child {
          margin-bottom: 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          color: #856404;
          font-size: 14px;
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
          <h1>📅 HireFlow</h1>
        </div>
        <div class="content">
          <h2>Hola ${payload.candidateName},</h2>
          <p>Ten en cuenta que el horario de tu próxima entrevista para el puesto de <strong>${payload.jobPosition}</strong> ha sido actualizado.</p>
          
          <div class="info-box">
            <p><strong>Tipo:</strong> ${payload.type}</p>
            <p><strong>Nueva Fecha y Hora:</strong> ${formattedDate}</p>
            ${payload.meetingLink ? `<p><strong>Enlace a la reunión:</strong> <a href="${payload.meetingLink}">${payload.meetingLink}</a></p>` : ''}
          </div>
          
          <div class="warning">
            <p><strong>Importante:</strong> Por favor, actualiza tu calendario con este nuevo horario.</p>
          </div>
          
          <p>Si tienes alguna pregunta o este nuevo horario no te resulta conveniente, por favor contacta a nuestro equipo lo antes posible.</p>
          
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
