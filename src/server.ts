import express, { Request, Response } from "express";
import passport, { authenticate } from "passport";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const router = express.Router();

import { connectDB } from "./database";
import { createUser, logout } from "./controllers/users";

// import passport strategy
import "./utils/passport";
import { isAuthenticated } from "./utils/passport";

interface IRequest extends Request {
  user?: any;
}

connectDB()
  .then(() => {
    app.listen(3000, () =>
      console.log("server started visit http://localhost:3000")
    );
  })
  .catch((err) => console.error(err));

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

  res.render("index.ejs", { name: req.user.fullName });
});

app.get("/login", (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login.ejs");
});
router.post("/logout", logout);

app.get("/register", (req: Request, res: Response) => {
  res.render("register.ejs");
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName) throw new Error("Missing name");
    if (!email) throw new Error("Invalid email");
    if (!password) throw new Error("Invalid password");
    await createUser({
      fullName,
      email,
      password,
    });
    // res.sendStatus(200);
    res.redirect("/login");
  } catch (err: any) {
    console.log(err);
    // res.status(500).send(err.message);
    res.redirect("/register");
  }
});

// router.post("/login", passport.authenticate('local'), async (req: Request, res: Response) => {
//   try {
//     console.log(req.user);

//     // const { email, password } = req.body;
//     // if (!email) throw new Error("Invalid email");
//     // if (!password) throw new Error("Invalid password");
//     // await loginUser({
//     //   email,
//     //   password,
//     // });
//     // res.json('passport auth');
//     // res.redirect("/")
//   } catch (err: any) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
