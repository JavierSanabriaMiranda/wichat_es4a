// External libs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/mongo/Connection');

// Libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs");
const YAML = require('yaml');

// My own libs
const {  newGame,
  next,
  endAndSaveGame,
  getNumberOfQuestionsPlayed,
  getQuestion,
  getCurrentGame,
  endGame } = require("./game/GameManager");

const port = 8005;
const app = express();

// Prometheus configuration
const promBundle = require('express-prom-bundle');
const { getCurrentQuestion } = require("./game/QuestionAsk");
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Middleware 
app.use(bodyParser.json()); // Parse the request into JSON
app.use(cors()); // This API is listening on a different port from the frontend

// API endpoints
app.post('/api/game/new', (req, res) => {
  console.log('Iniciando un nuevo juego...');
  newGame(req, res); // Ejecutar la función cuando se haga la solicitud
});

app.post('/api/game/next', (req, res) => {
  console.log('Obteniendo la siguiente pregunta...');
  next(req, res); // Ejecutar la función cuando se haga la solicitud
});

app.post('/api/game/endAndSaveGame', (req, res) => {
  console.log('Respondiendo a la pregunta...');
  endAndSaveGame(req, res); // Ejecutar la función cuando se haga la solicitud
});


// Leer el archivo OpenAPI YAML de forma síncrona
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parsear el contenido YAML a un objeto JavaScript que represente el documento Swagger
  const swaggerDocument = YAML.parse(file);

  // Servir la documentación Swagger UI en el endpoint '/api-doc'
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("No se ha configurado OpenAPI. El archivo de configuración no está presente.");
}

// Conectar con MongoDB cuando se haga la primera solicitud (y no antes)
app.post('/api/connectMongo', (req, res) => {
  mongodb(); // Conexión a MongoDB solo cuando se hace esta solicitud
  res.status(200).send('Conexión a MongoDB establecida.');
});

// Empezar el servidor
const server = app.listen(port, () => {
  console.log(`Game service listening at http://localhost:${port}`);
});

module.exports = server;