import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../schemas/User";
import { compareHashPassword } from "./utils";
import { NextFunction, Request, Response } from "express";

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (id: any, done: any) => {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        return(done(err));
    }
  })

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, {
            message: `No user found with that ${email}`,
          });
        }
        if (!(await compareHashPassword(password, user.password || ""))) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login");
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
