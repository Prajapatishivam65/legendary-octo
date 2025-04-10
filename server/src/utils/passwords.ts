import bcrypt from "bcrypt";
import { authConfig } from "../config/authConfig";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, authConfig.saltRounds);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
