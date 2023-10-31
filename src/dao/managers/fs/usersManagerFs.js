import fs from 'fs/promises';
import path from 'path';

class UsersManagerFs {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // guarda los usuarios en el archivo json
  async #save(users) {
    try {
      const usersStr = JSON.stringify(users, null, 2);
      await fs.writeFile(this.filePath, usersStr);
    } catch (error) {
      console.error({ error });
    }
  }

  // obtiene todos los usuarios
  async getUsers() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, lo crea y devuelve una lista vacía.
      console.log('El archivo de usuarios no existe');
      await this.#save([]);
      return [];
    }
  }

  // obtiene un usuario por email
  async getUserByEmail(email) {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.email === email);
      return user || null;
    } catch (error) {
      console.error({ error });
    }
  }

  // genera id para usuarios
  generateIdUsers(users) {
    return users.length > 0 ? users[users.length - 1].id + 1 : 1;
  }

  // crea un nuevo usuario
  async createUser(bodyUser) {
    try {
      const users = await this.getUsers();
      const newUser = {
        id: this.generateIdUsers(users),
        ...bodyUser
      };
      users.push(newUser);
      await this.#save(users);
      return newUser;
    } catch (error) {
      console.error({ error });
    }
  }

  // actualiza un usuario por id
  async updateUser(id, bodyUpdate) {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.id === id);
      if (user) {
        Object.assign(user, bodyUpdate);
        await this.#save(users);
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error({ error });
    }
  }

  // agrega documentos al usuario
  async documentUpdate(id, files) {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.id === id);
      if (user) {
        const documents = user.documents || [];
        const newDocuments = [
          ...(documents || []),
          ...files.map((file) => ({ name: file.originalname, reference: file.path }))
        ];
        user.documents = newDocuments;
        await this.#save(users);
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error({ error });
    }
  }
}


const usersFilePath = path.join(__dirname, './data/users.json');

export default new UsersManagerFs(usersFilePath);
