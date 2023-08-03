import passport from "passport";
import { Strategy } from "passport-local";
import passportJWT from "passport-jwt";
import GHStrategy from "passport-github2";
import Cart from "../dao/mongo/models/Cart.js";
import User from "../dao/mongo/models/User.js";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let cookieExtractor = (req) => {
  let token = null;
  if (req?.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const configStrategy = {
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.SECRET_JWT,
};

const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;
const callback = "http://localhost:8080/api/auth/github/callback";

const initializePassport = () => {
  // JWT AUTH

  passport.use(
    "jwt",
    new JWTStrategy(configStrategy, async (jwt_payload, done) => {
      try {
        let one = await User.findOne({ email: jwt_payload.email });
        if (one) {
          delete one.password;
          return done(null, one);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
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
            delete user.password;
            return done(null, user);
          }
          return done(null, false); // Redirecciona
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // SIGNIN GH

  passport.use(
    "github",
    new GHStrategy(
      {
        clientID: GH_CLIENT_ID,
        clientSecret: GH_CLIENT_SECRET,
        callbackURL: callback,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let one = await User.findOne({ email: profile._json.login });
          if (one) return done(null, one);
          if (!one) {
            const cart = await Cart.create({ products: [] });
            let user = await User.create({
              name: profile._json.login,
              email: profile._json.login,
              password: profile._json.id,
              photo: profile._json.avatar_url,
              cid: cart._id,
            });
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
