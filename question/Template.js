//libreria para trabajar con MongoDB
const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

//esquema para bd de pregunta
const questionSchema = new Schema({
    question: { type: String, required: true },
    topic: { type: String, required: true },
    answer: { type: String, required: true }, 
    options: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    correct: { type: Boolean, required: false }
});


//se crea el modelo a partir del esquema que se definió previamente
const Template = model("Template", questionSchema);

//sirve para representar lo que se exportará desde el archivo actual -> el modelo de Pregunta
module.exports = Template;
