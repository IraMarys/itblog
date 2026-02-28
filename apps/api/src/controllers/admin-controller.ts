import type { Request, Response } from "express";
import { query } from "../lib/query.js";
import { supabaseAdmin } from "../lib/supabase.js";

function optionalText(value: unknown) {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalDate(value: unknown) {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function replaceArticleTags(articleId: number, tagIds: number[]) {
  await query("DELETE FROM article_tags WHERE article_id = $1", [articleId]);
  for (const tagId of tagIds) {
    await query("INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)", [articleId, tagId]);
  }
}

export async function getAdminArticles(_request: Request, response: Response) {
  const result = await query(`
    SELECT
      a.*,
      u.name AS author_name,
      c.name AS category_name,
      COALESCE(array_agg(at.tag_id) FILTER (WHERE at.tag_id IS NOT NULL), '{}') AS tag_ids
    FROM articles a
    LEFT JOIN users u ON u.id = a.author_id
    LEFT JOIN categories c ON c.id = a.category_id
    LEFT JOIN article_tags at ON at.article_id = a.id
    GROUP BY a.id, u.name, c.name
    ORDER BY a.updated_at DESC
  `);
  response.json(result.rows);
}

export async function createArticle(request: Request, response: Response) {
  const {
    title,
    slug,
    excerpt,
    content,
    cover_url,
    author_id,
    category_id,
    status,
    meta_title,
    meta_description,
    published_at,
    tag_ids = []
  } = request.body;

  const safeTitle = typeof title === "string" ? title.trim() : "";
  const safeSlug = typeof slug === "string" ? slug.trim() : "";
  const safeContent = typeof content === "string" ? content.trim() : "";

  if (!safeTitle || !safeSlug || !safeContent) {
    return response.status(400).json({ message: "title, slug and content are required" });
  }

  const result = await query<{ id: number }>(
    `INSERT INTO articles
      (title, slug, excerpt, content, cover_url, author_id, category_id, status, meta_title, meta_description, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      safeTitle,
      safeSlug,
      optionalText(excerpt),
      safeContent,
      optionalText(cover_url),
      author_id ?? null,
      category_id ?? null,
      optionalText(status) ?? "draft",
      optionalText(meta_title),
      optionalText(meta_description),
      optionalDate(published_at)
    ]
  );

  await replaceArticleTags(result.rows[0].id, tag_ids);
  response.status(201).json({ id: result.rows[0].id });
}

export async function updateArticle(request: Request, response: Response) {
  const articleId = Number(request.params.id);
  const {
    title,
    slug,
    excerpt,
    content,
    cover_url,
    author_id,
    category_id,
    status,
    meta_title,
    meta_description,
    published_at,
    tag_ids = []
  } = request.body;

  const safeTitle = typeof title === "string" ? title.trim() : "";
  const safeSlug = typeof slug === "string" ? slug.trim() : "";
  const safeContent = typeof content === "string" ? content.trim() : "";

  if (!safeTitle || !safeSlug || !safeContent) {
    return response.status(400).json({ message: "title, slug and content are required" });
  }

  await query(
    `UPDATE articles
     SET title = $1,
         slug = $2,
         excerpt = $3,
         content = $4,
         cover_url = $5,
         author_id = $6,
         category_id = $7,
         status = $8,
         meta_title = $9,
         meta_description = $10,
         published_at = $11,
         updated_at = NOW()
     WHERE id = $12`,
    [
      safeTitle,
      safeSlug,
      optionalText(excerpt),
      safeContent,
      optionalText(cover_url),
      author_id ?? null,
      category_id ?? null,
      optionalText(status) ?? "draft",
      optionalText(meta_title),
      optionalText(meta_description),
      optionalDate(published_at),
      articleId
    ]
  );

  await replaceArticleTags(articleId, tag_ids);
  response.status(204).send();
}

export async function deleteArticle(request: Request, response: Response) {
  await query("DELETE FROM articles WHERE id = $1", [Number(request.params.id)]);
  response.status(204).send();
}

export async function listAuthors(_request: Request, response: Response) {
  const result = await query("SELECT id, name, slug, email, bio, avatar_url, is_admin, created_at FROM users ORDER BY created_at DESC");
  response.json(result.rows);
}

export async function listCategories(_request: Request, response: Response) {
  const result = await query("SELECT * FROM categories ORDER BY name ASC");
  response.json(result.rows);
}

export async function createCategory(request: Request, response: Response) {
  const { name, slug, description } = request.body;
  const result = await query("INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id", [
    name,
    slug,
    description
  ]);
  response.status(201).json(result.rows[0]);
}

export async function updateCategory(request: Request, response: Response) {
  const { name, slug, description } = request.body;
  await query("UPDATE categories SET name = $1, slug = $2, description = $3 WHERE id = $4", [
    name,
    slug,
    description,
    Number(request.params.id)
  ]);
  response.status(204).send();
}

export async function deleteCategory(request: Request, response: Response) {
  await query("DELETE FROM categories WHERE id = $1", [Number(request.params.id)]);
  response.status(204).send();
}

export async function listTags(_request: Request, response: Response) {
  const result = await query("SELECT * FROM tags ORDER BY name ASC");
  response.json(result.rows);
}

export async function createTag(request: Request, response: Response) {
  const { name, slug } = request.body;
  const result = await query("INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id", [name, slug]);
  response.status(201).json(result.rows[0]);
}

export async function updateTag(request: Request, response: Response) {
  const { name, slug } = request.body;
  await query("UPDATE tags SET name = $1, slug = $2 WHERE id = $3", [name, slug, Number(request.params.id)]);
  response.status(204).send();
}

export async function deleteTag(request: Request, response: Response) {
  await query("DELETE FROM tags WHERE id = $1", [Number(request.params.id)]);
  response.status(204).send();
}

export async function uploadCover(request: Request, response: Response) {
  const file = request.file;
  if (!file) {
    return response.status(400).json({ message: "File is required" });
  }

  const filePath = `covers/${Date.now()}-${file.originalname}`;
  const { error } = await supabaseAdmin.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET ?? "article-covers")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    return response.status(500).json({ message: error.message });
  }

  const { data } = supabaseAdmin.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET ?? "article-covers")
    .getPublicUrl(filePath);

  return response.status(201).json({ url: data.publicUrl, path: filePath });
}
