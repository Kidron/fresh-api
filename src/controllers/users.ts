import {NextFunction, Request, Response} from "express";
import User from "../schemas/User";
import {
  compareHashPassword,
  hashPassword,
  isValidEmail,
  isValidPassword,
} from "../utils/utils";

interface CreateUserType {
  fullName: string;
  email: string;
  password: string;
}
export async function createUser(payload: CreateUserType) {
  await isValidEmail(payload.email);
  await isValidPassword(payload.password);
  const hash = await hashPassword(payload.password);
  await User.create({
    fullName: payload.fullName,
    email: payload.email,
    password: hash,
  });
}
// export async function createUser(payload: CreateUserType) {
//   const emailError = await isValidEmail(payload.email);
//   if(emailError) return emailError;
// }


interface LoginUserType {
  email: string;
  password: string;
}
export async function loginUser(payload: LoginUserType) {
  await isValidEmail(payload.email);
  const user = await User.findOne({
    email: payload.email,
  })
    .lean()
    .exec();
  if (!user || !user.password) throw new Error("No user found");
  if (!(await compareHashPassword(payload.password, user.password)))
    throw new Error("Passwords don't match");

  // return something
  console.log(user);
}


// export const getLogin = (req: Request, res: Response) => {
//   if (req.isAuthenticated()) {
//     return res.redirect("/");
//   }
//   res.redirect("/login");
// }

export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout(() => {
    console.log("Logged out");
  });
  res.redirect("/login");
};