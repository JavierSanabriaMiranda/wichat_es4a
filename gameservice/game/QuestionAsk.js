/**
 * Module that handles request validation, retrieval of the current user's question,
 * and requesting questions from an external service.
 * 
 * Main functions:
 * - `requestQuestion`: Makes a request to an external API to retrieve a new question.
 * 
 * @module QuestionManager
 */
const axios = require('axios');
const { Game } = require("../models/index");



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
const requestQuestion = async (topics, lang) => {
    let gatewayServiceUrl = process.env.GATEWAY_SERVICE || 'http://localhost:8000';

   
    try {
            // Make a POST request to the API with the data in the body
            const res = await axios.post(`${gatewayServiceUrl}/api/question/new`, {
            topics: topics,   
            lang: lang       
        });
        // Make the request to the external API

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


        // Return a fallback simulated question in case of failure
        return {
            question: 'Which country does this outline belong to?',
            answer: 'Sri Lanka',
            imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Topography%20Sri%20Lanka.jpg',
            options: ['Qatar', 'Mexico', 'Kenya', 'Sri Lanka']
        };
    }
};

module.exports = {requestQuestion };

