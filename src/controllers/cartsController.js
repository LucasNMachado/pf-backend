import CartService from "../services/service.carts.js";
import TicketService from "../services/service.tickets.js";

class CartsController {
    constructor(cartsService, ticketService) {
        this.cartsService = cartsService;
        this.ticketService = ticketService;
    }

    handleResponse(res, message, success = true) {
        if (success) {
            return res.status(200).json(message);
        } else {
            return res.status(404).json(message);
        }
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartsService.addCarts();
            req.logger.info(newCart ? `Se ha creado correctamente el carrito con el id: ${newCart._id}` : 'No pudo crearse exitosamente el carrito nuevo');
            return this.handleResponse(res, newCart);
        } catch (error) {
            req.logger.fatal('Error al intentar crear un carrito, ' + error);
            return res.status(500).json('Error al intentar crear el carrito', error);
        }
    }

    getDataCartById = async (req, res) => {
        try {
            const id = req.params.cid;
            const cart = await this.cartsService.getCartById(id);
            req.logger.debug(`Se solicita el carrito con el id: ${id}`);
            req.logger.info(cart ? `Se hace la solicitud del carrito con el id: ${id}` : `No se ha encontrado el carrito con el id: ${id}, verifique los datos ingresados`);
            return this.handleResponse(res, cart, !!cart);
        } catch (error) {
            req.logger.fatal('Error al obtener el Carrito');
            return res.status(500).json('Error al obtener el Carrito');
        }
    }

    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const user = req.user;
            const newProductInCart = await this.cartsService.addProductCart(user, cid, pid);
            req.logger.debug(`Se realiza la incorporación del producto con el id: ${pid}, al carrito con el id: ${cid}`);
            req.logger.info(newProductInCart ? `Se agregó correctamente el producto con id: ${pid}, al carrito con el id: ${cid}` : `Se produjo un error al intentar insertar el producto con el id: ${pid}, en el carrito con el id: ${cid}`);
            return this.handleResponse(res, `Producto con el id: ${pid} ${newProductInCart ? 'agregado con éxito' : 'no encontrado, verifique los datos ingresados'}`, !!newProductInCart);
        } catch (error) {
            req.logger.fatal('Se produjo un error al intentar agregar un producto al carrito');
            return res.status(500).json('Error al agregar producto al carrito', error);
        }
    }

    emptyCart = async (req, res) => {
        try {
            const { cid } = req.params;
            req.logger.debug(`Se solicita vaciar el carrito with id: ${cid}`);
            const cartDelete = await this.cartsService.emptyCart(cid);
            req.logger.info(cartDelete.products.length === 0 ? `Se realizó exitosamente la operación de vacío en el carrito with id: ${cid}` : `Se produjo un error al intentar vaciar the carrito with id: ${cid}`);
            return this.handleResponse(res, cartDelete.products.length === 0 ? `Se ha vaciado correctamente el carrito with id: ${cid}` : `Carrito with id: ${cid} not found`, cartDelete.products.length === 0);
        } catch (error) {
            req.logger.fatal('Error al vaciar el carrito, verifique que los datos ingresados sean los correctos');
            return res.status(500).json('Error al vaciar el carrito', error);
        }
    }

    deleteProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const cartDelete = await this.cartsService.deleteProductCart(cid, pid);
            req.logger.debug(`Se solicita eliminar el producto with id: ${pid}, del carrito with id: ${cid}`);
            req.logger.info(cartDelete ? `Se ha eliminado correctamente el producto with id: ${pid}, del carrito with id: ${cid}` : `Se produjo un error al intentar eliminar el producto with id: ${pid}, del carrito with id: ${cid}`);
            return this.handleResponse(res, `Se ha eliminado correctamente el producto with id: ${pid}, del carrito with id: ${cid}`, !!cartDelete);
        } catch (error) {
            req.logger.fatal('Se produjo un error al querer borrar un producto del carrito');
            return res.status(500).json('Error al borrar el producto del carrito', error);
        }
    }

    updateQuantityProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updateQuantityProduct = await this.cartsService.updateProductInCart(cid, pid, quantity);
            req.logger.debug(`Se actualiza cantidad to: ${quantity} del producto with id: ${pid}, del carrito with id: ${cid}`);
            req.logger.info(updateQuantityProduct ? `Se realiza la actualización correcta de cantidad del producto with id: ${pid}, del carrito with id: ${cid}` : `Se produjo un error al intentar cambiar la cantidad del producto with id: ${pid}, del carrito with id: ${cid}`);
            return this.handleResponse(res, `Se ha actualizado correctamente la cantidad del producto with id: ${pid}, del carrito with id: ${cid}`, !!updateQuantityProduct);
        } catch (error) {
            req.logger.fatal('Error al intentar actualizar la cantidad de un producto del carrito');
            return res.status(500).json('Error al intentar actualizar la cantidad de un producto del carrito', error);
        }
    }

    addArrayInCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const products = req.body;
            req.logger.debug(`Productos a insertar: ${products}, al carrito with id: ${cid}`);
            const cart = await this.cartsService.insertArrayProductsIntoCart(cid, products);
            req.logger.info(cart ? `Se han insertado correctamente los productos en el carrito with id: ${cid}` : `Se produjo un error al insertar los productos en el carrito with id: ${cid}`);
            return this.handleResponse(res, cart ? `Se ha actualizado correctamente el carrito with id: ${cid}` : 'Carrito not found', !!cart);
        } catch (error) {
            req.logger.fatal('Se produjo un error al insertar los productos en el carrito');
            return res.status(500).json('Error al insertar un array of products in the Cart', error);
        }
    }

    confirmBuy = async (req, res) => {
        try {
            const user = req.body;
            req.logger.debug(`Se realiza la confirmación de compra del usuario: ${user}`);
            const ticket = await this.ticketService.create(user);
            req.logger.info(`Se realiza exitosamente la creación del ticket with id: ${ticket._id}`);
            return res.status(200).send('La creación del ticket fue exitosa');
        } catch (error) {
            req.logger.fatal(`Se ha producido un error en la creación del ticket del usuario: ${user}`);
            return res.status(500).json('Error al mandar el usuario', error);
        }
    }
}

export default CartsController;
