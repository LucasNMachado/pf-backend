import ticketsModel from "../../models/ticketsModel.js";

class TicketsManager {
  constructor() {
    this.ticketsModel = ticketsModel;
  }

  // crea un ticket
  async createTicket(bodyTicket) {
    try {
      const ticket = await this.ticketsModel.create(bodyTicket);
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      return null;
    }
  }

  // obtiene todos los tickets
  async getTickets() {
    try {
      const tickets = await this.ticketsModel.find();
      return tickets;
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      return [];
    }
  }

  // obtiene un ticket por el email
  async getTicketByEmail(email) {
    try {
      const ticket = await this.ticketsModel.findOne({ email });
      return ticket;
    } catch (error) {
      console.error("Error al obtener el ticket por email:", error);
      return null;
    }
  }
}

export default TicketsManager;
