import { userService } from "../service/index.js"

class UserController {
	getUser = async (req, res) => {
		try {
			let uid = req.params.uid
			let user = await userService.getUser(uid)
			user ? res.sendSuccess({ user }) : res.sendUserError(404, { error: 'Not found' })
		} catch (error) {
			res.sendServerError(error)
		}
	}
}

export default new UserController()