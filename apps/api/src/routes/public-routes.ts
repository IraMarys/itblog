import { Router } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
  addView,
  getArticle,
  getArticles,
  getAuthor,
  getAuthorArticles,
  getCategories,
  getCategoryArticles,
  getRelated,
  getTags,
  getTagArticles,
  searchArticles
} from "../controllers/public-controller.js";

export const publicRouter = Router();

publicRouter.get("/articles", asyncHandler(getArticles));
publicRouter.get("/articles/:slug", asyncHandler(getArticle));
publicRouter.get("/articles/:slug/related", asyncHandler(getRelated));
publicRouter.post("/articles/:id/view", asyncHandler(addView));
publicRouter.get("/categories", asyncHandler(getCategories));
publicRouter.get("/categories/:slug/articles", asyncHandler(getCategoryArticles));
publicRouter.get("/tags", asyncHandler(getTags));
publicRouter.get("/tags/:slug/articles", asyncHandler(getTagArticles));
publicRouter.get("/authors/:slug", asyncHandler(getAuthor));
publicRouter.get("/authors/:slug/articles", asyncHandler(getAuthorArticles));
publicRouter.get("/search", asyncHandler(searchArticles));
