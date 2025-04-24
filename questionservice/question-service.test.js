const request = require('supertest');
const server = require('./question-service');
const axios = require('axios');

jest.mock('axios');

afterAll(async () => {
  server.close();
});

beforeAll(() => {
  axios.post.mockImplementation((url, body, config) => {
    if (url === 'https://query.wikidata.org/sparql') {
      // Simula una respuesta de Wikidata con resultados válidos
      return Promise.resolve({
        data: {
          results: {
            bindings: [
              { label: { value: 'Egipto' }, image: { value: 'https://flag.url/egipto.png' } },
              { label: { value: 'Italia' }, image: { value: 'https://flag.url/italia.png' } },
              { label: { value: 'Polonia' }, image: { value: 'https://flag.url/polonia.png' } },
              { label: { value: 'Turquía' }, image: { value: 'https://flag.url/turquia.png' } }
            ]
          }
        }
      });
    }
    // Simula error si la URL no es la de Wikidata
    return Promise.reject(new Error('Unknown endpoint'));
  });
});

describe('Question Service', () => {

  it('should return a valid question when generating a question with the correct template', async () => {
    const response = await request(server)
      .post('/api/question/generate')
      .send({ topics: ['geography'], lang: 'es' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('image');
      expect(response.body).toHaveProperty('options');
  });

  it('should return a 404 error if no valid question is generated', async () => {
    const response = await request(server)
      .post('/api/question/error')
      .send({ topics: ['geography'], lang: 'es' });

    expect(response.statusCode).toBe(404);
    expect(response.body.question).toBe(undefined);
  });

  it('should handle errors gracefully', async () => {
    const response = await request(server)
      .post('/api/question/generate')
      .send({ topics: ['error'], lang: 'es' });

    expect(response.statusCode).toBe(500);
    expect(response.body.question).toBe(undefined);
  });

});