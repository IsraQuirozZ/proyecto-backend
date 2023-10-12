export default (req, res, next) => {
  req.cookies.token
    ? res.sendUserError(401, "You are already logged in")
    : next();
};
