import express from "express";
import { connectDB } from "./database";
import { Config } from "./types/config";
import initRouter from "./routes";

const app = express();

async function initServer() {
  if (!Config.DB_STRING) throw new Error("Invalid DB String");
  if (!Config.SESSION_SECRET) throw new Error("Missing session secret");

  await connectDB();
  await initRouter(app);
  app.listen(Config.PORT, () =>
    console.log(`server started visit http://localhost:${Config.PORT}`)
  );
}
initServer().catch((err) => console.log(err));
