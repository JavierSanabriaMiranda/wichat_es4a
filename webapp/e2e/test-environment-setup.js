const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoserver;
let userservice;
let authservice;
let llmservice;
let questionservice;
let gameservice;
let gatewayservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    process.env.DB_URL = mongoUri;
    process.env.GATEWAY_SERVICE = "http://localhost:8000"
    process.env.REACT_APP_API_ENDPOINT = "http://localhost:8000"
    process.env.AUTH_SERVICE_URL = "http://localhost:8002"
    process.env.USER_SERVICE_URL = "http://localhost:8001"
    process.env.LLM_SERVICE_URL = "http://localhost:8003"
    process.env.QUESTION_SERVICE_URL = "http://localhost:8004"
    process.env.GAME_SERVICE_URL = "http://localhost:8005"

    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    llmservice = await require("../../llmservice/llm-service");
    questionservice = await require("../../question/question-service");
    gameservice = await require("../../gameservice/game-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
}

startServer();
