# IT Blog

Монорепозиторій для SEO-орієнтованого IT-блогу зі стеком:

- `apps/web`: Next.js App Router + React + SSR/SSG
- `apps/api`: Express API + JWT + PostgreSQL/Supabase
- `packages/shared`: спільні типи
- `supabase`: SQL-схема, індекси та seed

## Швидкий старт

1. Створи проєкт у Supabase.
2. Виконай SQL із [`supabase/migrations/001_initial_schema.sql`](/Users/iramaryshchak/Desktop/seo/supabase/migrations/001_initial_schema.sql).
3. За потреби виконай seed із [`supabase/seed/001_seed.sql`](/Users/iramaryshchak/Desktop/seo/supabase/seed/001_seed.sql).
4. Скопіюй `.env.example` у `.env` та підстав свої ключі.
5. Встанови залежності: `npm install`
6. Запуск: `npm run dev`

## Структура

- Публічні сторінки: `/`, `/articles/[slug]`, `/categories/[slug]`, `/authors/[slug]`, `/tags/[slug]`, `/search`
- SEO-сторінки: `/sitemap.xml`, `/robots.txt`, `/rss.xml`
- Адмінка: `/admin`, `/admin/articles`, `/admin/categories`, `/admin/tags`, `/admin/authors`

# itblog
