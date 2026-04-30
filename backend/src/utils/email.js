const nodemailer = require('nodemailer');
const config = require('../config');

async function createTransporter() {
  if (config.email.host && config.email.user) {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port || 587,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  // Fallback -- console transport
  return {
    sendMail: async (mailOptions) => {
      console.log('==== EMAIL (console fallback) ===');
      console.log('From:', mailOptions.from);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Text:', mailOptions.text);
      console.log('=================================');
      return Promise.resolve();
    }
  };
}

async function sendVerificationEmail(to, token) {
  const transporter = await createTransporter();
  const link = `${config.baseUrl}/api/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Tamank - Verify your email',
    text: `Please verify your email by visiting the following link: ${link}`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
