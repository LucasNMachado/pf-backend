import fs from 'fs';
import path from 'path';

class CartManagerFs {
  constructor(path) {
    this.path = path;
  }

  // guarda datos en el archivo
  async #save(object) {
    try {
      const objectToStr = JSON.stringify(object, null, 2);
      await fs.promises.writeFile(this.path, objectToStr);
    } catch (ErrorSave) {
      console.error({ ErrorSave });
    }
  }

  // obtiene la lista de los carritos
  async getAllCarts() {
    try {
      const readFile = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(readFile);
    } catch (error) {
      console.log('No existe');
      this.#save([]);
      return [];
    }
  }

  // obtiene un carrito por id
  async getCart(id) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((cart) => cart?.id === id);
      if (cart) return cart;
      console.error('Carrito no encontrado');
      return null;
    } catch (ErrorGetCart) {
      console.error({ ErrorGetCart });
    }
  }

  // agrega un carrito
  async addCart() {
    try {
      const carts = await this.getAllCarts();
      const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: [],
      };
      carts.push(newCart);
      this.#save(carts);
      return newCart;
    } catch (ErrorAddCart) {
      console.error({ ErrorAddCart });
    }
  }

  // agrega un producto a un carrito
  async addProductToCart(id, idProduct) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((cart) => cart?.id === id);
      if (!cart) {
        console.error('Carrito no encontrado');
        return null;
      }
      let productFind = cart.products.find((elem) => elem?.product === idProduct);
      if (!productFind) {
        productFind = { product: idProduct, quantity: 0 };
        cart.products.push(productFind);
        console.log('Producto agregado al carrito');
      }
      productFind.quantity++;
      await this.#save(carts);
      return productFind;
    } catch (ErrorAddProductToCart) {
      console.error({ ErrorAddProductToCart });
    }
  }
}

const rutaCart = path.join(__dirname, './data/carts.json');
export default new CartManagerFs(rutaCart);
