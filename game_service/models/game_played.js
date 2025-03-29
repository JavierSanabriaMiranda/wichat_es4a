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
      selectedAnswer: { type: String, required: true },
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
}, { timestamps: true });

// Crear modelo
const GamePlayed = model("GamePlayed", gamePlayedSchema);

module.exports = GamePlayed;