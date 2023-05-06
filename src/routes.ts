import express, { Application, Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import flash from "express-flash";

const router = express.Router();

import { createUser, logout } from "./controllers/users";

// import passport strategy
import "./utils/passport";
import { isAuthenticated } from "./utils/passport";

interface IRequest extends Request {
  user?: any;
}

export default async function initRouter(app: Application) {
    app.set("view engine", "ejs");
    app.set("views", __dirname + "/views");
    
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "",
        store: MongoStore.create({ client: mongoose.connection.getClient() }),
        resave: false,
        saveUninitialized: false,
      })
    );
    
    // Use Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
    
    //Use flash messages for errors, info, ect...
    app.use(flash());
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    
    app.use("/api/v1", router);
    
    app.get("/", isAuthenticated, (req: IRequest, res: Response) => {
      // console.log(req.user);
    
      res.render("index", { name: req.user.fullName });
    });
    
    app.get("/login", (req: Request, res: Response) => {
      if (req.user) {
        return res.redirect("/");
      }
      res.render("login");
    });
    router.post("/logout", logout);
    
    app.get("/register", (req: Request, res: Response) => {
      res.render("register", { error: null });
    });
    
    router.post("/register", async (req: Request, res: Response) => {
      try {
        const { fullName, email, password } = req.body;
        if (!fullName) throw new Error("Missing name");
        if (!email) throw new Error("Invalid email");
        await createUser({
          fullName,
          email,
          password,
        });
        res.send(200);
      } catch (err: any) {
        console.log(err);
        // res.status(500).send(err.message);
        // res.redirect("/register");
        res.status(401).send({ error: err.message });
      }
    });
    
    router.post(
      "/login",
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
      })
    );
}