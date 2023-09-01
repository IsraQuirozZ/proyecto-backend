import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default (req, res, next) => {
  const token = jwt.sign({ ...req.user }, config.SECRET_JWT);
  res.cookie("token", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  return next();
};
