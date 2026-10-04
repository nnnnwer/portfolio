-- =============================================================================
-- Owen Thilakoun — Portfolio database schema (Supabase / PostgreSQL)
-- Run this whole file once in Supabase Dashboard -> SQL Editor -> New query.
-- It is idempotent: running it again will not duplicate tables or seed rows.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles: one active row holds the personal information shown on the site
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key default gen_random_uuid(),
  honorific         text check (char_length(honorific) <= 10),
  full_name         text not null check (char_length(full_name) between 1 and 120),
  title             text not null check (char_length(title) between 1 and 120),
  headline          text check (char_length(headline) <= 160),
  short_intro       text check (char_length(short_intro) <= 600),
  about             text check (char_length(about) <= 5000),
  background        text check (char_length(background) <= 5000),
  career_objectives text check (char_length(career_objectives) <= 3000),
  age               smallint check (age between 0 and 120),
  location          text check (char_length(location) <= 120),
  email             text check (char_length(email) <= 254),
  phone             text check (char_length(phone) <= 40),
  github_url        text check (github_url ~* '^https://'),
  linkedin_url      text check (linkedin_url ~* '^https://'),
  website_url       text check (website_url ~* '^https://'),
  photo_url         text check (photo_url ~* '^https://'),
  cv_url            text check (cv_url ~* '^https://'),
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Only one profile can be active at a time.
create unique index if not exists profiles_one_active_idx
  on public.profiles (is_active) where is_active;

-- -----------------------------------------------------------------------------
-- skills: level 1..5 (Beginner .. Expert); null = not rated yet
-- -----------------------------------------------------------------------------
create table if not exists public.skills (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 1 and 80),
  category       text not null check (category in
                   ('language', 'frontend', 'backend', 'database', 'tools', 'other')),
  level          smallint check (level between 1 and 5),
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  is_placeholder boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists skills_category_order_idx
  on public.skills (category, display_order);

-- -----------------------------------------------------------------------------
-- projects: slug is used in the URL (/projects/:slug)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title          text not null check (char_length(title) between 1 and 120),
  summary        text check (char_length(summary) <= 300),
  description    text check (char_length(description) <= 10000),
  role           text check (char_length(role) <= 120),
  status         text not null default 'completed'
                   check (status in ('completed', 'in_progress', 'planned')),
  year           smallint check (year between 1990 and 2100),
  tech_stack     text[] not null default '{}',
  github_url     text check (github_url ~* '^https://'),
  live_url       text check (live_url ~* '^https://'),
  image_url      text check (image_url ~* '^https://'),
  featured       boolean not null default false,
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  is_placeholder boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists projects_order_idx on public.projects (display_order);

-- -----------------------------------------------------------------------------
-- education
-- -----------------------------------------------------------------------------
create table if not exists public.education (
  id             uuid primary key default gen_random_uuid(),
  institution    text not null check (char_length(institution) between 1 and 160),
  degree         text not null check (char_length(degree) between 1 and 160),
  field_of_study text check (char_length(field_of_study) <= 160),
  location       text check (char_length(location) <= 120),
  start_year     smallint check (start_year between 1950 and 2100),
  end_year       smallint check (end_year between 1950 and 2100),
  status         text not null default 'graduated'
                   check (status in ('graduated', 'in_progress')),
  description    text check (char_length(description) <= 3000),
  highlights     text[] not null default '{}',
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  is_placeholder boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (end_year is null or start_year is null or end_year >= start_year)
);

