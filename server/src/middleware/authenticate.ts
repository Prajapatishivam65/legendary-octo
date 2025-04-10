import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import * as tokenService from "../services/tokenService";
import logger from "../utils/logger";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = tokenService.verifyToken(token);

    if (!decoded) {
      res.clearCookie("auth_token");
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    (req as AuthRequest).user = { id: decoded.userId };

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.clearCookie("auth_token");
    return res.status(401).json({ message: "Authentication failed" });
  }
};
