import MainRouter from "./Router.js";
import passportCall from "../middlewares/passportCall.js";
import authJwt from "../passport-jwt/authJwt.js";
import password_validator from "../middlewares/passwordValidator.js";
import validator from "../middlewares/registerValidator.js";
import createhash from "../middlewares/createhash.js";
import UserController from "../controllers/UserController.js";

const { register, login, logout, current } = UserController

class SessionRouter extends MainRouter {
  init() {
    this.post("/login", ["PUBLIC"], login);

    this.post(
      "/register",
      ["PUBLIC"],
      validator,
      password_validator,
      createhash,
      passportCall("register"),
      register
    );

    this.get("/logout", ["USER", "ADMIN"], passportCall("jwt"), logout
    );
    
    this.get(
      "/current",
      ["PUBLIC"],
      passportCall("jwt"),
      authJwt("user"),
      current
    );
  }
}

export default new SessionRouter();
