const request = require('supertest');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./user-model');

const correctUser = {
  username: 'testuser',
  password: 'Password123',
};

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const response = await request(app).post('/adduser').send(correctUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({ username: 'testuser' });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe('testuser');

    // Assert that the password is encrypted
    const isPasswordValid = await bcrypt.compare('Password123', userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should response with an error 400 because password is not secure', async () => {
    const newUser = {
      username: 'testuser',
      password: 'password',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password error content: password');
  });

  it('should response with an error 409 because username already exists', async () => {
    // Same user with another password
    const existingUser = {
      username: 'testuser',
      password: 'Password12345',
    };
    await request(app).post('/adduser').send(correctUser); // Add the user first
    const response = await request(app).post('/adduser').send(existingUser); // Try to add the same user again
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  });

  it ('should response with an error 400 because required fields are missing', async () => {
    const newUser = {
      password: 'Password123',
    };
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required field: username');
  });
});
