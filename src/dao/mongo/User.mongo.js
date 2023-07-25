import User from "./models/User.js";

class UserDao {
  constructor() {
    this.userModel = User
  }

  getUser = async uid => {
    return await this.userModel.findById(uid)
  }

  createUser = async userData => {
    return await this.userModel.create(userData)
  }
}

export default UserDao