
import nodemailer from 'nodemailer';
import config from '../../config/config.js';

class MailingService {
    constructor() {
        this.client = nodemailer.createTransport({
            service: config.mailing.service,
            port: config.mailing.port,
            auth: {
                user: config.mailing.auth.user,
                pass: config.mailing.auth.pass
            }
        });
    }

    async sendSimpleMail({ from, to, subject, html, attachments = [] }) {
        try {
            const result = await this.client.sendMail({
                from,
                to,
                subject,
                html,
                attachments
            });
            console.log(result);
            return result;
        } catch (error) {
            console.error(`Error sending email: ${error}`);
            throw error;
        }
    }
}

export default MailingService;
