import UserDTO from "../../dto/User.dto.js";
import User from "./models/User.js";

class UserDao {
  constructor() {
    this.userModel = User
  }

  getUser = async uid => {
    return await this.userModel.findById(uid)
  }

  createUser = async userData => {
    const newUser = new UserDTO(userData)
    return await this.userModel.create(newUser)
  }
}

export default UserDao