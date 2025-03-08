import QuestionService from './QuestionService.js';  // El nombre de la clase de preguntas no cambia
import GamePlayed from '../db/game_played.js';
import { startNewGame, endGame } from './GameController.js';

class GameSessionController {
  constructor(userId, topics, modality) {
    this.userId = userId;
    this.topics = topics;
    this.modality = modality;
    this.game = null;
    this.questionService = new QuestionService();
    this.numQuestions = 0;
  }

  async startGame() {
    try {
      this.game = await startNewGame(this.userId, this.topics, this.modality);
      console.log("Partida iniciada:", this.game);
    } catch (error) {
      console.error("Error al iniciar la partida:", error);
    }
  }

  async playQuestions() {
    try {
      for (let i = 0; i < 3; i++) {
        const pregunta = await this.questionService.getNextQuestion();
        if (pregunta.error) {
          console.error("Error al obtener la pregunta:", pregunta.error);
          return;
        }

        console.log(`Pregunta ${i + 1}:`, pregunta.question.text);

        await this.addQuestionToGame(pregunta);
        this.numQuestions++;
      }
      await this.endGame();  // Finaliza la partida después de las preguntas
    } catch (error) {
      console.error("Error al jugar las preguntas:", error);
    }
  }

  async addQuestionToGame(pregunta) {
    try {
      const newQuestion = await this.questionService.saveQuestion(pregunta);
      const gameId = this.game._id;
      this.game = await GamePlayed.findByIdAndUpdate(
        gameId,
        { $push: { questionsPlayed: newQuestion._id } },
        { new: true }
      );

      console.log("Pregunta añadida a la partida:", this.game);
    } catch (error) {
      console.error("Error al agregar la pregunta a la partida:", error);
    }
  }

  async endGame() {
    try {
      const gameEnded = await endGame(this.userId);
      console.log("Partida finalizada:", gameEnded);
    } catch (error) {
      console.error("Error al finalizar la partida:", error);
    }
  }
}

export default GameSessionController;
