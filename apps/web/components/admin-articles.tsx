"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { apiUrl } from "../lib/env";

type AdminArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url?: string;
  author_id?: number;
  category_id?: number;
  status: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  tag_ids?: number[];
  author_name?: string;
  category_name?: string;
};

type ResourceOption = {
  id: number;
  name: string;
  slug?: string;
};

type ArticleForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  author_id: string;
  category_id: string;
  status: string;
  meta_title: string;
  meta_description: string;
  published_at: string;
  tag_ids: number[];
};

const initialForm: ArticleForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  author_id: "",
  category_id: "",
  status: "draft",
  meta_title: "",
  meta_description: "",
  published_at: "",
  tag_ids: []
};

function toPublishDateTimeLocalValue(date = new Date()) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

export function AdminArticles() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [authors, setAuthors] = useState<ResourceOption[]>([]);
  const [categories, setCategories] = useState<ResourceOption[]>([]);
  const [tags, setTags] = useState<ResourceOption[]>([]);

  function getToken() {
    return localStorage.getItem("admin-token");
  }

  async function load() {
    const token = getToken();
    if (!token) {
      window.location.href = "/admin";
      return;
    }

    const [articlesResponse, authorsResponse, categoriesResponse, tagsResponse] = await Promise.all([
      fetch(`${apiUrl}/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${apiUrl}/admin/authors`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${apiUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${apiUrl}/admin/tags`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    if (articlesResponse.ok) {
      setArticles(await articlesResponse.json());
    }

    if (authorsResponse.ok) {
      setAuthors(await authorsResponse.json());
    }

    if (categoriesResponse.ok) {
      setCategories(await categoriesResponse.json());
    }

    if (tagsResponse.ok) {
      setTags(await tagsResponse.json());
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/articles${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          author_id: form.author_id ? Number(form.author_id) : null,
          category_id: form.category_id ? Number(form.category_id) : null,
          tag_ids: form.tag_ids
        })
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null;
        setMessage(error?.message ?? "Не вдалося зберегти статтю");
        return;
      }
    } catch {
      setMessage("Не вдалося зв'язатися з API. Перевір, чи сервер запущений.");
      return;
    }

    setForm(initialForm);
    setEditingId(null);
    setMessage(editingId ? "Статтю оновлено" : "Статтю створено");
    await load();
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");
    if (!(file instanceof File) || !file.name) {
      return;
    }

    setUploading(true);
    const response = await fetch(`${apiUrl}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    setUploading(false);

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { url: string };
    setForm((current) => ({ ...current, cover_url: data.url }));
    event.currentTarget.reset();
  }

  async function deleteArticle(id: number) {
    const token = getToken();
    if (!token) {
      return;
    }
    await fetch(`${apiUrl}/admin/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    await load();
  }

  function startEdit(article: AdminArticle) {
    setEditingId(article.id);
    setMessage("");
    setForm({
      title: article.title ?? "",
      slug: article.slug ?? "",
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      cover_url: article.cover_url ?? "",
      author_id: article.author_id ? String(article.author_id) : "",
      category_id: article.category_id ? String(article.category_id) : "",
      status: article.status ?? "draft",
      meta_title: article.meta_title ?? "",
      meta_description: article.meta_description ?? "",
      published_at: article.published_at ? toPublishDateTimeLocalValue(new Date(article.published_at)) : "",
      tag_ids: article.tag_ids ?? []
    });
  }

  function resetForm() {
    setEditingId(null);
    setMessage("");
    setForm(initialForm);
  }

  function toggleTag(tagId: number) {
    setForm((current) => ({
      ...current,
      tag_ids: current.tag_ids.includes(tagId)
        ? current.tag_ids.filter((currentTagId) => currentTagId !== tagId)
        : [...current.tag_ids, tagId]
    }));
  }

  return (
    <section className="admin-section">
      <h1>{editingId ? "Редагування статті" : "Статті"}</h1>
      <form className="admin-form" onSubmit={onSubmit}>
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="title"
        />
        <input
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          placeholder="slug"
        />
        <textarea
          value={form.excerpt}
          onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
          placeholder="excerpt"
          rows={3}
        />
        <textarea
          value={form.content}
          onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
          placeholder="content"
          rows={8}
        />
        <input
          value={form.cover_url}
          onChange={(event) => setForm((current) => ({ ...current, cover_url: event.target.value }))}
          placeholder="cover_url"
        />
        <label>
          Автор
          <select
            value={form.author_id}
            onChange={(event) => setForm((current) => ({ ...current, author_id: event.target.value }))}
          >
            <option value="">Оберіть автора</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Категорія
          <select
            value={form.category_id}
            onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Статус
          <select
            value={form.status}
            onChange={(event) => {
              const nextStatus = event.target.value;
              setForm((current) => ({
                ...current,
                status: nextStatus,
                published_at:
                  nextStatus === "published"
                    ? current.published_at || toPublishDateTimeLocalValue()
                    : ""
              }));
            }}
          >
            <option value="draft">Чернетка</option>
            <option value="published">Опубліковано</option>
          </select>
        </label>
        <input
          value={form.meta_title}
          onChange={(event) => setForm((current) => ({ ...current, meta_title: event.target.value }))}
          placeholder="meta_title"
        />
        <textarea
          value={form.meta_description}
          onChange={(event) => setForm((current) => ({ ...current, meta_description: event.target.value }))}
          placeholder="meta_description"
          rows={3}
        />
        <label>
          Дата публікації
          <input
            value={form.published_at}
            onChange={(event) => setForm((current) => ({ ...current, published_at: event.target.value }))}
            type="datetime-local"
            disabled={form.status !== "published"}
          />
        </label>
        <fieldset className="tag-fieldset">
          <legend>Теги</legend>
          <div className="tag-checkboxes">
            {tags.map((tag) => (
              <label key={tag.id} className="checkbox-chip">
                <input
                  type="checkbox"
                  checked={form.tag_ids.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="action-row">
          <button type="submit">{editingId ? "Оновити статтю" : "Створити статтю"}</button>
          {editingId ? (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Скасувати редагування
            </button>
          ) : null}
        </div>
      </form>
      {message ? <p>{message}</p> : null}
      <form className="admin-form" onSubmit={onUpload}>
        <input name="file" type="file" accept="image/*" />
        <button type="submit">{uploading ? "Завантаження..." : "Завантажити обкладинку"}</button>
      </form>
      <div className="stack">
        {articles.map((article) => (
          <article key={article.id} className="card">
            <h2>{article.title}</h2>
            <p>{article.slug}</p>
            <p>{article.status}</p>
            <p>{article.author_name ?? "Без автора"}</p>
            <p>{article.category_name ?? "Без категорії"}</p>
            <div className="action-row">
              <button type="button" onClick={() => startEdit(article)}>
                Редагувати
              </button>
              <button type="button" className="danger-button" onClick={() => deleteArticle(article.id)}>
                Видалити
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
