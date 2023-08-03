import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
// import { compareSync } from "bcrypt";
// import jwt from "jsonwebtoken";

class UserController {
  getUsers = async (req, res) => {
    try {
      let users = await userService.getUsers();

      users
        ? res.sendSuccess(200, users)
        : res.sendUserError(404, "Not found users");
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };

  getUser = async (req, res) => {
    try {
      let id = req.params.uid;
      let user = await userService.getUser(id);

      user
        ? res.sendSuccess(200, user)
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
        ? res.sendSuccess(200, user)
        : res.sendUserError(404, "Not found user");
    } catch (error) {
      res.sendServerError(500, error);
    }
  };

  //   getLoginUser = async (req, res) => {
  //     try {
  //       if (req.cookies.token) {
  //         return res.sendUserError(401, "You are already logged in");
  //       }

  //       let user = await userService.getUserByEmail(req.body.email);

  //       if (!user) {
  //         // return res.sendUserError(404, "User not registred");
  //         return res.sendUserError(400, "Invalid email or password");
  //       }

  //       const { password } = user;
  //       console.log(password);
  //       let verified = compareSync(req.body.password, password);

  //       if (!verified) {
  //         return res.sendUserError(400, "Invalid email or password");
  //       }

  //       let token = jwt.sign(
  //         { email: user.email, role: user.role },
  //         process.env.SECRET_JWT
  //       );
  //       res.cookie("token", token, {
  //         maxAge: 60 * 60 * 24 * 7,
  //         httpOnly: true,
  //       });
  //       return res.sendSuccess(200, user);
  //     } catch (error) {
  //       return res.sendServerError(500, error);
  //     }
  //   };

  //   registerUser = (req, res) => {
  //     return res.sendSuccess(201, "User registred successfully");
  //   };

  createUser = async (req, res) => {
    try {
      let { first_name, last_name, email, password, photo, age, role } =
        req.body;
      if (!first_name || !last_name || !email || !password) {
        return res.sendUserError(400, "Data is required");
      }
      let cart = await cartService.createCart();
      let newUser = new UserDTO({
        first_name,
        last_name,
        email,
        password,
        photo,
        age,
        role,
      });
      let user = await userService.createUser({ ...newUser, cid: cart._id });

      return res.sendSuccess(201, user);
    } catch (error) {
      return res.sendServerError(500, error);
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
        Object.entries(userData).length !== 0 &&
        !("cid" in userData) &&
        !("role" in userData)
      ) {
        let user = await userService.updateUser(id, userData);
        return res.sendSuccess(200, user);
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
