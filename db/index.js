import connect from "./Connection.js"; // Usa extensión .js al importar en ESM

const start = async () => {
    await connect();
    console.log("🚀 Conexión establecida con MongoDB");
};

start();
