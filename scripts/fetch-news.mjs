import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function fetchRockstar() {
  const RSS = 'https://www.rockstargames.com/newswire/rss';
  const { data } = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS)}`);
  return (data.items || []).map((item) => ({
    id: item.guid || item.link,
    slug: (item.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
    title: item.title,
    date: item.pubDate,
    url: item.link,
    excerpt: (item.description||'').replace(/<[^>]*>?/gm, '').slice(0, 200) + '...',
    image: item.enclosure?.link || item.thumbnail,
    official: true,
    tags: ['Rockstar','Newswire','GTA'],
    mirror: { enabled: true }
  }));
}

async function fetchMinecraft() {
  const RSS = 'https://www.minecraft.net/en-us/feeds/community-content/rss';
  const { data } = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS)}`);
  return (data.items || []).map((item) => ({
    id: item.guid || item.link,
    slug: (item.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
    title: item.title,
    date: item.pubDate,
    url: item.link,
    excerpt: (item.description||'').replace(/<[^>]*>?/gm, '').slice(0, 200) + '...',
    image: item.enclosure?.link || item.thumbnail,
    official: true,
    tags: ['Minecraft']
  }));
}

async function fetchPUBG() {
  const RSS = 'https://www.pubg.com/feed/';
  const { data } = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS)}`);
  return (data.items || []).map((item) => ({
    id: item.guid || item.link,
    slug: (item.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
    title: item.title,
    date: item.pubDate,
    url: item.link,
    excerpt: (item.description||'').replace(/<[^>]*>?/gm, '').slice(0, 200) + '...',
    image: item.enclosure?.link || item.thumbnail,
    official: true,
    tags: ['PUBG']
  }));
}

async function main(){
  const outDir = path.resolve('src', 'content');
  const mirrorsPath = path.join(outDir, 'mirrors.json');
  const all = [
    ...(await fetchRockstar()),
    ...(await fetchMinecraft()),
    ...(await fetchPUBG())
  ].sort((a,b)=> +new Date(b.date) - +new Date(a.date));
  fs.writeFileSync(mirrorsPath, JSON.stringify(all, null, 2));
  console.log(`Wrote ${all.length} items to ${mirrorsPath}`);
}

main().catch(err=>{ console.error(err); process.exit(1); });

