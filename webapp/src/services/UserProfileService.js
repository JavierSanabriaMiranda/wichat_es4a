import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const getUserHistory = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoint}/api/game/history/gameList`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en UserProfileService - getUserHistory:", error);
    }
}


const getQuestionsById = async (gameId) => {
    try {
        const response = await axios.get(`${apiEndpoint}/api/game/history/gameQuestions`, {
            headers: {
                "gameId": gameId
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en UserProfileService - getGameHistoryById:", error);
    }
}

export { getUserHistory, getQuestionsById };