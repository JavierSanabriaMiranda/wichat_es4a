// gameSessionService.js
import GameSession from './GameSession'; // Asegúrate de que la ruta es correcta.

class GameSessionService {
  constructor() {
    if (!GameSessionService.instance) {
      this.gameSession = null;
      GameSessionService.instance = this;
    }

    return GameSessionService.instance;
  }

  async startGame(userId, topics, modality) {
    if (!this.gameSession) {
      this.gameSession = new GameSession(userId, topics, modality);
      await this.gameSession.startGame();
      console.log('Game session started');
    }
    return this.gameSession;
  }

  async getNextQuestion() {
    if (this.gameSession) {
      const question = await this.gameSession.playQuestions();
      return question;
    }
    throw new Error('Game session not started yet.');
  }
}

const gameSessionService = new GameSessionService();
Object.freeze(gameSessionService);
export default gameSessionService;
