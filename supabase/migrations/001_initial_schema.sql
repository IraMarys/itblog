create extension if not exists pgcrypto;

create table if not exists users (
  id serial primary key,
  name varchar(100) not null,
  slug varchar(100) not null unique,
  email varchar(150) not null unique,
  password varchar(255) not null,
  bio text,
  avatar_url varchar(500),
  is_admin boolean default false,
  created_at timestamp default now()
);

create table if not exists categories (
  id serial primary key,
  name varchar(100) not null,
  slug varchar(100) not null unique,
  description text,
  created_at timestamp default now()
);

create table if not exists articles (
  id serial primary key,
  title varchar(300) not null,
  slug varchar(300) not null unique,
  excerpt text,
  content text not null,
  cover_url varchar(500),
  author_id integer references users(id) on delete set null,
  category_id integer references categories(id) on delete set null,
  status varchar(20) default 'draft' check (status in ('draft', 'published')),
  views integer default 0,
  meta_title varchar(300),
  meta_description varchar(500),
  published_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists tags (
  id serial primary key,
  name varchar(100) not null,
  slug varchar(100) not null unique,
  created_at timestamp default now()
);

create table if not exists article_tags (
  article_id integer references articles(id) on delete cascade,
  tag_id integer references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_status on articles(status);
create index if not exists idx_articles_category on articles(category_id);
create index if not exists idx_articles_author on articles(author_id);
create index if not exists idx_articles_published on articles(published_at desc);
create index if not exists idx_users_slug on users(slug);
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_tags_slug on tags(slug);

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on articles;
create trigger set_articles_updated_at
before update on articles
for each row
execute function update_updated_at_column();

insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public can view article covers" on storage.objects;
create policy "Public can view article covers"
on storage.objects
for select
to public
using (bucket_id = 'article-covers');

drop policy if exists "Service role manages article covers" on storage.objects;
create policy "Service role manages article covers"
on storage.objects
for all
to service_role
using (bucket_id = 'article-covers')
with check (bucket_id = 'article-covers');
