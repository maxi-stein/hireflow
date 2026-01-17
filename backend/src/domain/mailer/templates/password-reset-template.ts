export interface PasswordResetPayload {
  email: string;
  newPassword: string;
  firstName?: string;
}

/**
 * Validates and generates password reset email template
 */
export const getPasswordResetTemplate = (
  payload: PasswordResetPayload,
): string => {
  // Validate required fields
  if (!payload.email || typeof payload.email !== 'string') {
    throw new Error('Password reset template requires a valid email');
  }
  if (!payload.newPassword || typeof payload.newPassword !== 'string') {
    throw new Error('Password reset template requires a valid newPassword');
  }

  const firstName = payload.firstName || 'User';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - HireFlow</title>
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
        .password-box {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .password-box p {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
        .password {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 2px;
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
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 HireFlow</h1>
        </div>
        <div class="content">
          <h2>Hello ${firstName},</h2>
          <p>We received a request to reset your password. Your new temporary password has been generated:</p>
          
          <div class="password-box">
            <p>Your new password:</p>
            <div class="password">${payload.newPassword}</div>
          </div>
          
          <div class="warning">
            <p><strong>⚠️ Important Security Notice:</strong></p>
            <p>Please change this password immediately after logging in. For security reasons, we recommend using a strong, unique password.</p>
          </div>
          
          <p>If you didn't request a password reset, please contact our support team immediately.</p>
          
          <p>Best regards,<br>The HireFlow Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message from HireFlow. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} HireFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
