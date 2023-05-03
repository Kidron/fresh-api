import express, { Request, Response } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(express.json());

import { connectDB } from "./database";
import User from "./schemas/User";
import { createUser, loginUser } from "./controllers/users";

connectDB()
  .then(() => {
    app.listen(3000, () => console.log("server started"));
  })
  .catch((err) => console.error(err));

// app.get("/", async (req, res) => {
//     try {
//         res.send("Hello World");
//     } catch(err: any) {
//         console.log(err);
//         res.status(500);
//     }
// });

app.post("/api/v1/createuser", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Invalid email");
    if (!password) throw new Error("Invalid password");
    await createUser({
      email,
      password,
    });
    res.sendStatus(200);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.post("/api/v1/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email) throw new Error("Invalid email");
        if (!password) throw new Error("Invalid password");
        await loginUser({
            email,
            password
        })
        res.sendStatus(200);
    } catch (err: any) {
      console.log(err);
      res.status(500).send(err.message);
    }
  });
