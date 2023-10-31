import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoDbUrl: process.env.MONGO,
  sessionDbUrl: process.env.SESSION_DB_URL,

};




