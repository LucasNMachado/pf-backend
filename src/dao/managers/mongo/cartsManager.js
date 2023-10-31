import cartsModel from "../../models/cartsModel.js";

class CartManager {

  // agrega todos los carritos
  async getAllCarts() {
    try {

      return await cartsModel.find().populate("products.product");
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }
  // agrega por id
  async getCart(id) {
    try {
      return await cartsModel.findById(id).populate("products.product");
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // agrega nuevo carrito
  async addCart() {
    try {

      const newCart = new cartsModel({
        products: [],
      });

      return await newCart.save();
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // elimina un carrito por id
  async deleteCart(cartId) {
    try {
      return await cartsModel.findByIdAndDelete(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // actualiza un carrito con nuevos productos
  async updateCart(cartId, products) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = products;
      
      await cart.save();
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // actualiza la cantidad de un producto en el carrito o lo elimina si es 0
  async updateProductInCart(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        if (quantity > 0) {
          existingProduct.quantity = quantity;
        } else {
          cart.products = cart.products.filter(
            (product) => product.product.toString() !== productId
          );
        }
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }

      await cart.save();
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // agrega o actualiza la cantidad de un producto en el carrito
  async addOrUpdateProductInCart(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        if (quantity > 0) {
          cart.products.push({ product: productId, quantity });
        } else {
          throw new Error("Cantidad no válida");
        }
      }

      // guarda la actualización del carrito y lo retorna
      await cart.save();
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // agrega un producto al carrito o incrementa su cantidad si ya existe
  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      // guarda la actualización del carrito y lo retorna
      await cart.save();
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // vacía un carrito
  async emptyCart(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (cart) {
        cart.products = [];
      
        await cart.save();
      }
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }

  // elimina un producto del carrito o reduce su cantidad si es mayor que 1
  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          cart.products = cart.products.filter(
            (product) => product.product.toString() !== productId
          );
        }
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }

      // guarda la actualización del carrito y lo retorna
      await cart.save();
      return await this.getCart(cartId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }
}

export default CartManager;
