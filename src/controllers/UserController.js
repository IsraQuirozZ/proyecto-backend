import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import { logger } from "../utils/logger.js";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import generateToken from "../middlewares/generateToken.js";
import config from "../config/config.js";

class UserController {
  getUsers = async (req, res) => {
    try {
      let foundUsers = await userService.getUsers();
      let users = [];

      if (foundUsers.length > 0) {
        foundUsers.forEach((user) => {
          users.push(new UserDTO(user));
        });
        return res.sendSuccess(200, { users });
      }
      return res.sendUserError(404, "Not found users");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  getUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let user = await userService.getUser(id);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : res.sendUserError(404, "Not found user");
    } catch (error) {
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      let email = req.body.email;

      let user = await userService.getUserByEmail(email);

      user
        ? res.sendSuccess(200, { user: new UserDTO(user) })
        : res.sendUserError(404, "Not found user");
    } catch (error) {
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  updateUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let foundUser = await userService.getUser(id);

      if (!foundUser) {
        return res.sendUserError(404, "Not found user");
      }

      let userData = req.body;
      if (Object.entries(userData).length !== 0) {
        if (
          !("cid" in userData) &&
          !("role" in userData) &&
          !("password" in userData)
        ) {
          let user = await userService.updateUser(id, userData);
          return res.sendSuccess(200, { user: new UserDTO(user) });
        } else {
          return res.sendUserError(400, "There's data you can`t change");
        }
      }
      return res.sendUserError(400, "There's nothing to update");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const uid = req.params.uid;
      let user = await userService.getUser(uid);
      const cid = user.cid;

      if (!user) {
        return res.sendUserError(404, "Not found user");
      }
      let deleteUser = await userService.deleteUser(uid);
      let deleteCart = await cartService.deleteCart(cid);

      if (deleteUser && deleteCart) {
        return res.sendSuccess(200, `User ${user._id} deleted`);
      }
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  deleteUsers = async (req, res) => {
    try {
      const allUsers = await userService.getUsers();
      const today = new Date();

      const usersToDelete = allUsers.filter((user) => {
        const dateToCompare = new Date(user.last_connection);
        const timeDifference = today - dateToCompare;
        if (isNaN(timeDifference)) {
          return true;
        }
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        return daysDifference >= 2;
      });

      for (const user of usersToDelete) {
        await userService.deleteUser(user._id);
        await cartService.deleteCart(user.cid);
        await sendMail(
          user.email,
          "Your account was deleted",
          `<p>We have deleted your account due to lack of inactivity</p> `
        );
      }

      return res.sendSuccess(200, { deletedUsers: usersToDelete });
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };

  //REGISTER
  register = (req, res) => {
    return res.sendSuccess(201, "User registred successfully");
  };

  // LOGIN
  login = async (req, res) => {
    try {
      let user = await userService.getUserByEmail(req.body.email);
      let last_connection = new Date().toLocaleString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!user) {
        return res.sendUserError(400, "Invalid email or password");
      }

      const { password } = user;
      let verified = compareSync(req.body.password, password);

      if (!verified) {
        return res.sendUserError(400, "Invalid email or password");
      }
      user = await userService.updateUser(user._id, { last_connection });
      user = new UserDTO(user);

      let token = jwt.sign({ user }, config.SECRET_JWT);

      return res
        .cookie("token", token, {
          maxAge: 60 * 60 * 60 * 24 * 7,
          httpOnly: true,
        })
        .sendSuccess(200, { user });
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  // LOGOUT
  logout = async (req, res) => {
    try {
      return res.clearCookie("token").sendSuccess(200, "User signed out");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  // CURRENT (Allow us see the actual session)
  current = (req, res) => {
    return res.sendSuccess(200, { user: new UserDTO(req.user) });
  };

  // FORGOT-PASSWORD
  forgotPassword = async (req, res) => {
    try {
      if (!req.body.email) {
        return res.sendUserError(400, "Please enter your email");
      }

      let user = await userService.getUserByEmail(req.body.email);
      if (!user) {
        return res.sendUserError(400, "User email not registered");
      }

      user = new UserDTO(user);
      const token = generateToken(user, "1h");

      await sendMail(
        user.email,
        "Password recovery",
        `<h1>Press the link to reset you password</h1> 
        <br>
        <a href="http://127.0.0.1:5173/reset-password/?token=${token}">Password recovery</a>`
      );

      return res.sendSuccess(200, "Email sent");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, "Internal server Error");
    }
  };

  // RESET-PASSWORD
  resetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
        if (err) {
          return res.sendUserError(401, "Invalid token");
        }
        return res.sendSuccess(200, "Validated token");
      });
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, "Internal server error");
    }
  };

  // CONFIRM-PASSWORD
  confirmPassword = async (req, res) => {
    try {
      let { password, confirmPassword, token } = req.body;

      if (password !== confirmPassword) {
        return res.sendUserError(400, "Passwords do not match");
      }

      const decodedToken = jwt.verify(token, config.SECRET_JWT);
      const userId = decodedToken.user._id;
      let user = await userService.getUser(userId);

      const dbPassword = user.password;
      let verifiedPassword = compareSync(password, dbPassword);
      if (verifiedPassword) {
        return res.sendUserError(
          400,
          "Password must be different from the current one"
        );
      }
      password = hashSync(password, genSaltSync());
      user = await userService.updateUser(userId, { password });
      return res.sendSuccess(200, "Password reset");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, "Interval server error");
    }
  };
}

export default new UserController();
