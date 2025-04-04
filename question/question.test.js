import request from 'supertest';
import server from './question';
import axios from 'axios';

jest.mock('axios');

afterAll(async () => {
  server.close();
});

describe('Question Service', () => {
  axios.post.mockImplementation((url) => {
    if (url.endsWith('/api/question/generate')) {
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
    expect(response.body.token).toBe(undefined);
  });

  it('should handle errors gracefully', async () => {
    const response = await request(server)
      .post('/api/question/generate')
      .send({ topics: ['error'], lang: 'es' });

    expect(response.statusCode).toBe(500);
    expect(response.body.token).toBe(undefined);
  });

});