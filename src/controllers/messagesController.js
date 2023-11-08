import MessagesService from '../services/messagesService.js';

const messagesService = new MessagesService();

export const getMessages = async (req, res) => {
    try {
        const messages = await messagesService.getMessages();

        if (messages) {
            req.logger.info('Se solicitan los mensajes');
            res.status(200).json({ result: 'success', messages });
        } else {
            throw new Error('Error al mostrar los mensajes');
        }
    } catch (error) {
        req.logger.fatal('No se pueden mostrar los mensajes');
        res.status(500).json({ error: 'Error al mostrar los mensajes', message: error.message });
    }
};

export const addMessage = async (req, res) => {
    try {
        const { sender, content } = req.body;
        req.logger.debug(`Solicita para guardar el mensaje: ${content}, del remitente: ${sender}`);
        const newMessage = await messagesService.addMessage(sender, content);

        if (newMessage) {
            req.logger.info(`Mensajes exitosamente guardados: ${sender}`);
            res.status(201).json({ result: 'success', message: newMessage });
        } else {
            throw new Error('Error creating a new message');
        }
    } catch (error) {
        req.logger.fatal('Error para guardar los mensajes');
        res.status(500).json({ error: 'Error al crear los mensajes', message: error.message });
    }
};