-- -----------------------------------------------------------------------------
-- experience (work, internships, volunteering)
-- -----------------------------------------------------------------------------
create table if not exists public.experience (
  id              uuid primary key default gen_random_uuid(),
  role            text not null check (char_length(role) between 1 and 160),
  organization    text not null check (char_length(organization) between 1 and 160),
  location        text check (char_length(location) <= 120),
  employment_type text check (char_length(employment_type) <= 60),
  start_date      date,
  end_date        date,
  is_current      boolean not null default false,
  description     text check (char_length(description) <= 3000),
  highlights      text[] not null default '{}',
  display_order   integer not null default 0,
  is_published    boolean not null default true,
  is_placeholder  boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

-- -----------------------------------------------------------------------------
-- contact_messages: written only by the backend (secret key), never public
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (
                char_length(email) <= 254
                and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  subject     text not null check (char_length(subject) between 3 and 150),
  message     text not null check (char_length(message) between 10 and 5000),
  status      text not null default 'new'
                check (status in ('new', 'read', 'replied', 'archived', 'spam')),
  user_agent  text check (char_length(user_agent) <= 500),
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles', 'skills', 'projects', 'education', 'experience']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- =============================================================================
-- Row Level Security
-- Public (anon / authenticated) may only SELECT published portfolio rows.
-- Nobody but service_role (the backend secret key, which bypasses RLS)
-- can write anything. contact_messages has no public policy at all.
-- =============================================================================
alter table public.profiles         enable row level security;
alter table public.skills           enable row level security;
alter table public.projects         enable row level security;
alter table public.education        enable row level security;
alter table public.experience       enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read the active profile" on public.profiles;
create policy "Public can read the active profile"
  on public.profiles for select to anon, authenticated
  using (is_active);

drop policy if exists "Public can read published skills" on public.skills;
create policy "Public can read published skills"
  on public.skills for select to anon, authenticated
  using (is_published);

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select to anon, authenticated
  using (is_published);

drop policy if exists "Public can read published education" on public.education;
create policy "Public can read published education"
  on public.education for select to anon, authenticated
  using (is_published);

drop policy if exists "Public can read published experience" on public.experience;
create policy "Public can read published experience"
  on public.experience for select to anon, authenticated
  using (is_published);

-- Table privileges (defence in depth on top of RLS).
grant usage on schema public to anon, authenticated, service_role;

revoke all on public.profiles, public.skills, public.projects,
              public.education, public.experience
  from anon, authenticated;
grant select on public.profiles, public.skills, public.projects,
                public.education, public.experience
  to anon, authenticated;

revoke all on public.contact_messages from anon, authenticated;

grant all on public.profiles, public.skills, public.projects,
             public.education, public.experience, public.contact_messages
  to service_role;

-- =============================================================================
-- Storage: one public bucket for the profile photo, project images and CV PDF.
-- Public bucket = files are readable by URL. No storage.objects policies are
-- created for anon, so visitors cannot upload, overwrite, delete or list files.
-- Upload files through Supabase Dashboard -> Storage.
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- =============================================================================
-- Seed data
-- Only facts Owen provided are filled in. Everything else is a clearly marked
-- placeholder: text beginning with "[Placeholder]" and/or is_placeholder = true.
-- The website styles these so they are obviously unfinished.
-- =============================================================================
insert into public.profiles (
  honorific, full_name, title, headline, short_intro, about, background,
  career_objectives, age
)
select
  'Mr.',
  'Owen Thilakoun',
  'Computer Engineering Graduate',
  'Aspiring Software Developer',
  'I''m a 22-year-old Computer Engineering graduate working toward a career in software development.',
  '[Placeholder] Introduce yourself in a few sentences: what you enjoy building, how you like to work, and what you are learning right now.',
  '[Placeholder] Describe your background: what drew you to computer engineering, the topics you focused on during your degree, and anything outside of tech that shapes how you work.',
  '[Placeholder] Describe the role you are looking for, for example the kind of team, the type of software, and what you hope to learn in your first developer position.',
  22
where not exists (select 1 from public.profiles);

insert into public.skills (name, category, level, display_order, is_placeholder)
select * from (values
  ('[Placeholder] Programming language', 'language', null::smallint, 1, true),
  ('[Placeholder] Frontend technology',  'frontend', null::smallint, 1, true),
  ('[Placeholder] Backend technology',   'backend',  null::smallint, 1, true),
  ('[Placeholder] Database',             'database', null::smallint, 1, true),
  ('[Placeholder] Development tool',     'tools',    null::smallint, 1, true)
) as v(name, category, level, display_order, is_placeholder)
where not exists (select 1 from public.skills);

insert into public.projects (
  slug, title, summary, description, status, tech_stack, featured,
  display_order, is_placeholder
)
select * from (values
  ('placeholder-project-one',
   '[Placeholder] Project title',
   '[Placeholder] One or two sentences on what this project does and who it is for.',
   E'[Placeholder] Explain the problem this project solves.\n\n[Placeholder] Describe how you built it, the decisions you made, and what you would improve next.',
   'completed', array['[Placeholder] Technology'], true, 1, true),
  ('placeholder-project-two',
   '[Placeholder] Second project title',
   '[Placeholder] One or two sentences on what this project does and who it is for.',
   E'[Placeholder] Explain the problem this project solves.\n\n[Placeholder] Describe how you built it and what you learned.',
   'in_progress', array['[Placeholder] Technology'], true, 2, true)
) as v(slug, title, summary, description, status, tech_stack, featured,
       display_order, is_placeholder)
where not exists (select 1 from public.projects);

insert into public.education (
  institution, degree, field_of_study, status, description, display_order,
  is_placeholder
)
select
  '[Placeholder] University name',
  '[Placeholder] Degree title, e.g. Bachelor of Engineering',
  'Computer Engineering',
  'graduated',
  '[Placeholder] Optional: thesis or final project, relevant coursework, or honours.',
  1,
  true
where not exists (select 1 from public.education);

insert into public.experience (
  role, organization, description, display_order, is_placeholder
)
select
  '[Placeholder] Role title',
  '[Placeholder] Organization name',
  '[Placeholder] Add internships, part-time work, volunteering or freelance work. Delete this row if you prefer to leave the section empty.',
  1,
  true
where not exists (select 1 from public.experience);
