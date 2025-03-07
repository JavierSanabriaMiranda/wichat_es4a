// Usar require en lugar de import
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { executeFullFlow }  from './wikidata.js';  // Aquí usamos require para importar la función

console.log("¡El script ha comenzado a ejecutarse!");

// Conexión a MongoDB
const connect = async () => {
    try {
        console.log("Intentando conectar con MongoDB...");

        if (process.env.DB_URL) {
            console.log("Conectando a MongoDB usando la URL externa...");
            await mongoose.connect('mongodb://mongodb:27017/ana');
            console.log("Conexión con MongoDB externa exitosa");
        } else {
            console.log("Conectando a MongoDB en memoria...");
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            console.log("MongoDB en memoria URI:", mongoUri);
            await mongoose.connect(mongoUri);
            console.log("Conexión con MongoDB en memoria exitosa");
        }

        console.log('MongoDB conectado con éxito');

        // Llamar a la función de flujo completo después de la conexión exitosa
        const topics = ["geography", "history"];
        const lang = "en";  // Puedes cambiar el idioma aquí si es necesario
        console.log("Iniciando flujo completo...");
        executeFullFlow(topics, lang)
            .then(result => {
                console.log("Resultado final:", result);  // Mostrar el resultado final si todo sale bien
            })
            .catch(err => {
                console.error("Error en el flujo completo:", err);  // Mostrar el error si algo falla
            });

    } catch (error) {
        console.error("Error en la conexión de MongoDB:", error);  // Mostrar errores si ocurre algo
        throw new Error('Error al conectarse a MongoDB');
    }
};

connect();
