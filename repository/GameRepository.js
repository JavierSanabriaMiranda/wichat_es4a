import GamePlayed from '../db/game_played.js';

/**
 * Retrieves topics from the database.
 * This method queries the topics of played games to generate a list of used topics.
 * 
 * @returns {Promise<Array|string>} A list of topics or an error object if the query fails.
 */
export async function getTopicsFromDatabase() {
    try {
        // Retrieve unique topics from all played games
        const result = await GamePlayed.aggregate([
            { $unwind: "$topics" },
            { $group: { _id: null, topics: { $addToSet: "$topics" } } }
        ]);

        // Return the list of topics if found
        return result.length > 0 ? result[0].topics : [];
    } catch (error) {
        console.error("Error retrieving topics from the database:", error);
        return { error: "Failed to retrieve topics." };
    }
}

/**
 * Associates a question with an ongoing game session.
 * 
 * @param {string} gameId - The ID of the game session.
 * @param {string} questionId - The ID of the question to add.
 * @returns {Promise<Object>} The updated game document.
 * @throws {Error} If the question cannot be added.
 */
export async function addQuestionToGameSession(gameId, questionId) {
    try {
        return await GamePlayed.findByIdAndUpdate(
            gameId,
            { $push: { questionsPlayed: questionId } },
            { new: true }
        );
    } catch (error) {
        console.error("Error associating question with the game session:", error);
        throw new Error("Failed to associate the question with the game session.");
    }
}

/**
 * Saves a new question to the database.
 * 
 * @param {Object} questionData - The question object containing its details.
 * @param {string} questionData.pregunta - The question text.
 * @param {Array<Object>} questionData.respuestas - The list of possible answers.
 * @param {string} questionData.imagen - (Optional) The URL of the image associated with the question.
 * @param {string} questionData.respuestaCorrecta - The correct answer.
 * @returns {Promise<Object>} The newly created question document.
 * @throws {Error} If the question cannot be saved.
 */
export async function saveQuestionToDatabase(questionData) {
    try {
        return await Question.create({
            question: questionData.pregunta,
            answer: questionData.respuestas[0], 
            options: questionData.respuestas,       
            imageUrl: questionData.imagen || "",    
            correct: questionData.respuestaCorrecta 
        });
    } catch (error) {
        console.error("Error saving the question to the database:", error);
        throw new Error("Failed to save the question.");
    }
}

/**
 * Starts a new game session for a user, marking any previous session as inactive.
 * 
 * @param {string} userId - The ID of the user starting the game.
 * @param {Array<string>} topics - The topics to be used in the game.
 * @param {string} modality - The game mode.
 * @returns {Promise<Object>} The created game document.
 * @throws {Error} If the game session cannot be started.
 */
export async function startNewGame(userId, topics, modality) {
    try {
        const newGame = new GamePlayed({
            user: userId,
            topics: topics,
            modality: modality,
            isActive: true
        });

        await newGame.save();

        console.log("New game session started:", newGame);
        return newGame;
    } catch (error) {
        console.error("Error starting a new game session:", error);
        throw new Error("Failed to start a new game session.");
    }
}

/**
 * Ends the active game session for a user.
 * 
 * @param {string} userId - The ID of the user whose game session should be ended.
 * @returns {Promise<Object|string>} The updated game document or an error message.
 */
export async function endGame(userId) {
    try {
        const game = await GamePlayed.findOneAndUpdate(
            { user: userId, isActive: true },
            { $set: { isActive: false } },
            { new: true } // Returns the updated document
        );

        return game || { error: "No active game session to end." };
    } catch (error) {
        console.error("Error ending the game session:", error);
        return { error: "Error ending the game session." };
    }
}

// Game Repository Object
const GameRepository = {
    saveQuestionToDatabase,
    addQuestionToGameSession,
};

export default GameRepository;
