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
import { addLogger, logger } from "./config/logger.js";
import session from "express-session";

const server = express();
config.connectDB();
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.use(cookieParser());
server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.listen(config.PORT, (error) => {
  if (error) logger.error(error.message);
  logger.info("Server listening on port " + config.PORT);
});

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

server.use(addLogger);

server.use("/", router);

server.use(errorHandler); // Manejador de errores
server.use(notFoundHandler); // Manejador de rutas inexistentes

export default server;
