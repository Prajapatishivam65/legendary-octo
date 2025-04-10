import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import * as authService from "../services/authService";
import * as tokenService from "../services/tokenService";
import { cookieOptions } from "../config/cookieConfig";
import logger from "../utils/logger";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, avatarUrl } = req.body;

    const user = await authService.createUser(email, password, avatarUrl);
    const token = tokenService.generateToken(user.id);

    // Set JWT as HTTP-only cookie
    res.cookie("auth_token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.validateUser(email, password);
    const token = tokenService.generateToken(user.id);

    // Set JWT as HTTP-only cookie
    res.cookie("auth_token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    ...cookieOptions,
    maxAge: 0,
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authService.getUserById(userId);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error("Get user error:", error);
    next(error);
  }
};
