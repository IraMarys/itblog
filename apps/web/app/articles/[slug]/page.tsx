import type { ArticlePreview, Tag } from "@it-blog/shared";
import Link from "next/link";
import { ArticleViewTracker } from "../../../components/article-view-tracker";
import { ArticleCard } from "../../../components/article-card";
import { getArticle, getRelatedArticles } from "../../../lib/api";
import { buildMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return buildMetadata({
    title: article.meta_title ?? article.title,
    description: article.meta_description ?? article.excerpt ?? article.title,
    path: `/articles/${article.slug}`,
    image: article.cover_url
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, related] = await Promise.all([getArticle(slug), getRelatedArticles(slug)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    author: article.author?.name,
    image: article.cover_url
  };

  return (
    <div className="stack">
      <article className="card">
        <ArticleViewTracker articleId={article.id} />
        <div className="article-meta">
          <span>{article.category?.name}</span>
          <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("uk-UA") : ""}</span>
          <span>{article.views} переглядів</span>
        </div>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <p>
          Автор: <Link href={`/authors/${article.author?.slug}`}>{article.author?.name}</Link>
        </p>
        <div className="tag-list">
          {article.tags.map((tag: Tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag">
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className="article-content">{article.content}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>

      <section className="stack">
        <h2>Пов'язані статті</h2>
        {related.map((item: ArticlePreview) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </section>
    </div>
  );
}
