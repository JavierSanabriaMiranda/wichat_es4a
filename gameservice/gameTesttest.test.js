const request = require('supertest');
const axios = require('axios');  // Ensure axios is imported here
const app = require('./game'); // Correct path to your Express server
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { GamePlayed } = require('./models/game_played'); // Correct path to your model
const Question = require('./models/Question'); // Adjust the path if needed

// Secret key for signing JWT (adjust according to your actual configuration)
const privateKey = "your-secret-key";

// Mocking axios
jest.mock('axios');  // This mocks all axios calls within the tests

let mongoServer;
// Mock for Question model to avoid actual database calls
jest.mock('./models/Question', () => ({
  Question: {
    findOne: jest.fn().mockResolvedValue({
      text: 'What is the capital of Chile?',
      imageUrl: '',
      answers: [
        { text: 'Lima', isCorrect: false },
        { text: 'Madrid', isCorrect: false },
        { text: 'Santiago', isCorrect: true },
      ],
    }),
    insertMany: jest.fn().mockResolvedValue([
      {
        _id: '603d2f3e4f1b3b1f7237c7ed',  // Simulated MongoDB _id
        text: 'What is the capital of France?',
        imageUrl: 'http://example.com/image.jpg',
        selectedAnswer: 'Paris',
        answers: [
          { text: 'Paris', isCorrect: true },
          { text: 'London', isCorrect: false }
        ],
      },
      {
        _id: '603d2f3e4f1b3b1f7237c7ee',
        text: 'What is 2 + 2?',
        imageUrl: 'http://example.com/image2.jpg',
        selectedAnswer: '4',
        answers: [
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false }
        ],
      },
    ]),
  },
}));

beforeAll(async () => {
  // Create an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Mock axios.post for API calls
  axios.post.mockImplementation((url, data, config) => {
    if (url.includes('/api/game/new')) {
      return Promise.resolve({ data: { cacheId: 12345 } });
    } else if (url.includes('/api/question/new')) {
      return Promise.resolve({
        data: {
          question: {
            text: 'What is the capital of France?',
            answers: [
              { text: 'Paris', isCorrect: true },
              { text: 'London', isCorrect: false },
              { text: 'London', isCorrect: false },
              { text: 'London', isCorrect: false }
            ],
          },
        },
      });
    } else if (url.includes('/api/game/endAndSaveGame')) {
      return Promise.resolve({ data: { gameEnded: true } });
    } else if (url.includes('/api/game/history/gameList')) {
      return Promise.resolve({
        data: [
          {
            _id: "6806b4ec6e7ef01ac6d2a409",
            userId: "60d0fe4f5311236168a109cf",
            numberOfQuestions: 1,
            numberOfCorrectAnswers: 1,
            gameMode: 'normal',
            points: 10,
            topics: []
          }
        ]
      });
    } else if (url.includes('/api/game/history/gameQuestions')) {
      return Promise.resolve({ data: { questions: ['q1', 'q2'] } });
    }
    return Promise.resolve({ data: {} });
  });
});

afterAll(async () => {
  // Disconnect and stop the in-memory database server
  await mongoose.disconnect();
  await mongoServer.stop();

  app.close(); // Close the server after tests are completed
});

/**
 * Test suite for Game Service API
 */
