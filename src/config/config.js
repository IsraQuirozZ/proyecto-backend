import dotenv from "dotenv";
import commander from "../utils/commander.js";
import MongoSingleton from "./MongoSingleton.js";

const { mode } = commander.opts();

dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

const config = {
  PORT: process.env.SECRET_JWT || 8080,
  MONGO_URL: process.env.MONGO_LINK || "",
  connectDB: () => MongoSingleton.getInstance(),
};

export default config;
