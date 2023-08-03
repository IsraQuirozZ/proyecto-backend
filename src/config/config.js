import dotenv from "dotenv";
import commander from "../utils/commander.js";
import MongoSingleton from "./singletonMongoConnect.js";

const { mode } = commander.opts();

dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

export default {
	SECRET_JWT: process.env.SECRET_JWT || '',
	PORT: process.env.PORT || 8080,
	MONGO_LINK: process.env.MONGO_LINK|| '',
	PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
	GMAIL_USER_APP: process.env.GMAIL_USER_APP || '',
	GMAIL_PASS_APP: process.env.GMAIL_PASS_APP || '',
	connectDB: async () => MongoSingleton.getInstance()
}
