import { Router } from "express";
import { login, logout } from "../controllers/auth-controller.js";
import { asyncHandler } from "../lib/async-handler.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
