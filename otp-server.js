const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://vinaykumarhub.github.io/host/send-otp.html', // Replace with your frontend URL
}));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yadamma077@gmail.com',
    pass: 'rqyj jibq nhmz fytw',
  },
});

// Store OTPs temporarily in memory
const otps = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ status: 'Invalid or missing email address.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otps[email] = otp;

  setTimeout(() => {
    delete otps[email];
  }, 300000);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}\nThis OTP will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP: ', error);
      return res.status(500).json({ status: 'Failed to send OTP', error: error.message });
    }
    console.log('OTP sent: ' + info.response);
    res.status(200).json({ status: 'OTP sent successfully' });
  });
});

// Utility function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Error Handling
app.use((req, res) => {
  res.status(404).json({ status: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'Internal Server Error' });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
