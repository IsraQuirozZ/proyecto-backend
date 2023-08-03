import MainRouter from "./Router.js";
import UserController from "../controllers/UserController.js";

const { getUsers, getUser, createUser, updateUser, deleteUser } =
  UserController;

class UserRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getUsers); // ADMIN
    this.get("/:uid", ["PUBLIC"], getUser); // USER && ADMIN
    // this.post('/login', ['USER'])
    this.post("/", ["PUBLIC"], createUser); // PUBLIC (tiene que usarse en el register, tiene que tener middlewares)
    this.put("/:uid", ["PUBLIC"], updateUser); // USER (Esto no se utilizará en nuestra aplicación)
    this.delete("/:uid", ["PUBLIC"], deleteUser);
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

export default new UserRouter();
