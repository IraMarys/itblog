import type { ArticlePreview } from "@it-blog/shared";
import { getArticles } from "../../lib/api";
import { siteUrl } from "../../lib/env";

export async function GET() {
  const articles = await getArticles({ pageSize: 20 });
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>IT Blog</title>
      <link>${siteUrl}</link>
      <description>Останні публікації IT Blog</description>
      ${articles.data
        .map(
          (article: ArticlePreview) => `
        <item>
          <title>${article.title}</title>
          <link>${siteUrl}/articles/${article.slug}</link>
          <description>${article.excerpt ?? ""}</description>
          <pubDate>${article.published_at ?? article.created_at}</pubDate>
        </item>`
        )
        .join("")}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
