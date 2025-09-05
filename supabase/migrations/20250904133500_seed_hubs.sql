-- Seed sample data for dynamic hubs and MDX guides demo

-- Games
insert into public.games (id, slug, title, description, cover_path)
select gen_random_uuid(), 'gta6', 'Grand Theft Auto VI', 'The next entry in Rockstar''s open-world series set in Leonida.', null
where not exists (select 1 from public.games where slug = 'gta6');

insert into public.games (id, slug, title, description, cover_path)
select gen_random_uuid(), 'minecraft', 'Minecraft', 'A sandbox game about placing blocks and going on adventures.', null
where not exists (select 1 from public.games where slug = 'minecraft');

insert into public.games (id, slug, title, description, cover_path)
select gen_random_uuid(), 'pubg', 'PUBG: Battlegrounds', 'Tactical battle royale shooter on PC and consoles.', null
where not exists (select 1 from public.games where slug = 'pubg');

-- News (image_url uses a public placeholder)
insert into public.news (title, slug, excerpt, image_url, tags, published_at, source_url, source)
select
  'GTA 6 trailer breakdown',
  'gta6-trailer-breakdown',
  'Highlights and details from the official GTA 6 trailer.',
  '/placeholder.svg',
  array['gta6'],
  now(),
  'https://www.rockstargames.com/newswire',
  'Official'
where not exists (select 1 from public.news where slug = 'gta6-trailer-breakdown');

insert into public.news (title, slug, excerpt, image_url, tags, published_at, source_url, source)
select
  'Best Minecraft seeds to try',
  'minecraft-best-seeds',
  'Explore new worlds with these curated Minecraft seeds.',
  '/placeholder.svg',
  array['minecraft'],
  now(),
  'https://www.minecraft.net/en-us/article',
  'Official'
where not exists (select 1 from public.news where slug = 'minecraft-best-seeds');

-- Guides (inline MDX for demo)
insert into public.guides (title, slug, description, body_mdx, tags, mdx_path)
select
  'GTA 6: Getting Started',
  'gta6-getting-started',
  'Everything to know before launch: editions, map, and more.',
  '# GTA 6: Getting Started\n\nThis guide covers launch details, editions, and tips.\n\n## Editions\n\n- Standard\n- Deluxe\n\n```ts\nexport const editions = ["Standard","Deluxe"]\n```\n',
  array['gta6'],
  '' -- mdx_path blank for inline demo
where not exists (select 1 from public.guides where slug = 'gta6-getting-started');

insert into public.guides (title, slug, description, body_mdx, tags, mdx_path)
select
  'Minecraft Survival Basics',
  'minecraft-survival-basics',
  'A quick primer on surviving your first night.',
  '# Minecraft: Survival Basics\n\nGather wood, craft tools, and build a shelter before sundown.\n\n```json\n{"tip":"craft a bed to skip the night"}\n```\n',
  array['minecraft'],
  ''
where not exists (select 1 from public.guides where slug = 'minecraft-survival-basics');

