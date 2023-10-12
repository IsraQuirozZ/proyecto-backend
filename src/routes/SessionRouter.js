import MainRouter from "./Router.js";
import passportCall from "../middlewares/passportCall.js";
import password_validator from "../middlewares/passwordValidator.js";
import registerValidator from "../middlewares/registerValidator.js";
import createHash from "../middlewares/createHash.js";
import UserController from "../controllers/UserController.js";
import passport from "passport";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const {
  register,
  login,
  logout,
  current,
  forgotPassword,
  resetPassword,
  confirmPassword,
} = UserController;

class SessionRouter extends MainRouter {
  init() {
    this.post("/login", ["PUBLIC"], isLoggedIn, login);

    this.post(
      "/register",
      ["PUBLIC"],
      isLoggedIn,
      registerValidator,
      password_validator,
      createHash,
      passportCall("register"),
      register
    );

    this.delete(
      "/logout",
      ["PREMIUM", "USER", "ADMIN"],
      passportCall("jwt"),
      logout
    );

    this.get("/current", ["USER", "ADMIN"], current);

    this.get(
      "/google",
      ["PUBLIC"],
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    this.get(
      "/google/callback",
      ["PUBLIC"],
      passport.authenticate("google", {
        failureRedirect: "/google/failure",
      }),
      (req, res) => {
        console.log(req.user);
        return res.redirect("/google/success");
      }
    );

    this.post("/forgot-password", ["PUBLIC"], isLoggedIn, forgotPassword);

    this.get("/reset-password", ["PUBLIC"], isLoggedIn, resetPassword);

    this.post(
      "/confirm-password",
      ["PUBLIC"],
      isLoggedIn,
      password_validator,
      confirmPassword
    );
  }
}

export default new SessionRouter();
