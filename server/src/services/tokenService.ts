import jwt, { SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/authConfig";

interface DecodedToken {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: `${authConfig.jwtExpiresIn}`, // Change this to match your authConfig.jwtExpiresIn type
  };

  return jwt.sign({ userId }, authConfig.jwtSecret as jwt.Secret, options);
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(
      token,
      authConfig.jwtSecret as jwt.Secret
    ) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};
