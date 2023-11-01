import CartsRepository from "../repositories/CartsRepository";
import UsersService from '../services/usersService.js';
import ProductsRepository from '../repositories/ProductsRepository';

const userService = new UsersService();
const productRepository = new ProductsRepository();

class CartsService {
    constructor() {
        this.carts = new CartsRepository();
    }

    async getAllCarts() {
        try {
            const carts = await this.carts.getAllCarts();
            return carts;
        } catch (error) {
            throw new Error("Error al obtener todos los carritos: " + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.carts.getCart(cartId);

            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            // procesa el carrito y calcula el subtotal y total
            const products = cart.products.map(async (cartProduct) => {
                const product = await productRepository.getProductById(cartProduct.productId);
                const subtotal = product.price * cartProduct.quantity;

                return {
                    ...cartProduct,
                    product,
                    subtotal,
                };
            });

            cart.products = await Promise.all(products);

            const total = cart.products.reduce((acc, curr) => acc + curr.subtotal, 0);
            cart.total = total;

            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito con ID (${cartId}): ${error.message}`);
        }
    }

    async createCart() {
        try {
            const newCart = await this.carts.addCart();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async addProductToCart(user, cartId, productId) {
        try {
            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error(`Error al cargar el producto con ID: ${productId}. Verifique su existencia.`);
            }

            const userRegister = await userService.getUserById(user.id);

            if (!userRegister) {
                throw new Error(`No se ha encontrado el usuario con el ID: ${user.id}. Verifique los datos ingresados.`);
            }

            const cart = await this.carts.addProductToCart(cartId, productId);
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar un producto al carrito: ${error.message}`);
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await this.carts.getCart(cartId);
            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            const deletedCart = await this.carts.deleteCart(cartId);
            return deletedCart;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await this.carts.getCart(cartId);
            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            const emptiedCart = await this.carts.emptyCart(cartId);
            return emptiedCart;
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.carts.getCart(cartId);
            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            const productIndex = cart.products.findIndex((cartProduct) => cartProduct.productId === productId);

            if (productIndex === -1) {
                throw new Error(`El producto con el ID: ${productId} no se encuentra en el carrito.`);
            }

            cart.products.splice(productIndex, 1);

            const updatedCart = await this.carts.updateCart(cartId, cart.products);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error al eliminar un producto del carrito: ${error.message}`);
        }
    }

    async updateProductInCart(cartId, productId, quantity) {
        try {
            const cart = await this.carts.getCart(cartId);
            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error(`Error al cargar el producto con ID: ${productId}. Verifique su existencia.`);
            }

            const cartProduct = cart.products.find((cartProduct) => cartProduct.productId === productId);

            if (!cartProduct) {
                throw new Error(`El producto con el ID: ${productId} no se encuentra en el carrito.`);
            }

            cartProduct.quantity = quantity;

            const updatedCart = await this.carts.updateCart(cartId, cart.products);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad de un producto en el carrito: ${error.message}`);
        }
    }

    async insertArrayProductsIntoCart(cartId, products) {
        try {
            const cart = await this.carts.getCart(cartId);
            if (!cart) {
                throw new Error(`No se ha encontrado el carrito con el ID: ${cartId}. Verifique los datos ingresados.`);
            }

            // verifica si los productos existen antes de agregarlos al carrito
            const invalidProducts = [];
            for (const product of products) {
                const existingProduct = await productRepository.getProductById(product.productId);
                if (!existingProduct) {
                    invalidProducts.push(product.productId);
                }
            }

            if (invalidProducts.length > 0) {
                throw new Error(`Los siguientes productos no existen: ${invalidProducts.join(", ")}`);
            }

            cart.products = cart.products.concat(products);

            const updatedCart = await this.carts.updateCart(cartId, cart.products);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error al insertar productos en el carrito: ${error.message}`);
        }
    }
}

export default CartsService;
