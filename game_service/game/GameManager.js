const { GamePlayed, Question, User } = require("../models/Index");
const { validate, getCurrentQuestion } = require("./QuestionAsk");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { requestQuestion } = require("./QuestionAsk");
const NodeCache = require("node-cache");
const gameCache = new NodeCache();

const privateKey = process.env.JWT_SECRET || "ChangeMePlease!!!!";

/**
 * Crea un nuevo juego para el usuario y guarda valores en caché.
 */
const newGame = async (req, res) => {
    try {
        let userId = req.body.userId || new mongoose.Types.ObjectId();
        const { questionTime, numberOfQuestion, topics, lang } = req.body;        

        // Guardar valores en caché
        gameCache.set(userId.toString(), { questionTime, numberOfQuestion, topics, lang });
        console.log(`Game data saved in cache for user ${userId}:`, { questionTime, numberOfQuestion, topics, lang });
        res.status(200).send();
    } catch (error) {
        console.error("Error creating a new game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene la siguiente pregunta en el juego actual sin guardar nada en la base de datos.
 */
const next = async (req, res) => {
    console.log("Request body recibido:", req.body.userId);
    try {
        let userId = req.body.userId;
        console.log("Getting next question for user:", userId);

        // Obtener valores desde caché
        const cacheData = gameCache.get(userId.toString());
        if (!cacheData) return res.status(400).json({ error: "Game settings not found." });

        const { questionTime, numberOfQuestion, topics, lang } = cacheData;

        // Llamada a requestQuestion sin guardar nada en la base de datos
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


const endAndSaveGame = async (req, res) => {
    try {
        const { userId, gameHistory } = req.body;

        // Validación de los datos de entrada
        if (!userId || !gameHistory || !Array.isArray(gameHistory)) {
            return res.status(400).send("Missing required fields or invalid data format.");
        }

        for (const gameData of gameHistory) {
            const { points, correctAnswers, totalQuestions, date, questions } = gameData;

            // Convertir la fecha al formato adecuado (YYYY-MM-DD) si es necesario
            const formattedDate = new Date(date).toISOString().split('T')[0]; // Si es necesario formatear la fecha

            // Crear una nueva entrada del juego
            const newGame = new GamePlayed({
                user: userId,
                modality: 'prueba', // Puedes modificar la modalidad según el tipo de juego
                score: points,
                topics: questions.map(q => q.topic), // Suponiendo que cada pregunta tiene un tema
                isActive: false, // El juego ya terminó
            });

            // Guardar el juego en la base de datos
            const savedGame = await newGame.save();

            // Guardar todas las preguntas relacionadas con este juego
            const questionsToInsert = questions.map(q => ({
                text: q.text, // Pregunta
                imageUrl: q.imageUrl, // URL de la imagen
                wasUserCorrect: q.wasUserCorrect, // Respuesta del usuario
                selectedAnswer: q.selectedAnswer, // Respuesta seleccionada por el usuario
                answers: q.answers.map(ans => ({
                    text: ans.text, // Texto de la opción
                    isCorrect: ans.isCorrect, // Si es la respuesta correcta
                })),
            }));

            // Guardar todas las preguntas en la base de datos
            const savedQuestions = await Question.insertMany(questionsToInsert);

            // Actualizar las preguntas jugadas en el juego
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
 * Obtiene el número de preguntas jugadas en el juego actual.
 */
const getNumberOfQuestionsPlayed = async (req, res) => {
    try {
        // Obtiene el juego actual
        const game = await getCurrentGame(req, res);
        if (!game) return res.status(400).send("No active game found.");

    
        return game.questionsPlayed.length;
    } catch (error) {
        console.error("Error getting number of questions played:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


/**
 * Obtiene la pregunta actual del usuario, es decir la pregunta en la que está el usuario.
 */
const getQuestion = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("Getting current question for user:", userId);

        // Obtener el juego activo primero
        const currentGame = await getCurrentGame(req, res);
        if (!currentGame) {
            return res.status(400).send("No active game found for this user.");
        }

        // Obtener el ID de la última pregunta jugada
        const lastQuestionId = currentGame.questionsPlayed[currentGame.questionsPlayed.length - 1];
        if (!lastQuestionId) {
            return res.status(400).send("No questions played yet.");
        }

        // Buscar la pregunta con el ID correspondiente
        const question = await Question.findOne({ 
            _id: lastQuestionId
        }).exec(); // Asegúrate de que es un documento de Mongoose

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
 * Obtiene el juego actual del usuario.
 */
const getCurrentGame = async (req, res) => {
    try {
        const userId = req.body.userId;
        
        // Buscar el juego donde isActive es true (activo)
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
    getCurrentGame
   
};
