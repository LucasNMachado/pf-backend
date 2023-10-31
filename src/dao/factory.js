import CartManagerFs from "./managers/fs/cartsManagerFs.js";
import CartManager from "./managers/mongo/cartsManager.js";
import MessagesManagerFs from "./managers/fs/messagesManagerFs.js";
import MessagesManager from "./managers/mongo/messagesManager.js";
import ProductManagerFs from "./managers/fs/productsManagerFs.js";
import ProductManager from "./managers/mongo/productsManager.js";
import TicketsManagerFs from "./managers/fs/ticketsManagerFs.js";
import TicketsManager from "./managers/mongo/ticketsManager.js";
import UsersManagerFs from "./managers/fs/usersManagerFs.js";
import UsersManager from "./managers/mongo/usersManager.js";

export default class DaoFactory {
    constructor() {}

    static getDao() {
        const dao = process.env.PERSISTENCE || 'mongo';
        switch (dao) {
            case 'mongo':
                return {
                    cartManager: new CartManager(),
                    productManager: new ProductManager(),
                    messagesManager: new MessagesManager(),
                    ticketsManager: new TicketsManager(),
                    usersManager: new UsersManager(),
                };
            case 'fs':
                return {
                    cartManager: new CartManagerFs(),
                    productManager: new ProductManagerFs(),
                    messagesManager: new MessagesManagerFs(),
                    ticketsManager: new TicketsManagerFs(),
                    usersManager: new UsersManagerFs(),
                };
            default:
                return {
                    cartManager: new CartManager(),
                    productManager: new ProductManager(),
                    messagesManager: new MessagesManager(),
                    ticketsManager: new TicketsManager(),
                    usersManager: new UsersManager(),
                };
        }
    }
}
