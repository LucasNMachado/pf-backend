import UsersRepository from "../repositories/UsersRepository.js";
import UserDTO from "./UserDTO.js";
import CustomError from "./CustomError.js";
import EErrors from "./ErrorsEnums.js";
import MailingService from "./MailingService.js";
import {
  UsersErrorInfo,
  UpdateRoleErrorInfo,
  UpdateRoleUserErrorInfo,
} from "../errors/info.js";

const mailingService = new MailingService();

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getAllUsers() {
    try {
      const users = await this.usersRepository.getAllUsers();
      if (!users) {
        throw new Error("No se han encontrado Usuarios");
      } else {
        const usersDTO = users.map((user) => new UserDTO(user));
        return usersDTO;
      }
    } catch (error) {
      throw new Error("Error al obtener todos los usuarios: " + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      if (!email) {
        throw CustomError.createError({
          name: "User Creation Error",
          cause: UsersErrorInfo({ email }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error trying to create a new user",
        });
      }
      const user = await this.usersRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      throw new Error(
        "Se produjo un error al leer el correo electrónico ingresado"
      );
    }
  }

  async getUserById(id) {
    try {
      const user = await this.usersRepository.getUserById(id);
      return user;
    } catch (error) {
      throw new Error("Se produjo un error al leer el ID ingresado");
    }
  }

  async createUser(bodyUser) {
    try {
      if (typeof bodyUser !== "object") {
        throw new Error(
          "Se produjo un error al cargar los datos del nuevo usuario, verifique si los campos están correctamente completados"
        );
      }
      const { firstName, lastName, email, age, password, birthDate, role } =
        bodyUser;
      if (
        !firstName ||
        !lastName ||
        !email ||
        !age ||
        !password ||
        !birthDate ||
        !role
      ) {
        throw CustomError.createError({
          name: "User Creation Error",
          cause: UsersErrorInfo({
            firstName,
            lastName,
            email,
            age,
            password,
            birthDate,
            role,
          }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error trying to create a new user",
        });
      }
      const user = await this.usersRepository.createUser(bodyUser);
      return user;
    } catch (error) {
      throw new Error(
        "Se produjo un error al crear un usuario nuevo: " + error.message
      );
    }
  }

  async updateUserPassword(email, newPassword) {
    try {
      if (!email || !newPassword) {
        throw CustomError.createError({
          name: "User Creation Error",
          cause: UsersErrorInfo({ email, newPassword }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error trying to create a new user",
        });
      }
      const user = await this.usersRepository.getUserByEmail(email);
      if (!user) {
        throw new Error(
          `No se ha encontrado un usuario registrado con este correo electrónico: (${email}), verifique que los datos ingresados sean correctos y vuelva a intentarlo`
        );
      } else {
        const comparison = isValidPassword(user, newPassword);
        if (comparison === true) {
          throw new Error(
            "No se puede utilizar la misma contraseña, verifique los datos"
          );
        } else {
          const hashedPassword = createHash(newPassword);
          const updatedUser = await this.usersRepository.updateUserPassword(
            user._id,
            hashedPassword
          );
          return updatedUser;
        }
      }
    } catch (error) {
      throw new Error(`Error al actualizar la contraseña: ${error.message}`);
    }
  }

  async updateRole(id, newRole) {
    try {
      if (!id || !newRole) {
        throw CustomError.createError({
          name: "User Creation Error",
          cause: UpdateRoleErrorInfo({ id, newRole }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error trying to update role for user",
        });
      }
      const user = await this.usersRepository.getUserById(id);
      if (!user) {
        throw new Error(
          `No se ha encontrado un usuario registrado con este ID: (${id}), verifique que los datos ingresados sean correctos y vuelva a intentarlo`
        );
      }
      const userUpdate = await this.usersRepository.updateUserRole(id, newRole);
      return userUpdate;
    } catch (error) {
      throw new Error(`Error al actualizar el rol: ${error.message}`);
    }
  }

  async addDocumentUser(id, files) {
    try {
      if (!id || !files) {
        throw CustomError.createError({
          name: "User Creation Error",
          cause: UsersErrorInfo({ id, files }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error trying to add documents to the user",
        });
      }
      const user = await this.usersRepository.getUserById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const documents = user.documents || [];
      const newDocuments = [
        ...documents,
        ...files.map((file) => ({
          name: file.originalname,
          reference: file.path,
        })),
      ];
      const updatedUser = await this.usersRepository.updateUserDocuments(
        id,
        newDocuments
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        `Error al agregar documentos al usuario: ${error.message}`
      );
    }
  }

  async setLastConnection(user) {
    try {
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const id = user._id;
      const updatedUser = await this.usersRepository.updateLastConnection(
        id,
        new Date()
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        `Error al establecer la última conexión: ${error.message}`
      );
    }
  }

  async deleteUserById(id) {
    try {
      if (!id) {
        throw new Error("El ID del usuario es obligatorio");
      }
      const user = await this.usersRepository.getUserById(id);
      if (!user) {
        throw new Error("El usuario no existe");
      }
      const sendMail = await mailingService.createEmailDeleteUserToInactivity(
        user
      );
      if (sendMail) {
        const deletedUser = await this.usersRepository.deleteUser(id);
        if (!deletedUser) {
          throw new Error("No se pudo eliminar el usuario");
        }
        return deletedUser;
      } else {
        throw new Error(
          "Ocurrió un error en el envío del correo electrónico para notificar al usuario que su cuenta ha sido eliminada"
        );
      }
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }
}

export default UsersService;
