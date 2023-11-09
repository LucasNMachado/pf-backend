import CartsService from "../services/cartsService";
import ProductsService from "../services/productsService";
import UsersService from "../services/usersService";

class ViewsController {
  constructor(logger) {
    this.logger = logger;
    this.cartsService = new CartsService();
    this.productsService = new ProductsService();
    this.usersService = new UsersService();
  }

  publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect("/products");
    next();
  };

  privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
  };

  productsView = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort = 'asc', category } = req.query;
      const data = await this.productsService.getProducts(limit, page, sort, category);
      let products = data.products;
    } catch (error) {
      this.logger.error('Error al obtener productos', error);
      res.status(500).render('Error al obtener los productos desde la base de datos');
    }
  };

  cartIdView = async (req, res) => {
    try {
      const idCart = req.params.cid;
      this.logger.debug('El id del carrito es: ' + idCart);
      const cart = await this.cartsService.getCartById(idCart);
      if (!cart) {
        this.logger.warn('El carrito con el id ' + idCart + ' no existe');
        return res.status(404).render("El carrito está vacío.");
      }
    } catch (error) {
      this.logger.error('Se produjo un error al obtener el carrito', error);
      res.status(500).render('Error al obtener el carrito desde la base de datos');
    }
  };

  MessagesView = (req, res) => {
    try {
      res.status(200).render('Messages');
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewChat', error);
      res.status(500).render('Error al obtener los mensajes desde la base de datos');
    }
  };

  UsersRegisterView = async (req, res) => {
    try {
      res.status(200).render('registerUser', {
        style: "index.css",
        styleBoostrap: "bootstrap.min.css",
        title: "RegisterUser"
      });
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewRegisterUser', error);
      res.status(500).render('Error al renderizar el registro de usuarios');
    }
  };

  LoginView = async (req, res) => {
    try {
      res.status(200).render('loginUser', {
        title: "loginUser"
      });
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewLogin', error);
      res.status(500).render('Error al renderizar la vista de inicio de sesión');
    }
  };

  resetPasswordView = async (req, res) => {
    try {
      res.status(200).render('resetPassword', {
        style: "index.css",
        styleBoostrap: "bootstrap.min.css",
        title: "resetPassword"
      });
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewResetPassword', error);
      res.status(500).render('Error al renderizar la vista de restablecimiento de contraseña');
    }
  };

  RestartPasswordView = async (req, res) => {
    try {
      res.status(200).render('restartPassword', {
        title: "restartPassword"
      });
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewRestartPassword', error);
      res.status(500).render('Error al renderizar la vista de reinicio de contraseña');
    }
  };

  CurrentView = async (req, res) => {
    try {
      res.status(200).render('current', {
        title: "current"
      });
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewCurrent', error);
      res.status(500).render('Error al renderizar la vista de usuario actual');
    }
  };

  UserView = async (req, res) => {
    try {
      const users = await this.usersService.getAllUsers();
      if (!users) {
        this.logger.fatal('No hay usuarios para mostrar');
        return res.status(404).render("El listado de usuarios está vacío.");
      }
    } catch (error) {
      this.logger.error('Se produjo un error al renderizar ViewUserList', error);
      res.status(500).render('Error al renderizar la vista de lista de usuarios');
    }
  };

}

export default ViewsController;
