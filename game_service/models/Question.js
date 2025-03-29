//libreria para trabajar con MongoDB
// Importar mongoose
const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;



//esquema para bd de pregunta
const questionSchema = new Schema({
    text: { type: String, required: true }, // Enunciado de la pregunta
    imageUrl: { type: String, required: true }, // URL de la imagen asociada a la pregunta
    wasUserCorrect: { type: Boolean, required: true }, // Indica si el usuario respondió correctamente
    selectedAnswer: { type: String, required: true }, // Respuesta seleccionada por el usuario
    answers: [
        {
            text: { type: String, required: true }, // Texto de la opción de respuesta
            isCorrect: { type: Boolean, required: true } // Indica si es la respuesta correcta
        }
    ]
});

//se crea el modelo a partir del esquema que se definió previamente
const Question = model("Question", questionSchema);

//sirve para representar lo que se exportará desde el archivo actual -> el modelo de Pregunta
// Exportación en ES Module
module.exports =  Question;
