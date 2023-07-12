import { Router } from "express";
import registerValidator from "../../middlewares/registerValidator.js";
import passwordValidator from "../../middlewares/passwordValidator.js";
import isPasswordValid from "../../middlewares/isPasswordValid.js";
import createHash from "../../middlewares/createhash.js";
import generateToken from "../../middlewares/generateToken.js";
// import authenticateUser from "../../middlewares/authenticateUser.js";
import User from "../../dao/models/User.js";
import passport from "passport";
import passportCall from "../../middlewares/passportCall.js";

const router = Router();

// REGISTER
router.post(
  "/register",
  createHash,
  passport.authenticate("register", {
    failureRedirect: "/api/auth/fail-register",
  }),
  (req, res) => {
    return res.status(201).json({
      success: true,
      response: "User created",
    });
  },
  registerValidator,
  passwordValidator,
  generateToken
);

router.get("/fail-register", (req, res) => {
  return res.status(401).json({
    success: false,
    response: "Auth error",
  });
});

// LOGIN
router.post(
  "/login",
  // authenticateUser,
  passport.authenticate("login", { failureRedirect: "api/auth/fail-login" }),
  isPasswordValid,
  generateToken,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!req.session.email) {
        req.session.email = email;
        req.session.role = req.user.role;
        return res.status(200)
        .cookie('token', req.token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({
          success: true,
          message: "User logged",
          user: req.user,
          token: req.token
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
  },
);

router.get("/fail-login", (req, res) => {
  return res.status(401).json({
    success: false,
    response: "Auth error",
  });
});

// LOGOUT

router.post('/logout',
  passportCall('jwt'),
  async (req, res, next) => {
    try {
      return res.status(200).clearCookie('token').json({
        success: false,
        response: 'User signed out'
      })
    } catch (error) {
      next(error)
    }
  }
)


// router.post("/logout", async (req, res, next) => {
//   try {
//     let user = await User.findOne({ email: req.session.email });
//     if (user) {
//       req.session.destroy((err) => {
//         if (err) {
//           return res.status(500).json({
//             success: false,
//             response: "Error logging out",
//           });
//         } else {
//           return res.status(200).json({
//             success: true,
//             response: "User logged out",
//           });
//         }
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         response: "No session started",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// JWT LOGIN

router.post('/login', /* validator, strategy, password, token, */
  passport.authenticate('login', { failureRedirect: '/api/auth/fail-login' }),
  isPasswordValid,
  generateToken,
  (req, res, next) => {
    try {
      return res.status(200).cookie('token', req.token, { maxAge: 60 * 60 * 1000 }).json({
        success: true,
        response: 'Logged in'
      })
    } catch (error) {
      next(error)
    }
  })

// GITHUB REGISTER

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => { })

router.get('/github/callback',
  passport.authenticate(
    'github',
    { failureRedirect: '/api/auth/fail-register-github' }),
  (req, res) => res.status(200).redirect('/'))

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
