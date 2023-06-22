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
          succes: true,
          response: "User login",
        });
      } else {
        return res.status(404).json({
          success: false,
          response: "Incorrect password",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        response: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

// LOGOUT
router.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    return res.status(200).json({
      success: true,
      response: "Disconnected",
    });
  } catch (error) {
    next(error);
  }
});

router.get("");

export default router;
