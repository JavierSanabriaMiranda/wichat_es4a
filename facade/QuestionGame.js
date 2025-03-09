/**
 * Importa las funciones necesarias para obtener datos y temas desde las bases de datos.
 * @module QuestionService
 */
import { executeFullFlow } from '../question/wikidata.js';
import { getTopicsFromDatabase } from './gameController.js'; 

/**
 * Clase que maneja la lógica relacionada con la obtención de preguntas, respuestas y verificación de respuestas.
 * Utiliza una serie de temas predefinidos o extraídos de la base de datos para generar preguntas.
 */
class QuestionService {
  
  /**
   * Crea una instancia de la clase QuestionService.
   * Inicializa las propiedades de la pregunta, respuesta correcta, respuestas falsas, imagen y topics.
   */
  constructor() {
    /**
     * Contiene la pregunta obtenida.
     * @type {string}
     */
    this.pregunta = "";

    /**
     * Respuesta correcta de la pregunta.
     * @type {string}
     */
    this.respuestaCorrecta = "";

    /**
     * Respuestas falsas asociadas a la pregunta.
     * @type {Array<string>}
     */
    this.respuestasFalsas = [];

    /**
     * Imagen asociada a la pregunta (si existe).
     * @type {string|null}
     */
    this.imagen = "";

    /**
     * Lista de topics disponibles para las preguntas.
     * @type {Array<string>}
     */
    this.topics = [];
  }

  /**
   * Obtiene los temas desde la base de datos.
   * Este método llama a la función `getTopicsFromDatabase` para obtener los temas disponibles.
   * Si hay un error durante la obtención de los temas, devuelve un mensaje de error.
   * 
   * @returns {Array|string} Retorna un array de topics o un mensaje de error en caso de fallo.
   */
  async obtenerTopics() {
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
   * Asigna un conjunto de topics a la instancia de la clase.
   * Este método permite asignar manualmente los topics que se usarán para la obtención de preguntas.
   * 
   * @param {Array<string>} topics - Lista de topics que se asignarán a la instancia.
   */
  async obtenerTopic(topics) {
    this.topics = topics;
  }

  /**
   * Solicita una pregunta con las respuestas mezcladas. Utiliza la función `executeFullFlow`
   * para obtener los datos de la pregunta, y mezcla las respuestas (correcta + incorrectas).
   * 
   * @param {string} lang - El idioma en el que se debe generar la pregunta (por ejemplo, "es" para español).
   * @returns {Object} Retorna un objeto con la pregunta, las respuestas mezcladas y la imagen asociada.
   * @throws {Error} Si los datos obtenidos no tienen el formato esperado o si ocurre un error durante la solicitud.
   */
  async pedirPregunta(lang) {
    try {
      // Si no se han definido topics, asignamos valores predeterminados.
      if (this.topics.length == 0) {
        this.topics = ["geography", "history", "science", "sports"];
      }

      const resultado = await executeFullFlow(this.topics, lang); // Pide la pregunta con los topics

      console.log("Resultados finales recibidos:", resultado); // Debugging

      // Validar el formato de los resultados obtenidos
      if (!resultado || typeof resultado !== "object" || !resultado.question || !resultado.correct || !Array.isArray(resultado.options)) {
        throw new Error("Los datos obtenidos no tienen el formato esperado.");
      }

      // Guardamos los datos de la pregunta
      this.pregunta = resultado.question;
      this.respuestaCorrecta = resultado.correct;
      this.respuestasFalsas = resultado.options;
      this.imagen = resultado.image || null;

      const listaRespuestas = [
        {
          respuesta: resultado.correct,
          correcta: true
        },
        {
          respuesta: resultado.options[0],
          correcta: false
        },
        {
          respuesta: resultado.options[1],
          correcta: false
        },
        {
          respuesta: resultado.options[2],
          correcta: false
        }
      ]

      // Mezclamos las respuestas (correcta + falsas)
      const respuestasMezcladas = listaRespuestas.sort(() => Math.random() - 0.5);

      return {
        pregunta: this.pregunta,
        respuestas: respuestasMezcladas,
        imagen: this.imagen
      };

    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return { error: "No se pudo obtener la pregunta", detalles: error.message };
    }
  }

  /**
   * Verifica si la respuesta proporcionada por el usuario es correcta.
   * 
   * @param {string} respuestaUsuario - La respuesta del usuario para la pregunta actual.
   * @returns {boolean} `true` si la respuesta es correcta, `false` si es incorrecta.
   */
  esCorrecta(respuestaUsuario) {
    return respuestaUsuario === this.respuestaCorrecta;
  }
  /**
   * Método adicional para obtener la pregunta y sus detalles.
   * Llama a `pedirPregunta` y devuelve los valores obtenidos de la pregunta.
   * 
   * @param {string} lang - El idioma en el que se debe generar la pregunta (por ejemplo, "es" para español).
   * @returns {Object} Retorna un objeto con la pregunta, las respuestas mezcladas y la imagen asociada.
   */
  async obtenerPreguntaConDetalles(lang) {
    const preguntaDetalles = await this.pedirPregunta(lang);
    return preguntaDetalles;
  }

}
export default QuestionService; 
// 🔹 Prueba la clase
(async () => {
  const questionService = new QuestionService();

  // Solicitar una pregunta
  const pregunta = await questionService.pedirPregunta("es");
  console.log("Pregunta obtenida: ", pregunta);

  // Verificar respuestas
  console.log("Verificación de respuesta correcta: ", questionService.esCorrecta("prueba")); // Debería ser false
  console.log("Verificación de respuesta incorrecta: ", questionService.esCorrecta("pruebaMalRespuesta")); // Debería ser false
})();
