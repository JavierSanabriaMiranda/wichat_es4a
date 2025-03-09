/**
 * @module QuestionService
 * 
 * Handles the logic related to retrieving questions, answers, and verifying responses.
 * It uses predefined topics or fetches them from the database to generate questions.
 */

import { executeFullFlow } from '../question/wikidata.js';
import { getTopicsFromDatabase } from '../repository/gameRepository.js';
/**
 * Class that handles the logic for managing questions and answers.
 */
class QuestionService {
  
 /**
   * Creates an instance of the `QuestionService` class.
   * Initializes properties for the question, correct answer, wrong answers, image, and topics.
   */
  constructor() {
    /**
     * The question obtained from the database or generated.
     * @type {string}
     */
    this.question = "";
   

    /**
     * The correct answer for the question.
     * @type {string}
     */
    this.correctAnswer = "";

    /**
     * Incorrect answers associated with the question.
     * @type {Array<string>}
     */
    this.worngAnswer = [];

    /**
     * List of available topics for the questions.
     * @type {Array<string>}
     */
    this.img = "";

    /**
     * Lista de topics disponibles para las preguntas.
     * @type {Array<string>}
     */
    this.topics = [];
  }

   /**
   * Retrieves the topics from the database.
   * Calls `getTopicsFromDatabase` to fetch the available topics.
   * If an error occurs, it returns an error message.
   * 
   * @returns {Promise<Array|string>} Returns an array of topics or an error message if failed.
   */
  async getTopicsGame() {
    try {
      this.topics = await getTopicsFromDatabase(); // Obtiene los topics desde la BD
      console.log("Topics obtenidos de la BD:", this.topics);
      return this.topics;
    } catch (error) {
      console.error("Error al obtener los topics:", error);
      return { error: "No se pudieron obtener los topics." };
    }
  }

 /**
   * Manually assigns topics to the instance.
   * This method allows defining which topics to use for fetching questions.
   * 
   * @param {Array<string>} topics - List of topics to assign.
   */
  async saveTopics(topics) {
    this.topics = topics;
  }

  
 /**
   * Requests a question with shuffled answers.
   * Uses `executeFullFlow` to get the question data and shuffle the answers (correct and incorrect).
   * 
   * @param {string} lang - The language in which the question should be generated (e.g., "es" for Spanish).
   * @returns {Promise<Object>} Returns an object with the question, shuffled answers, and associated image.
   * @throws {Error} If the retrieved data is not in the expected format or if an error occurs during the request.
   */
  async requestQuestion(lang) {
    try {
     // getTopicsFromDatabase();
      if (this.topics.length == 0) {
        this.topics = ["geography", "history", "science", "sports"];
      }

      const result = await executeFullFlow(this.topics, lang); // Pide la pregunta con los topics

      console.log("Resultados finales recibidos:", result); // Debugging

      if (!result || typeof result !== "object" || !result.question || !result.correct || !Array.isArray(result.options)) {
        throw new Error("Los datos obtenidos no tienen el formato esperado.");
      }

      this.question = result.question;
      this.correctAnswer = result.correct;
      this.worngAnswer = result.options;
      this.img = result.image || null;

      const listaRespuestas = [
        {
          respuesta: result.correct,
          correcta: true
        },
        {
          respuesta: result.options[0],
          correcta: false
        },
        {
          respuesta: result.options[1],
          correcta: false
        },
        {
          respuesta: result.options[2],
          correcta: false
        }
      ]

      const respuestasMezcladas = listaRespuestas.sort(() => Math.random() - 0.5);

      return {
        pregunta: this.question,
        respuestas: respuestasMezcladas,
        imagen: this.img
      };

    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return { error: "No se pudo obtener la pregunta", detalles: error.message };
    }
  }

  /**
   * Verifies whether the user's provided answer is correct.
   * 
   * @param {string} userAnswer - The user's selected answer for the current question.
   * @returns {boolean} `true` if the answer is correct, `false` if it is incorrect.
   */
  isCorrect(userAnswer) {
    return userAnswer === this.correctAnswer;
  }
   /**
   * Additional method to retrieve the question and its details.
   * Calls `requestQuestion` and returns the values obtained from the question.
   * 
   * @param {string} lang - The language in which the question should be generated (e.g., "es" for Spanish).
   * @returns {Promise<Object>} Returns an object with the question, shuffled answers, and associated image.
   */
  async getAnswerDetails(lang) {
    const answerDetail = await this.requestQuestion(lang);
    return answerDetail;
  }

}
export default QuestionService; 
/**
 * Test the class
 */
(async () => {
  const questionService = new QuestionService();

  // Request a question
  const question = await questionService.requestQuestion("es");
  console.log("Retrieved question: ", question);

  // Check answers
  console.log("Correct answer verification: ", questionService.isCorrect("test")); // Expected: false
  console.log("Incorrect answer verification: ", questionService.isCorrect("wrongTestAnswer")); // Expected: false
})();