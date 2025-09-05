#!/usr/bin/env node
/*
  Uploads the example MDX and a cover image to Supabase Storage (buckets: `guides`, `media`),
  then switches an existing guide to use `mdx_path` (or inserts one if missing).

  Env required:
    - VITE_SUPABASE_URL
    - SUPABASE_SERVICE_ROLE (preferred) or VITE_SUPABASE_ANON_KEY (may lack write perms)

  Run:
    node scripts/seed-guides-storage.mjs
*/

import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const url = process.env.VITE_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE
const anon = process.env.VITE_SUPABASE_ANON_KEY
const key = service || anon

if (!url || !key) {
  console.error('Missing env. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE (or VITE_SUPABASE_ANON_KEY).')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false } })

async function ensureBucket(bucket, opts = { public: true }) {
  try {
    const { data, error } = await sb.storage.createBucket(bucket, opts)
    if (error) {
      // If it already exists, ignore
      if (!String(error.message || '').toLowerCase().includes('already exists')) {
        console.warn(`[warn] createBucket(${bucket}):`, error.message)
      }
    } else {
      console.log(`[ok] created bucket ${bucket}`)
    }
  } catch (e) {
    console.warn(`[warn] createBucket(${bucket}) threw`, e?.message)
  }
}

function ts() { return new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) }

async function uploadFile(bucket, destPath, bytes, contentType) {
  const { data, error } = await sb.storage.from(bucket).upload(destPath, bytes, { upsert: true, contentType })
  if (error) throw error
  return data?.path || destPath
}

async function main() {
  const usingService = !!service
  console.log(`[info] Using ${usingService ? 'service-role' : 'anon'} key`)
  await ensureBucket('guides', { public: true })
  await ensureBucket('media', { public: true })

  // Load example MDX from repo
  const mdxFsPath = path.resolve(__dirname, '..', 'examples', 'guides', 'getting-started.mdx')
  const mdxBytes = await readFile(mdxFsPath)
  const mdxDest = `getting-started/${ts()}.mdx`
  console.log('[info] uploading MDX →', mdxDest)
  const mdx_path = await uploadFile('guides', mdxDest, mdxBytes, 'text/markdown; charset=utf-8')

  // Optional cover: pick a local public image
  let cover_path = null
  try {
    const coverLocal = path.resolve(__dirname, '..', 'public', 'Gamexbuddy-logo-v2-transparent.png')
    const coverBytes = await readFile(coverLocal)
    const coverDest = `guides/getting-started-cover-${ts()}.png`
    console.log('[info] uploading cover →', coverDest)
    cover_path = await uploadFile('media', coverDest, coverBytes, 'image/png')
  } catch {
    console.log('[info] no local cover found, skipping cover upload')
  }

  // Upsert guide: prefer switching seeded `gta6-getting-started`, else add `getting-started`
  const preferredSlug = 'gta6-getting-started'
  const fallbackSlug = 'getting-started'

  const { data: existing, error: selErr } = await sb.from('guides').select('id, slug').in('slug', [preferredSlug, fallbackSlug])
  if (selErr) throw selErr
  const row = (existing || [])[0]
  const payload = {
    title: 'GTA 6: Getting Started',
    slug: row?.slug || preferredSlug,
    description: 'Guide uploaded to Storage. Renders via mdx_path with syntax highlighting.',
    mdx_path,
    body_mdx: null,
    tags: ['gta6', 'docs', 'mdx'],
    ...(cover_path ? { cover_path } : {}),
  }

  if (row) {
    console.log('[info] updating guide →', row.slug)
    const { error } = await sb.from('guides').update(payload).eq('slug', row.slug)
    if (error) throw error
  } else {
    console.log('[info] inserting guide →', payload.slug)
    const { error } = await sb.from('guides').insert(payload)
    if (error) throw error
  }

  console.log('\n[done] Storage + DB updated:')
  console.log(' - mdx_path:', mdx_path)
  if (cover_path) console.log(' - cover_path:', cover_path)
  console.log('Open: /guides/gta6-getting-started')
}

main().catch((e) => {
  console.error('[error]', e?.message || e)
  process.exit(1)
})

