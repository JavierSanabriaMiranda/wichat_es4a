// src/controllers/gameController.js
import GamePlayed from '../db/game_played.js';

/**
 * Obtiene los topics de la base de datos.
 * Este método consulta los temas de las partidas jugadas para obtener una lista de temas utilizados.
 * 
 * @returns {Array|Object} Lista de topics o un objeto de error si la consulta falla.
 */
export async function getTopicsFromDatabase() {
    try {
      // Obtenemos los topics únicos de todas las partidas jugadas
      const result = await GamePlayed.aggregate([
        { $unwind: "$topics" },
        { $group: { _id: null, topics: { $addToSet: "$topics" } } }
      ]);
  
      // Si se encontraron topics, retornamos la lista
      if (result.length > 0) {
        return result[0].topics;
      }
      return []; // Si no hay topics, retornamos un array vacío
    } catch (error) {
      console.error("Error al obtener los topics de la base de datos:", error);
      return { error: "No se pudieron obtener los topics." };
    }
  }
/**
 * Inicia una nueva partida para un usuario, marcando la anterior como inactiva.
 * 
 * @param {ObjectId} userId - El ID del usuario que inicia la partida.
 * @param {Array} topics - Los topics que se utilizarán en la partida.
 * @param {string} modality - La modalidad del juego.
 * @returns {Object} Retorna el documento de la partida creada.
 */
export async function startNewGame(userId, topics, modality) {
  try {
   
    // Crear una nueva partida activa
    const newGame = new GamePlayed({
      user: userId,
      topics: topics,
      modality: modality,
      isActive: true
    });

    await newGame.save();

    console.log("Nueva partida iniciada:", newGame);
    return newGame;
  } catch (error) {
    console.error("Error al iniciar nueva partida:", error);
    throw new Error("No se pudo iniciar la nueva partida.");
  }
}

/**
 * Finaliza la partida activa del usuario.
 * 
 * @param {ObjectId} userId - El ID del usuario cuyo juego se desea finalizar.
 * @returns {Object} El documento de la partida finalizada.
 */
export async function endGame(userId) {
  try {
    const game = await GamePlayed.findOneAndUpdate(
      { user: userId, isActive: true },
      { $set: { isActive: false } },
      { new: true } // Retorna el documento actualizado
    );

    if (!game) {
      return { error: "No hay partida activa para finalizar." };
    }

    return game;
  } catch (error) {
    console.error("Error al finalizar la partida:", error);
    return { error: "Error al finalizar la partida." };
  }
}
