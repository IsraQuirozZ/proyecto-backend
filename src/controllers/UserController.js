import UserDTO from "../dto/User.dto.js";
import { userService } from "../service/index.js";
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
      res.sendServerError(500, error);
    }
  };

  login = async (req, res) => {
    try {
      if (req.cookies.token) {
        return res.sendUserError(401, "You are already logged in");
      }

      let user = await userService.getUserByEmail(req.body.email);

      if (!user) {
        return res.sendUserError(400, "Invalid email or password");
      }

      const { password } = user;
      let verified = compareSync(req.body.password, password);

      if (!verified) {
        return res.sendUserError(400, "Invalid email or password");
      }

      let token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.SECRET_JWT
      );
      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      });
      return res.sendSuccess(200, { user: new UserDTO(user) });
    } catch (error) {
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
      return res.sendServerError(500, error);
    }
  };

  current = (req, res) => {
    return res.sendSuccess(200, { user: new UserDTO(req.user) });
  };

  // createUser = async (req, res) => {
  //   try {
  //     let { first_name, last_name, email, password } = req.body;
  //     if (!first_name || !last_name || !email || !password) {
  //       return res.sendUserError(400, "Data is required");
  //     }
  //     let cart = await cartService.createCart();
  //     let user = await userService.createUser({ ...req.body, cid: cart._id });

  //     return res.sendSuccess(201, new UserDTO(user));
  //   } catch (error) {
  //     return res.sendServerError(500, error);
  //   }
  // };

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
      return res.sendServerError(500, error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let user = await userService.deleteUser(id);

      if (user) {
        return res.sendSuccess(200, `User ${user._id} deleted`);
      }
      return res.sendUserError(404, "Not found user");
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };
}

export default new UserController();
