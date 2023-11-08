// controllers/productsController.js
import { updateProducts } from "../public/js/socket.js";
import ProductsService from "../services/service.products.js";

class ProductsController {
    constructor() {
        this.productsService = new ProductsService();
    }

    handleResponse(res, message, success = true) {
        if (success) {
            return res.json({ status: "success", payload: message });
        } else {
            return res.status(404).json({ status: "error", message });
        }
    }

    async getProduct(req, res) {
        try {
            const products = await this.productsService.getProducts();
            req.logger.info('Se solicitan todos los productos');
            return res.json({ result: 'success', payload: products });
        } catch (error) {
            req.logger.fatal('No se han podido traer los productos de la base de datos');
            throw new Error('No hay productos disponibles en este momento');
        }
    }

    async getProductById(req, res) {
        try {
            const id = req.params.pid;
            req.logger.debug(`Se solicita el producto con el id: ${id}`);
            const product = await this.productsService.getProductsById(id);
            const message = product ? product : `Producto no encontrado con el id: ${id}`;
            req.logger.info(product ? `Se realizó exitosamente la búsqueda del producto con el id: ${id}` : `No se encontró el producto con el id: ${id}`);
            return this.handleResponse(res, message, !!product);
        } catch (error) {
            req.logger.fatal('No se pudo obtener el producto solicitado');
            return res.status(500).json({ status: "error", message: 'Error al obtener el producto, por favor verifique los datos' });
        }
    }

    async productAdd(req, res) {
        try {
            const newProduct = await this.productsService.addProduct(req);
            const message = newProduct ? { status: "success" } : 'Se produjo un error al crear el producto';
            req.logger.info(newProduct ? `Se ha creado exitosamente el producto: ${newProduct}` : 'No se pudo crear el producto en este momento');
            if (newProduct) {
                updateProducts(req.app.get('io'));
            }
            return this.handleResponse(res, message, !!newProduct);
        } catch (error) {
            req.logger.fatal('Se produjo un error al obtener los datos para crear un nuevo producto');
            return res.status(500).json({ status: "error", message: 'Error al obtener el producto, por favor verifique los datos' });
        }
    }

    async productUpdate(req, res) {
        try {
            const { pid } = req.params;
            const bodyProduct = req.body;
            req.logger.debug(`Se solicita cambiar la siguiente propiedad: ${bodyProduct}, del producto con el id: ${pid}`);
            const productUpdate = await this.productsService.updateProduct(pid, bodyProduct);
            const message = productUpdate ? productUpdate : 'No se encontró el producto con el id especificado';
            req.logger.info(productUpdate ? `Se han actualizado correctamente las propiedades del producto con el id: ${pid}` : `Se produjo un error al intentar cambiar las propiedades del producto con el id: ${pid}`);
            return this.handleResponse(res, message, !!productUpdate);
        } catch (error) {
            req.logger.fatal('Se produjo un error al intentar actualizar el producto');
            return res.status(500).json({ status: "error", message: 'Error al intentar actualizar el producto' });
        }
    }

    async productDelete(req, res) {
        try {
            const { pid } = req.params;
            req.logger.debug(`Se solicita borrar el producto con el id: ${pid}`);
            const productDelete = await this.productsService.deleteProduct(req);
            const message = productDelete ? `${productDelete} eliminado correctamente` : 'No se encontró el producto a eliminar';
            req.logger.info(productDelete ? 'Producto eliminado correctamente' : 'Se produjo un error al intentar eliminar el producto');
            if (productDelete) {
                updateProducts(req.app.get('io'));
            }
            return this.handleResponse(res, message, !!productDelete);
        } catch (error) {
            req.logger.fatal('Error al eliminar el producto, por favor verifique los datos');
            return res.status(500).json({ status: "error", message: 'Error al borrar el producto' });
        }
    }
}

export default ProductsController;
