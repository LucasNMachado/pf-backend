import MyRouter from './router';
import ViewsRouter from '../controllers/viewsControllers';

export default class ViewsRouter extends MyRouter {

  init() {
    
    this.get('/products', ['USER_ADMIN', 'USER', 'USER_PREMIUM'], this.ViewsController.privateAccess, this.viewsController.productsView);
    this.get('/carts/:cid', ['USER_ADMIN', 'USER', 'USER_PREMIUM'], this.ViewsController.privateAccess, this.viewsController.cartIdView);
    this.get('/messages', ['PUBLIC'], this.ViewsController.MessagesView);
    this.get('/register', ['PUBLIC'], this.viewsController.publicAccess, this.viewsController.UsersRegisterView);
    this.get('/login', ['PUBLIC'], this.viewsController.publicAccess, this.viewsController.LoginView);
    this.get('/resetPassword/:id', ['PUBLIC'], this.viewsController.publicAccess, this.viewsController.resetPasswordView);
    this.get('/restartPassword', ['PUBLIC'], this.viewsController.publicAccess, this.viewsController.RestartPasswordView);
    this.get('/current', ['USER_ADMIN', 'USER', 'USER_PREMIUM'], this.viewsController.privateAccess, this.viewsController.CurrentView);
    this.get('/usersList', ['USER_ADMIN'], this.viewsController.privateAccess, this.viewsController.getViewUsers);

  }
}


