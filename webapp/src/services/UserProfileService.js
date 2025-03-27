import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const getUserHistory = async (userId) => {
    try {
        const response = await axios.get(`${apiEndpoint}/api/game/history`);
        return response.data;
    } catch (error) {
        console.error("Error en UserProfileService - getUserHistory:", error);
    }
}

export { getUserHistory };