import MessagesRepository from '../repositories/MessagesRepository';
import CustomError from '../utils/errors/customError.js';
import EErrors from '../utils/errors/enum.js';
import { MessagesErrorInfo } from '../utils/errors/info.js';

class MessagesService {
  constructor() {
    this.messages = new MessagesRepository();
  }

  async getMessages() {
    try {
      const messages = await this.messages.getMessages();
      return messages;
    } catch (error) {
      throw new Error(`Error al recuperar mensajes desde la base de datos: ${error.message}`);
    }
  }

  async addMessage(sender, content) {
    try {
      if (!sender || !content) {
        throw CustomError.createError({
          name: 'Error en la Creación de Mensaje',
          cause: MessagesErrorInfo({ sender, content }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: 'Error al intentar crear un nuevo mensaje',
        });
      }
      const newMessage = await this.messages.addMessage(sender, content);
      return newMessage;
    } catch (error) {
      throw new Error(`Error al intentar guardar mensajes en la base de datos: ${error.message}`);
    }
  }

  async updateMessage(id, object) {
    try {
      const updatedMessage = await this.messages.updateMessage(id, object);
      return updatedMessage;
    } catch (error) {
      throw new Error(`Error al actualizar el mensaje con ID (${id}): ${error.message}`);
    }
  }

  async deleteMessage(id) {
    try {
      const deletedMessage = await this.messages.deleteMessage(id);
      return deletedMessage;
    } catch (error) {
      throw new Error(`Error al eliminar el mensaje con ID (${id}): ${error.message}`);
    }
  }
}

export default MessagesService;
