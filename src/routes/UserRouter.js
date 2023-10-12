import MainRouter from "./Router.js";
import UserController from "../controllers/UserController.js";

const {
  getUsers,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  deleteUsers,
} = UserController;

class UserRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getUsers);
    this.get("/:uid", ["USER", "ADMIN"], getUser);
    this.post("/", ["ADMIN"], getUserByEmail);
    this.put("/:uid", ["USER", "ADMIN"], updateUser);
    this.delete("/:uid", ["ADMIN"], deleteUser);
    this.delete("/", ["ADMIN"], deleteUsers);
  }
}

export default new UserRouter();
