import { Router } from "express";
import validator from "../../middlewares/validator.js";
import passwordValidator from "../../middlewares/passwordValidator.js";
import isPasswordValid from "../../middlewares/isPasswordValid.js";
import createHash from "../../middlewares/createhash.js";
import User from "../../dao/models/User.js";
import Cart from "../../dao/models/Cart.js";
import passport from "passport";

const router = Router();

// REGISTER
router.post(
  "/register",
  validator,
  passwordValidator,
  createHash,
  passport.authenticate("register", {
    failureRedirect: "/api/auth/fail-register",
  }),
  (req, res) => {
    return res.status(201).json({
      success: true,
      response: "User created",
    });
  }
);

router.get("/fail-register", (req, res) => {
  return res.status(400).json({
    success: false,
    response: "auth error",
  });
});

// LOGIN
router.post(
  "/login",
  // passwordValidator,
  passport.authenticate("login", { failureRedirect: "api/auth,fail-login" }),
  isPasswordValid,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!req.session.email) {
        req.session.email = email;
        req.session.role = req.user.role;
        return res.status(200).json({
          success: true,
          message: "User login",
          email: req.session.email,
          role: req.session.role,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You already have an open session",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/fail-login", (req, res) => {
  return res.status(400).json({
    success: false,
    response: "auth error",
  });
});

// LOGOUT
router.post("/logout", async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.session.email });
    if (user) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error logging out",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "User logged out",
          });
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No session started",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET SESSION
router.get("/session", (req, res) => {
  return res.json({
    email: req.session.email,
    role: req.session.role,
  });
});

export default router;
