// Librería para trabajar con MongoDB
const { Schema, model } = require("mongoose");

// Esquema para Topic
const topicSchema = new Schema({
  type: {
    type: [String],
    required: true
  }
});

// Se crea el modelo a partir del esquema
const Topic = model("Topic", topicSchema);

// Exportamos el modelo
module.exports = Topic;