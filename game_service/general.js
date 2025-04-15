const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

(async function () {
  // Crear una instancia de MongoMemoryServer
  const mongoServer = await MongoMemoryServer.create();

  // Obtener la URI de MongoMemoryServer
  const mongoUri = mongoServer.getUri();

  // Conectar a MongoDB usando Mongoose
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Verificar si la conexión está activa
  if (mongoose.connection.readyState === 1) {
    console.log('MongoMemoryServer sigue en ejecución');
  } else {
    console.log('MongoMemoryServer no está en ejecución');
  }

  // Dejarlo corriendo por 10 segundos para ver si sigue activo
  setTimeout(async () => {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoMemoryServer sigue activo después de 10 segundos');
    } else {
      console.log('MongoMemoryServer no está activo después de 10 segundos');
    }

    // Desconectar después de 10 segundos
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Desconectado de MongoMemoryServer');
  }, 10000); // 10 segundos de espera
})();
