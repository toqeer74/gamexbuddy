create or replace function public.search_all(q text)
returns table(kind text, title text, snippet text, id text)
language sql stable as $$
  with 
  games as (
    select 'game'::text as kind, g.title, g.description as snippet, g.slug as id
    from public.games g
    where to_tsvector('simple', coalesce(g.title,'') || ' ' || coalesce(g.description,'')) @@ plainto_tsquery('simple', q)
    limit 20
  ),
  news as (
    select 'news'::text as kind, n.title, n.excerpt as snippet, n.slug as id
    from public.news n
    where to_tsvector('simple', coalesce(n.title,'') || ' ' || coalesce(n.excerpt,'')) @@ plainto_tsquery('simple', q)
    limit 20
  ),
  guides as (
    select 'guide'::text as kind, g.title, g.description as snippet, g.slug as id
    from public.guides g
    where to_tsvector('simple', coalesce(g.title,'') || ' ' || coalesce(g.description,'')) @@ plainto_tsquery('simple', q)
    limit 20
  ),
  posts as (
    select case when p.type='thread' then 'thread' else 'meme' end as kind,
           coalesce(p.title, '[No title]') as title,
           left(coalesce(p.body, ''), 160) as snippet,
           p.id::text as id
    from public.posts p
    where to_tsvector('simple', coalesce(p.title,'') || ' ' || coalesce(p.body,'')) @@ plainto_tsquery('simple', q)
    limit 20
  )
  select * from games
  union all select * from news
  union all select * from guides
  union all select * from posts
  limit 80;
$$;

