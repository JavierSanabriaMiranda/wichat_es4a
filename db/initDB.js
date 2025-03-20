import mongoose from "mongoose";
import connectDB from "./Connection.js";
import Question from "./Question.js";
import GamePlayed from "./game_played.js";

const initializeDB = async () => {
  console.log("🚀 Iniciando la inicialización de la base de datos...");
  await connectDB(); // Conectar a MongoDB
  console.log("✅ Conexión a MongoDB establecida");

  try {
    console.log("🔍 Verificando si hay preguntas en la colección...");
    const existingQuestions = await Question.find();
    let questionId = null;

    if (existingQuestions.length === 0) {
      console.log("📌 No hay preguntas en la base de datos. Creando una nueva...");
      const question = await Question.create({
        question: "¿Cuál es la capital de Francia?",
        topics: [],
        answer: "París",
        options: ["Madrid", "Berlín", "París", "Londres"],
        imageUrl: "https://example.com/paris.jpg",
        correct: true
      });
      console.log("✅ Pregunta creada con ID:", question._id);
      questionId = question._id;
    } else {
      console.log("📌 Ya existen preguntas en la base de datos.");
      questionId = existingQuestions[0]._id;
    }

    console.log("🔍 Verificando si hay partidas activas...");
    const existingGames = await GamePlayed.find({ isActive: true });

    if (existingGames.length === 0) {
      console.log("📌 No hay partidas activas, creando una partida inicial...");

      await GamePlayed.create({
        user: new mongoose.Types.ObjectId(), // Sustituir con un usuario válido si es necesario
        modality: "Single Player",
        score: 0,
        topics: ["Geografía"],
        questionsPlayed: [questionId],
        isActive: true
      });
      console.log("✅ Partida inicial creada.");
    } else {
      console.log("📌 Ya existen partidas activas en la base de datos.");
    }

    console.log("🔌 Cerrando conexión con MongoDB...");
    mongoose.connection.close();
    console.log("✅ Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error inicializando la BD:", error);
    mongoose.connection.close();
  }
};

// Ejecuta la inicialización
initializeDB();