import fs from 'fs/promises';
import path from 'path';

class MessagesManagerFs {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // guarda los mensajes en el json.
  async #save(messages) {
    try {
      const messagesStr = JSON.stringify(messages, null, 2);
      await fs.writeFile(this.filePath, messagesStr);
    } catch (error) {
      console.error({ error });
    }
  }

  // obtiene  mensajes desde el json.
  async getMessages() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, lo crea y devuelve una lista vacía.
      console.log('El archivo no existe');
      await this.#save([]);
      return [];
    }
  }

  // agrega un mensaje .
  async addMessages(user, message) {
    if (!user || !message) {
      console.error('Faltan campos obligatorios');
      return null;
    }

    try {
      const messages = await this.getMessages();
      const existingUserIndex = messages.findIndex((msg) => msg.user === user);

      if (existingUserIndex !== -1) {
        // si el usuario existe, agrega el mensaje a su lista de mensajes
        messages[existingUserIndex].messages.push(message);
      } else {
        // ai el usuario no existe, crea un nuevo mensaje
        const newMessage = {
          user: user,
          messages: [message],
        };
        messages.push(newMessage);
      }

      // guarda los mensajes actualizados en el archivo.
      await this.#save(messages);
      return messages;
    } catch (error) {
      console.error({ error });
    }
  }
}


const messageFilePath = path.join(__dirname, './data/messages.json');


export default new MessagesManagerFs(messageFilePath);
