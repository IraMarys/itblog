import type { ArticlePreview } from "@it-blog/shared";
import { ArticleCard } from "../../../components/article-card";
import { Pagination } from "../../../components/pagination";
import { getCategories, getCategoryArticles } from "../../../lib/api";
import { buildMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return buildMetadata({
    title: category?.name ?? "Категорія",
    description: category?.description ?? `Статті категорії ${slug}`,
    path: `/categories/${slug}`
  });
}

export const revalidate = 120;

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const categoryArticles = await getCategoryArticles(slug, Number(page ?? "1"));
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return (
    <section className="stack">
      <div className="hero">
        <p>Категорія</p>
        <h1>{category?.name ?? slug}</h1>
        <p>{category?.description}</p>
      </div>
      {categoryArticles.data.map((article: ArticlePreview) => (
        <ArticleCard key={article.id} article={article} />
      ))}
      <Pagination page={categoryArticles.meta.page} pageCount={categoryArticles.meta.pageCount} basePath={`/categories/${slug}?page=`} />
    </section>
  );
}
