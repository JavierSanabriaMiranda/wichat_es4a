const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
app.use(cors());
const port = 8006;

/*
Crear una aplicacion en PayPal
Agregar las credenciales de nuestra app de PayPal
https://developer.paypal.com/developer/applications (debemos acceder con nuestra cuenta de paypal)
cuentas de test -> https://developer.paypal.com/developer/accounts/
*/
const CLIENT = 'ASvnlzo-PymyeRSxwq4L4RtpuqQvCUBzyZkKqNz5IKzrPzFnEEUQH6ny-ZVyTedWoINPUCeqtExWpCUi';
const SECRET = 'EIhQjimqEeHCSS75NsYMuAOu7BBuINHzbrNlqomuy2M4QwdvwNmtMYcInGezkHgE8ziNlse7nEPRTb-c';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Live https://api-m.paypal.com
const auth = {user: CLIENT, pass: SECRET}

/*
Establecemos los controladores que vamos a usar
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
        return_url: `http://localhost:8006/execute-payment`,
        cancel_url: `http://localhost:8006/cancel-payment`
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
  
      res.json({ approvalUrl }); //  esto es lo que espera el frontend
    });
  };
  

/*
Esta funcion captura el dinero REALMENTE
*/
const executePayment = (req, res) => {
    const token = req.query.token; 

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}

//http://localhost:8006/create-payment
app.post(`/create-payment`, createPayment)

app.get(`/execute-payment`, executePayment)

/*
app.get('/cancel-payment', (req, res) => {
    res.send('Pago cancelado.');
});
*/

app.post('/api/donate', (req, res) => {
    console.log("estoy aqui");
});

app.listen(port, () => {
    console.log(`Comenzemos a generar dinero --> http://localhost:8006`);
})