
import Router from './router.js';
import CartsController from './controllers/cartsController.js';

export default class CartsRouter extends Router {
    init() {
        const cartsController = new CartsController();

        this.get('/createCart', ['PUBLIC'], cartsController.createCart);
        this.get('/cart/:cid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.getDataCartById);
        this.post('/addProduct/:cid/:pid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.addProductToCart);
        this.post('/emptyCart/:cid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.emptyCart);
        this.delete('/deleteProduct/:cid/:pid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.deleteProductToCart);
        this.put('/updateQuantity/:cid/:pid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.updateQuantityProductInCart);
        this.post('/addArray/:cid', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.addArrayInCart);
        this.post('/confirmBuy', ['USER', 'USER_PREMIUM', 'USER_ADMIN'], cartsController.confirmBuy);
    }
}
