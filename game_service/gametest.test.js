const request = require('supertest');
const server = require('./game');
const axios = require('axios');
const GameManager = require('./game/GameManager');

jest.mock('axios');

afterAll(async () => {
  server.close();
});

describe('Game Service', () => {
  beforeAll(() => {
    
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/api/game/new')) {
        return Promise.resolve({ data: { success: true, message: 'Game data created successfully' } });
      }
    });
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/api/game/next')) {
        return Promise.resolve({ data: 
          {
            question: "¿A qué país pertenece esta bandera?",
            correct: "Egipto",
            image: "https://commons.wikimedia.org/wiki/File:Flag_of_Egypt.svg",
            options: ["Italia", "Polonia", "Egipto", "Turquía"]
          } 
        });
      }
    });
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/api/game/endAndSaveGame')) {
        return Promise.resolve({ success: true, message: 'Game data saved successfully.' });
      }
    });
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/api/game/history')) {
        return Promise.resolve({ data:
          [
            { id: 'game1', score: 100 },
            { id: 'game2', score: 80 }
          ]
        });
      }
    });
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/api/game/history/gameList')) {
        return Promise.resolve({ data:
          [
            { id: 'game1', user: 'user123', score: 90 },
            { id: 'game2', user: 'user123', score: 70 }
          ]
        });
      }
    });

  });


  it('POST /api/game/new → debe crear un nuevo juego', async () => {
    const response = await request(server)
      .post('/api/game/new')
      .send({ userId: 'user123', mode: 'normal' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'Nuevo juego creado' });
  });

  it('POST /api/game/next → debe devolver la siguiente pregunta', async () => {
    const response = await request(server)
      .post('/api/game/next')
      .send({ gameId: 'game123', userId: 'user123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(Array.isArray(response.body.options)).toBe(true);
  });

  it('POST /api/game/endAndSaveGame → debe finalizar y guardar el juego', async () => {
    const response = await request(server)
      .post('/api/game/endAndSaveGame')
      .send({ gameId: 'game123', score: 80 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('finalScore');
  });

  it('POST /api/game/history → debe devolver el historial de juegos de un usuario', async () => {
    const response = await request(server)
      .post('/api/game/history')
      .send({ userId: 'user123' });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('score');
  });

  it('POST /api/game/history/gameList → debe devolver lista de partidas sin preguntas', async () => {
    const response = await request(server)
      .post('/api/game/history/gameList')
      .send({ userId: 'user123' });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('user');
  });

  it('POST /api/game/history/gameQuestions → debe devolver preguntas de una partida', async () => {
    const response = await request(server)
      .post('/api/game/history/gameQuestions')
      .send({ gameId: 'game123' });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('question');
    expect(response.body[0]).toHaveProperty('correct');
  });
});
