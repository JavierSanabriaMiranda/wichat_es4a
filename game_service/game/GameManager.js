/**
 * Question and answer game management module.
 * 
 * This module handles the creation of new games, retrieving questions, 
 * validating answers, and storing a user's game history.
 * It uses in-memory cache to temporarily store game settings and 
 * connects to the database to store the game results and questions played.
 * 
 * Main functions:
 * - `newGame`: Creates a new game and stores the settings in cache.
 * - `next`: Retrieves the next question in the game without saving anything to the database.
 * - `endAndSaveGame`: Ends the game, saves the history and questions to the database.
 * - `getUserGames`: Retrieves all games associated with a user, including played questions.
 * - `getNumberOfQuestionsPlayed`: Retrieves the number of questions played in the current game.
 * - `getQuestion`: Retrieves the current question the user is on in the game.
 * - `getCurrentGame`: Retrieves the active game of a user.
 */

const { GamePlayed, Question } = require("../models/Index");
const { validate, getCurrentQuestion } = require("./QuestionAsk");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { requestQuestion } = require("./QuestionAsk");
const NodeCache = require("node-cache");
const gameCache = new NodeCache();

const privateKey = process.env.JWT_SECRET || "ChangeMePlease!!!!";

/**
 * Creates a new game for the user and stores the values in cache.
 * 
 * @param {Object} req - Request object containing game information.
 * @param {Object} res - Response object to send the response to the client.
 * @returns {void}  Sends an HTTP response based on the operation status.
 */
