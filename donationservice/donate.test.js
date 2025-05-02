const request = require('supertest');
const app = require('./donate'); 
const { post } = require('request');
const nodemailer = require('nodemailer');

// Mock external dependencies
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

// Close the server after all tests
afterAll(() => {
  app.close();
});

/**
 * Test suite for Donation API integration with PayPal Sandbox.
 * 
 * This suite tests the donation process using the PayPal Sandbox API, ensuring that payment creation, execution,
 * cancellation, and email notifications work as expected. The tests also handle various edge cases like 
 * errors in the payment process or email sending failures.
 */
describe('Donation Tests with PayPal Sandbox', () => {

  /**
   * Clears all mocks before each test to ensure no state is carried over.
   */
  beforeEach(() => {
    jest.clearAllMocks();  
  });

  /**
   * Test case for creating a payment.
   * 
   * This test checks that the `/create-payment` endpoint successfully returns a PayPal approval URL when
   * the request is processed correctly.
   * 
   * @test
   */
  test('POST /create-payment should return approvalUrl', async () => {
    // Mocking the response from PayPal API
    post.mockImplementation((url, options, callback) => {
      callback(null, {
        body: {
          links: [
            { rel: 'approve', href: 'https://paypal.com/approve/payment' }
          ]
        }
      });
    });

    // Sending the request to the app
    const res = await request(app)
      .post('/create-payment')
      .send();

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('approvalUrl');
    expect(res.body.approvalUrl).toBe('https://paypal.com/approve/payment');
  });

  /**
   * Test case for executing a payment successfully.
   * 
   * This test checks that the `/execute-payment` endpoint correctly processes the payment when the status is 
   * 'COMPLETED', and ensures that an email is sent notifying the user.
   * 
   * @test
   */
  test('GET /execute-payment should successfully capture the payment in sandbox environment', async () => {
    // Mocking the PayPal API response for a completed payment
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

    // Sending the request to the app
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    // Assertions
    expect(res.statusCode).toBe(302);  // Redirection expected
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirection to home page
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();  // Email should be sent
  });

  /**
   * Test case for handling a not completed payment.
   * 
   * This test checks that the `/execute-payment` endpoint processes the payment correctly even when the 
   * status is 'PENDING', and that no email is sent in this case.
   * 
   * @test
   */
  test('GET /execute-payment handles a NOT completed payment', async () => {
    // Mocking the PayPal API response for a pending payment
    post.mockImplementation((url, options, callback) => {
      callback(null, { body: { status: 'PENDING' } });
    });

    // Sending the request to the app
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    // Assertions
    expect(res.statusCode).toBe(302);  // Redirection expected
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirection to home page
    expect(nodemailer.createTransport().sendMail).not.toHaveBeenCalled();  // No email should be sent
  });

  /**
   * Test case for canceling a payment.
   * 
   * This test ensures that the `/cancel-payment` endpoint correctly redirects the user when the payment is canceled.
   * 
   * @test
   */
  test('GET /cancel-payment should redirect correctly', async () => {
    const res = await request(app)
      .get('/cancel-payment')
      .send();

    // Assertions
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirection to home page
  });

  /**
   * Test case for handling errors while capturing a payment.
   * 
   * This test simulates an error occurring while capturing a payment and verifies that the system returns
   * a 500 status code and an error message.
   * 
   * @test
   */
  test('GET /execute-payment should handle error while capturing payment', async () => {
    // Mocking an error in the PayPal API response
    post.mockImplementation((url, options, callback) => {
      callback(new Error('Error capturing payment'), null);
    });

    // Sending the request to the app
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    // Assertions
    expect(res.statusCode).toBe(500);  // Error response expected
    expect(res.text).toBe('Error capturing payment');  // Error message
  });

  /**
   * Test case for handling errors during payment creation.
   * 
   * This test checks that if there is an error while creating a payment with PayPal, the system responds 
   * with a 500 status code and an error message.
   * 
   * @test
   */
  test('POST /create-payment should handle error while creating payment', async () => {
    // Mocking an error in the PayPal API response
    post.mockImplementation((url, options, callback) => {
      callback(new Error('PayPal failed'), null);
    });

    // Sending the request to the app
    const res = await request(app)
      .post('/create-payment')
      .send();

    // Assertions
    expect(res.statusCode).toBe(500);  // Error response expected
    expect(res.body).toEqual({ error: 'Error creating payment' });  // Error message
  });

  /**
   * Test case for handling email sending errors.
   * 
   * This test simulates an error occurring while sending the confirmation email, ensuring that the process 
   * continues but without the email being sent.
   * 
   * @test
   */
  test('GET /execute-payment handles email sending error', async () => {
    // Mocking the PayPal API response for a completed payment
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

    // Mocking the error when sending the email
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn((options, callback) => {
        callback(new Error('Email sending failed'), null);
      })
    });

    // Sending the request to the app
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    // Assertions
    expect(res.statusCode).toBe(302);  // Redirection expected
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirection to home page
  });

  /**
   * Test case for handling multiple purchase units in a payment.
   * 
   * This test checks that the `/execute-payment` endpoint correctly handles payments with multiple purchase units.
   * 
   * @test
   */
  test('GET /execute-payment handles multiple purchase units', async () => {
    // Mocking the PayPal API response with multiple purchase units
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

    // Sending the request to the app
    const res = await request(app)
      .get('/execute-payment?token=fake-token')
      .send();

    // Assertions
    expect(res.statusCode).toBe(302);  // Redirection expected
    expect(res.headers.location).toBe('http://localhost:3000');  // Redirection to home page
  });

});
