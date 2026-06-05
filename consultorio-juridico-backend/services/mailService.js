const nodemailer = require('nodemailer');
require('dotenv').config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  SMTP_FROM_NAME
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT ? Number(SMTP_PORT) : 587,
  secure: SMTP_PORT === '465',
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS
  } : undefined
});

const sendStudentRegisteredEmail = async ({ correoInstitucional, nombreCompleto, documento, turnoTexto }) => {
  if (!correoInstitucional) {
    throw new Error('No se proporcionó correo institucional para enviar la notificación');
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error('No está configurado el servidor SMTP en las variables de entorno');
  }

  const subject = 'Confirmación de inscripción - Consultorio Jurídico';
  const text = `Hola ${nombreCompleto || 'estudiante'},\n\nHemos recibido su inscripción al Consultorio Jurídico.\n\n${documento ? `Documento: ${documento}\n` : ''}${turnoTexto ? `Turno asignado: ${turnoTexto}\n\n` : '\n'}Por favor revise su correo institucional para más información.\n\nAtentamente,\nConsultorio Jurídico`;
  const html = `<p>Hola ${nombreCompleto || 'estudiante'},</p>
<p>Hemos recibido su inscripción al <strong>Consultorio Jurídico</strong>.</p>
${documento ? `<p><strong>Documento:</strong> ${documento}</p>` : ''}
${turnoTexto ? `<p><strong>Turno asignado:</strong> ${turnoTexto}</p>` : ''}
<p>Por favor revise su correo institucional para más información.</p>
<p>Atentamente,<br/>Consultorio Jurídico</p>`;

  const mailOptions = {
    from: SMTP_FROM_NAME ? `${SMTP_FROM_NAME} <${SMTP_FROM}>` : SMTP_FROM,
    to: correoInstitucional,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = {
  sendStudentRegisteredEmail
};
