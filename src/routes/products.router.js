
import Router from './router.js';
import ProductsController from './controllers/productsController.js';

export default class ProductsRouter extends Router {
    init() {
        const productsController = new ProductsController();

        this.get('/', ['PUBLIC'], productsController.getProduct);
        this.get('/:pid', ['PUBLIC'], productsController.getProductById);
        this.post('/', ['PUBLIC'], productsController.productAdd);
        this.put('/:pid', ['PUBLIC'], productsController.productUpdate);
        this.delete('/:pid', ['PUBLIC'], productsController.productDelete);
    }
}
