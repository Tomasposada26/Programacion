// src/services/mailerService.js
const nodemailer = require('nodemailer');
const mailerConfig = require('../config/mailer');

const transporter = nodemailer.createTransport(mailerConfig);

module.exports = transporter;
