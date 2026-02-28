import type { ArticleDetail, ArticlePreview, Category, PaginatedResponse, Tag, User } from "@it-blog/shared";
import { apiUrl } from "./env";

type NextRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false;
  };
};

async function request<T>(path: string, init?: NextRequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    next: init?.method === "GET" ? { revalidate: 120 } : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function requestOrFallback<T>(path: string, fallback: T, init?: NextRequestInit): Promise<T> {
  try {
    return await request<T>(path, init);
  } catch {
    return fallback;
  }
}

const emptyPagination = {
  data: [],
  meta: {
    page: 1,
    pageSize: 10,
    total: 0,
    pageCount: 0
  }
} satisfies PaginatedResponse<ArticlePreview>;

export function getArticles(searchParams?: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestOrFallback<PaginatedResponse<ArticlePreview>>(`/articles${suffix}`, emptyPagination);
}

export function getArticle(slug: string) {
  return request<ArticleDetail>(`/articles/${slug}`);
}

export function getRelatedArticles(slug: string) {
  return request<ArticlePreview[]>(`/articles/${slug}/related`);
}

export function incrementView(id: number) {
  return request<void>(`/articles/${id}/view`, { method: "POST" });
}

export function getCategories() {
  return requestOrFallback<Category[]>("/categories", []);
}

export function getCategoryArticles(slug: string, page = 1) {
  return requestOrFallback<PaginatedResponse<ArticlePreview>>(
    `/categories/${slug}/articles?page=${page}`,
    emptyPagination
  );
}

export function getTags() {
  return requestOrFallback<Tag[]>("/tags", []);
}

export function getTagArticles(slug: string, page = 1) {
  return requestOrFallback<PaginatedResponse<ArticlePreview>>(`/tags/${slug}/articles?page=${page}`, emptyPagination);
}

export function getAuthor(slug: string) {
  return request<User>(`/authors/${slug}`);
}

export function getAuthorArticles(slug: string, page = 1) {
  return request<PaginatedResponse<ArticlePreview>>(`/authors/${slug}/articles?page=${page}`);
}

export function searchArticles(query: string, page = 1) {
  return requestOrFallback<PaginatedResponse<ArticlePreview>>(`/search?q=${encodeURIComponent(query)}&page=${page}`, emptyPagination, {
    cache: "no-store"
  });
}

export function adminRequest<T>(path: string, token: string, init?: RequestInit) {
  return request<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {})
    }
  });
}
