import mongoose from 'mongoose';
import GameSession from './gameSession.js';

async function testGameFlow() {
  try {
    // Conexión a la base de datos de MongoDB
    await mongoose.connect('mongodb://localhost:27017/tu_bd', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conexión a la base de datos establecida");

    // Datos de prueba (puedes personalizarlos)
    const userId = '646ff07e1f82797d3eaf62a4';  // ID de un usuario existente
    const topics = ['geography', 'history'];  // Temas de la partida
    const modality = 'single-player';  // Modalidad del juego

    // Crear una instancia de GameSession
    const gameSession = new GameSession(userId, topics, modality);

    // Iniciar el juego
    await gameSession.startGame();
    
    // Jugar las preguntas
    await gameSession.playQuestions();

    // La partida se finaliza automáticamente después de las 3 preguntas, 
    // pero si quieres llamarlo manualmente, puedes hacerlo así:
    // await gameSession.endGame();

  } catch (error) {
    console.error("Error durante el flujo de juego:", error);
  } finally {
    // Cerrar la conexión a la base de datos
    await mongoose.disconnect();
    console.log("Conexión a la base de datos cerrada");
  }
}

// Ejecutar la prueba
testGameFlow();
