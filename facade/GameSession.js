// src/controllers/gameSession.js
import Question from '../db/Question.js';
import { startNewGame, endGame } from './gameController.js';
import QuestionService from './QuestionGame.js';
import GamePlayed from '../db/game_played.js';

class GameSession {

  apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

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
        const pregunta = await this.questionService.pedirPregunta("es");
        if (pregunta.error) {
          console.error("Error al obtener la pregunta:", pregunta.error);
          return;
        }
        console.log(`Pregunta ${i + 1}:`, pregunta.pregunta);
        this.numQuestions++;

        return pregunta;
      }
      await this.endGame();
    } catch (error) {
      console.error("Error al jugar las preguntas:", error);
    }
  }

  async addQuestionToGame(pregunta) {
    try {
      pregunta = await this.questionService.obtenerPreguntaConDetalles("es");
      // Crear la pregunta en la base de datos
      const newQuestion = await Question.create({
        question: pregunta.pregunta,        // Pregunta obtenida
        answer:  pregunta.respuestas[0], // Respuesta correcta
        options: pregunta.respuestas,       // Respuestas mezcladas
        imageUrl: pregunta.imagen || "",    // Imagen asociada (si existe)
        correct: pregunta.respuestaCorrecta // Indicador de la respuesta correcta
      });
  
      // Asociar la pregunta recién creada con la partida actual
      const gameId = this.game._id;
      this.game = await GamePlayed.findByIdAndUpdate(
        gameId,
        { $push: { questionsPlayed: newQuestion._id } },  // Añadir el ID de la pregunta a la partida
        { new: true } // Obtener la partida actualizada
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

export default GameSession;
