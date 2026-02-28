update users
set
  name = 'Diana Developer',
  slug = 'diana-developer',
  email = 'diana@itblog.local',
  bio = 'Пише про backend та DevOps.',
  avatar_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  is_admin = false
where slug = 'andrii-developer' or email = 'andrii@itblog.local';

insert into users (name, slug, email, password, bio, avatar_url, is_admin)
values
  (
    'Ira Maryshchak',
    'ira-maryshchak',
    'admin@itblog.local',
    '$2b$10$FfUz8to1feczZAICfI7X9eoHc07AnieJRWsQYMS3MvKWuxdoL1iE2',
    'Редакторка та адміністраторка IT Blog.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    true
  ),
  (
    'Diana Developer',
    'diana-developer',
    'diana@itblog.local',
    '$2b$10$FfUz8to1feczZAICfI7X9eoHc07AnieJRWsQYMS3MvKWuxdoL1iE2',
    'Пише про backend та DevOps.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    false
  )
on conflict (email) do update
set
  name = excluded.name,
  slug = excluded.slug,
  password = excluded.password,
  bio = excluded.bio,
  avatar_url = excluded.avatar_url,
  is_admin = excluded.is_admin;

insert into categories (name, slug, description)
values
  ('JavaScript / Frontend', 'javascript-frontend', 'Новини та практики frontend-розробки.'),
  ('Backend та DevOps', 'backend-devops', 'Серверна розробка, хостинг та автоматизація.'),
  ('Штучний інтелект та ML', 'ai-ml', 'Моделі, інструменти та AI-практика.'),
  ('Кібербезпека', 'cybersecurity', 'Новини та огляди з безпеки.'),
  ('Огляди інструментів', 'tooling', 'Порівняння сервісів та стеків.')
on conflict (slug) do nothing;

insert into tags (name, slug)
values
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('Supabase', 'supabase'),
  ('PostgreSQL', 'postgresql'),
  ('SEO', 'seo'),
  ('Node.js', 'nodejs')
on conflict (slug) do update
set name = excluded.name;

insert into articles (
  title,
  slug,
  excerpt,
  content,
  cover_url,
  author_id,
  category_id,
  status,
  views,
  meta_title,
  meta_description,
  published_at
)
select
  'Як побудувати SSR-блог на Next.js та Supabase',
  'ssr-blog-nextjs-supabase',
  'Покроковий розбір архітектури блогу з фокусом на SEO.',
  'Ця стаття пояснює, як поєднати Next.js App Router, Express API та Supabase PostgreSQL у production-ready стек для SEO-блогу.',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  u.id,
  c.id,
  'published',
  128,
  'SSR блог на Next.js та Supabase',
  'Архітектура SEO-блогу з React, Express та Supabase.',
  now() - interval '2 days'
from users u, categories c
where u.slug = 'ira-maryshchak' and c.slug = 'javascript-frontend'
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_url = excluded.cover_url,
  author_id = excluded.author_id,
  category_id = excluded.category_id,
  status = excluded.status,
  views = excluded.views,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  published_at = excluded.published_at;

insert into articles (
  title,
  slug,
  excerpt,
  content,
  cover_url,
  author_id,
  category_id,
  status,
  views,
  meta_title,
  meta_description,
  published_at
)
select
  'Підключення PostgreSQL у Supabase для командного блогу',
  'postgresql-supabase-it-blog',
  'Що потрібно налаштувати для стабільної роботи бази даних у студентському проєкті.',
  'Розглядаємо схему таблиць, індекси, Storage для обкладинок і стартові seed-дані для блогу.',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
  u.id,
  c.id,
  'published',
  94,
  'PostgreSQL у Supabase для IT Blog',
  'Структура бази даних і практика інтеграції Supabase у блог.',
  now() - interval '1 day'
from users u, categories c
where u.slug = 'diana-developer' and c.slug = 'backend-devops'
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_url = excluded.cover_url,
  author_id = excluded.author_id,
  category_id = excluded.category_id,
  status = excluded.status,
  views = excluded.views,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  published_at = excluded.published_at;

delete from article_tags
where article_id in (
  select id from articles where slug in ('ssr-blog-nextjs-supabase', 'postgresql-supabase-it-blog')
);

insert into article_tags (article_id, tag_id)
select a.id, t.id
from articles a
cross join tags t
where a.slug = 'ssr-blog-nextjs-supabase'
  and t.slug in ('react', 'nextjs', 'supabase', 'seo')
on conflict do nothing;

insert into article_tags (article_id, tag_id)
select a.id, t.id
from articles a
cross join tags t
where a.slug = 'postgresql-supabase-it-blog'
  and t.slug in ('supabase', 'postgresql', 'nodejs')
on conflict do nothing;
