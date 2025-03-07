import {connect, disconnect} from './Connection.js';
import User from './user.js';
// Y los demás imports necesarios

// Clase que contiene los métodos para realizar operaciones CRUD sobre cualquier modelo de la base de datos
class Crud {

  static async createUser(data) {
    try {
      const newUser = new User(data);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
        error.message = 'Error al crear el usuario: ' + error.message;
        throw error;
    }
  }

  static async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
        error.message = 'Error al obtener los usuarios: ' + error.message;
        throw error;
    }
  }

  static async getUserById(userId) {
    try {
        const user = await User.findById(userId);
        return user; 
    } catch (error) {
        error.message = 'Error al obtener el usuario: ' + error.message;
        throw error;
    }
  }

  static async updateUser(userId, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true }
      );
      return updatedUser;   // Devuelve el usuario actualizado
    } catch (error) {
        error.message = 'Error al actualizar el usuario: ' + error.message;
        throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;   // Devuelve el usuario eliminado
    } catch (error) {
        error.message = 'Error al eliminar el usuario: ' + error.message;
        throw error;
    }
  }
}

connect()
  .then(() => {
    console.log("Conexión establecida");
    // Se crea el usuario
    return Crud.createUser({
      username: 'user1',
      password: '123456'
    });
  })
  .then(createdUser => {
    console.log("Usuario creado:", createdUser);
    // Se busca el usuario recién creado usando su _id
    return Crud.getUserById(createdUser._id);
  })
  .then(foundUser => {
    console.log("Usuario encontrado:", foundUser);
    console.log(`ID: ${foundUser._id}`);
    console.log(`Username: ${foundUser.username}`);
    console.log(`Friend Code: ${foundUser.friendCode}`);
    console.log(`Password: ${foundUser.password}`);
  })
  .catch(error => {
    console.error("Error:", error);
  })
  .finally(() => {
    disconnect();
  });

export default Crud;