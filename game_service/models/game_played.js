// Import mongoose
const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;

/**
 * @typedef {Object} GamePlayed
 * @property {ObjectId} user - The ID of the user who played the game, referenced from the "User" collection.
 * @property {string} modality - The modality of the game (e.g., "test", "challenge").
 * @property {number} score - The score the user achieved in the game. Default is 0.
 * @property {Array<string>} topics - An array of topics related to the game.
 * @property {Array<ObjectId>} questionsPlayed - An array of ObjectIds referencing the "Question" collection, representing the questions played during the game.
 * @property {boolean} isActive - A boolean indicating whether the game is still active or not. Default is false.
 */

/**
 * Game Played Schema
 * 
 * This schema represents a game that a user has played, including their score, the topics related to the game,
 * and the questions played. The game is linked to the user through the `user` field and can reference multiple questions
 * from the `Question` collection. The schema also stores whether the game is still active (i.e., if the game has ended).
 * 
 * @example
 * const game = new GamePlayed({
 *   user: "60a7b9360b98d8b0f1dbe20b", // User ObjectId
 *   modality: "test",
 *   score: 10,
 *   topics: ["Geography", "Science"],
 *   questionsPlayed: ["60a7b92e0b98d8b0f1dbe20a"], // Question ObjectId
 *   isActive: false
 * });
 */
const gamePlayedSchema = new Schema({
  /**
   * The ID of the user who played the game.
   * This is a reference to the "User" collection.
   * 
   * @type {ObjectId}
   * @required
   */
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },

  /**
   * The modality of the game, such as "test" or "challenge".
   * 
   * @type {string}
   * @required
   */
  modality: {
    type: String,
    required: true
  },

  /**
   * The score achieved by the user in the game.
   * 
   * @type {number}
   * @default 0
   */
  score: {
    type: Number,
    default: 0
  },

  /**
   * The topics related to the game.
   * This is an array of strings that represent the topics covered in the game.
   * 
   * @type {Array<string>}
   * @required
   */
  topics: [
    {
      type: String,
      required: true
    }
  ],

  /**
   * An array of ObjectIds that reference the "Question" collection,
   * representing the questions that were played during the game.
   * 
   * @type {Array<ObjectId>}
   */
  questionsPlayed: [
    {
      type: ObjectId,
      ref: "Question"
    }
  ],

  /**
   * A boolean indicating whether the game is still active.
   * This field is set to false by default, indicating that the game is not active.
   * 
   * @type {boolean}
   * @default false
   */
  isActive: {
    type: Boolean,
    default: false
  }
});

// Create the model for the "GamePlayed" collection
/**
 * GamePlayed Model
 * 
 * This model is used to interact with the "GamePlayed" collection in the database.
 * It allows CRUD operations on the data structure defined by the schema.
 */
const GamePlayed = model("GamePlayed", gamePlayedSchema);

// Export the GamePlayed model
module.exports = GamePlayed;
