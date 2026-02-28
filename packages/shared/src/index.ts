export type ArticleStatus = "draft" | "published";

export interface User {
  id: number;
  name: string;
  slug: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface ArticlePreview {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  status: ArticleStatus;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: Pick<User, "id" | "name" | "slug" | "avatar_url"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  tags: Tag[];
}

export interface ArticleDetail extends ArticlePreview {
  content: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
