// Importing external libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/mongo/Connection');

// Libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

// My own libraries for game management
const {  
  newGame,
  next,
  endAndSaveGame,
  getNumberOfQuestionsPlayed,
  getQuestion,
  getCurrentGame,
  getUserGames,
  getUserGamesWithoutQuestions,
  getGameQuestions,
  endGame 
} = require("./game/GameManager");

const port = 8005;
const app = express();

// Prometheus configuration for metrics
const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Middleware configuration
app.use(bodyParser.json()); // Parse incoming requests as JSON
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) to handle requests from a different port

/**
 * @description API Endpoints
 * 
 * These are the POST API endpoints for handling game-related requests. The body of each POST request 
 * should contain the required data for the respective game function to process.
 * 
 * - **POST /api/game/new**: Starts a new game. 
 *   - Body data: A JSON object containing necessary game parameters (e.g., user details, game modality).
 * 
 * - **POST /api/game/next**: Retrieves the next question in the game. 
 *   - Body data: A JSON object containing user/game details.
 * 
 * - **POST /api/game/endAndSaveGame**: Ends the current game and saves the result. 
 *   - Body data: A JSON object containing the current game status and the final responses.
 * 
 * - **POST /api/game/history**: Retrieves the history of games played by a user. 
 *   - Body data: A JSON object with user details (e.g., user ID).
 */

// API Endpoints

/**
 * @function POST /api/game/new
 * @description Initiates a new game by calling the `newGame` function.
 * @body {Object} req.body - Request body should include data to start a new game.
 */
app.post('/api/game/new', (req, res) => {
  console.log('Iniciando un nuevo juego...');
  newGame(req, res); // Executes the function when the request is received
});

/**
 * @function POST /api/game/next
 * @description Retrieves the next question for the game by calling the `next` function.
 * @body {Object} req.body - Request body should include data about the current game and player.
 */
app.post('/api/game/next', (req, res) => {
  console.log('Obteniendo la siguiente pregunta...');
  next(req, res); // Executes the function when the request is received
});

/**
 * @function POST /api/game/endAndSaveGame
 * @description Ends the current game and saves the results by calling the `endAndSaveGame` function.
 * @body {Object} req.body - Request body should include game end data and final player responses.
 */
app.post('/api/game/endAndSaveGame', (req, res) => {
  console.log('Respondiendo a la pregunta...');
  endAndSaveGame(req, res); // Executes the function when the request is received
});

/**
 * @function POST /api/game/history
 * @description Retrieves the history of games played by the user by calling the `getUserGames` function.
 * @body {Object} req.body - Request body should include user identification (e.g., user ID).
 */
app.post('/api/game/history', (req, res) => {
  console.log('Obteniendo historial de juegos...');
  getUserGames(req, res); // Executes the function when the request is received
});

//Información sobre la partida para el historial
app.post('/api/game/history/gameList', async(req, res) => {
  try{
    console.log("Generando historico sobre partida");
    getUserGamesWithoutQuestions(req, res); // Executes the function when the request is received

  }catch(error){
    console.log("Error al generar el historico de partida: ", error.message);

  }
});

//Información sobre las preguntas de una partida para el historial
app.post('/api/game/history/gameQuestions', async(req, res) => {
  try{
    console.log("Generando historico sobre preguntas de una partida");
    getGameQuestions(req, res); // Executes the function when the request is received

  }catch(error){
    console.log("Error al generar el historico de preguntas: ", error.message);

  }
});
/**
 * @description OpenAPI-Swagger Documentation
 * 
 * Reads the OpenAPI YAML file and serves it as Swagger UI for API documentation.
 * If the YAML file is found, it is parsed and the documentation is available at the /api-doc endpoint.
 */
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');
  
  // Parse the YAML file into a JavaScript object
  const swaggerDocument = YAML.parse(file);
  
  // Serve the Swagger UI at the /api-doc endpoint
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("No OpenAPI configuration found. The configuration file is missing.");
}

/**
 * @description Connect to MongoDB on first request
 * 
 * When the /api/connectMongo POST request is made, this API will establish a connection to MongoDB.
 * 
 * @function POST /api/connectMongo
 * @body {Object} req.body - Request body is not required.
 */
app.post('/api/connectMongo', (req, res) => {
  mongodb(); // Connect to MongoDB when this request is made
  res.status(200).send('Conexión a MongoDB establecida.');
});

// Start the server and listen on the specified port
const server = app.listen(port, () => {
  console.log(`Game service listening at http://localhost:${port}`);
});

module.exports = server;
