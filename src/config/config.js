import { connect } from "mongoose"
import dotenv from 'dotenv'
import commander from "../utils/commander.js"

const { mode } = commander.opts()

dotenv.config({
	path: mode === 'development' ? './.env.development' : './.env.production'
})

export default {
	SECRET_JWT: process.env.SECRET_JWT || '',
	PORT: process.env.PORT || 8000,
	MONGO_LINK: process.env.MONGO_LINK|| '',
	connectDB: async () =>{
		try {
			await connect(process.env.MONGO_LINK)
			console.log('Connected DB')
		} catch (error) {
			console.log('Connection error')
		}
	}
}