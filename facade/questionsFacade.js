import { executeFullFlow } from '../question/wikidata.js';
//import { getTopicsFromDatabase } from '../database/partidaRepository.js'; // Suponiendo que esta función obtiene los topics

class QuestionService {
  constructor() {
    this.pregunta = "";
    this.respuestaCorrecta = "";
    this.respuestasFalsas = [];
    this.imagen = "";
    this.topics = [];
  }
/*
  // Método para obtener los temas desde la base de datos
  async obtenerTopics() {
    try {
      this.topics = await getTopicsFromDatabase(); // Obtiene los topics desde la BD
      console.log("Topics obtenidos de la BD:", ["history", "geography", "science", "sports"]);
      return this.topics;
    } catch (error) {
      console.error("Error al obtener los topics:", error);
      return { error: "No se pudieron obtener los topics." };
    }
  }*/

  // Método para pedir una pregunta con las respuestas mezcladas
  async pedirPregunta() {
    try {
      // Asegurar que hay topics disponibles antes de pedir una pregunta
     /* if (this.topics.length === 0) {
        await this.obtenerTopics();
      }*/

      const resultado = await executeFullFlow(["history", "geography", "science", "sports"]); // Pide la pregunta con los topics

      console.log("Resultados finales recibidos:", resultado); // Debugging

      if (!resultado || typeof resultado !== "object" || !resultado.question || !resultado.correct || !Array.isArray(resultado.options)) {
        throw new Error("Los datos obtenidos no tienen el formato esperado.");
      }

      // Guardamos los datos en la instancia
      this.pregunta = resultado.question;
      this.respuestaCorrecta = resultado.correct;
      this.respuestasFalsas = resultado.options;
      this.imagen = resultado.image || null;

      // Mezclamos las respuestas (correcta + falsas)
      const respuestasMezcladas = [resultado.correct, ...resultado.options].sort(() => Math.random() - 0.5);

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

  // Método para verificar si una respuesta es correcta
  esCorrecta(respuestaUsuario) {
    return respuestaUsuario === this.respuestaCorrecta;
  }
}

// 🔹 Prueba la clase
(async () => {
  const questionService = new QuestionService();

  const pregunta = await questionService.pedirPregunta();
  console.log("Pregunta obtenida:", pregunta);

  console.log("Verificación de respuesta:", questionService.esCorrecta("TSG 1899 Hoffenheim")); 
})();
