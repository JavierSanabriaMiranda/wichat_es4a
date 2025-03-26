// Importing the GamePlayed, Question, and User models
const GamePlayed = require("./Game_played");
const Question = require("./Question");
const User = require("./User");

/**
 * @module Models
 * 
 * This module imports and exports the Mongoose models for the `GamePlayed`, `Question`, and `User` collections.
 * These models are used to interact with the respective collections in the MongoDB database.
 * 
 * - `GamePlayed`: Represents a game that a user has played, including game details such as score, topics, and the questions played.
 * - `Question`: Represents a question that is part of the quiz game, including question text, options, and the correct answer.
 * - `User`: Represents a user who participates in games, with details such as username, email, and other user-related information.
 * 
 * @example
 * const { GamePlayed, Question, User } = require("./models");
 * 
 * // Example usage:
 * GamePlayed.findById(gameId).then(game => console.log(game));
 * Question.findById(questionId).then(question => console.log(question));
 * User.findById(userId).then(user => console.log(user));
 */
module.exports = { GamePlayed, Question, User };
