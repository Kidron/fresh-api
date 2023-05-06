import dotenv from "dotenv";

export interface ConfigType {
  DB_STRING: string;
  SESSION_SECRET: string;
  PORT: string
}

dotenv.config();

export const Config: ConfigType = {
    DB_STRING: process.env.DB_STRING || "",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
    PORT: process.env.PORT || "3000"
};
