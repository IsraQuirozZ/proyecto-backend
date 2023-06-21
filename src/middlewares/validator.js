import User from '../dao/models/User.js'

const validator = async (req, res, next) => {

	let { name, email, password } = req.body

	if (!name || !email || !password) {
		return res.status(400).json({
			success: false,
			response: "All data required",
		});
	} else if (!email.match(/^[^\s@]+@[^\s@]+.[^\s@]+$/)){
		return res.status(400).json({
			success: false,
			response: "Invalid email",
		});
	}

	let userExist = await User.findOne({email})
	console.log(userExist)

	next()

};

export default validator;
