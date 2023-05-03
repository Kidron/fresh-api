import express, { Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const router = express.Router();

import { connectDB } from "./database";
import User from "./schemas/User";
import { createUser, loginUser } from "./controllers/users";
import initializePassport from "./utils/passport";
initializePassport(passport);

connectDB()
  .then(() => {
    app.listen(3000, () =>
      console.log("server started visit http://localhost:3000")
    );
  })
  .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "fkjswfhjkfhjk"
}))

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.render("index.ejs");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login.ejs");
});

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
    res.redirect(200, "/login");
  } catch (err: any) {
    console.log(err);
    // res.status(500).send(err.message);
    res.redirect("/register");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Invalid email");
    if (!password) throw new Error("Invalid password");
    await loginUser({
      email,
      password,
    });
    res.sendStatus(200);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  }
});
