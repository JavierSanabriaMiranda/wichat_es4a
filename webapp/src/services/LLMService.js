import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

/**
 * Asks for a clue from the LLM service.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.name - The name of the user.
 * @param {string} params.userQuestion - The question asked by the user.
 * @param {string} params.language - The language of the question.
 * @returns {Promise<Object>} The response data from the LLM service.
 * @throws Will throw an error if the request fails.
 */
const askClue = async ({ name, userQuestion, language }) => {
    try {
        const response = await axios.post(`${apiEndpoint}/askllm/clue`, {
            name,
            userQuestion,
            language
        });
        return response;
    } catch (error) {
        console.error("Error en LLMService - askClue:", error);
        throw error;
    }
};

export { askClue };
