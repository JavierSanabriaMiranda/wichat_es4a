// Importing external libraries
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configuring environment variables from .env file
dotenv.config();

/**
 * @function connect
 * @description Establishes a connection to MongoDB using the mongoose library. 
 * The connection URL is retrieved from the environment variable `DB_URL` or defaults to a local MongoDB instance.
 * 
 * The connection process uses `mongoose.connect()` with the `useNewUrlParser` and `useUnifiedTopology` options to ensure a modern, stable connection to MongoDB.
 * If the connection is successful, a confirmation message is logged. If an error occurs during the connection attempt, an error message is logged and an exception is thrown.
 * 
 * @example
 *  connect()
 *    .then(() => console.log("Connected successfully"))
 *    .catch(error => console.log("Error during connection", error));
 */
const connect = async () => {
  try {
    // Getting the MongoDB connection URL from the environment variable, or using a local default if not provided

    const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bd";

    console.log("🚀 Conectando a MongoDB en:", dbUrl);

    // Attempt to connect to MongoDB with mongoose
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true, // Use the new URL parser for MongoDB
      useUnifiedTopology: true, // Use the unified topology for MongoDB driver
    });

    // If connection is successful, log a success message
    console.log("✅ Conexión exitosa con MongoDB.");
  } catch (error) {
    // If there's an error connecting to MongoDB, log the error and throw a custom error
    console.error("❌ Error al conectar con MongoDB:", error);
    throw new Error("Error al conectar con MongoDB");
  }
};

// Exporting the connect function for use in other files
module.exports = connect; // ✅ Exportar correctamente

