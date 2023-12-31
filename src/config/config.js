import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  mailing: {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    }
  },
  nodeEnv: process.env.NODE_ENV,
  mongoDbUrl: process.env.MONGO,
  sessionDbUrl: process.env.SESSION_DB_URL,
  
};

export default config;
