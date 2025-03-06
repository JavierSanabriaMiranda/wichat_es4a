import mongoose from "mongoose";
import connectDB from "./Connection.js";
import Question from "./Question.js";
import GamePlayed from "./game_played.js";

const initializeDB = async () => {
  await connectDB(); // Conectar a MongoDB

  try {
    // Verifica si hay preguntas en la colección
    const existingQuestions = await Question.find();
    if (existingQuestions.length === 0) {
      console.log("📌 No hay preguntas, insertando datos iniciales...");

      // Insertar una pregunta de prueba
      await Question.create({
        question: "¿Cuál es la capital de Francia?",
        topics: [], // Deberías enlazarlo con un Topic si tienes esa colección
        answer: "París",
        options: ["Madrid", "Berlín", "París", "Londres"],
        imageUrl: "https://example.com/paris.jpg",
        correct: true
      });

      console.log("✅ Pregunta de prueba insertada.");
    } else {
      console.log("📌 Las preguntas ya existen en la base de datos.");
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
