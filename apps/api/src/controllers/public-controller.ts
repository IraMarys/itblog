import type { Request, Response } from "express";
import { query } from "../lib/query.js";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
  listPublishedArticles
} from "../services/article-service.js";

function getQueryValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
}

function getParamValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getArticles(request: Request, response: Response) {
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 10);
  const category = getQueryValue(request.query.category);
  const tag = getQueryValue(request.query.tag);
  const search = getQueryValue(request.query.q);

  const result = await listPublishedArticles({ page, pageSize, category, tag, search });
  response.json(result);
}

export async function getArticle(request: Request, response: Response) {
  const slug = getParamValue(request.params.slug);
  const article = await getArticleBySlug(slug);
  if (!article) {
    return response.status(404).json({ message: "Article not found" });
  }
  return response.json(article);
}

export async function getRelated(request: Request, response: Response) {
  response.json(await getRelatedArticles(getParamValue(request.params.slug)));
}

export async function addView(request: Request, response: Response) {
  await incrementArticleViews(Number(request.params.id));
  response.status(204).send();
}

export async function getCategories(_request: Request, response: Response) {
  const result = await query("SELECT * FROM categories ORDER BY name ASC");
  response.json(result.rows);
}

export async function getCategoryArticles(request: Request, response: Response) {
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 10);
  const slug = getParamValue(request.params.slug);
  const result = await listPublishedArticles({
    page,
    pageSize,
    category: slug
  });
  response.json(result);
}

export async function getTags(_request: Request, response: Response) {
  const result = await query("SELECT * FROM tags ORDER BY name ASC");
  response.json(result.rows);
}

export async function getTagArticles(request: Request, response: Response) {
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 10);
  const slug = getParamValue(request.params.slug);
  const result = await listPublishedArticles({
    page,
    pageSize,
    tag: slug
  });
  response.json(result);
}

export async function getAuthor(request: Request, response: Response) {
  const slug = getParamValue(request.params.slug);
  const result = await query("SELECT id, name, slug, email, bio, avatar_url, is_admin, created_at FROM users WHERE slug = $1", [
    slug
  ]);
  if (!result.rows[0]) {
    return response.status(404).json({ message: "Author not found" });
  }
  return response.json(result.rows[0]);
}

export async function getAuthorArticles(request: Request, response: Response) {
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 10);
  const slug = getParamValue(request.params.slug);
  const result = await query<{ id: number }>("SELECT id FROM users WHERE slug = $1", [slug]);
  if (!result.rows[0]) {
    return response.status(404).json({ message: "Author not found" });
  }

  const data = await listPublishedArticles({ page, pageSize, author: slug });
  response.json(data);
}

export async function searchArticles(request: Request, response: Response) {
  const queryString = getQueryValue(request.query.q) ?? "";
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 10);
  const result = await listPublishedArticles({
    page,
    pageSize,
    search: queryString
  });
  response.json(result);
}
