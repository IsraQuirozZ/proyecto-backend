import MainRouter from "./Router.js";
import UserController from "../controllers/UserController.js";
import uploader from "../utils/uploader.js";
// import passportCall from "../middlewares/passportCall.js";

const { getUsers, getUser, getUserByEmail, updateUser, deleteUser } =
  UserController;

class UserRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getUsers);
    this.get("/:uid", ["USER", "ADMIN"], getUser);
    this.post("/", ["ADMIN"], getUserByEmail);
    this.put("/:uid", ["USER", "ADMIN"], updateUser); // Poder cambiar contraseña -->
    this.delete("/:uid", ["ADMIN"], deleteUser); // y USER para borrar cuenta -->
    // this.post("/:uid/documents", ["USER"], uploader.array('documents', 5), subirDocs, **req.files**); // Utilizar multer para subir docs
    // this.put("/premium/:uid", ["USER", "ADMIN"], cambiarRol);
  }
}

export default new UserRouter();
