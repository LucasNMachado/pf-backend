import DaoFactory from '../dao/factory';

const daoFactory = DaoFactory.getDao();
const usersManager = daoFactory.usersManager;

class UsersRepository {
  constructor() {
    this.usersManager = usersManager;
  }

  async getUser(email) {
    return this.usersManager.getUser(email);
  }

  async getUserId(id) {
    return this.usersManager.getUserId(id);
  }

  async createUser(bodyUser) {
    return this.usersManager.createUser(bodyUser);
  }

  async updateUser(id, bodyUpdate) {
    return this.usersManager.updateUser(id, bodyUpdate);
  }
}

export default UsersRepository;
