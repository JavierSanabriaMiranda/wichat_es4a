const axios = require('axios');
const express = require('express');

// Utils
const { getLanguage } = require('../llmservice/llm-service-utils');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());
// Load enviornment variables
require('dotenv').config();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Define configurations for different LLM APIs
const llmConfigs = {
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    transformRequest: (question) => ({
      contents: [{ parts: [{ text: question }] }]
    }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text
  },
  empathy: {
    url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
    transformRequest: (question) => ({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question }
      ]
    }),
    transformResponse: (response) => response.data.choices[0]?.message?.content,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }
};

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Generic function to send questions to LLM
async function sendQuestionToLLM(question, apiKey, model = 'gemini') {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Model "${model}" is not supported.`);
    }

    const url = config.url(apiKey);
    const requestData = config.transformRequest(question);

    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers ? config.headers(apiKey) : {})
    };

    const response = await axios.post(url, requestData, { headers });

    return config.transformResponse(response);

  } catch (error) {
    return null;
  }
}

app.post('/ask', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['question', 'model']);

    const { question, model } = req.body;
    //load the api key from an environment variable
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing.' });
    }
    const answer = await sendQuestionToLLM(question, apiKey, model);
    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/askllm/clue', async (req, res) => {
  let model = 'gemini';
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['correctAnswer', 'question', 'context', 'language']);

    const { correctAnswer, question, context = [], language } = req.body;
    //load the api key from an environment variable
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing.' });
    }

    let attempts = 0;
    let answer = "idk";
    let cleanContext = context.filter(msg => typeof msg.content === 'string' && msg.content.trim() !== '');
    let history = cleanContext.map((msg, i) => `Turno ${i + 1} [${msg.role}]: ${msg.content}`).join('\n');
    while (attempts < 3) {
      /**
 * Generates a question prompt for a user to guess a name without revealing it.
 *
 * @param {string} correctAnswer - The answer that the user needs to guess.
 * @param {string} question - The question asked by the user.
 * @param {string} language - The language in which the response should be given.
 * @returns {string} - A response for the user to guess the name without revealing it, in the specified language.
 */
      let prompt = `
            Estás ayudando a un usuario a adivinar el término secreto: **"${correctAnswer}"**.
            Tu tarea es proporcionarle pistas útiles, pero sin revelar directa o indirectamente el término ni ninguna de sus partes.
            
            Instrucciones:
            - Jamás digas ni parte ni sinónimo de "${correctAnswer}".
            - Sé claro, conciso y directo con tus pistas. En el caso de que no quieras dar una pista sobre algo, ofrece una pista parecida a lo que pregunta el usuario.
            - Si el usuario repite mucho las mismas preguntas, responde con un toque muy irónico, recalcando que el usuario no sabe ni por donde le sopla el viento.
            - Asegúrate de que tus pistas no se repitan.
            
            Conversación hasta ahora:
            ${history}
            
            Nueva pregunta del usuario: "${question}"
            
            ¿Qué le responderías en ${getLanguage(language)}?
            `.trim();
      var llmResponse = "idk";
      try {
        llmResponse = await sendQuestionToLLM(prompt, apiKey, model);
        break;
      }
      catch (error) {
        attempts++;
      }
      answer = llmResponse;
    }

    if (answer === "idk") {
      /**
       * @description Generates a fallback question in the specified language.
       * @param {string} language - The language code to determine the language of the fallback question.
       * @returns {string} A fallback question prompting the user to respond briefly in the specified language.
       */
      let fallbackQuestion = "Responde brevemente en " + getLanguage(language) + " que no sabes la respuesta.";
      let fallbackResponse = await sendQuestionToLLM(fallbackQuestion, apiKey);
      answer = fallbackResponse;
    }

    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});

app.post('/askllm/welcome', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['username', 'language']);

    const { username, language } = req.body;
    //load the api key from an environment variable
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing.' });
    }

    let model = 'gemini';
    let answer = "idk";
    answer = await sendQuestionToLLM("Saluda a " + username + " de forma educada y deséale suerte para su partida de 'WiChat'. Sé conciso, UNA FRASE. Debes responder en " + getLanguage(language) + ".", apiKey, model);

    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});

const server = app.listen(port, () => {
});

module.exports = server