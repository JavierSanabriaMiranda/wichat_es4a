const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const GameSession = require('../facade/GameSession');

//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

// Utils
const { getLanguage, normalizeString } = require('./gateway-service-utils');

const app = express();
const port = 8000;

const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8003';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    console.log(userResponse)
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/askllm', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const llmResponse = await axios.post(llmServiceUrl+'/ask', req.body);
    res.json(llmResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Endpoint to get a question from the Wikidata service
app.get('/api/questions', async (req, res) => {
  const gameSession = new GameSession.default("user123", ["geography", "history"], "easy");
  const question = await gameSession.playQuestions();
  if (question) {
      res.json(question);
  } else {
      res.status(500).json({ error: "No se pudo obtener la pregunta" });
  }
});

// Endpoint to get a clue from the LLM service
app.post('/askllm/clue', async (req, res) => {
  try {
    const { name, userQuestion, language } = req.body;

    let model = "empathy";
    let attempts = 0;
    let answer = "idk";

    while (attempts < 10) {
      /**
       * Generates a question prompt for a user to guess a name without revealing it.
       *
       * @param {string} name - The name that the user needs to guess.
       * @param {string} userQuestion - The question asked by the user.
       * @param {string} language - The language in which the response should be given.
       * @returns {string} - A prompt for the user to guess the name without revealing it, in the specified language.
       */
      let question = "Un usuario debe adivinar " + name + ". Para ello pregunta: " + userQuestion + ". ¿Qué le responderías? De forma corta y concisa. NO PUEDES DECIR DE NINGUNA FORMA " + name + ". Debes responder en " + getLanguage(language) + ".";
      let llmResponse = await axios.post(llmServiceUrl+'/ask', { question, model });

      const normalizedAnswer = normalizeString(llmResponse.data.answer.toLowerCase());
      const normalizedName = normalizeString(name.toLowerCase());

      if (!normalizedAnswer.includes(normalizedName)) {
        answer = llmResponse;
        break;
      }

      attempts += 1;
    }

    if (answer === "idk") {
      /**
       * @description Generates a fallback question in the specified language.
       * @param {string} language - The language code to determine the language of the fallback question.
       * @returns {string} A fallback question prompting the user to respond briefly in the specified language.
       */
      let fallbackQuestion = "Responde brevemente en " + getLanguage(language) + " que no sabes la respuesta.";
      let fallbackResponse = await axios.post(llmServiceUrl+'/ask', { question: fallbackQuestion, model });
      answer = fallbackResponse;
    }

    res.json(answer.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
