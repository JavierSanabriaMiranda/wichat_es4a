import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/bd";
    console.log("🚀 Conectando a MongoDB en:", dbUrl);

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

// Asegúrate de exportar la función 'connect' correctamente
export default connect; // Cambiar a exportación por defecto
