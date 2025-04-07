// Importing external libraries
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Configuring environment variables from .env file
dotenv.config();

/**
 * @function connect
 * @description Establishes a connection to MongoDB using the mongoose library.
 * If the `DB_URL` environment variable is defined, it connects to the specified MongoDB instance.
 * Otherwise, it spins up an in-memory MongoDB server (ideal for testing).
 *
 * This approach ensures real DB usage in production/dev, and isolated DB usage in tests.
 *
 * @example
 *  connect()
 *    .then(() => console.log("Connected successfully"))
 *    .catch(error => console.log("Error during connection", error));
 */
const connect = async () => {
  try {
    let dbUrl;

    if (process.env.DB_URL) {
      dbUrl = process.env.DB_URL;
      console.log("🌍 Conectando a MongoDB real:", dbUrl);
    } else {
      const mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
      console.log("🧪 Conectando a MongoDB en memoria para testing");
    }

    // Attempt to connect to MongoDB with mongoose
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conexión exitosa con MongoDB.");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    throw new Error("Error al conectar con MongoDB");
  }
};

// Exporting the connect function for use in other files
module.exports = connect;
