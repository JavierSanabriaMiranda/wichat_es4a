const request = require('supertest');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = require('./gateway-service');


const privateKey = process.env.TOKEN_SECRET_KEY || 'your-secret-key';

afterAll(async () => {
  app.close();
});

// Se simula axios.post para cada endpoint llamado por el Gateway
jest.mock('axios');

describe('Gateway Service', () => {
  beforeAll(() => {
    axios.post.mockImplementation((url, data, config) => {
      if (url.includes('/login')) {
        return Promise.resolve({ data: { token: 'mockedToken' } });
      } else if (url.includes('/adduser')) {
        return Promise.resolve({ data: { userId: 'mockedUserId' } });
      } else if (url.includes('/api/question/generate')) {
        return Promise.resolve({ data: { question: 'generatedQuestion' } });
      } else if (url.includes('/editUser')) {
        return Promise.resolve({ data: { result: 'userEdited' } });
      } else if (url.includes('/api/connectMongo')) {
        return Promise.resolve({ data: { connected: true } });
      } else if (url.includes('/api/game/new')) {
        return Promise.resolve({ data: { gameStarted: true } });
      } else if (url.includes('/api/game/next')) {
        return Promise.resolve({ data: { question: 'nextQuestion' } });
      } else if (url.includes('/api/game/endAndSaveGame')) {
        return Promise.resolve({ data: { gameEnded: true } });
      } else if (url.includes('/api/game/history/gameList')) {
        return Promise.resolve({ data: { history: ['game1', 'game2'] } });
      } else if (url.includes('/api/game/history/gameQuestions')) {
        return Promise.resolve({ data: { questions: ['q1', 'q2'] } });
      } else if (url.includes('/askllm/clue')) {
        return Promise.resolve({ data: { answer: 'llmanswer' } });
      } else if (url.includes('/askllm/welcome')) {
        return Promise.resolve({ data: { answer: 'llmanswer' } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  it('should forward question generation request to question service', async () => {
    const response = await request(app)
      .post('/api/question/new')
      .send({ someData: 'value' });
    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('generatedQuestion');
  });

  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  it('should forward edit user request to user service with valid token', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/user/editUser')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'edituser' });
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe('userEdited');
  });

  it('should forward askllm clue request to the llm service', async () => {
    const response = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'question', context: [], language: 'es' });
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  it('should forward askllm welcome request to the llm service', async () => {
    const response = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'username', language: 'es' });
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  it('should start a new game and return a cacheId', async () => {
    const response = await request(app)
      .post('/api/game/new')
      .send({ someGameData: 'value' });
    expect(response.statusCode).toBe(200);
    expect(response.body.cacheId).toBeDefined();
    expect(typeof response.body.cacheId).toBe('number');
  });

  it('should return next game question', async () => {
    const response = await request(app)
      .post('/api/game/question')
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('nextQuestion');
  });

  it('should end and save game with valid token', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'game1', score: 100 });
    expect(response.statusCode).toBe(200);
    expect(response.body.gameEnded).toBe(true);
  });

  it('should return game history list with valid token', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    const response = await request(app)
      .get('/api/game/history/gameList')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(200);
    expect(response.body.history).toEqual(['game1', 'game2']);
  });

  it('should return game questions history', async () => {
    const response = await request(app)
      .post('/api/game/history/gameQuestions')
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toEqual(['q1', 'q2']);
  });

  it('should handle login error from auth service', async () => {
    axios.post.mockImplementationOnce(() => 
      Promise.reject({ response: { status: 400, data: { error: 'Invalid creds' } } })
    );
    const response = await request(app)
      .post('/login')
      .send({ username: 'u', password: 'p' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid creds');
  });

  it('should handle adduser error from user service', async () => {
    axios.post.mockImplementationOnce(() => 
      Promise.reject({ response: { status: 409, data: { error: 'User exists' } } })
    );
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'u', password: 'p' });
    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('User exists');
  });

  it('should assign guest user when editing user without token', async () => {
    const response = await request(app)
      .post('/api/user/editUser')
      .send({ username: 'guestedit' });
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe('userEdited');
  });

  it('should return 401 when Authorization header has no token', async () => {
    const response = await request(app)
      .post('/api/user/editUser')
      .set('Authorization', 'Bearer ')
      .send({ username: 'edit' });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Token wasn't provided properly");
  });

  it('should return 401 for invalid token on editUser', async () => {
    const response = await request(app)
      .post('/api/user/editUser')
      .set('Authorization', 'Bearer invalid.token.here')
      .send({ username: 'edit' });
    expect(response.statusCode).toBe(401);
  });

  it('should handle editUser service error', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/editUser')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Service error' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/api/user/editUser')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'user' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Service error');
  });

  it('should handle askllm/clue error from llm service', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/askllm/clue')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Clue error' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'a', question: 'q', context: [], language: 'en' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Clue error');
  });

  it('should handle askllm/welcome error from llm service', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/askllm/welcome')) {
        return Promise.reject({ response: { status: 503, data: { error: 'Welcome error' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'u', language: 'en' });
    expect(response.statusCode).toBe(503);
    expect(response.body.error).toBe('Welcome error');
  });

  it('should handle /api/question/new error', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/question/generate')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Gen error' }, data: { foo: 'bar' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/api/question/new')
      .send({ foo: 'bar' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error generating question');
  });

  it('should handle /api/game/question error', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/next')) {
        return Promise.reject({ response: { status: 404, data: { error: 'Not found' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/api/game/question')
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Not found');
  });

  it('should handle /api/game/endAndSaveGame error', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/endAndSaveGame')) {
        return Promise.reject({ response: { status: 400, data: { error: 'End error' } } });
      }
      return Promise.resolve({ data: {} });
    });
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'game1', score: 10 });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('End error');
  });

  it('should handle /api/game/new error', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/new')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Error starting game' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/api/game/new')
      .send({ some: 'data' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error starting game');
  });

  it('should handle /api/game/history/gameList error', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('mongo fail')));
    const response = await request(app)
      .get('/api/game/history/gameList')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should handle /api/game/history/gameQuestions error', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('mongo fail')));
    const response = await request(app)
      .post('/api/game/history/gameQuestions')
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should return game history list without token (guest)', async () => {
    const response = await request(app)
      .get('/api/game/history/gameList')
      .send({ gameId: 'game1' });
    expect(response.statusCode).toBe(200);
    expect(response.body.history).toEqual(['game1', 'game2']);
  });

  it('should return 401 if userId is missing in /api/game/history/gameList', async () => {
    const token = jwt.sign({}, privateKey);
    const response = await request(app)
      .get('/api/game/history/gameList')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if userId is missing in /api/game/endAndSaveGame', async () => {
    const token = jwt.sign({}, privateKey); // No incluye userId
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 100 });
    
    expect(response.statusCode).toBe(401);
  });

  it('should handle error when /api/question/new fails with 500', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/question/generate')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal question generation error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/api/question/new')
      .send({ prompt: 'generate something' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal question generation error');
    expect(response.body.details).toBeDefined();
  });

  it('should handle error when /api/game/new fails with 500', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/new')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal game start error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/api/game/new')
      .send({ someGameData: 'value' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal game start error');
  });

  it('should handle error when fetching next game question fails with 500', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/next')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal fetch question error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/api/game/question')
      .send({ gameId: 'someGameId' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal fetch question error');
  });

  it('should handle error when ending and saving game fails with 500', async () => {
    const token = jwt.sign({ userId: 'testUser' }, privateKey);
  
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/api/game/endAndSaveGame')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal save game error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/api/game/endAndSaveGame')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'testUser', gameId: 'someGameId', score: 100 });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal save game error');
  });
  
  it('should handle error when generating clue fails with 500', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/askllm/clue')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal LLM error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/askllm/clue')
      .send({ question: 'What is the capital of France?' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal LLM error');
  });

  it('should handle error when generating welcome message fails with 500', async () => {
    axios.post.mockImplementationOnce((url) => {
      if (url.includes('/askllm/welcome')) {
        return Promise.reject({ response: { status: 500, data: { error: 'Internal LLM welcome error' } } });
      }
      return Promise.resolve({ data: {} });
    });
  
    const response = await request(app)
      .post('/askllm/welcome')
      .send({ user: 'newUser' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal LLM welcome error');
  });

  it('debería devolver 401 si no se proporciona un token', async () => {
    const res = await request(app).post('/validateToken').send({});
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Token not provided');
  });

  it('debería devolver 200 si el token es válido', async () => {
    const token = jwt.sign({ userId: 'usuario123' }, privateKey, { algorithm: 'HS256' }); // o el algoritmo que uses
    const res = await request(app).post('/validateToken').send({ token });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Token is valid');
    expect(res.body.userId).toBe('usuario123');
  });

  it('debería devolver 500 si ocurre un error inesperado en el servidor', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Fallo interno');
    });
    const token = jwt.sign({ userId: 'usuario123' }, privateKey, { algorithm: 'HS256' });
    const res = await request(app).post('/validateToken').send({ token });
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Fallo interno');
    jwt.verify.mockRestore(); 
  });

  it('debería devolver 200 y los datos del pago cuando el servicio externo responde correctamente', async () => {
    const mockPaymentResponse = { data: { success: true, paymentId: 'pago123' } };
    axios.post.mockResolvedValue(mockPaymentResponse);

    const res = await request(app)
      .post('/create-payment')
      .send({ amount: 100 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ success: true, paymentId: 'pago123' });
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/create-payment'), { amount: 100 });
  });

  it('debería devolver el statusCode y mensaje de error del servicio externo si falla', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid payment data' }
      }
    };
    axios.post.mockRejectedValue(mockError);

    const res = await request(app)
      .post('/create-payment')
      .send({ amount: 0 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Invalid payment data');
  });

  it('debería devolver 500 si ocurre un error inesperado', async () => {
    axios.post.mockRejectedValue(new Error('Service unavailable'));

    const res = await request(app)
      .post('/create-payment')
      .send({ amount: 100 });

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Error creating payment');
  });
});
