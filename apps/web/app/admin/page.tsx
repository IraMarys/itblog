import Link from "next/link";
import { AdminLogin } from "../../components/admin-login";
import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  title: "Адмін-панель",
  description: "Авторизація для управління контентом блогу.",
  path: "/admin"
});

export default function AdminPage() {
  return (
    <section className="stack">
      <div className="hero">
        <p>Адмінка</p>
        <h1>Керування блогом</h1>
      </div>
      <AdminLogin />
      <div className="admin-grid">
        <Link href="/admin/articles" className="card">
          Статті
        </Link>
        <Link href="/admin/categories" className="card">
          Категорії
        </Link>
        <Link href="/admin/tags" className="card">
          Теги
        </Link>
        <Link href="/admin/authors" className="card">
          Автори
        </Link>
      </div>
    </section>
  );
}

