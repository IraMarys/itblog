import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../lib/async-handler.js";
import {
  createArticle,
  createCategory,
  createTag,
  deleteArticle,
  deleteCategory,
  deleteTag,
  getAdminArticles,
  listAuthors,
  listCategories,
  listTags,
  updateArticle,
  updateCategory,
  updateTag,
  uploadCover
} from "../controllers/admin-controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get("/articles", asyncHandler(getAdminArticles));
adminRouter.post("/articles", asyncHandler(createArticle));
adminRouter.put("/articles/:id", asyncHandler(updateArticle));
adminRouter.delete("/articles/:id", asyncHandler(deleteArticle));
adminRouter.get("/categories", asyncHandler(listCategories));
adminRouter.post("/categories", asyncHandler(createCategory));
adminRouter.put("/categories/:id", asyncHandler(updateCategory));
adminRouter.delete("/categories/:id", asyncHandler(deleteCategory));
adminRouter.get("/tags", asyncHandler(listTags));
adminRouter.post("/tags", asyncHandler(createTag));
adminRouter.put("/tags/:id", asyncHandler(updateTag));
adminRouter.delete("/tags/:id", asyncHandler(deleteTag));
adminRouter.get("/authors", asyncHandler(listAuthors));
adminRouter.post("/upload", upload.single("file"), asyncHandler(uploadCover));
