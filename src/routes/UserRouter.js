
import MainRouter from "./Router.js";
import UserController from "../controllers/UserController.js";
// import passportCall from "../middlewares/passportCall.js";

const {
  getUsers,
  getUser,
  getUserByEmail,
  // getLoginUser,
  createUser,
  updateUser,
  deleteUser,
} = UserController;

class UserRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getUsers); // ADMIN
    this.get("/:uid", ["PUBLIC"], getUser); // USER && ADMIN
    this.post("/", ["PUBLIC"], getUserByEmail); // USER && ADMIN
    // this.post("/register", ["PUBLIC"], passportCall("register"));
    // this.post("/login", ["PUBLIC"], getLoginUser);
    this.post("/", ["PUBLIC"], createUser); // PUBLIC (tiene que usarse en el register, tiene que tener middlewares)
    this.put("/:uid", ["PUBLIC"], updateUser); // USER (Esto no se utilizará en nuestra aplicación)
    this.delete("/:uid", ["PUBLIC"], deleteUser);
  }
}

export default new UserRouter();
