import MessagesService from '../services/messagesService.js';

const messagesService = new MessagesService();

export const getMessages = async (req, res) => {
    try {
        const messages = await messagesService.getMessages();

        if (messages) {
            req.logger.info('Se solicitan los mensajes');
            res.status(200).json({ result: 'success', messages });
        } else {
            throw new Error('Error retrieving messages');
        }
    } catch (error) {
        req.logger.fatal('No se pueden mostrar los mensajes');
        res.status(500).json({ error: 'An error occurred while retrieving messages', message: error.message });
    }
};

export const addMessage = async (req, res) => {
    try {
        const { sender, content } = req.body;
        req.logger.debug(`Se solicita guardar el mensaje: ${content}, del remitente: ${sender}`);
        const newMessage = await messagesService.addMessage(sender, content);

        if (newMessage) {
            req.logger.info(`Se guardan exitosamente los mensajes del remitente: ${sender}`);
            res.status(201).json({ result: 'success', message: newMessage });
        } else {
            throw new Error('Error creating a new message');
        }
    } catch (error) {
        req.logger.fatal('Se produce un error al guardar los mensajes de chat');
        res.status(500).json({ error: 'An error occurred while creating a message', message: error.message });
    }
};
