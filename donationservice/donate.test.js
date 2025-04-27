const request = require('supertest');
const app = require('./donate'); 
const { post } = require('request');
const nodemailer = require('nodemailer');

// Mocks
jest.mock('request', () => {
  return {
    post: jest.fn()
  };
});

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn((options, callback) => {
        callback(null, { response: 'Correo enviado (mock)' });
      })
    })
  };
});

afterAll(() => {
  app.close();
});

describe('Pruebas de Donaciones con PayPal Sandbox', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();  // Limpiar mocks antes de cada prueba
  });

  test('POST /create-payment debe retornar approvalUrl', async () => {
    // Simula la respuesta de PayPal cuando se crea un pago
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          links: [
            { rel: 'approve', href: 'https://paypal.com/approve/payment' }
          ]
        }
      });
    });

    // Realiza la petición a la ruta /create-payment
    const res = await request(app)
      .post('/create-payment')
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('approvalUrl');
    expect(res.body.approvalUrl).toBe('https://paypal.com/approve/payment');
  });

  test('GET /execute-payment debe capturar pago correctamente en sandbox', async () => {
    // Simula la respuesta de PayPal cuando se ejecuta un pago exitoso
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          status: 'COMPLETED',
          payer: { name: { given_name: 'Andrea' }, email_address: 'sb-43dxvk40763243@personal.example.com' },
          purchase_units: [
            { payments: { captures: [{ amount: { value: '1.00', currency_code: 'EUR' } }] } }
          ]
        }
      });
    });

    // Realiza la petición a la ruta /execute-payment
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    expect(res.statusCode).toBe(302);  // Redirige
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirige al frontend

    // Verifica que se intentó enviar un correo (pero no se envió realmente)
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
  });

  
  test('GET /execute-payment maneja pago NO completado', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(null, { body: { status: 'PENDING' } });
    });
  
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();
  
    expect(res.statusCode).toBe(302);  
    expect(res.headers.location).toBe('http://localhost:3000');
    expect(nodemailer.createTransport().sendMail).not.toHaveBeenCalled();  
  });
  test('GET /cancel-payment debe redirigir correctamente', async () => {
    const res = await request(app)
      .get('/cancel-payment')
      .send();
  
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');
  });
  test('GET /execute-payment debe manejar error al capturar pago', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(new Error('Error al capturar pago'), null);
    });
  
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();
  
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error capturando el pago');
  });
  test('POST /create-payment debe manejar error al crear pago', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(new Error('Falló PayPal'), null);
    });
  
    const res = await request(app)
      .post('/create-payment')
      .send();
  
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Error al crear el pago' });
  });
  test('GET /execute-payment maneja error al enviar correo', async () => {
    // Primero simulamos que la captura fue exitosa
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          status: 'COMPLETED',
          payer: { name: { given_name: 'Andrea' }, email_address: 'andrea@test.com' },
          purchase_units: [
            { payments: { captures: [{ amount: { value: '5.00', currency_code: 'EUR' } }] }}
          ]
        }
      });
    });
  
    // Ahora simulamos error en el envío de email
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn((options, callback) => {
        callback(new Error('Fallo enviando correo'), null);
      })
    });
  
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();
  
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');
  });

  test('GET /execute-payment maneja múltiples unidades de compra', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          status: 'COMPLETED',
          payer: { name: { given_name: 'Andrea' }, email_address: 'andrea@test.com' },
          purchase_units: [
            { payments: { captures: [{ amount: { value: '10.00', currency_code: 'EUR' } }] } },
            { payments: { captures: [{ amount: { value: '5.00', currency_code: 'USD' } }] } }
          ]
        }
      });
    });
  
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();
  
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');
  });
  
 
});
