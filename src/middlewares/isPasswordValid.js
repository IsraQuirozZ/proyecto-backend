import { compareSync } from "bcrypt";
import User from "../dao/models/User.js";

const isPasswordValid = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    let verified = compareSync(password, user.password);
    if (verified) {
      return next();
    }
  }
  return res.status(401).json({
    success: false,
    response: "Invalid email or password",
  });
};

export default isPasswordValid;
