import express from "express";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import handlebars from 'express-handlebars';
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import CartsRouter from "./routes/carts.router.js";
import MessagesRouter from "./routes/messages.router.js";
import ProductsRouter from "./routes/products.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import UsersRouter from "./routes/users.router.js";
import ViewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { addLogger } from "./utils/logger.js";
import __dirname from "./utils/utils.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';


const app = express();
const port = config.port || 8080;
app.use(addLogger);

const server = http.createServer(app);
const io = new Server(server);


io.on("connection", async (socket) => {
  console.log("New connection: ", socket.id);

  app.engine("handlebars", handlebars.engine);
  app.set("view engine", "handlebars");
  app.set('views', __dirname + '/views');
  app.use("/public", express.static(__dirname, "/public"));

  // express
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

// session mongo

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

// passport

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

//logger

app.get("/loggerTest", (req, res) => {
  req.logger.debug("Esto es un mensaje de depuración");
  req.logger.info("Esto es un mensaje de información");
  req.logger.warn("Esto es un mensaje de advertencia");
  req.logger.error("Esto es un mensaje de error");
  req.logger.fatal("Esto es un mensaje fatal");

  res.send("Logs generados con éxito en /loggerTest");
});


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