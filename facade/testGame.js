// testGame.js
import GameSession from './GameSession.js';
import mongoose from 'mongoose';


(async () => {
  const userId = new mongoose.Types.ObjectId();  // Simula un ID de usuario
  const topics = ['history', 'science', 'sports'];
  const modality = 'classic';

  const gameSession = new GameSession(userId, topics, modality);

  await gameSession.startGame(); // Inicia la partida
  await gameSession.playQuestions(); // Juega las 3 preguntas
})();
