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


export { getNextQuestion };