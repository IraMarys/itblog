import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth.js";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    request.user = verifyToken(header.slice(7));
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (!request.user?.isAdmin) {
    return response.status(403).json({ message: "Forbidden" });
  }

  return next();
}

