
import MyRouter from './router.js';
import ProductsController from './controllers/productsController.js';

export default class ProductsRouter extends MyRouter {
    init() {
        
        this.get('/', ['PUBLIC'], ProductsController.getProduct);
        this.get('/:pid', ['PUBLIC'], ProductsController.getProductById);
        this.post('/', ['PUBLIC'], ProductsController.productAdd);
        this.put('/:pid', ['PUBLIC'], ProductsController.productUpdate);
        this.delete('/:pid', ['PUBLIC'], ProductsController.productDelete);
    }
}