const newGame = async (req, res) => {
    try {
        let userId = req.body.userId || new mongoose.Types.ObjectId();
        const { questionTime, numberOfQuestion, topics, lang } = req.body;

        // Store values in cache
        gameCache.set(userId.toString(), { questionTime, numberOfQuestion, topics, lang });
        console.log(`Game data saved in cache for user ${userId}:`, { questionTime, numberOfQuestion, topics, lang });
        res.status(200).send();
    } catch (error) {
        console.error("Error creating a new game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves the next question in the current game without saving anything to the database.
 * 
 * @param {Object} req - Request object containing the user ID.
 * @param {Object} res - Response object to send the next question.
 * @returns {void}  Sends the current question of the game in JSON format.
 */
const next = async (req, res) => {
    console.log("Request body received:", req.body.userId);
    try {
        let userId = req.body.userId;
        console.log("Getting next question for user:", userId);

        // Get values from cache
        const cacheData = gameCache.get(userId.toString());
        if (!cacheData) return res.status(400).json({ error: "Game settings not found." });

        const { questionTime, numberOfQuestion, topics, lang } = cacheData;

        // Call requestQuestion without saving anything to the database
        const questionRaw = await requestQuestion(questionTime, numberOfQuestion, topics, lang);
        console.log("Question raw:", questionRaw);

        res.status(200).json({
            question: questionRaw.question,
            topics: questionRaw.topics,
            answer: questionRaw.answer,
            options: questionRaw.options,
            imageUrl: questionRaw.imageUrl || ""
        });
    } catch (error) {
        console.error("Error getting next question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Ends the game and saves the results to the database.
 * 
 * @param {Object} req - Request object containing the game history and user ID.
 * @param {Object} res - Response object to return a success or error status.
 * @returns {void}  Sends an HTTP response indicating success or failure of the operation.
 */
const endAndSaveGame = async (req, res) => {
    try {
        const { userId, gameHistory } = req.body;

        // Validate input data
        if (!userId || !gameHistory || !Array.isArray(gameHistory)) {
            return res.status(400).send("Missing required fields or invalid data format.");
        }

        for (const gameData of gameHistory) {
            const { points, correctAnswers, totalQuestions, date, questions } = gameData;

            // Convert the date to the proper format (YYYY-MM-DD) if needed
            const formattedDate = new Date(date).toISOString().split('T')[0]; // If necessary, format the date

            // Create a new game entry
            const newGame = new GamePlayed({
                user: userId,
                modality: 'prueba', // Modify the modality based on the game type
                score: points,
                topics: questions.map(q => q.topic), // Assuming each question has a topic
                isActive: false, // The game is over
            });

            // Save the game to the database
            const savedGame = await newGame.save();

            // Save all the questions related to this game
            const questionsToInsert = questions.map(q => ({
                text: q.text, // Question text
                imageUrl: q.imageUrl, // Image URL
                wasUserCorrect: q.wasUserCorrect, // User's answer
                selectedAnswer: q.selectedAnswer, // Selected answer by the user
                answers: q.answers.map(ans => ({
                    text: ans.text, // Option text
                    isCorrect: ans.isCorrect, // If it is the correct answer
                })),
            }));

            // Save all the questions to the database
            const savedQuestions = await Question.insertMany(questionsToInsert);

            // Update the played questions in the game
            savedGame.questionsPlayed = savedQuestions.map(question => question._id);
            await savedGame.save();
        }

        res.status(200).send("Game data saved successfully.");
    } catch (error) {
        console.error("Error saving game data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves all games associated with a user, including played questions.
 * 
 * @param {Object} req - Request object containing the user ID.
 * @param {Object} res - Response object to return the user's game history.
 * @returns {void}  Sends an array of games with associated questions in JSON format.
 */
const getUserGames = async (req, res) => {
    try {
        const userId = req.body.userId;  // Get the user ID from the request body
        console.log("Fetching games for user:", userId);

        // Find all games associated with this user
        const games = await GamePlayed.find({ user: userId })
            .populate('questionsPlayed')  // This fills the questions with full details
            .exec();

        if (!games || games.length === 0) {
            return res.status(404).json({ message: 'No games found for this user.' });
        }

        // Return games and associated questions in JSON format
        res.status(200).json(games);
    } catch (error) {
        console.error("Error fetching user games:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves the number of questions played in the current game.
 * 
 * @param {Object} req - Request object containing the user ID.
 * @param {Object} res - Response object to return the number of questions played.
 * @returns {void}  Sends the number of questions played in the current game.
 */
const getNumberOfQuestionsPlayed = async (req, res) => {
    try {
        // Get the current game
        const game = await getCurrentGame(req, res);
        if (!game) return res.status(400).send("No active game found.");

        return game.questionsPlayed.length;
    } catch (error) {
        console.error("Error getting number of questions played:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves the current question for the user, i.e., the question the user is currently on.
 * 
 * @param {Object} req - Request object containing the user ID.
 * @param {Object} res - Response object to return the current question.
 * @returns {void}  Sends the current question along with options and answer in JSON format.
 */
const getQuestion = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("Getting current question for user:", userId);

        // Get the active game first
        const currentGame = await getCurrentGame(req, res);
        if (!currentGame) {
            return res.status(400).send("No active game found for this user.");
        }

        // Get the ID of the last played question
        const lastQuestionId = currentGame.questionsPlayed[currentGame.questionsPlayed.length - 1];
        if (!lastQuestionId) {
            return res.status(400).send("No questions played yet.");
        }

        // Find the question with the corresponding ID
        const question = await Question.findOne({
            _id: lastQuestionId
        }).exec(); // Ensure it's a Mongoose document

        if (!question) {
            return res.status(400).send("No unanswered question found.");
        }

        return res.status(200).json({
            question: question.question,
            topics: question.topics,
            answer: question.answer,
            options: question.options,
            imageUrl: question.imageUrl || ""
        });
    } catch (error) {
        console.error("Error retrieving current question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves the current active game of the user.
 * 
 * @param {Object} req - Request object containing the user ID.
 * @param {Object} res - Response object to return the current game.
 * @returns {Object}  Sends the active game of the user.
 */
const getCurrentGame = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Find the game where isActive is true (active)
        const currentGame = await GamePlayed.findOne({ user: userId, isActive: true });

        if (!currentGame) {
            return res.status(400).send("No active game found for this user.");
        }

        return currentGame;
    } catch (error) {
        console.error("Error retrieving current game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    newGame,
    next,
    endAndSaveGame,
    getNumberOfQuestionsPlayed,
    getQuestion,
    getCurrentGame,
    getUserGames
};
