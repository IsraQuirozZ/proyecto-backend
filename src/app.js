import express from "express";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

import { engine } from 'express-handlebars'
import { __dirname } from "./utils.js";


const server = express();

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);


server.engine('handlebars', engine())       // Motor de plantillas
server.set('view engine', 'handlebars')     // Configuración del motor
server.set('views', __dirname + '/views')  // Ubicación de las plantillas
server.use('/public', express.static('public'))
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/", router); // Enrutador principal
server.use(errorHandler); // Manejador de errores
server.use(notFoundHandler); // Manejador de rutas inextistetes

server.listen(PORT, ready);