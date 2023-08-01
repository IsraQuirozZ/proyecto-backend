// import dotenv from "dotenv";
import { connect } from "mongoose";
import MongoSingleton from "./MongoSingleton.js";

const config = {
  PORT: process.env.SECRET_JWT || 8080,
  MONGO_URL: process.env.MONGO_LINK || "",
  connectDB: () => MongoSingleton.getInstance(),
};

export default config;
