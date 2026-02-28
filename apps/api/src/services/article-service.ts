import type { ArticleDetail, ArticlePreview, PaginatedResponse, Tag } from "@it-blog/shared";
import { pagination, query } from "../lib/query.js";

type RawArticleRow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  cover_url: string | null;
  status: "draft" | "published";
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: number | null;
  author_name: string | null;
  author_slug: string | null;
  author_avatar_url: string | null;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  tags: Tag[] | null;
};

function normalizeArticle(row: RawArticleRow): ArticlePreview {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    cover_url: row.cover_url,
    status: row.status,
    views: row.views,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: row.author_id
      ? {
          id: row.author_id,
          name: row.author_name ?? "",
          slug: row.author_slug ?? "",
          avatar_url: row.author_avatar_url
        }
      : null,
    category: row.category_id
      ? {
          id: row.category_id,
          name: row.category_name ?? "",
          slug: row.category_slug ?? ""
        }
      : null,
    tags: row.tags ?? []
  };
}

const articleSelect = `
  SELECT
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.cover_url,
    a.status,
    a.views,
    a.meta_title,
    a.meta_description,
    a.published_at,
    a.created_at,
    a.updated_at,
    u.id AS author_id,
    u.name AS author_name,
    u.slug AS author_slug,
    u.avatar_url AS author_avatar_url,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug, 'created_at', t.created_at)
      ) FILTER (WHERE t.id IS NOT NULL),
      '[]'
    ) AS tags
  FROM articles a
  LEFT JOIN users u ON u.id = a.author_id
  LEFT JOIN categories c ON c.id = a.category_id
  LEFT JOIN article_tags at ON at.article_id = a.id
  LEFT JOIN tags t ON t.id = at.tag_id
`;

export async function listPublishedArticles(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
}) {
  const { page, pageSize, offset } = pagination(params.page, params.pageSize);
  const values: unknown[] = ["published"];
  const filters = ["a.status = $1"];

  if (params.category) {
    values.push(params.category);
    filters.push(`c.slug = $${values.length}`);
  }

  if (params.tag) {
    values.push(params.tag);
    filters.push(`t.slug = $${values.length}`);
  }

  if (params.search) {
    values.push(`%${params.search}%`);
    filters.push(`(a.title ILIKE $${values.length} OR a.content ILIKE $${values.length})`);
  }

  if (params.author) {
    values.push(params.author);
    filters.push(`u.slug = $${values.length}`);
  }

  values.push(pageSize, offset);

  const rows = await query<RawArticleRow>(
    `${articleSelect}
    WHERE ${filters.join(" AND ")}
    GROUP BY a.id, u.id, c.id
    ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}`
    ,
    values
  );

  const countValues = values.slice(0, values.length - 2);
  const count = await query<{ count: string }>(
    `SELECT COUNT(DISTINCT a.id)::text AS count
     FROM articles a
     LEFT JOIN users u ON u.id = a.author_id
     LEFT JOIN categories c ON c.id = a.category_id
     LEFT JOIN article_tags at ON at.article_id = a.id
     LEFT JOIN tags t ON t.id = at.tag_id
     WHERE ${filters.join(" AND ")}`,
    countValues
  );

  const total = Number(count.rows[0]?.count ?? 0);

  return {
    data: rows.rows.map(normalizeArticle),
    meta: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize)
    }
  } satisfies PaginatedResponse<ArticlePreview>;
}

export async function getArticleBySlug(slug: string, includeDraft = false) {
  const statusFilter = includeDraft ? "" : "AND a.status = 'published'";
  const result = await query<RawArticleRow>(
    `${articleSelect}
    WHERE a.slug = $1 ${statusFilter}
    GROUP BY a.id, u.id, c.id`,
    [slug]
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    ...normalizeArticle(row),
    content: row.content ?? ""
  } satisfies ArticleDetail;
}

export async function getRelatedArticles(slug: string) {
  const result = await query<RawArticleRow>(
    `${articleSelect}
    WHERE a.status = 'published'
      AND a.slug <> $1
      AND a.category_id = (SELECT category_id FROM articles WHERE slug = $1)
    GROUP BY a.id, u.id, c.id
    ORDER BY a.published_at DESC NULLS LAST
    LIMIT 4`,
    [slug]
  );

  return result.rows.map(normalizeArticle);
}

export async function incrementArticleViews(id: number) {
  await query("UPDATE articles SET views = views + 1 WHERE id = $1", [id]);
}
