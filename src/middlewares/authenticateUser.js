import User from "../dao/models/User.js"
import jwt from "jsonwebtoken"

export default (req, res, next) => {
	const auth = req.headers.authorization
	if (!auth) {
		return res.status(401).json({
			success: false,
			response: 'auth error'
		})
	}
	const token = auth.split(' ')[1]
	jwt.verify(
		token,
		process.env.SECRET,
		async (error, credentials) => {
			if (error) {
				return res.status(401).json({
					success: false,
					response: 'auth error'
				})
			}
			let user = await User.findOne({ email: credentials.email })
			req.user = user
			return next()
		}
	)
}
