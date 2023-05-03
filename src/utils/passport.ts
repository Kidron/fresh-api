import { Strategy as LocalStrategy } from "passport-local";
import User from "../schemas/User";
// import bcrypt from "bcrypt";
import {compareHashPassword} from "./utils";

export default function initializePassport(passport: any) {
    const authenticateUser = async (email: string, password: string, done: any) => {
        User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: any) => {
            if (err) { return done(err); }
            if (!user) {
                return done(undefined, false, { message: `Email ${email} not found.` });
            }
            user.compareHashPassword(password, (err: Error, isMatch: boolean) => {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(undefined, user);
                }
                return done(undefined, false, { message: "Invalid email or password." });
            });
        });
    }
  passport.use(new LocalStrategy({ usernameField: "email" }), authenticateUser);
  passport.serializeUser((user: any, done: any) => {
    done(undefined, user);
  })
  passport.deserializeUser((id: any, done: any) => {
    User.findById(id, (err: NativeError, user: any) => done(err, user));
  })
}


// passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: UserDocument) => {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(undefined, false, { message: `Email ${email} not found.` });
//         }
//         user.comparePassword(password, (err: Error, isMatch: boolean) => {
//             if (err) { return done(err); }
//             if (isMatch) {
//                 return done(undefined, user);
//             }
//             return done(undefined, false, { message: "Invalid email or password." });
//         });
//     });
// }));