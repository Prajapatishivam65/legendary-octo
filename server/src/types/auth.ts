import { Request } from "express";

export interface AuthUser {
  id: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  avatarUrl?: string;
}
