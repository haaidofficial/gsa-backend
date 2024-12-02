require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using your email service configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL, // Replace with your email
        pass: process.env.APP_PASSWORD,  // Replace with your password or app-specific password
    },
    secure: false,  // Ensure this is set to false for Gmail
    tls: {
        rejectUnauthorized: false,  // Add this line to allow connections
    },
});

// Function to send email
const sendEmail = (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL,  // Your email address
        to: to,  // The recipient's email address (company's or owner's email)
        subject: subject,
        html: html,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
