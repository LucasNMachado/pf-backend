import messagesModel from "../../models/messagesModel.js";

class MessagesManager {
  constructor() {
    this.messagesModel = messagesModel;
  }

  // obtiene todos los mensajes
  async getMessages() {
    try {
      const messages = await this.messagesModel.find();
      return messages;
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      return [];
    }
  }

  // obtiene un mensaje por id
  async getMessageById(id) {
    try {
      const message = await this.messagesModel.findById(id);
      if (message) {
        return message;
      } else {
        console.error("Mensaje no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el mensaje:", error);
      return null;
    }
  }

  // agrega un nuevo mensaje
  async addMessage(sender, content) {
    if (!sender || !content) {
      console.error("Faltan campos obligatorios");
      return null;
    }

    try {
      const newMessage = new this.messagesModel({
        sender,
        content,
      });

      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error("Error al agregar el mensaje:", error);
      return null;
    }
  }

  // actualiza un mensaje por su id
  async updateMessage(id, object) {
    try {
      const updatedMessage = await this.messagesModel.findByIdAndUpdate(
        id,
        object,
        { new: true }
      );
      if (updatedMessage) {
        return updatedMessage;
      } else {
        console.error("Mensaje no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al actualizar el mensaje:", error);
      return null;
    }
  }

  // elimina un mensaje por su id
  async deleteMessage(id) {
    try {
      const deletedMessage = await this.messagesModel.findByIdAndDelete(id);
      if (deletedMessage) {
        return deletedMessage;
      } else {
        console.error("Mensaje no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
      return null;
    }
  }
}

export default MessagesManager;
