import DaoFactory from '../dao/factory';

const daoFactory = DaoFactory.getDao();
const productManager = daoFactory.productManager;

class ProductsRepository {
  constructor() {
    this.productManager = productManager;
  }

  async getProducts(limit, page, sort, category) {
    return this.productManager.getProducts(limit, page, sort, category);
  }

  async getProductById(id) {
    return this.productManager.getProductById(id);
  }

  async createProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  }) {
    return this.productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
  }

  async updateProduct(id, updateBodyProduct) {
    return this.productManager.updateProduct(id, updateBodyProduct);
  }

  async deleteProduct(id) {
    return this.productManager.deleteProduct(id);
  }
}

export default ProductsRepository;

