import MainRouter from "./Router.js";
import passportCall from "../middlewares/passportCall.js";
import authJwt from "../passport-jwt/authJwt.js";
import password_validator from "../middlewares/passwordValidator.js";
import registerValidator from "../middlewares/registerValidator.js";
import createhash from "../middlewares/createhash.js";
import UserController from "../controllers/UserController.js";
import passport from "passport";
import generateToken from "../middlewares/generateToken.js";

const { register, login, logout, current } = UserController;

class SessionRouter extends MainRouter {
  init() {
    this.post("/login", ["PUBLIC"], login);

    this.post(
      "/register",
      ["PUBLIC"],
      registerValidator,
      password_validator,
      createhash,
      passportCall("register"),
      register
    );

    this.get("/logout", ["USER", "ADMIN"], passportCall("jwt"), logout);

    this.get(
      "/current",
      ["USER", "ADMIN"],
      passportCall("jwt"),
      authJwt("user"),
      current
    );

    this.get('/google', ['PUBLIC'],
    passport.authenticate('google', 
    { scope: ['email', 'profile'] })
    )

    this.get('/google/callback', ['PUBLIC'], passport.authenticate('google', {
      successRedirect: '/google/success', 
      failureRedirect: '/google/failure'
    }))
  }
}

export default new SessionRouter();
