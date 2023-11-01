import ProductsRepository from "../repositories/ProductsRepository.js";
import CustomError from "../errors/customError.js";
import EErrors from "../errors/enum.js";
import { ProductsErrorInfo } from "../errors/info.js";
import UsersService from "../services/usersService.js";
import MailingService from "../utils/mail/mailing.js";

const mailingService = new MailingService();
const userService = new UsersService();

class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async getProducts(limit, page, sort, category) {
    try {
      const products = await this.productsRepository.getProducts(
        limit,
        page,
        sort,
        category
      );
      return products;
    } catch (error) {
      throw new Error("Error al obtener productos: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productsRepository.getProductById(id);
      if (!product) {
        throw new Error(
          `No se encontró un producto con este ID: (${id}), verifica los datos e intenta nuevamente`
        );
      }
      return product;
    } catch (error) {
      throw new Error(
        "Error al leer los datos del producto desde el repositorio"
      );
    }
  }

  async addProduct(req) {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        throw CustomError.createError({
          name: "Error de Creación de Producto",
          cause: ProductsErrorInfo({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
          }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: "Error al intentar crear un nuevo producto",
        });
      }

      const user = await userService.getUserByEmail(req.user.email);

      if (!user) {
        user._id = "admin";
      }

      const productData = {
        ...req.body,
        owner: user._id,
      };

      const newProduct = await this.productsRepository.createProduct(
        productData
      );
      return newProduct;
    } catch (error) {
      throw new Error(`Error al crear un nuevo producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateBodyProduct) {
    try {
      const existingProduct = await this.productsRepository.getProductById(id);

      if (!existingProduct) {
        throw new Error(`El producto que deseas actualizar no existe`);
      }

      const user = await userService.getUserById(existingProduct.owner);

      if (user.role === "admin" || existingProduct.owner === "admin") {
        const updatedProduct = await this.productsRepository.updateProduct(
          id,
          updateBodyProduct
        );
        return updatedProduct;
      } else if (
        user._id === existingProduct.owner &&
        user.role === "premium"
      ) {
        const updatedProduct = await this.productsRepository.updateProduct(
          id,
          updateBodyProduct
        );
        return updatedProduct;
      } else {
        throw new Error("El rol no permite la acción que deseas realizar");
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(req) {
    try {
      const id = req.params.pid;
      const existingProduct = await this.productsRepository.getProductById(id);

      if (!existingProduct) {
        throw new Error("El producto que deseas eliminar no existe");
      }

      const requestingUser = req.user;

      if (requestingUser.role === "admin") {
        const user = await userService.getUserById(existingProduct.owner);

        if (user.role === "premium") {
          const sendMail = await mailingService.createEmailOfDeleteProduct(
            user,
            existingProduct
          );

          if (sendMail) {
            const productDelete = await this.productsRepository.deleteProduct(
              id
            );
            return productDelete;
          }
        } else {
          const productDelete = await this.productsRepository.deleteProduct(id);
          return productDelete;
        }
      } else if (requestingUser.role === "premium") {
        if (requestingUser._id === existingProduct.owner) {
          const productDelete = await this.productsRepository.deleteProduct(id);
          return productDelete;
        } else {
          throw new Error("El rol no permite la acción que deseas realizar");
        }
      } else {
        throw new Error("El rol no permite la acción que deseas realizar");
      }
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductsService;
