const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendEnquiryEmail = async (data) => {
  const { name, email, phone, trip_type, from_city, to_city, adults, children, infants, message } = data;
  
  const mailOptions = {
    from: `"Travel Sparsh" <${process.env.SMTP_USER}>`,
    to: [process.env.ADMIN_EMAIL, email].filter(Boolean), // Send to admin and user
    subject: `New Enquiry from ${name} - Travel Sparsh`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1d3d46;">
        <h2 style="color: #1b3b6b;">New Travel Enquiry</h2>
        <p>You have received a new enquiry with the following details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Trip Type</td><td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;">${trip_type}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">From</td><td style="padding: 8px; border: 1px solid #ddd;">${from_city}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">To</td><td style="padding: 8px; border: 1px solid #ddd;">${to_city}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Travellers</td><td style="padding: 8px; border: 1px solid #ddd;">${adults} Adu, ${children} Chi, ${infants} Inf</td></tr>
        </table>
        <br/>
        <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #1b3b6b;">
          <strong>Message/Notes:</strong><br/>
          ${message.replace(/\n/g, '<br/>')}
        </div>
        <p style="font-size: 0.8rem; color: #888; margin-top: 20px;">
          This is an automated message from your website.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = { sendEnquiryEmail };
