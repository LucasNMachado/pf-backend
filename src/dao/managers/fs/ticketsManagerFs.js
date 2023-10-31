import fs from 'fs/promises';
import path from 'path';

class TicketManagerFs {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // guarda los tickets en el json
  async #save(tickets) {
    try {
      const ticketsStr = JSON.stringify(tickets, null, 2);
      await fs.writeFile(this.filePath, ticketsStr);
    } catch (error) {
      console.error({ error });
    }
  }

  // genera id para los tickets
  generateIdTicket(tickets) {
    return tickets.length > 0 ? tickets[tickets.length - 1].id + 1 : 1;
  }

  // genera el código para los tickets
  generateCode(tickets) {
    return tickets.length > 0 ? tickets[tickets.length - 1].code + 1 : 1;
  }

  // crea un nuevo ticket
  async createTicket(bodyTicket) {
    try {
      const tickets = await this.getTickets();
      const newTicket = {
        id: this.generateIdTicket(tickets),
        code: this.generateCode(tickets),
        ...bodyTicket
      };
      tickets.push(newTicket);
      await this.#save(tickets);
      return newTicket;
    } catch (error) {
      console.error({ error });
    }
  }

  // obtiene la lista de tickets
  async getTickets() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // si el archivo no existe, lo crea y devuelve una lista vacía
      console.log('El archivo de tickets no existe');
      await this.#save([]);
      return [];
    }
  }

  // obtiene un ticket por email
  async getTicketByEmail(email) {
    try {
      const tickets = await this.getTickets();
      const ticket = tickets.find((t) => t.email === email);
      return ticket || null;
    } catch (error) {
      console.error({ error });
    }
  }
}


const ticketFilePath = path.join(__dirname, './data/tickets.json');

export default new TicketManagerFs(ticketFilePath);
