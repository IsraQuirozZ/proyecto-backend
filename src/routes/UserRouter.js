
import Router from "./Router.js";
import UserController from "../controllers/UserController.js";

const { getUser } = UserController

class UserRouter extends Router {
	init() {
		this.get('/:uid', ['PUBLIC'], getUser)
		// this.post('/login', ['USER'])
		// this.post('/current', ['ADMIN'], async (req, res) => {
		// 	try {
		// 		let user = {}
		// 		res.sendSuccess('get post')
		// 	} catch (error) {
		// 		res.sendServerError(error)
		// 	}
		// })
	}
}

export default new UserRouter()