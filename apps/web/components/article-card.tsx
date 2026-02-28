import type { ArticlePreview, Tag } from "@it-blog/shared";
import Link from "next/link";

export function ArticleCard({ article }: { article: ArticlePreview }) {
  return (
    <article className="card">
      <div className="card-meta">
        <span>{article.category?.name ?? "Без категорії"}</span>
        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("uk-UA") : "Чернетка"}</span>
      </div>
      <h2>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p>{article.excerpt}</p>
      <div className="card-footer">
        <span>{article.author?.name ?? "Невідомий автор"}</span>
        <span>{article.views} переглядів</span>
      </div>
      <div className="tag-list">
        {article.tags.map((tag: Tag) => (
          <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag">
            #{tag.name}
          </Link>
        ))}
      </div>
    </article>
  );
}
