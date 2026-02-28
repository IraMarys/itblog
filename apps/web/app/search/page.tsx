import { SearchClient } from "../../components/search-client";
import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  title: "Пошук",
  description: "Пошук по заголовках та тексту статей блогу.",
  path: "/search"
});

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <section className="stack">
      <div className="hero">
        <p>Пошук</p>
        <h1>Знайди потрібну статтю.</h1>
      </div>
      <SearchClient initialQuery={q ?? ""} />
    </section>
  );
}

