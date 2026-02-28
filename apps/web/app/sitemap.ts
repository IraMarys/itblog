import type { ArticlePreview, Category, Tag } from "@it-blog/shared";
import type { MetadataRoute } from "next";
import { getArticles, getCategories, getTags } from "../lib/api";
import { siteUrl } from "../lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags] = await Promise.all([getArticles(), getCategories(), getTags()]);

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1
    },
    ...articles.data.map((article: ArticlePreview) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...categories.map((category: Category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...tags.map((tag: Tag) => ({
      url: `${siteUrl}/tags/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))
  ];
}
