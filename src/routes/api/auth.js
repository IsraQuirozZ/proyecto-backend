import { Router } from "express";
import registerValidator from "../../middlewares/registerValidator.js";
import passwordValidator from "../../middlewares/passwordValidator.js";
import isPasswordValid from "../../middlewares/isPasswordValid.js";
import createHash from "../../middlewares/createhash.js";
import generateToken from "../../middlewares/generateToken.js";
// import authenticateUser from "../../middlewares/authenticateUser.js";
import User from "../../dao/models/User.js";
import passport from "passport";

const router = Router();

// REGISTER
router.post(
  "/register",
  registerValidator,
  passwordValidator,
  createHash,
  generateToken,
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
    response: "Auth error",
  });
});

// LOGIN
router.post(
  "/login",
  isPasswordValid,
  generateToken,
  // authenticateUser,
  passport.authenticate("login", { failureRedirect: "api/auth/fail-login" }),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!req.session.email) {
        req.session.email = email;
        req.session.role = req.user.role;
        return res.status(200).json({
          success: true,
          message: "User logged",
          email: req.session.email,
          role: req.session.role,
          token: req.token
          user: { email: req.session.email, role: req.user.role },
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
    response: "Auth error",
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
            response: "Error logging out",
          });
        } else {
          return res.status(200).json({
            success: true,
            response: "User logged out",
          });
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        response: "No session started",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GITHUB REGISTER

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => { })

router.get('/github/callback',
  passport.authenticate(
    'github',
    { failureRedirect: '/fail-register-github' }),
  (req, res) => res.status(200).redirect('http://localhost:8080/'))

router.get('/fail-register-github', (req, res) => res.status(403).json({
  success: false,
  response: 'Bad auth'
}))

// GET SESSION
router.get("/session", async (req, res) => {
  return res.json({
    email: req.session.email,
    role: req.session.role,
  });
});

export default router;
