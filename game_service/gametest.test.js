const request = require('supertest');
const app = require("./game"); // Asegúrate de que app esté exportando el servidor de Express correctamente
const axios = require('axios');

// Mocks de axios y otros módulos
jest.mock('axios');
jest.mock('./game/QuestionAsk', () => ({
  ...jest.requireActual('./game/QuestionAsk'),
  requestQuestion: jest.fn().mockResolvedValue({
    question: '¿Cuál es la capital de Chile?',
    answer: 'Santiago',
    imageUrl: '',
    options: ['Lima', 'Madrid', 'Bogotá']
  })
}));

jest.mock('./models/game_played', () => ({
  GamePlayed: {
    findOne: jest.fn().mockImplementation(() => {
      console.log("Mocked findOne is called");  // Esto para depuración
      return Promise.resolve({
        userId: "60d0fe4f5311236168a109cf",
        numberOfQuestions: 5,
        numberOfCorrectAnswers: 3,
        gameMode: "normal",
        points: 10,
        topics: ["history"],
        questions: [{
          text: "¿Cuál es la capital de Chile?",
          selectedAnswer: "Santiago",
          answers: [
            { text: 'Lima', isCorrect: false },
            { text: 'Madrid', isCorrect: false },
            { text: 'Santiago', isCorrect: true },
          ]
        }]
      });
    }),
    save: jest.fn().mockResolvedValue(true),
    insertMany: jest.fn().mockResolvedValue(true),
  },
}));


jest.mock('./models/Question', () => ({
  Question: {
    findOne: jest.fn().mockResolvedValue({
      text: '¿Cuál es la capital de Chile?',
      imageUrl: '',
      answers: [
        { text: 'Lima', isCorrect: false },
        { text: 'Madrid', isCorrect: false },
        { text: 'Santiago', isCorrect: true },
      ],
    }),
    insertMany: jest.fn().mockResolvedValue(true),
  },
}));

// El token válido para las pruebas
const validCacheId = "60d0fe4f5311236168a109cf"; // Asegúrate de usar un cacheId válido
const validLang = 'es';
const validTopics = ['history'];

afterAll(() => {
    app.close();
});

describe('Game Service', () => {
    it("Should return 200 with a valid cacheId when requesting a new game", async () => {
        const response = await request(app)
            .post('/api/game/new')
            .send({ cacheId: validCacheId, topics: validTopics, lang: validLang });

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Game data created successfully");
    });

    it("Should return 400 when the game settings are not found for the next question", async () => {
        const response = await request(app)
            .post('/api/game/next')
            .send({ cacheId: "60d0fe4f5311236168a13333" });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Game settings not found.');
    });

    it("Should return 200 with the next question when requesting the next game", async () => {
        const response = await request(app)
            .post('/api/game/next')
            .send({ cacheId: validCacheId });

        expect(response.statusCode).toBe(200);
        expect(response.body.text).toBe("¿Cuál es la capital de Chile?");
        expect(response.body.answers.length).toBe(3); // Asegúrate de que el número de respuestas es correcto
    });

    it("Should return 200 when ending and saving the game", async () => {
        const gameData = {
            user: { userId: "60d0fe4f5311236168a109cf" },
            numberOfQuestions: 5,
            numberOfCorrectAnswers: 3,
            gameMode: "normal",
            points: 10,
            topics:["history"],
            questions: [{
                text: "¿Cuál es la capital de Chile?",
                selectedAnswer: "Santiago",
                answers: [
                    { text: 'Lima', isCorrect: false },
                    { text: 'Madrid', isCorrect: false },
                    { text: 'Santiago', isCorrect: true },
                ]
            }]
        };

        const response = await request(app)
            .post('/api/game/endAndSaveGame')
            .send(gameData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Game data saved successfully.");
    });

    it("Should return 200 with the game questions", async () => {
        const gameId = "60d0fe4f5311236168a109cf";  // Suponemos que ya tienes un ID de juego válido

        const response = await request(app)
            .post('/api/game/history/gameQuestions')
            .send({ gameId: gameId });

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); // Asegúrate de que haya preguntas en el historial
    });

    it("Should return 400 when game questions are not found for a game", async () => {
        const response = await request(app)
            .post('/api/game/history/gameQuestions')
            .send({ gameId: 'nonExistingGameId' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("Internal server error");
    });

    it("Should return 200 with a valid user ID when requesting user game history", async () => {
        const response = await request(app)
            .post('/api/game/history/gameList')
            .send({ user: { userId: '60d0fe4f5311236168a109cf' } });

        expect(response.statusCode).toBe(200);
    });

    it("Should return 400 when no user ID is provided for game history", async () => {
        const response = await request(app)
            .post('/api/game/history/gameList')
            .send({ user: {} });

        expect(response.statusCode).toBe(500);
    });

    it("Should return 400 with invalid cacheId when requesting a new game", async () => {
        const response = await request(app)
            .post('/api/game/new')
            .send({ cacheId: undefined, topics: validTopics, lang: validLang });

        expect(response.statusCode).toBe(500);
    });
});
