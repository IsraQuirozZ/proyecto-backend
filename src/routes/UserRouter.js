import Router from "./Router.js";

class UserRouter extends Router {
	init() {
		this.get('/', ['PUBLIC'], (req, res) => {
			try {
				res.sendSuccess('get user')
			} catch (error) {
				res.sendServerError(error)
			}
		})
		// this.post('/login', ['USER'])
		this.post('/current', ['ADMIN'], async (req, res) => {
			try {
				let user = {}
				res.sendSuccess('get post')
			} catch (error) {
				res.sendServerError(error)
			}
		})
	}
}

export default new UserRouter()