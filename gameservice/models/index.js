
/**
 * @fileoverview This module exports the Mongoose models used in the application.
 * 
 * Models:
 * - GamePlayed: Represents a completed game session, including questions, answers, and metadata.
 * - Question: Represents a question entity, typically including text, options, correct answer, etc.
 */

const GamePlayed = require("./game_played");
const Question = require("./Question");

module.exports = { GamePlayed, Question };

