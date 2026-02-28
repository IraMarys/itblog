import type { ArticlePreview } from "@it-blog/shared";
import { ArticleCard } from "../../../components/article-card";
import { getTagArticles, getTags } from "../../../lib/api";
import { buildMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((item) => item.slug === slug);

  return buildMetadata({
    title: `#${tag?.name ?? slug}`,
    description: `Статті за тегом ${tag?.name ?? slug}`,
    path: `/tags/${slug}`
  });
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getTagArticles(slug);

  return (
    <section className="stack">
      <div className="hero">
        <p>Тег</p>
        <h1>#{slug}</h1>
      </div>
      {articles.data.map((article: ArticlePreview) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </section>
  );
}
