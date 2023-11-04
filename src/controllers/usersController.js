import UsersService from "../services/usersService.js";
import UserDTO from "./UserDTO.js";
import CustomError from "./CustomError.js";
import EErrors from "./ErrorsEnums.js";
import MailingService from "./MailingService.js";
import jwt from "jsonwebtoken";

const mailingService = new MailingService();
const usersService = new UsersService();

const handleError = (req, res, logMessage, error, statusCode = 500) => {
  req.logger.error(logMessage);
  res.status(statusCode).send(`Error: ${logMessage} - ${error.message}`);
};

const tryCatchHandler = async (req, res, callback) => {
  try {
    await callback();
  } catch (error) {
    handleError(req, res, callback.name, error);
  }
};

export const registerUser = (req, res) => {
  tryCatchHandler(req, res, async () => {
    req.logger.info("El usuario se ha creado correctamente");
    res.status(200).send({ status: "success", message: "Usuario registrado", payload: req.user });
  });
};

export const failRegister = (req, res) => {
  tryCatchHandler(req, res, async () => {
    req.logger.error("Fallo en la Estrategia");
    res.status(404).send({ error: "Fallo" });
  });
};

export const loginUser = (req, res) => {
  tryCatchHandler(req, res, async () => {
    if (!req.user) {
      const { firstName, lastName, email, age, password, birthDate, role } = req.user;
      if (!firstName || !lastName || !email || !age || !password || !birthDate || !role) {
        req.logger.error("Credenciales inválidas");
        CustomError.createError({
          name: "User Creation Error",
          cause: UsersErrorInfo({ firstName, lastName, email, age, password, birthDate, role }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error en las credenciales del usuario",
        });
        res.status(400).send({ status: "Error", error: "Credenciales inválidas" });
      }
    }
    req.session.user = { name: `${req.user.firstName} ${req.user.lastName}`, email: req.user.email, age: req.user.age, role: req.user.role };
    req.logger.info("Sesión iniciada, usuario: " + req.user);
    res.cookie("cookieToken", req.authInfo, { httpOnly: true }).send({ status: "Usuario autenticado", message: "Cookie establecida", payload: req.authInfo });
  });
};

export const failLogin = (req, res) => {
  tryCatchHandler(req, res, async () => {
    req.logger.error("Fallo al Logearse, credenciales inválidas");
    res.send({ error: "Fallo al Logearse" });
  });
};

export const logoutSession = (req, res) => {
  tryCatchHandler(req, res, async () => {
    req.session.destroy((error) => {
      if (!error) {
        req.logger.info("Sesión finalizada " + req.user);
        res.status(200).send("Sesión eliminada");
      } else {
        handleError(req, res, "Error al eliminar la sesión", error, 400);
      }
    });
  });
};

export const resetPassword = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const { token, newpassword, confirmNewPassword } = req.body;

    if (!token || !newpassword || !confirmNewPassword) {
      req.logger.error("Error al verificar las credenciales, verifique y vuelva a intentarlo");
      CustomError.createError({
        name: "User ResetPass Creation Error",
        cause: ResPwdErrorInfo({ token, newpassword, confirmNewPassword }),
        code: EErrors.INVALID_TYPES_ERROR,
        message: "Error en las credenciales para restablecer la contraseña",
      });
      res.status(400).send("Error al verificar los datos ingresados, vuelva a intentarlo");
    } else if (newpassword !== confirmNewPassword) {
      req.logger.error("Error al verificar las nuevas credenciales, vuelva a intentarlo");
      CustomError.createError({
        name: "User Differnt Pass Creation Error",
        cause: newPassErrorInfo({ newpassword, confirmNewPassword }),
        code: EErrors.INVALID_TYPES_ERROR,
        message: "Error en las credenciales para restablecer la contraseña, verifique que sean iguales",
      });
      res.status(400).send("Error al verificar las nuevas credenciales, vuelva a intentarlo");
    } else {
      const user = jwt.verify(token, PRIVATE_KEY);
      if (!user) {
        req.logger.error("Usuario incorrecto y/o inexistente");
        res.status(400).send("Usuario incorrecto y/o inexistente");
      } else {
        const email = user.email;
        req.logger.debug(`Solicitud de cambio de contraseña para el usuario: ${email}`);
        const result = await usersService.updateUserPassword(email, newpassword);
        if (result) res.status(200).send("Contraseña restablecida exitosamente");
      }
    }
  });
};

export const restartPassword = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const { email } = req.body;
    req.logger.debug(email);
    const user = await usersService.getUsers(email);
    req.logger.debug(user);
    if (user) {
      const sendMail = await mailingService.createEmail(email);
      if (sendMail) {
        req.logger.info('El correo electrónico fue enviado');
        res.status(200).send('Se realizó exitosamente el envío del Email');
      } else {
        res.status(400).send(`Usuario no válido para el correo electrónico: ${email}`);
      }
    }
  });
};

export const usersCurrent = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const user = new UserDTO(req.user);
    res.send(user);
  });
};

export const updateRole = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const { id } = req.params;
    req.logger.debug(`Se solicita cambiar el rol del usuario con el ID: ${id}`);
    const updateRole = req.body;
    const updateUser = await usersService.updateRole(id, updateRole);
    if (updateRole) {
      req.logger.info(`Rol del usuario con ID: ${id}, cambiado exitosamente`);
      res.status(200).send('Rol cambiado exitosamente');
    } else {
      req.logger.error(`Usuario no válido para el ID: ${id}`);
      res.status(400).send(`Usuario no válido para el ID: ${id}`);
    }
  });
};

export const addDocumentsToUser = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const { uid } = req.params;
    const files = req.files;
    const addDocuments = await usersService.addDocumentUser(uid, files);
    if (addDocuments) {
      req.logger.info(`Documentos agregados con éxito al usuario con ID: ${uid}`);
      res.status(200).send('Documentos agregados exitosamente');
    } else {
      req.logger.error(`Error al cargar los documentos en el usuario con el ID: ${uid}`);
      res.status(400).send(`Error al cargar los documentos en el usuario con el ID: ${uid}`);
    }
  });
};

export const getUsers = (req, res) => {
  tryCatchHandler(req, res, async () => {
    req.logger.info('Se solicitan a todos los usuarios');
    const users = await usersService.getAllUsers();
    return users;
  });
};

export const deleteUser = (req, res) => {
  tryCatchHandler(req, res, async () => {
    const { id } = req.body;
    const userDelete = await usersService.deleteUserById(id);
    if (userDelete.deletedCount === 1) {
      res.status(200).send('Usuario eliminado exitosamente');
    } else {
      res.status(400).send("No se pudo eliminar el usuario");
    }
  });
};
