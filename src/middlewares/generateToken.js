import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import UserDTO from '../dto/User.dto.js'

export default (req, res, next) => {
	console.log('token')
	const token = jwt.sign(
		{ ...new UserDTO(req.body.user) },
		config.SECRET_JWT
	)
	res.cookie('token', token, {
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true
	})
	return next()
}
