import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
    try {
        const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/bd"; 

        await mongoose.connect(dbUrl);

    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
        throw new Error("Error al conectar con MongoDB");
    }
};

export default connect;