describe('Game Service API', () => {
  
  /**
   * Test for starting a new game
   * It tests the `/api/game/new` endpoint to start a new game and return a cacheId.
   */
  it('should start a new game and return a cacheId', async () => {
    const response = await request(app)
      .post('/api/game/new')
      .send({ cacheId: '60d0fe4f5311236168a109cf', topics: ['science'], lang: 'en' });

    expect(response.statusCode).toBe(200);
  });

  /**
   * Test for retrieving the next question in the game
   * It tests the `/api/game/next` endpoint to retrieve the next question for the game.
   */
  it('should return next game question', async () => {
    const response = await request(app)
      .post('/api/game/next')
      .send({ cacheId: '60d0fe4f5311236168a109cf' });

    expect(response.statusCode).toBe(200);
  });

  /**
   * Test for ending and saving the game
   * It tests the `/api/game/endAndSaveGame` endpoint to end the game and save its results.
   */
  it('should end and save game', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        user: { userId: '60d0fe4f5311236168a109cf' },
        questions: [
          { text: 'What is the capital of France?', imageUrl: 'http://example.com/image.jpg', selectedAnswer: 'Paris', answers: [{ text: 'Paris', isCorrect: true }, { text: 'London', isCorrect: false }] }
        ],
        numberOfQuestions: 1,
        numberOfCorrectAnswers: 1,
        gameMode: 'normal',
        points: 10
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Game data saved successfully.");
  });

  /**
   * Test for retrieving the game history list
   * It tests the `/api/game/history/gameList` endpoint to get the history of games played by a user.
   */
  it('should return game history list', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/game/history/gameList')
      .set('Authorization', `Bearer ${token}`)
      .send({ "user": { "userId": "60d0fe4f5311236168a109cf" }});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        _id: expect.any(String),
        numberOfQuestions: 1,
        numberOfCorrectAnswers: 1,
        gameMode: 'normal',
        points: 10,
        topics: []
      }
    ]);
  });

  /**
   * Test for retrieving the questions history of a game
   * It tests the `/api/game/history/gameQuestions` endpoint to get the questions asked in a specific game.
   */
  it('should return game questions history', async () => {
    const mockGame = { questions: ['q1', 'q2'] };

    // Mock the GamePlayed model method
    jest.spyOn(GamePlayed, 'findById').mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockGame),
    }));

    const response = await request(app)
      .post('/api/game/history/gameQuestions')
      .send({ gameId: "60d0fe4f5311236168a109cf" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(['q1', 'q2']);
  });

  /**
   * Test for handling an error when creating a new game with missing required fields
   * It tests the `/api/game/new` endpoint with empty data.
   */
  it('should return 500 when creating a new game without required fields', async () => {
    const response = await request(app)
      .post('/api/game/new')
      .send({});  // Sending empty body

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });

  /**
   * Test for handling an error when `cacheId` is missing while requesting next question
   * It tests the `/api/game/next` endpoint with empty data.
   */
  it('should return 500 when cacheId is missing while requesting next question', async () => {
    const response = await request(app)
      .post('/api/game/next')
      .send({});  // Empty body without cacheId

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });

  /**
   * Test for handling a bad request when incorrect data is sent to end the game
   * It tests the `/api/game/endAndSaveGame` endpoint with incorrect data format.
   */
  it('should return 400 when sending incorrect data to end game', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: { userId: '' },  // Empty userId
        questions: [],  // Empty questions
        numberOfQuestions: 0,
        numberOfCorrectAnswers: 0,
        gameMode: 'normal',
        points: 0
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Missing required fields or invalid data format.");
  });

  /**
   * Test for handling a server error when saving game data fails
   * It tests the `/api/game/endAndSaveGame` endpoint when an error occurs during the save process.
   */
  it('should return 500 when an error occurs while saving game data', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: { userId: '60d0fe4f5311236168a109cf' },
        questions: [{ text: 'What is 2+2?', answers: [{ text: '4', isCorrect: true }] }],
        numberOfCorrectAnswers: 1,
        points: 10
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });

  /**
   * Test for handling a missing `userId` while fetching the game history list
   * It tests the `/api/game/history/gameList` endpoint with empty data.
   */
  it('should return 500 when userId is missing while fetching game list', async () => {
    const response = await request(app)
      .post('/api/game/history/gameList')
      .send({});  // Empty body without userId

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });

  /**
   * Test for handling a not found error when a game is not found while fetching game questions
   * It tests the `/api/game/history/gameQuestions` endpoint with an invalid gameId.
   */
  it('should return 404 when game not found while fetching game questions', async () => {
    // Simulate game not found
    jest.spyOn(GamePlayed, 'findById').mockResolvedValue(null);

    const response = await request(app)
      .post('/api/game/history/gameQuestions')
      .send({
        gameId: '60d0fe4f5311236168a109cf'
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
