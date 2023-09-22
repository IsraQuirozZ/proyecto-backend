import { __dirname } from "../utils/utils.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1", // Conjunto de reglas
    info: {
      title: "DecorateMe App Documentation",
      description: "API designed for home decoration sales.",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

export default swaggerOptions;
