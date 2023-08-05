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
    this.get("/", ["ADMIN"], getUsers);
    this.get("/:uid", ["ADMIN"], getUser);
    this.post("/", ["ADMIN"], getUserByEmail);
    // this.post("/", ["PUBLIC"], createUser); // No se usa ya que usamos una strategy "register" de passport
    // this.post("/register", ["PUBLIC"], passportCall("register"),register);
    // this.post("/login", ["PUBLIC"], getLoginUser);
    // this.post("/logout", ["USER", "ADMIN"], passportCall("jwt"), logout)
    this.put("/:uid", ["USER", "ADMIN"], updateUser); // Más adelante poder cambiar contraseña...
    this.delete("/:uid", ["ADMIN"], deleteUser);
  }
}

export default new UserRouter();
