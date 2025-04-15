/**
 * @fileoverview Tests para el servicio de juego utilizando Supertest, Jest y mocks.
 * Este archivo realiza pruebas de integración simulando peticiones HTTP al servidor Express.
 */

const request = require('supertest');
const app = require("./game"); // Importa la app de Express
const axios = require('axios');

// Mocks de dependencias externas
jest.mock('axios');

// Mock del módulo que proporciona las preguntas del juego
jest.mock('./game/QuestionAsk', () => ({
  ...jest.requireActual('./game/QuestionAsk'),
  requestQuestion: jest.fn().mockResolvedValue({
    question: '¿Cuál es la capital de Chile?',
    answer: 'Santiago',
    imageUrl: '',
    options: ['Lima', 'Madrid', 'Bogotá']
  })
}));

// Mock del modelo GamePlayed para simular interacciones con la base de datos
jest.mock('./models/game_played', () => ({
  GamePlayed: {
    findOne: jest.fn().mockImplementation(() => {
      console.log("Mocked findOne is called");
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

// Mock del modelo Question para evitar llamadas reales a la base de datos
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

// Parámetros reutilizables para las pruebas
const validCacheId = "60d0fe4f5311236168a109cf";
const validLang = 'es';
const validTopics = ['history'];

// Cierra la app al final de todas las pruebas
afterAll(() => {
    app.close();
});

/**
 * Suite de pruebas para el servicio de juego.
 */
describe('Game Service', () => {

    /**
     * Verifica que se pueda iniciar una nueva partida con parámetros válidos.
     */
    it("Should return 200 with a valid cacheId when requesting a new game", async () => {
        const response = await request(app)
            .post('/api/game/new')
            .send({ cacheId: validCacheId, topics: validTopics, lang: validLang });

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Game data created successfully");
    });

    /**
     * Verifica que se devuelva error 400 si no se encuentra configuración de juego.
     */
    it("Should return 400 when the game settings are not found for the next question", async () => {
        const response = await request(app)
            .post('/api/game/next')
            .send({ cacheId: "60d0fe4f5311236168a13333" });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Game settings not found.');
    });

    /**
     * Verifica que se devuelva la siguiente pregunta correctamente.
     */
    it("Should return 200 with the next question when requesting the next game", async () => {
        const response = await request(app)
            .post('/api/game/next')
            .send({ cacheId: validCacheId });

        expect(response.statusCode).toBe(200);
        expect(response.body.text).toBe("¿Cuál es la capital de Chile?");
        expect(response.body.answers.length).toBe(3);
    });

    /**
     * Verifica que se pueda guardar correctamente el final de una partida.
     */
    it("Should return 200 when ending and saving the game", async () => {
        const gameData = {
            user: { userId: "60d0fe4f5311236168a109cf" },
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
        };

        const response = await request(app)
            .post('/api/game/endAndSaveGame')
            .send(gameData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Game data saved successfully.");
    });

    /**
     * Verifica que se puedan recuperar las preguntas de una partida existente.
     */
    it("Should return 200 with the game questions", async () => {
        const gameId = "60d0fe4f5311236168a109cf";

        const response = await request(app)
            .post('/api/game/history/gameQuestions')
            .send({ gameId: gameId });

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    /**
     * Verifica que se maneje adecuadamente un ID de juego no existente.
     */
    it("Should return 400 when game questions are not found for a game", async () => {
        const response = await request(app)
            .post('/api/game/history/gameQuestions')
            .send({ gameId: 'nonExistingGameId' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("Internal server error");
    });

    /**
     * Verifica que se pueda obtener el historial de partidas de un usuario.
     */
    it("Should return 200 with a valid user ID when requesting user game history", async () => {
        const response = await request(app)
            .post('/api/game/history/gameList')
            .send({ user: { userId: '60d0fe4f5311236168a109cf' } });

        expect(response.statusCode).toBe(200);
    });

    /**
     * Verifica que se devuelva error si no se proporciona userId en el historial.
     */
    it("Should return 400 when no user ID is provided for game history", async () => {
        const response = await request(app)
            .post('/api/game/history/gameList')
            .send({ user: {} });

        expect(response.statusCode).toBe(500);
    });

    /**
     * Verifica que se maneje correctamente una solicitud inválida para iniciar juego.
     */
    it("Should return 400 with invalid cacheId when requesting a new game", async () => {
        const response = await request(app)
            .post('/api/game/new')
            .send({ cacheId: undefined, topics: validTopics, lang: validLang });

        expect(response.statusCode).toBe(500);
    });
});
