import axios from 'axios';

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const getNextQuestion = async () => {
        try {
            const response = await axios.get(apiEndpoint + '/api/questions');
            console.log("Respuesta obtenida: ", response.data);

            const fullStructure =    {
                question: {
                    text: response.data.pregunta,
                    image: response.data.imagen,
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