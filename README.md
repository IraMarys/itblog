# IT Blog

Монорепозиторій для SEO-орієнтованого IT-блогу зі стеком:

- `apps/web`: Next.js App Router + React + SSR/SSG
- `apps/api`: Express API + JWT + PostgreSQL/Supabase
- `packages/shared`: спільні типи
- `supabase`: SQL-схема, індекси та seed

## Швидкий старт

Встанови залежності: `npm install`
Запуск: `npm run dev`

Тестовий адміністратор:

- Email: `admin@itblog.local`
- Password: `admin123`

## Структура

- Публічні сторінки: `/`, `/articles/[slug]`, `/categories/[slug]`, `/authors/[slug]`, `/tags/[slug]`, `/search`
- SEO-сторінки: `/sitemap.xml`, `/robots.txt`, `/rss.xml`
- Адмінка: `/admin`, `/admin/articles`, `/admin/categories`, `/admin/tags`, `/admin/authors`
