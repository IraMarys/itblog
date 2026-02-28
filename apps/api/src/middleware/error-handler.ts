import type { NextFunction, Request, Response } from "express";

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  console.error(error);
  response.status(500).json({ message: "Internal server error" });
}

