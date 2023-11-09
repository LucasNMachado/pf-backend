import MyRouter from './router.js';
import UserController from '../controllers/usersController.js';

export default class UserRouter extends MyRouter {
  init() {
    this.get("/", ['USER_ADMIN'], UserController.getUsers);

    this.get("/:uid", UserController.getUserById);

    this.delete("/:uid",['USER_ADMIN'], UserController.deleteUser);

    this.put("/:uid",['USER_ADMIN','USER_PREMIUM','USER'], UserController.updateRole);
  }
}
