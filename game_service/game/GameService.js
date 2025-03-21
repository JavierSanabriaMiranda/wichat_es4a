const jwt = require('jsonwebtoken');
const { GamePlayed, Question, User } = require("../models");
const { validate, getCurrentQuestion } = require("./QuestionAsk");
const { loadQuestion } = require("./questionService");

const privateKey = process.env.JWT_SECRET || "ChangeMePlease!!!!";

/**
 * Crea un nuevo juego para el usuario.
 */
const newGame = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;
        const tags = req.body.tags ?? "";
        
        let settings = await User.findOne({ where: { user_id: userId } });
        if (!settings) {
            settings = await User.create({ user_id: userId });
        }

        await GamePlayed.create({
            user_id: userId,
            tags: tags,
            numberOfQuestions: settings.numberOfQuestions,
            gameMode: req.body.gameMode
        });

        res.status(200).send();
    } catch (error) {
        console.error("Error creating a new game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene la siguiente pregunta en el juego actual.
 */
const next = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;
        const game = await getCurrentGame(req, res);

        if (!game) return;

        let settings = await User.findOne({ where: { user_id: userId } });
        if (!settings) {
            settings = await User.create({ user_id: userId });
        }

        const questionRaw = await loadQuestion(game.tags.split(",").filter(s => s.length > 0), req.body.lang);

        // Asegurarse de que la respuesta esté en el formato correcto
        const question = await Question.create({
            title: questionRaw.question, // 'question' -> 'title'
            imageUrl: questionRaw.image || "",  // 'image' -> 'imageUrl'
            answer: questionRaw.correct,  // 'correct' -> 'answer'
            fake: questionRaw.options.filter(opt => opt !== questionRaw.correct),  // 'options' -> 'fake' (fake answers)
            duration: settings.durationQuestion,
            gameId: game.id,
            lang: req.body.lang
        });

        res.status(200).json({
            title: question.title,
            lang: question.lang,
            imageUrl: question.imageUrl,
            answers: [question.answer, ...question.fake]
        });
    } catch (error) {
        console.error("Error getting next question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


/**
 * Registra la respuesta de un usuario en una pregunta.
 */
const answer = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;

        if (!validate(req, ['answer'])) {
            return res.status(400).send();
        }

        const answer = req.body.answer;
        const question = await getCurrentQuestion(userId);

        if (!question || question.user_answer !== null) {
            return res.status(400).send();
        }

        question.user_answer = answer;
        question.onTime = ((new Date().getTime() - question.createdAt.getTime()) < (question.duration * 1000));
        await question.save();

        res.status(200).send(question.answer);
    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene el estado de la pregunta actual.
 */
const update = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;
        const question = await getCurrentQuestion(userId);

        if (!question || question.user_answer !== null) {
            return res.status(400).send();
        }

        res.status(200).json({
            title: question.title,
            imageUrl: question.imageUrl || "",
            answers: [question.answer, ...question.fake],
            created: String(question.createdAt.getTime()),
            duration: String(question.duration),
            numberOfQuestions: (await question.getGame()).numberOfQuestions,
            questionNumber: (await (await question.getGame()).getQuestions()).length
        });
    } catch (error) {
        console.error("Error updating game session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene el historial de juegos del usuario.
 */
const getHistory = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;

        const games = await GamePlayed.findAll({
            where: { user_id: userId },
            include: [{ model: Question, as: 'Questions' }]
        });

        res.status(200).json(games.map(game => game.toJSON()));
    } catch (error) {
        console.error("Error retrieving game history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene el historial de juegos de un usuario específico.
 */
const getHistoryByUser = async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID not valid' });
        }

        const games = await GamePlayed.findAll({
            where: { user_id: userId },
            include: [{ model: Question, as: 'Questions' }]
        });

        res.status(200).json(games.map(game => game.toJSON()));
    } catch (error) {
        console.error("Error retrieving game history by user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene el número de preguntas respondidas en el juego actual.
 */
const getNumberOfQuestions = async (req, res) => {
    try {
        const game = await getCurrentGame(req, res);
        const questionsAsked = await game.getQuestions();
        res.status(200).json({ numberOfQuestions: questionsAsked.length });
    } catch (error) {
        console.error("Error getting number of questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtiene la pregunta actual del usuario.
 */
const getQuestion = async (req, res) => {
    try {
        const userId = jwt.verify(req.body.token, privateKey).user_id;
        const question = await getCurrentQuestion(userId);
        res.status(200).json({ question }).send();
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
        const userId = jwt.verify(req.body.token, privateKey).user_id;

        const games = await GamePlayed.findAll({ where: { user_id: userId } });

        if (!games || games.length < 1) {
            res.status(400).send();
            return null;
        }

        return games[0];
    } catch (error) {
        console.error("Error retrieving current game:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    newGame,
    next,
    answer,
    update,
    getHistory,
    getHistoryByUser,
    getNumberOfQuestions,
    getQuestion
};
