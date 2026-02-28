import type { ArticlePreview } from "@it-blog/shared";
import { ArticleCard } from "../../../components/article-card";
import { getAuthor, getAuthorArticles } from "../../../lib/api";
import { buildMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthor(slug);

  return buildMetadata({
    title: author.name,
    description: author.bio ?? `Профіль автора ${author.name}`,
    path: `/authors/${slug}`,
    image: author.avatar_url
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [author, articles] = await Promise.all([getAuthor(slug), getAuthorArticles(slug)]);

  return (
    <section className="stack">
      <div className="hero">
        <p>Автор</p>
        <h1>{author.name}</h1>
        <p>{author.bio}</p>
      </div>
      {articles.data.map((article: ArticlePreview) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </section>
  );
}
