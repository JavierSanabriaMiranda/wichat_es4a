import Question from '../db/Question.js';
import QuestionService from './QuestionGame.js';
import GamePlayed from '../db/game_played.js';
import GameRepository from '../repository/gameRepository.js';

/**
 * Represents a game session for a user.
 */
class GameSession {

  /**
   * The API endpoint URL.
   * @type {string}
   */
  apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  /**
   * Creates a new game session.
   * @param {string} userId - The ID of the user.
   * @param {Array<string>} topics - The topics for the game session.
   * @param {string} modality - The modality of the game.
   */
  constructor(userId, topics, modality) {
    /**
     * The user ID.
     * @type {string}
     */
    this.userId = userId;

    /**
     * The selected topics for the game.
     * @type {Array<string>}
     */
    this.topics = topics;

    /**
     * The game modality.
     * @type {string}
     */
    this.modality = modality;

    /**
     * The current game instance.
     * @type {Object|null}
     */
    this.game = null;

    /**
     * Service for handling game questions.
     * @type {QuestionService}
     */
    this.questionService = new QuestionService();

    /**
     * Number of questions played.
     * @type {number}
     */
    this.numQuestions = 0;
  }

  /**
   * Starts a new game session.
   * @returns {Promise<void>}
   */
  async startGame() {
    try {
      this.game = await GameRepository.startNewGame(this.userId, this.topics, this.modality);
      console.log("Game started:", this.game);
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  }

  /**
   * Plays a new question in the game session.
   * @returns {Promise<Object|void>} The question object or undefined if an error occurs.
   */
  async playQuestions() {
    try {
      const question = await this.questionService.requestQuestion("es");
      if (question.error) {
        console.error("Error fetching the question:", question.error);
        return;
      }
      console.log("Question:", question.pregunta);
      this.numQuestions++;

      return question;
    } catch (error) {
      console.error("Error playing questions:", error);
    }
  }

  /**
   * Adds a new question to the current game session.
   * @returns {Promise<void>}
   */
  async addQuestionToGame() {
    try {
      // Save the question in the database
      const newQuestion = await GameRepository.saveQuestionToDatabase(pregunta);

      // Associate the question with the current game session
      this.game = await GameRepository.addQuestionToGameSession(this.game._id, newQuestion._id);

      console.log("Question added to the game:", this.game);
    } catch (error) {
      console.error("Error adding the question to the game session:", error);
    }
  }

  /**
   * Ends the current game session.
   * @returns {Promise<void>}
   */
  async endGame() {
    try {
      const gameEnded = await GameRepository.endGame(this.userId);
      console.log("Game ended:", gameEnded);
    } catch (error) {
      console.error("Error ending the game:", error);
    }
  }
}

export default GameSession;
