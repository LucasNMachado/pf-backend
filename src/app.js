import { addLogger } from "./utils/logger.js";
import express from "express";
import MongoStore from "connect-mongo";
import CartsRouter from "./routes/carts.router.js";
import MessagesRouter from "./routes/messages.router.js";
import ProductsRouter from "./routes/products.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import UsersRouter from "./routes/users.router.js";
import ViewsRouter from "./routes/views.router.js";


import passport from "passport";
import initializePassport from "./config/passport.config.js";
import path from "path";
import homeRouter from "./routes/homeRoutes.js";
import ProductManager from "../src/dao/mongo/productManager.js";
import MessageManager from "../src/dao/mongo/messageManager.js";


import exphbs from "express-handlebars";
import mongoose from "mongoose";
import http from "http";
import session from "express-session";
import __dirname from "./utils/utils.js";
import { Server } from "socket.io";
import config from "./config/config.js";

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';


const __filename = new URL(import.meta.url).pathname;

const app = express();
const port = config.port || 8080;



app.use(addLogger);
const server = http.createServer(app);
const io = new Server(server);

//logger
app.get("/loggerTest", (req, res) => {
  req.logger.debug("Esto es un mensaje de depuración");
  req.logger.info("Esto es un mensaje de información");
  req.logger.warn("Esto es un mensaje de advertencia");
  req.logger.error("Esto es un mensaje de error");
  req.logger.fatal("Esto es un mensaje fatal");

  res.send("Logs generados con éxito en /loggerTest");
});

io.on("connection", async (socket) => {
  console.log("New connection: ", socket.id);

  socket.emit("products", await ProductManager.getProducts());

  socket.on("new-product", async (data) => {
    console.log(data);
    await ProductManager.addProduct(data);
    io.emit("products", await ProductManager.getProducts());
  });

  socket.on("chatMessage", async (data) => {
    const { user, message } = data;
    await MessageManager.createMessage(user, message);
    io.emit("chatMessage", { user, message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
mongoose
  .connect(config.mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// conexión a session de mongo

app.use(
  session({
    secret: "coderhouse",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.sessionDbUrl,
      ttl: 100,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));
app.use("/", ViewsRouter);
app.use("/api/products", ProductsRouter );
app.use("/api/cart", CartsRouter);
app.use("/api/messages", MessagesRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/users", UsersRouter);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));



// swagger

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentacion API Adopme',
          description: 'Documentacion para uso de swagger!!'
      }
  },
  apis: [`./src/docs/**/*.yaml`]
}

  // specs
const specs = swaggerJSDoc(swaggerOptions);
//  API - endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));