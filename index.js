const nodemailer = require('nodemailer');
const express = require('express');

const server = express();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
})

server.get('/', (req, res) => {
  res.send('Post Mailer Service by @robin_schleser');
});

server.post('/', (req, res) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_CC,
    subject: 'New Inquiry',
    text: `${req.body.name}
    ${req.body.email}
    ${req.body.message}`,
    html: `<h1>New Inquiry</h1>
    <p>${req.body.name}</p>
    <p>${req.body.email}</p>
    <p>${req.body.message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info.response);
    }
  });
});