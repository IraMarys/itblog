"use client";

import type { ArticlePreview } from "@it-blog/shared";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { searchArticles } from "../lib/api";
import { ArticleCard } from "./article-card";

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ArticlePreview[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialQuery) {
      return;
    }

    startTransition(async () => {
      const response = await searchArticles(initialQuery);
      setResults(response.data);
    });
  }, [initialQuery]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await searchArticles(query);
      setResults(response.data);
    });
  }

  return (
    <section>
      <form className="search-form" onSubmit={onSubmit}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Шукати по статтях" />
        <button type="submit">Знайти</button>
      </form>
      {isPending ? <p>Пошук...</p> : null}
      <div className="stack">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
