import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  getUsers = async (req, res) => {
    try {
      let foundUsers = await userService.getUsers();
      let users = [];

      if (foundUsers) {
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
      if (
        // De momento que no se pueda cambiar ni el rol ni la contraseña
        Object.entries(userData).length !== 0
      ) {
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

  login = async (req, res) => {
    try {
      return res.sendSuccess(200, { user: req.body });
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  register = (req, res) => {
    return res.sendSuccess(201, "User registred successfully");
  };

  logout = async (req, res) => {
    try {
      return res.clearCookie("token").sendSuccess(200, "User signed out");
    } catch (error) {
      logger.error(error);
      return res.sendServerError(500, error);
    }
  };

  current = (req, res) => {
    return res.sendSuccess(200, { user: new UserDTO(req.user) });
  };
}

export default new UserController();
