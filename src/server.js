import express from "express";
import "dotenv/config.js";
import errorHandler from "./middlewares/error/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { __dirname } from "./utils/utils.js";
import router from "./routes/index.js";
import cors from "cors";
import passport from "passport";
import inicializePassport from "./passport-jwt/passport.config.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger, logger } from "./utils/logger.js";
import session from "express-session";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import swaggerOptions from "./config/swagger.config.js";

const server = express();
config.connectDB();

server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);
server.use(express.urlencoded({ extended: true }));
server.use(addLogger);
const specs = swaggerJsDoc(swaggerOptions);
server.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
server.use("/public", express.static("public"));

inicializePassport();
server.use(passport.initialize());

server.use(
  session({
    secret: config.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

server.use("/", router);

server.use(errorHandler);
server.use(notFoundHandler);

export const httpServer = () =>
  server.listen(config.PORT, (error) => {
    if (error) logger.error(error.message);
    logger.info("Server listening on port " + config.PORT);
  });

export default server;
