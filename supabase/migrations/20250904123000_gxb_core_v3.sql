-- Migration: roles columns on public.profiles
-- Safe due to IF EXISTS + IF NOT EXISTS.
-- Generated: 2025-09-04T03:10:20

-- roles
alter table if exists public.profiles
  add column if not exists is_moderator boolean default false,
  add column if not exists is_editor    boolean default false;
