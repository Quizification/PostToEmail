const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require("dotenv").config();

const server = express();

server.use(cors())
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const PORT = process.env.PORT || 4848;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3'
  },
  requireTLS: true
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
    ${req.body.message} & ${JSON.stringify(req.body.data)}`,
    html: `<h1>New Inquiry</h1>
    <p>${req.body.name}</p>
    <p>${req.body.email}</p>
    <p>${req.body.message}</p>
    <pre>${JSON.stringify(req.body.data)}</pre>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send("Successfully sended");
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});