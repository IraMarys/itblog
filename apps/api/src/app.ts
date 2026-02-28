import cors from "cors";
import express from "express";
import { adminRouter } from "./routes/admin-routes.js";
import { authRouter } from "./routes/auth-routes.js";
import { publicRouter } from "./routes/public-routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);

