import passport from "passport";
import { Strategy } from "passport-local";
import GHStrategy from "passport-github2";
import User from "../dao/models/User.js";
import Cart from "../dao/models/Cart.js";

const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env
const callback = 'http://localhost:8080/api/auth/github/callback'

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
	// SIGNIN GH
	passport.use('github',
		new GHStrategy({
			clientID: GH_CLIENT_ID,
			clientSecret: GH_CLIENT_SECRET,
			callbackURL: callback
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let one = await User.findOne({ email: profile._json.login })
				if (one) return done(null, one)
				if (!one) {
					const cart = await Cart.create({products: []})
					let user = await User.create({
						name: profile._json.login,
						email: profile._json.login,
						password: profile._json.id,
						photo: profile._json.avatar_url,
						cid: cart._id
					})
					return done(null, user)
				}
			} catch (error) {
				return done(error)
			}
		})
	)
};

export default inicializePassport;
