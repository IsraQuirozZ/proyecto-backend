import { Router } from "express";
import validator from "../../middlewares/validator.js";
import password_validator from "../../middlewares/passwordValidator.js";
import User from "../../dao/models/User.js";

const router = Router();

// REGISTER
router.post(
  "/register",
  validator,
  password_validator,
  async (req, res, next) => {
    try {
      let newUser = await User.create(req.body);

      if (newUser) {
        return res.status(201).json({
          success: true,
          response: `User ${newUser._id} created`,
        });
      }

      return res.status(500).json({
        success: true,
        response: "User not created",
      });
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN
router.post("/login", password_validator, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (password === user.password) {
        req.session.email = email;
        req.session.role = user.role;
        return res.status(200).json({
          success: true,
          message: "User login",
          email: req.session.email,
          role: req.session.role,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Incorrect password",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

// LOGOUT
router.post("/logout", async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.session.email });
    console.log(user);
    if (user) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: true,
            message: "Error logging out",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: " ",
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

// router.get("");

export default router;
