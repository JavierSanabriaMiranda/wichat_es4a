//set a fake api key
process.env.LLM_API_KEY = 'test-api-key';

const request = require('supertest');
const axios = require('axios');
const app = require('./llm-service');

// Utils
const { getLanguage } = require('../llmservice/llm-service-utils');

afterAll(async () => {
  app.close();
});

jest.mock('axios');

describe('LLM Service', () => {

  const ORIGINAL_API_KEY = process.env.LLM_API_KEY;
  afterAll(() => {
    process.env.LLM_API_KEY = ORIGINAL_API_KEY;
  });

  // Test de health endpoint
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.startsWith('https://generativelanguage')) {
      return Promise.resolve({ data: { candidates: [{ content: { parts: [{ text: 'llmanswer' }] } }] } });
    } else if (url.startsWith('https://empathyai')) {
      return Promise.resolve({ data: { choices: [ { message: { content: 'llmanswer' } } ] } });
    }
  });

  // Test /ask endpoint
  it('the llm should reply', async () => {
    const response1 = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    const response2 = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'empathy' });

    expect(response1.statusCode).toBe(200);
    expect(response1.body.answer).toBe('llmanswer');
    expect(response2.statusCode).toBe(200);
    expect(response2.body.answer).toBe('llmanswer');
  });

  // Test /askllm/clue endpoint
  it('the llm should reply', async () => {
    const response1 = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'a question', context: [], language: 'en', gameMode: 'normal' });
  
    const response2 = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'a question', context: [], language: 'es', gameMode: 'normal' });
  
    expect(response1.statusCode).toBe(200);
    expect(response1.body.answer).toBe('llmanswer');
    expect(response2.statusCode).toBe(200);
    expect(response2.body.answer).toBe('llmanswer');
  });

  // Test /askllm/welcome endpoint
  it('the llm should reply', async () => {
    const response1 = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'username', language: 'es' });

    const response2 = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'username', language: 'es' });

    expect(response1.statusCode).toBe(200);
    expect(response1.body.answer).toBe('llmanswer');
    expect(response2.statusCode).toBe(200);
    expect(response2.body.answer).toBe('llmanswer');
  });

  // Tests utils
  it('should return the correct language for es', () => {
    const result = getLanguage('es');
    expect(result).toBe('español');
  });
  it('should return the correct language for en', () => {
    const result = getLanguage('en');
    expect(result).toBe('inglés');
  });
  it('should return the default language for fr', () => {
    const result = getLanguage('fr');
    expect(result).toBe('francés');
  });
  it('should return the default language for de', () => {
    const result = getLanguage('de');
    expect(result).toBe('alemán');
  });
  it('should return the default language for it', () => {
    const result = getLanguage('it');
    expect(result).toBe('italiano');
  });
  it('should return the default language for unsupported language', () => {
    const result = getLanguage('x');
    expect(result).toBe('español');
  });

  // Tests required fields /ask endpoint
  it('should return 400 if required fields missing on /ask (línea 96)', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ model: 'gemini' }); // falta `question`

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: question');
  });

  // Tests required fields /askllm/clue endpoint
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/clue')
      .send({ question: 'a question', context: [], language: 'es', gameMode: 'normal' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: correctAnswer');
  });
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'a question', language: 'es', gameMode: 'normal' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: context');
  });
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'a question', context: [], gameMode: 'normal' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: language');
  });
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/clue')
      .send({ correctAnswer: 'answer', question: 'a question', context: [], language: 'es' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: gameMode');
  });

  // Tests required fields /askllm/welcome endpoint
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/welcome')
      .send({ language: 'es' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: username');
  });
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'username' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: language');
  });

  // Response null for unsupported model
  it('should return null answer for unsupported model', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'test', model: 'no-such-model' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBeNull();
  });

  // Tests for missing API key
  it('should return 400 if API key missing on /ask', async () => {
    delete process.env.LLM_API_KEY;

    const response = await request(app)
      .post('/ask')
      .send({ question: 'hola', model: 'gemini' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('API key is missing.');

    process.env.LLM_API_KEY = ORIGINAL_API_KEY;
  });

  it('should return 400 if API key missing on /askllm/clue', async () => {
    delete process.env.LLM_API_KEY;

    const response = await request(app)
      .post('/askllm/clue')
      .send({
        correctAnswer: 'resp',
        question: '¿qué?',
        context: [],
        language: 'es',
        gameMode: 'normal'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('API key is missing.');

    process.env.LLM_API_KEY = ORIGINAL_API_KEY;
  });

  it('should return 400 if API key missing on /askllm/welcome', async () => {
    delete process.env.LLM_API_KEY;

    const response = await request(app)
      .post('/askllm/welcome')
      .send({ username: 'user1', language: 'en' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('API key is missing.');

    process.env.LLM_API_KEY = ORIGINAL_API_KEY;
  });

  // Response idk for /askllm/clue
  it('should return fallback response when LLM returns "idk" on /askllm/clue', async () => {
    axios.post.mockImplementationOnce((url, data) =>
      Promise.resolve({
        data: { candidates: [{ content: { parts: [{ text: 'idk' }] } }] }
      })
    );
    axios.post.mockImplementationOnce((url, data) =>
      Promise.resolve({
        data: { candidates: [{ content: { parts: [{ text: 'pista-final' }] } }] }
      })
    );

    const response = await request(app)
      .post('/askllm/clue')
      .send({
        correctAnswer: 'secreto',
        question: '¿otra pista?',
        context: [],
        language: 'es',
        gameMode: 'normal'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('pista-final');
  });

});
