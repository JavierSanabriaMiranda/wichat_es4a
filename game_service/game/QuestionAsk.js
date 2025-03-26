const axios = require('axios');
const { Game } = require("../models/index");

// Valida que el request tenga los campos requeridos en el cuerpo
const validate = (req, requiredFields) => {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
            return false;
        }
    }
    return true;
};

// Obtiene la pregunta actual del usuario basado en su ID
const getCurrentQuestion = async (userId) => {
    let games = await Game.findAll({
        where: {
            user_id: userId
        }
    });

    // Si el usuario no tiene juegos activos, retorna null
    if (games == null || games.length < 1) {
        return null;
    }

    let game = games[0];  // Obtiene el primer juego encontrado

    let questions = await game.getQuestions();
    // Si no hay preguntas en el juego, retorna null
    if (questions == null || questions.length < 1) {
        return null;
    }

    return questions[0]; // Retorna la primera pregunta del juego
};

const requestQuestion = async (questionTime, numberOfQuestion, topics, lang) => {
    let url = "http://localhost:8004/api/questions/generate";
    console.log("Que me llega", topics);
    console.log("Que me llega", lang);
    try {
        const requestData = { lang, topics };

        // Realiza la solicitud POST a la API con los datos en el body
        const res = await axios.post(url, { lang, topics });  // Enviamos los parámetros en el body
        // Realiza la solicitud a la API externa
        const { question, correct, image, options } = res.data;

        // Validamos que la estructura de la respuesta es correcta
        if (!question || !correct || !image || !Array.isArray(options) || options.length < 1) {
            throw new Error("La pregunta no tiene el formato esperado.");
        }

        // Asegurar que la respuesta correcta esté dentro de las opciones
        let allOptions = [...options];
        if (!allOptions.includes(correct)) {
            allOptions.push(correct);
        }

        // Mezclar aleatoriamente las opciones
        allOptions.sort(() => Math.random() - 0.5);

        // Retornar la pregunta en el formato adecuado
        return {
            question: question,
            answer: correct,
            imageUrl: image,
            options: allOptions
        };

    } catch (error) {
        console.error("Error al obtener la pregunta desde el servicio externo, usando pregunta simulada.");
        console.error(error);

        // Pregunta de respaldo en caso de fallo
        return {
            question: '¿A qué país pertenece este contorno?',
            answer: 'Sri Lanka',
            imageUrl: 'http://commons.wikimedia.org/wiki/Special:FilePath/Topography%20Sri%20Lanka.jpg',
            options: ['Catar', 'México', 'Kenia', 'Sri Lanka']
        };
    }
};


module.exports = { validate, getCurrentQuestion, requestQuestion };
