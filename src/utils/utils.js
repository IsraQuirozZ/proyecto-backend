import { dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
logger.info(__dirname);

export { __filename, __dirname };
