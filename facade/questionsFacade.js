import { obtenerPreguntaYRespuesta } from '../questions/wikidata.js'; // Ajusta la ruta correcta

class PreguntaHandler {
  constructor() {
    this.pregunta = "";
    this.respuestaC = "";  // Respuesta correcta
    this.respuestasFalsas = []; // Respuestas falsas
  }

  // Método asíncrono para obtener una pregunta desde obtenerPreguntaYRespuesta()
  async dameLaPregunta() {
    try {
      // Obtenemos la pregunta, la respuesta correcta y las falsas
      const { pregunta, respuesta, respuestasFalsas } = await obtenerPreguntaYRespuesta();

      // Mezclamos las respuestas (correcta + falsas)
      const respuestasMezcladas = [respuesta, ...respuestasFalsas].sort(() => Math.random() - 0.5);

      // Retornamos el JSON con la pregunta y respuestas
      return {
        pregunta: pregunta,
        respuestas: respuestasMezcladas
      };
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return { error: "No se pudo obtener la pregunta" };
    }
  }


  // Método para devolver la pregunta y respuestas
  async envioPregunta() {
    return await this.dameLaPregunta();
  }

  // Método para verificar si la respuesta del usuario es correcta
  esCorrecta(respUsuario) {
    return respUsuario === this.respuestaC;
  }

  // Método auxiliar para mezclar las respuestas en orden aleatorio
  mezclarRespuestas(respuestas) {
    return respuestas.sort(() => Math.random() - 0.5);
  }
}

// Ejemplo de uso con async/await
async function main() {
  try {
    const preguntaHandler = new PreguntaHandler();

    // Obtener la pregunta y respuestas de manera asíncrona
    const { pregunta, respuestas } = await preguntaHandler.envioPregunta();

    console.log("Pregunta:", pregunta);
    console.log("Respuestas posibles:", respuestas);

    // Simulación de respuesta del usuario
    const respuestaUsuario = respuestas[0]; // Ejemplo: usuario elige la primera opción

    // Verificar si la respuesta es correcta
    const esCorrecta = preguntaHandler.esCorrecta(respuestaUsuario);
    console.log("¿Es correcta la respuesta?", esCorrecta ? "Sí" : "No");
  } catch (error) {
    console.error("Error ejecutando el script:", error);
  }
}

main().catch(console.error);
