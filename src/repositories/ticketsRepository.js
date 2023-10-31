import DaoFactory from '../dao/factory';

const daoFactory = DaoFactory.getDao();
const ticketsManager = daoFactory.ticketsManager;

class TicketsRepository {
  constructor() {
    this.ticketsManager = ticketsManager;
  }

  async createTicket(bodyTicket) {
    return this.ticketsManager.createTicket(bodyTicket);
  }

  async getTickets() {
    return this.ticketsManager.getTickets();
  }

  async getTicketByEmail(email) {
    return this.ticketsManager.getTicketByEmail(email);
  }
}

export default TicketsRepository;
