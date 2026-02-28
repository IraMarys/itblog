"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { apiUrl } from "../lib/env";

type ResourceItem = Record<string, string | number | null | undefined>;

export function AdminResource({
  endpoint,
  title,
  fields
}: {
  endpoint: string;
  title: string;
  fields: string[];
}) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});

  async function load() {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      window.location.href = "/admin";
      return;
    }

    const response = await fetch(`${apiUrl}/admin/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      setItems(await response.json());
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (!token) {
      return;
    }

    await fetch(`${apiUrl}/admin/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    setForm({});
    await load();
  }

  async function deleteItem(id: number | string) {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      return;
    }

    await fetch(`${apiUrl}/admin/${endpoint}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    await load();
  }

  return (
    <section className="admin-section">
      <h1>{title}</h1>
      <form className="admin-form" onSubmit={createItem}>
        {fields.map((field) => (
          <input
            key={field}
            value={form[field] ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
            placeholder={field}
          />
        ))}
        <button type="submit">Створити</button>
      </form>
      <div className="stack">
        {items.map((item) => (
          <article className="card" key={String(item.id)}>
            {fields.map((field) => (
              <p key={field}>
                <strong>{field}:</strong> {String(item[field] ?? "")}
              </p>
            ))}
            <button type="button" onClick={() => deleteItem(item.id ?? "")}>
              Видалити
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
