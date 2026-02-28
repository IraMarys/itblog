import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="shell site-header">
      <Link href="/" className="brand">
        IT Blog
      </Link>
      <nav className="nav">
        <Link href="/">Головна</Link>
        <Link href="/search">Пошук</Link>
        <Link href="/admin">Адмінка</Link>
      </nav>
    </header>
  );
}

