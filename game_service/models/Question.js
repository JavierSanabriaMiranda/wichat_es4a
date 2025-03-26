// Importing the GamePlayed, Question, and User models
const GamePlayed = require("./Game_played");
const Question = require("./Question");
const User = require("./User");

/**
 * @module Models
 * 
 * This module imports and exports three Mongoose models that interact with collections in a MongoDB database:
 * 
 * - **GamePlayed**: A model representing a game played by a user. It includes information such as score, topics, 
 *   and the questions answered during the game.
 * - **Question**: A model representing a question used in the quiz game. It contains details like the question text, 
 *   the options, and the correct answer.
 * - **User**: A model representing a user of the game platform. It contains user-specific information like username, 
 *   email, and other credentials.
 * 
 * These models are used for CRUD (Create, Read, Update, Delete) operations on their respective collections.
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
