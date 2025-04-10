import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/passwords";

const prisma = new PrismaClient();

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

export const createUser = async (
  email: string,
  password: string,
  avatarUrl?: string
) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AuthError("User with this email already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      avatarUrl,
    },
  });
};

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    throw new AuthError("Invalid email or password", 401);
  }

  return user;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  return user;
};
