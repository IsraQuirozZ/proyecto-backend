import { hashSync, genSaltSync } from "bcrypt";

const createHash = (req, res, next) => {
  req.body.password = hashSync(req.body.password, genSaltSync());
  return next();
};

export default createHash;
