// Librería para trabajar con MongoDB
const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

// Esquema para Partida Jugada
const gamePlayedSchema = new Schema({
  // Referencia al usuario que jugó
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  // Modalidad de juego
  modality: {
    type: String,
    required: true
  },
  // Puntuación obtenida
  score: {
    type: Number,
    default: 0
  },
  // Topics jugados en la partida
  topics: [
    {
      type: String,
      required: true
    }
  ],
  // Array con las preguntas jugadas en esta partida
  questionsPlayed: [
    {
      type: ObjectId,
      ref: "Question"
    }
  ]
});

// Se crea el modelo a partir del esquema definido previamente
const GamePlayed = model("GamePlayed", gamePlayedSchema);

// Exporta el modelo de GamePlayed
module.exports = GamePlayed;
