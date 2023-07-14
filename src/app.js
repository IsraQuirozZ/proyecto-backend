import express from "express";
import "dotenv/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { __dirname } from "./utils.js";
import router from "./routes/index.js";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import inicializePassport from './passport-jwt/passport.config.js';
import cookieParser from "cookie-parser";
import UserRouter from "./routes/UserRouter.js";
import SessionRouter from "./routes/SessionRouter.js";
import ProductsRouter from "./routes/ProductsRouter.js";

const server = express();
// Middlewares
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.use(cookieParser())
// server.use(
//   session({
//     secret: process.env.SECRET_SESSION,
//     resave: true,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_LINK,
//       ttl: 7 * 24 * 60 * 60 * 1000,
//     }),
//     rolling: true,
//   })
// );
server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

inicializePassport();
server.use(passport.initialize());
// server.use(passport.session());

server.use('/api/session', SessionRouter.getRouter())
server.use('/api/users', UserRouter.getRouter())
server.use('/api/products', ProductsRouter.getRouter())
server.use("/", router); // Enrutador principal
server.use(errorHandler); // Manejador de errores
server.use(notFoundHandler); // Manejador de rutas inextistetes

export default server;
