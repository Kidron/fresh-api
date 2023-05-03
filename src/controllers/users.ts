import User from "../schemas/User";
import {
  compareHashPassword,
  hashPassword,
  isValidEmail,
  isValidPassword,
} from "../utils/utils";

interface CreateUserType {
  email: string;
  password: string;
}
export async function createUser(payload: CreateUserType) {
  await isValidEmail(payload.email);
  await isValidPassword(payload.password);
  const hash = await hashPassword(payload.password);
  await User.create({
    email: payload.email,
    password: hash,
  });
}

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
