import GamePlayed from '../db/game_played.js';

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
  
export async function startNewGame(userId, topics, modality) {
  try {
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

export async function endGame(userId) {
  try {
    const game = await GamePlayed.findOneAndUpdate(
      { user: userId, isActive: true },
      { $set: { isActive: false } },
      { new: true }
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
