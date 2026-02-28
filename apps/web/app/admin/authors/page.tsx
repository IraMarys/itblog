"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../../../lib/env";

type Author = {
  id: number;
  name: string;
  email: string;
  slug: string;
};

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      window.location.href = "/admin";
      return;
    }

    void fetch(`${apiUrl}/admin/authors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => setAuthors(data));
  }, []);

  return (
    <section className="stack">
      <h1>Автори</h1>
      {authors.map((author) => (
        <article key={author.id} className="card">
          <h2>{author.name}</h2>
          <p>{author.email}</p>
          <p>{author.slug}</p>
        </article>
      ))}
    </section>
  );
}

