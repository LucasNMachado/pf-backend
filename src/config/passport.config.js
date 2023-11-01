import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "../dao/models/user.model.js"
import { cartModel } from "../dao/models/cart.model.js";
import {createHash,isValidPassword} from "../utils.js"
import UsersDTO from "../dto/usersDto.js"

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userModel.findOne({ email: username });
            if (user) return done(null, false);
            
            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: "user"
            });

            user = await userModel.create(newUser);

            const newCart = new cartModel({
                user: newUser._id,
                products: [],
            });

            await newCart.save();
            newUser.carrito = newCart._id;
            await newUser.save();

            return done(null, user);
        } catch (error) {
            return done(error, false, { message: "Error creating user" });
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }
            if (!isValidPassword(password, user.password)) {
                console.log("Invalid credentials");
                return done(null, false, { message: "Invalid credentials" });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error logging in:", error);
            return done({ message: "Error logging in" });
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4cd974739022e22c',
        clientSecret: 'a952a6fc352ab2d6a7fb4c232e16b4a2c88acfa2',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log({ profile })
            let user = await userModel.findOne({ email: profile._json.email });
            if (user) return done(null, user);
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: 21,
                password: '',
            }
            user = await userModel.create(newUser);
            return done(null, user);
        } catch (error) {
            return done({ message: 'Error creating user' });
        }
    }));

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

export default initializePassport;