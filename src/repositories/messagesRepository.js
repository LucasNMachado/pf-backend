import DaoFactory from '../dao/factory';

const daoFactory = DaoFactory.getDao();
const messagesManager = daoFactory.messagesManager;

class MessagesRepository {
  constructor() {
    this.messagesManager = messagesManager;
  }

  async getMessages() {
    return this.messagesManager.getMessages();
  }

  async getMessageById(id) {
    return this.messagesManager.getMessageById(id);
  }

  async addMessage(sender, content) {
    return this.messagesManager.addMessage(sender, content);
  }

  async updateMessage(id, object) {
    return this.messagesManager.updateMessage(id, object);
  }

  async deleteMessage(id) {
    return this.messagesManager.deleteMessage(id);
  }
}

export default MessagesRepository;
