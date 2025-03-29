import axios from 'axios';

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    /**
     * Function to calll the API endpoint to get the next question
     * 
     * @returns {Promise<{question: {text: string, image: string, topic: string}, answers: {text: string, isCorrect: boolean}[]>}
     */
    const getNextQuestion = async () => {
        try {
            const response = await axios.get(apiEndpoint + '/api/questions');

            const fullStructure =    {
                question: {
                    text: response.data.pregunta,
                    imageUrl: response.data.imagen,
                    topic: ""
                },
                answers : [
                    {
                        text: response.data.respuestas[0].respuesta,
                        isCorrect: response.data.respuestas[0].correcta
                    },
                    {
                        text: response.data.respuestas[1].respuesta,
                        isCorrect: response.data.respuestas[1].correcta
                    },
                    {
                        text: response.data.respuestas[2].respuesta,
                        isCorrect: response.data.respuestas[2].correcta
                    },
                    {
                        text: response.data.respuestas[3].respuesta,
                        isCorrect: response.data.respuestas[3].correcta
                    }
                ]
            }

            return fullStructure;
        } catch (error) {
            console.error("Error al obtener la pregunta:", error);
        }
    };

    
    
    /**
    * @typedef {Object} Question
    * @property {String} text The question text
    * @property {String} [imageUrl] Image URL for the question
    * @property {String} selectedAnswer The answer selected by the user
    * @property {Object[]} answers Array of possible answers
    * @property {String} answers.text The answer text
    * @property {Boolean} answers.isCorrect Whether this answer is correct
    */

   /**
    * Sends the game data to the API endpoint to save it in the database.
    * 
    * @param {String} token Session token that stores the user ID.
    * @param {Question[]} gameQuestions Array of question objects.
    * @param {Number} numberOfQuestions The total number of questions in the game.
    * @param {Number} numberOfCorrectAnswers The number of correct answers.
    * @param {"normal" | "caos"} gameMode The game mode.
    * @param {Number} points The total points earned in the game.
    */
    const saveGame = async (token, gameQuestions, numberOfQuestions, numberOfCorrectAnswers, gameMode, points) => {
        try {
            const gameData = {
                "token": token,
                "questions": gameQuestions,
                "numberOfQuestions": numberOfQuestions,
                "numberOfCorrectAnswers": numberOfCorrectAnswers,
                "gameMode": gameMode,
                "points": points
            };

            await axios.post(apiEndpoint + '/api/game/endAndSaveGame', gameData);
        } catch (error) {
            console.error("Error al guardar el juego:", error);
        }
    }


export { getNextQuestion, saveGame };