import MainRouter from "./Router.js";
import jwt from "jsonwebtoken";
import passportCall from '../middlewares/passportCall.js'
import User from "../dao/models/User.js";
import authJwt from "../passport-jwt/authJwt.js";
import password_validator from "../middlewares/passwordValidator.js";
import validator from "../middlewares/registerValidator.js";
import createhash from "../middlewares/createhash.js";

class SessionRouter extends MainRouter {
	init() {
		this.post('/login', ['PUBLIC'], async (req, res) => {
			try {
				if (req.cookies.token) {
					return res.sendUserError('You are already logged in')
				}
				let { email, role } = await User.findOne({ email: req.body.email })
				let user = {email, role}
				let token = jwt.sign(user, process.env.SECRET_JWT)
				res.cookie('token', token, {
					maxAge: 60 * 60 * 24 * 7,
					httpOnly: true
				})
				res.sendSuccess({ token })
			} catch (error) {
				res.sendServerError(error)
			}
		})

		this.post('/register', ['PUBLIC'],validator, password_validator, createhash, passportCall('register'), (req, res) => {
			return res.sendSuccess('User registred successfully')
		})

		this.get('/logout', ['USER', 'ADMIN'], passportCall('jwt'), (req, res) => {
			try {
				return res.status(200).clearCookie('token').sendSuccess('User signed out')
			} catch (error) {
				res.sendServerError(error)
			}
		})
		this.get('/current', ['PUBLIC'], passportCall('jwt'), authJwt('user'), (req, res) => {
			res.sendSuccess(req.cookies.token)
		})
	}
}

export default new SessionRouter()