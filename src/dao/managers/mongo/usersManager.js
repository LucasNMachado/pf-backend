import usersModel from "../../models/user.models.js";

class UsersManager {
  constructor() {
    this.usersModel = usersModel;
  }

  // trae al usuario por email
  async getUser(email) {
    try {
      const user = await this.usersModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error al obtener el usuario por email:", error);
      return null;
    }
  }

  // trae usuario por id
  async getUserId(id) {
    try {
      const user = await this.usersModel.findById(id);
      return user;
    } catch (error) {
      console.error("Error al obtener el usuario por id:", error);
      return null;
    }
  }

  // crea un usuario
  async createUser(bodyUser) {
    try {
      const user = await this.usersModel.create(bodyUser);
      return user;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return null;
    }
  }

  // modifica la contraseña del usuario
  async updateUser(id, bodyUpdate) {
    try {
      const idMongoUser = { _id: id };
      const updatePass = await this.usersModel.updateOne(idMongoUser, bodyUpdate);
      return updatePass;
    } catch (error) {
      console.error("Error al modificar la contraseña del usuario:", error);
      return null;
    }
  }
}

export default UsersManager;
