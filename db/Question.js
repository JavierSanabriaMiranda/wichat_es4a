//libreria para trabajar con MongoDB
// Importar mongoose
import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;



//esquema para bd de pregunta
const questionSchema = new Schema({
    question: { type: String, required: true },
    topics: [{ 
        type: ObjectId, 
        ref: "Topic", 
        required: true 
    }],
    answer: { type: String, required: true }, 
    options: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    correct: { type: Boolean, required: false }
});


//se crea el modelo a partir del esquema que se definió previamente
const Question = model("Question", questionSchema);

//sirve para representar lo que se exportará desde el archivo actual -> el modelo de Pregunta
// Exportación en ES Module
export default Question;
