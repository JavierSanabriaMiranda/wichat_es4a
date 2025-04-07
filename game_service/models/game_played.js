const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;

const gamePlayedSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  numberOfQuestions: {
    type: Number,
    required: true
  },
  numberOfCorrectAnswers: {
    type: Number,
    required: true
  },
  gameMode: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  questions: [
    {
      text: { type: String, required: true },
      imageUrl: { type: String, default: "" },
      selectedAnswer: { type: String, required: false },
      answers: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, required: true }
        }
      ]
    }
  ],
  topics: [
    {
      type: String,
      required: false
    }
  ],
  gameDate: {
    type: String,
    default: () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    }
  }
  
});

// Crear modelo
const GamePlayed = model("GamePlayed", gamePlayedSchema);

module.exports = GamePlayed;