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

const server = express();
config.connectDB();
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

server.use(cookieParser());
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

server.listen(config.PORT, () =>
  console.log("Server listening on port " + config.PORT)
);

inicializePassport();
server.use(passport.initialize());
// server.use(passport.session());

server.use('/', router)

server.use(errorHandler); // Manejador de errores
server.use(notFoundHandler); // Manejador de rutas inexistentes

export default server;
