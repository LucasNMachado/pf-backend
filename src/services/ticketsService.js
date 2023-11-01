import TicketsRepository from './TicketsRepository';
import CustomError from './CustomError';
import EErrors from './enums';
import { TicketsErrorInfo } from './info';
import CartsService from '../services/cartsService.js';

class TicketService {
  constructor() {
    this.ticketsRepository = new TicketsRepository();
    this.cartsService = new CartsService();
  }

  async create(bodyTicket) {
    try {
      const user = bodyTicket;
      const cart = await this.cartsService.getCartById(user.cart);
      const amount = cart.total;
      const code = this.generateRandomNumber();
      const purchase_datetime = new Date();

      if (!code || !purchase_datetime || !amount || !user.email) {
        console.log('error');
        CustomError.createError({
          name: 'Ticket Creation Error',
          cause: TicketsErrorInfo({ code, purchase_datetime, amount, purchaser: user.email }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: 'Error creating a new Ticket',
        });
      }

      const newTicket = {
        code: code,
        purchase_datetime: purchase_datetime,
        amount: amount,
        purchaser: user.email,
      };

      const dataTicket = await this.ticketsRepository.createTicket(newTicket);
      const prodSinStock = [];

      const products = cart.products;
      for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        if (prod.stock === 0) {
          prodSinStock.push(prod);
        }
      }

      if (prodSinStock.length > 0) {
        await this.cartsService.emptyCart(cart._id);
        await this.cartsService.insertArrayProductsIntoCart(cart._id, prodSinStock);
      } else {
        await this.cartsService.emptyCart(cart._id);
      }

      return dataTicket;
    } catch (error) {
      throw new Error('An error occurred while creating the Ticket');
    }
  }

  async get() {
    try {
      const data = await this.ticketsRepository.getTickets();
      return data;
    } catch (error) {
      throw new Error('An error occurred while retrieving all the tickets');
    }
  }

  async getByEmail(email) {
    try {
      if (!email) {
        console.log('error');
        CustomError.createError({
          name: 'Ticket Retrieval Error',
          cause: TicketsErrorInfo({ purchaser: email }),
          code: EErrors.INVALID_TYPES_ERROR,
          message: 'Error retrieving a Ticket',
        });
      }

      const data = await this.ticketsRepository.getTicketByEmail(email);
      return data;
    } catch (error) {
      throw new Error(`An error occurred while retrieving the Ticket for the user: ${email}`);
    }
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 100000) + 1;
  }
}

export default TicketService;
