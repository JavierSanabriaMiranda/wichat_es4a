/**
 * Module that handles request validation, retrieval of the current user's question,
 * and requesting questions from an external service.
 * 
 * Main functions:
 * - `validate`: Validates that the required fields are present in the request body.
 * - `getCurrentQuestion`: Retrieves the current question for a user based on their ID.
 * - `requestQuestion`: Makes a request to an external API to retrieve a new question.
 * 
 * @module QuestionManager
 */
const axios = require('axios');
const { Game } = require("../models/Index");

/**
 * Validates that the request body contains the required fields.
 * 
 * @param {Object} req - The request object containing the request body.
 * @param {Array} requiredFields - List of fields expected in the request body.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const validate = (req, requiredFields) => {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
            return false;
        }
    }
    return true;
};

/**
 * Retrieves the current question for a user based on their ID.
 * 
 * @param {string} userId - The user's ID for retrieving their current question.
 * @returns {Object|null} - Returns the first question from the active game, or `null` if no question is found.
 */
const getCurrentQuestion = async (userId) => {
    // Fetch the user's games from the database
    let games = await Game.findAll({
        where: {
            user_id: userId
        }
    });

    // If no active games are found, return null
    if (games == null || games.length < 1) {
        return null;
    }

    let game = games[0];  // Get the first active game found

    // Fetch the questions associated with the game
    let questions = await game.getQuestions();
    // If no questions are associated with the game, return null
    if (questions == null || questions.length < 1) {
        return null;
    }

    // Return the first question of the game
    return questions[0];
};

/**
 * Makes a request to an external API to retrieve a new question.
 * 
 * @param {number} questionTime - The time limit to answer the question.
 * @param {number} numberOfQuestion - The number of the question in the game.
 * @param {Array} topics - List of topics for the question.
 * @param {string} lang - The language in which the question should be returned.
 * @returns {Object} - Returns an object with the question, correct answer, image, and options.
 * @throws {Error} - Throws an error if the external API response is not in the expected format.
 */
const requestQuestion = async (questionTime, numberOfQuestion, topics, lang) => {
    let url = "http://localhost:8009/api/questions/generate";
    console.log("What is received", topics);
    console.log("What is received", lang);
    try {
        const requestData = { lang, topics };

        // Make a POST request to the external API with the topics and language in the body
        const res = await axios.post(url, { lang, topics });

        // Extract data from the API response
        const { question, correct, image, options } = res.data;

        // Validate that the response has the expected structure
        if (!question || !correct || !image || !Array.isArray(options) || options.length < 1) {
            throw new Error("The question does not have the expected format.");
        }

        // Ensure that the correct answer is included in the options
        let allOptions = [...options];
        if (!allOptions.includes(correct)) {
            allOptions.push(correct);
        }

        // Shuffle the options randomly
        allOptions.sort(() => Math.random() - 0.5);

        // Return the question in the correct format
        return {
            question: question,
            answer: correct,
            imageUrl: image,
            options: allOptions
        };

    } catch (error) {
        console.error("Error getting the question from the external service, using simulated question.");
        console.error(error);

        // Return a fallback simulated question in case of failure
        return {
            question: 'Which country does this outline belong to?',
            answer: 'Sri Lanka',
            imageUrl: 'http://commons.wikimedia.org/wiki/Special:FilePath/Topography%20Sri%20Lanka.jpg',
            options: ['Qatar', 'Mexico', 'Kenya', 'Sri Lanka']
        };
    }
};

module.exports = { validate, getCurrentQuestion, requestQuestion };
