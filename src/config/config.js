import dotenv from 'dotenv'
import commander from "../utils/commander.js"
import MongoSingleton from "./singletonMongoConnect.js"

const { mode } = commander.opts()

dotenv.config({
	path: mode === 'development' ? './.env.development' : './.env.production'
})

export default {
	SECRET_JWT: process.env.SECRET_JWT || '',
	PORT: process.env.PORT || 8080,
	MONGO_LINK: process.env.MONGO_LINK|| '',
	connectDB: async () => MongoSingleton.getInstance()
}