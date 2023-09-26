const nodemailer = require("nodemailer")

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Function to send an email
const sendEmail = async (to, subject, message) => {
  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: 'privatetutorapp@gmail.com', 
      to,
      subject,
      html: message,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
module.exports = {sendEmail}