import jwt from "jsonwebtoken";

const privateKey = "your-secret-key"; // Debe coincidir con la clave del middleware

const payload = {
    userId: "60d0fe4f5311236168a109cf" // Este es el ID del usuario
};
const token = jwt.sign(payload, privateKey);


console.log("Token generado:", token);
