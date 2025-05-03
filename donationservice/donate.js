const express = require('express');
const cors = require('cors');
const request = require('request');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 8006;

const redirectionUrl = process.env.REDIRECTION_PAGE || 'http://localhost:3000';
const donationServiceUrl = process.env.DONATION_SERVICE || 'http://localhost:8006';

const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET_KEY;

const PAYPAL_API ='https://api-m.paypal.com'
const auth = {user: CLIENT, pass: SECRET}
const nodemailer = require('nodemailer');

// Email configuration using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'WiChat4a@gmail.com',
      pass: 'ongv ptdj dwcc nbjb'
  }
});

/**
 * Creates a PayPal payment order.
 * 
 * @route POST /create-payment
 * @function
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {Object} - JSON response with PayPal approval URL or error message.
 */
const createPayment = (req, res) => {
    const body = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: '1'
        }
      }],
      application_context: {
        brand_name: `Wichat`,
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${donationServiceUrl}/execute-payment`,
        cancel_url: `${donationServiceUrl}/cancel-payment`
      }
    };
  
    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
      auth,
      body,
      json: true
    }, (err, response) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear el pago' });
      }
  
      const links = response.body.links;
      const approvalUrl = links.find(link => link.rel === 'approve')?.href;
  
      res.json({ approvalUrl }); 
    });
  };
  
/**
 * Executes a PayPal payment once approved by the user, and sends confirmation email.
 * 
 * @route GET /execute-payment
 * @function
 * 
 * @param {Object} req - The HTTP request object, includes the PayPal token as query param.
 * @param {Object} res - The HTTP response object.
 */
const executePayment = (req, res) => {
  const token = req.query.token;

  request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
      auth,
      body: {},
      json: true
  }, (err, response) => {
      if (err) {
          return res.status(500).send('Error capturando el pago');
      }
      const status = response.body.status; 

      if (status === 'COMPLETED') {
        console.log('Pago completado:', response.body);
        console.log('Enviando correo');
        const nombreDonante = response.body.payer.name.given_name;
        const correoDelDonante = response.body.payer.email_address;
        const cantidadDonada = response.body.purchase_units[0].payments.captures[0].amount.value;
        const moneda = response.body.purchase_units[0].payments.captures[0].amount.currency_code;
        const mailOptions = {
          from: 'WiChat4a@gmail.com',
          to: correoDelDonante, 
          subject: '¡Gracias por tu donación a Wichat!',
          html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; color: #333;">
                  <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <div style="text-align: center;">
                          <img src="cid:logo" alt="Logo de Wichat" style="width: 100px; margin-bottom: 20px;" />
                          <h1 style="color: #4CAF50;">¡Gracias ${nombreDonante}!</h1>
                      </div>
                      <p style="font-size: 16px;">
                          Tu apoyo significa muchísimo para nosotros. 🙏<br>
                          Hemos recibido tu donación de <strong>${cantidadDonada} ${moneda}</strong>.<br><br>
                          Cada donación nos impulsa a seguir mejorando y a seguir creando mejores experiencias para ti.
                      </p>
                      <p style="font-size: 16px;">
                          <em>Apoyarnos nos hace mejorar día a día. 💪</em>
                      </p>
                      <hr style="margin: 30px 0;">
                      <div style="text-align: center; font-size: 14px;">
                          <p>Con cariño,</p>
                          <p>
                              👩 Claudia, 👨 Javier, 👩 Adriana, 👩 Ana, 👩 Andrea, 👨 Aitor
                          </p>
                          <p>Equipo de <strong>Wichat</strong></p>
                      </div>
                  </div>
              </div>
          `,
          attachments: [{
              filename: 'logo.png',
              path: __dirname + '/public/images/logo.png', 
              cid: 'logo' 
          }]
      };
      
        transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.error('Error al enviar el correo:', error);
              } else {
                  console.log('Correo enviado:', info.response);
              }
          });
      }
      res.redirect(redirectionUrl);
  });
};

/**
 * Cancels the PayPal payment and redirects to the redirection page.
 * 
 * @route GET /cancel-payment
 * @function
 */
app.get('/cancel-payment', (req, res) => {
    res.redirect(redirectionUrl)
});

// Register endpoints
app.post(`/create-payment`, createPayment)
app.get(`/execute-payment`, executePayment)

const server = app.listen(port, '0.0.0.0', () => {  
})

module.exports = server;
