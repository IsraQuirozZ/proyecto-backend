import passport from "passport";
import { Strategy } from "passport-local";
import User from "../dao/models/User.js";
import Cart from "../dao/models/Cart.js";

const inicializePassport = () => {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
  // REGISTER
  passport.use(
    "register",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          let one = await User.findOne({ email: username });
          if (!one) {
            let cart = await Cart.create({ products: [] });
            let user = await User.create({ ...req.body, cid: cart._id });
            return done(null, user);
          }
          return done(null, false); // Redirecciona
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  // LOGIN
  passport.use(
    "login",
    new Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await User.findOne({ email: username });
          if (user) {
            return done(null, user);
          }
          return done(null, false); // Redirecciona
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

export default inicializePassport;
