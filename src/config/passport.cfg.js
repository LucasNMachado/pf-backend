import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/models/usersModel.js";
import { createHash, validatePassword } from "../utils/utils.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, birth_date, role } = req.body;
        try {
          let user = await usersModel.findOne({ email: username });
          if (user) return done(null, false);
          const newUser = {
            first_name,
            last_name,
            email,
            birth_date,
            password: createHash(password),
            role,
          };
          user = await usersModel.create(newUser);
          return done(null, user);
        } catch (error) {
          return done({ message: "Error creating user" });
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });
          if (!user) return done(null, false, { message: "User not found" });
          if (!validatePassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done({ message: "Error logging in" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await usersModel.findOne({ _id });
      return done(null, user);
    } catch {
      return done({ message: "Error deserializing user" });
    }
  });
};

export default initializePassport;