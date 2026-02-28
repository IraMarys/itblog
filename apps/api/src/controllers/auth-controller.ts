import type { Request, Response } from "express";
import { comparePassword, signToken } from "../lib/auth.js";
import { query } from "../lib/query.js";

export async function login(request: Request, response: Response) {
  const { email, password } = request.body as { email?: string; password?: string };

  if (!email || !password) {
    return response.status(400).json({ message: "Email and password are required" });
  }

  const result = await query<{
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
  }>("SELECT id, name, email, password, is_admin FROM users WHERE email = $1", [email]);

  const user = result.rows[0];
  if (!user) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const matches = await comparePassword(password, user.password);
  if (!matches) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  return response.json({
    token: signToken({
      id: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      name: user.name
    })
  });
}

export async function logout(_request: Request, response: Response) {
  response.status(204).send();
}

