import productsModel from "../../models/productsModel";


class ProductManager {
  constructor() {
    this.productsModel = productsModel;
  }
//agrega todos los productos
  async getProducts() {
    try {
      const products = await this.productsModel.find();
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return [];
    }
  }
//agrega producto por id
  async getProductById(id) {
    try {
      const product = await this.productsModel.findById(id);
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null;
    }
  }
//agrega nuevo producto
  async addProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  }) {
    //verifica los campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      console.error("Faltan campos obligatorios");
      return null;
    }

    thumbnails.push("https://picsum.photos/536/354?image=");
    thumbnails.push("https://picsum.photos/536/354?image=");
    thumbnails.push("https://picsum.photos/536/354?image=");
// crea nuevos productos con datos proporcionados
  try {
      const newProduct = new this.productsModel({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });

      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return null;
    }
  }
//actualiza el producto su id con los nuevos datos
  async updateProduct(id, object) {
    try {
      const updatedProduct = await this.productsModel.findByIdAndUpdate(
        id,
        object,
        { new: true }
      );
      if (updatedProduct) {
        return updatedProduct;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return null;
    }
  }
// elimina un producto por id
  async deleteProduct(id) {
    try {
      const deletedProduct = await this.productsModel.findByIdAndDelete(id);
      if (deletedProduct) {
        return deletedProduct;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return null;
    }
  }
}

export default ProductManager;