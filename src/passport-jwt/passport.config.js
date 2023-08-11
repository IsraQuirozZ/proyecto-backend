import passport from "passport";
import { Strategy } from "passport-local";
import passportJWT from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserDTO from "../dto/User.dto.js";
import { cartService, userService } from "../service/index.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = config

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

// const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;
// const callback = "http://localhost:8080/api/auth/github/callback";

const initializePassport = () => {
  // JWT AUTH

  passport.use(
    "jwt",
    new JWTStrategy(configStrategy, async (jwt_payload, done) => {
      try {
        let user = await userService.getUserByEmail(jwt_payload.email);
        if (user) {
          return done(null, new UserDTO(user));
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
          let user = await userService.getUserByEmail(username);
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
          let user = await userService.getUserByEmail(username);
          if (!user) {
            let cart = await cartService.createCart();
            let user = await userService.createUser({
              ...req.body,
              cid: cart._id,
            });
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
  // passport.use(
  //   "github",
  //   new GHStrategy(
  //     {
  //       clientID: GH_CLIENT_ID,
  //       clientSecret: GH_CLIENT_SECRET,
  //       callbackURL: callback,
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         let one = await User.findOne({ email: profile._json.login });
  //         if (one) return done(null, one);
  //         if (!one) {
  //           const cart = await Cart.create({ products: [] });
  //           let user = await User.create({
  //             name: profile._json.login,
  //             email: profile._json.login,
  //             password: profile._json.id,
  //             photo: profile._json.avatar_url,
  //             cid: cart._id,
  //           });
  //           return done(null, user);
  //         }
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  // GOOGLE
  passport.use('google',
    new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/session/google/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('first')
        let one = await userService.getUserByEmail(profile.emails[0].value)
        if (one) {
          const token = jwt.sign(
            new UserDTO(one),
            process.env.SECRET_JWT,
            { expiresIn: 60 * 60 * 24 * 7 }
          )
          res.cookie('token', token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
          })
          console.log(token)
          return done(one)}
        if (!one) {
          const cart = await cartService.createCart()
          let user = await userService.createUser({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            password: profile.id,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            cid: cart._id
          })
          const token = jwt.sign(
            new UserDTO(user),
            process.env.SECRET_JWT,
            { expiresIn: 60 * 60 * 24 * 7 }
          )
          res.cookie('token', token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
          })
          console.log(token)
          return done(null, user)
        }
      } catch (error) {
        return done(error, null);
      }
    } 
    )
  )
};

export default initializePassport;
