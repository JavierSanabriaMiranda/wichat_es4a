import mongoose from "mongoose";
import connectDB from "./Connection.js";
import Question from "./Question.js";
import GamePlayed from "./game_played.js";

const initializeDB = async () => {
  await connectDB(); // Conectar a MongoDB

  try {
    // Verifica si hay preguntas en la colección
    const existingQuestions = await Question.find();
    let questionId = null;


      // Insertar una pregunta de prueba
      const question = await Question.create({
        question: "¿Cuál es la capital de Francia?",
        topics: [],
        answer: "París",
        options: ["Madrid", "Berlín", "París", "Londres"],
        imageUrl: "https://example.com/paris.jpg",
        correct: true
      });

      questionId = question._id;
    
        // Verifica si hay partidas activas en la colección
    const existingGames = await GamePlayed.find({ isActive: true });
    if (existingGames.length === 0) {
      console.log("📌 No hay partidas activas, creando una partida inicial...");

      await GamePlayed.create({
        user: new mongoose.Types.ObjectId(), // Sustituir con un usuario válido si es necesario
        modality: "Single Player",
        score: 0,
        topics: ["Geografía"],
        questionsPlayed: [questionId], // ✅ Ahora siempre tiene un valor
        isActive: true
      });
      
      console.log("✅ Partida inicial creada.");
    } else {
      console.log("📌 Ya existen partidas activas en la base de datos.");
    }

    // Cierra la conexión
    mongoose.connection.close();
    console.log("🔌 Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error inicializando la BD:", error);
    mongoose.connection.close();
  }
};

// Ejecuta la inicialización
initializeDB();
