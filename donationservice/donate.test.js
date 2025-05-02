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
        callback(null, { response: 'Email sent (mock)' });
      })
    })
  };
});

// Close the app after all tests
afterAll(() => {
  app.close();
});

describe('Donation Tests with PayPal Sandbox', () => {

  beforeEach(() => {
    jest.clearAllMocks();  // Clear mocks before each test
  });

  test('POST /create-payment should return approvalUrl', async () => {
    // Simulate PayPal response when creating a payment
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          links: [
            { rel: 'approve', href: 'https://paypal.com/approve/payment' }
          ]
        }
      });
    });

    // Make request to /create-payment route
    const res = await request(app)
      .post('/create-payment')
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('approvalUrl');
    expect(res.body.approvalUrl).toBe('https://paypal.com/approve/payment');
  });

  test('GET /execute-payment should successfully capture the payment in sandbox environment', async () => {
    // Simulate PayPal response for a successful payment execution
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

    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    expect(res.statusCode).toBe(302);  // Redirect
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirects to frontend
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();  // Verifies that email sending was attempted
  });

  test('GET /execute-payment handles a NOT completed payment', async () => {
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

  test('GET /cancel-payment should redirect correctly', async () => {
    const res = await request(app)
      .get('/cancel-payment')
      .send();

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');
  });

  test('GET /execute-payment should handle error while capturing payment', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(new Error('Error capturing payment'), null);
    });

    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error capturing payment');
  });

  test('POST /create-payment should handle error while creating payment', async () => {
    post.mockImplementation((url, options, callback) => {
      callback(new Error('PayPal failed'), null);
    });

    const res = await request(app)
      .post('/create-payment')
      .send();

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Error creating payment' });
  });

  test('GET /execute-payment handles email sending error', async () => {
    // Simulate successful capture
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

    // Simulate email sending failure
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn((options, callback) => {
        callback(new Error('Email sending failed'), null);
      })
    });

    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');
  });

  
});
