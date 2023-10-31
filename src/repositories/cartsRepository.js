import DaoFactory from "../dao/factory"; 


const daoFactory = DaoFactory.getDao();
const cartManager = daoFactory.cartManager;

class CartsRepository {
    constructor(cartManager) {
        this.cartManager = cartManager;
    }

    async getAllCarts() {
        return this.cartManager.getAllCarts();
    }

    async getCart(id) {
        return this.cartManager.getCart(id);
    }

    async addCart() {
        return this.cartManager.addCart();
    }

    async deleteCart(cartId) {
        return this.cartManager.deleteCart(cartId);
    }

    async updateCart(cartId, products) {
        return this.cartManager.updateCart(cartId, products);
    }

    async updateProductInCart(cartId, productId, quantity) {
        return this.cartManager.updateProductInCart(cartId, productId, quantity);
    }

    async addOrUpdateProductInCart(cartId, productId, quantity) {
        return this.cartManager.addOrUpdateProductInCart(cartId, productId, quantity);
    }

    async addProductToCart(cartId, productId) {
        return this.cartManager.addProductToCart(cartId, productId);
    }

    async emptyCart(cartId) {
        return this.cartManager.emptyCart(cartId);
    }

    async deleteProductFromCart(cartId, productId) {
        return this.cartManager.deleteProductFromCart(cartId, productId);
    }
}

export default CartsRepository;
