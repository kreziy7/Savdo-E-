const nodemailer = require('nodemailer');

/**
 * Send email via SMTP (nodemailer)
 * Development: logs to console if SMTP not configured
 */
const sendEmail = async ({ to, subject, html }) => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Dev mode — no SMTP configured: just log
  if (!host || !user || !pass) {
    console.log('\n========== EMAIL (DEV MODE) ==========');
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`HTML:    ${html}`);
    console.log('======================================\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Savdo-E" <${user}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
