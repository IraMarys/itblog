import type { ArticlePreview } from "@it-blog/shared";
import { ArticleCard } from "../components/article-card";
import { CategoryFilter } from "../components/category-filter";
import { Pagination } from "../components/pagination";
import { getArticles, getCategories } from "../lib/api";
import { buildMetadata } from "../lib/seo";

export const revalidate = 120;
export const metadata = buildMetadata({
  title: "IT Blog",
  description: "Останні новини зі світу frontend, backend, AI, DevOps та кібербезпеки.",
  path: "/"
});

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? "1");
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles({
      category: resolvedSearchParams.category,
      page
    })
  ]);

  return (
    <>
      <section className="hero">
        <p>Новини, аналітика та практичні матеріали для сучасної IT-команди.</p>
        <h1>SEO-оптимізований блог про технології з SSR.</h1>
      </section>
      <CategoryFilter categories={categories} />
      <section className="grid">
        {articles.data.map((article: ArticlePreview) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </section>
      <Pagination
        page={articles.meta.page}
        pageCount={articles.meta.pageCount}
        basePath={resolvedSearchParams.category ? `/?category=${resolvedSearchParams.category}&page=` : "/?page="}
      />
    </>
  );
}
