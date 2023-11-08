import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/users.js";
import { createHash, IsValidPassword } from "../util.js";
import userDto from "../dto/userDto.js";
import { CartService } from "../services/serviceCarts.js";
import jwt from 'passport-jwt';
import { default as token} from 'jsonwebtoken';


const JWTStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const PRIVATE_KEY = "CoderKeyFeliz";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1d' });
    return token;}

const ServiceCart = new CartService()

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userModel.findOne({
            email: username,
          });
          if (user) return done(null, false);

          let role = "user";
          if (email.includes("admin")) {
            role = "admin";
          }

          let userCart = await ServiceCart.create()

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            userRole: role,
            cart: userCart,
          };
          user = await userModel.create(newUser);
          return done(null, user);
        } catch (error) {
          return done({
            message: "Error creating user",
          });
        }
      }
    )
  );

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username , password, done) => {
    try {
        const user = await userModel.findOne({ email: username });
        if (!user) return done(null, false, { message: "User not found" });
        if (!IsValidPassword(user, password)) return done(null, false);
        const { password: pass, ...userNoPass} = user._doc;
        const jwt = generateToken(userNoPass);
        await user.updateOne({ last_connection: new Date() });
        return done(null, userNoPass);
    } catch (error) {
        return done({ message: "Error logging in" });
    }
}));

passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY
}, async (jwt_payload, done) => {
    try {
         const filter = new userDto(jwt_payload)
         console.log(filter)
        return done(null, filter);
    } catch (error) {
        return done(error);
    }
}
));

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: 'Iv1.b20d0f0f0f8d38a6',
        clientSecret: 'ae6b314ff4ae4e642250afd27132f1d038de4abd',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log({ profile });
          let user = await userModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);
          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: 18,
            password: "",
          };
          user = await userModel.create(newUser);
          return done(null, user);
        } catch (error) {
          return done({ message: "Error creating user" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await userModel.findOne({ _id });
      return done(null, user);
    } catch {
      return done({ message: "Error deserializing user" });
    }
  });

};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['coderCookieToken'];
  }
  return token;
};





export default initializePassport;