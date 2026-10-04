# Owen Thilakoun — CV & Portfolio

A multi-page personal portfolio and CV website for **Mr. Owen Thilakoun**, Computer Engineering graduate and aspiring software developer.

- **Frontend:** React 19 + Vite, Tailwind CSS v4, React Router, Lucide icons, Axios. Hosted on Vercel.
- **Backend:** Node.js + Express 5 REST API. Hosted on Render.
- **Data:** Supabase Postgres with Row Level Security, plus Supabase Storage for images and the CV PDF.

There is no login, registration or admin UI. Visitors browse everything freely, and Owen manages content in the Supabase dashboard.

---

## Contents

1. [Architecture](#1-architecture)
2. [Project structure](#2-project-structure)
3. [Database schema](#3-database-schema)
4. [Run locally](#4-run-locally)
5. [Test every route and API](#5-test-every-route-and-api)
6. [Managing content](#6-managing-content)
7. [Deploy for free](#7-deploy-for-free)
8. [Free-tier limitations](#8-free-tier-limitations)
9. [Security notes](#9-security-notes)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Architecture

```
 Browser ──HTTPS──▶  Vercel (React SPA)
    │
    └──HTTPS /api──▶ Render (Express API) ──▶ Supabase Postgres (RLS on)
                          │                    ▲
                          │ publishable key ───┘  public reads, RLS enforced
                          └ secret key ────────▶  insert contact_messages only

 Images / CV PDF: public URLs from the Supabase Storage bucket "portfolio-media"
```

Design decisions:

- **The browser never sees a Supabase key.** All data flows through the Express API.
- **Least privilege on the server.** GET endpoints use the low-privilege *publishable* key, so RLS still applies even on the server. Only `POST /api/contact` uses the *secret* key, after validation.
- **Supabase's new API keys.** Supabase is retiring the legacy `anon` / `service_role` JWT keys by the end of 2026, so this project uses `sb_publishable_…` and `sb_secret_…` keys.
- **Placeholders are data, not code.** Text that starts with `[Placeholder]`, or rows with `is_placeholder = true`, are rendered with a dashed copper border and a "Placeholder" badge, so unfinished content is obvious. Replace them in Supabase and the badges disappear.

### Frontend routes

| Route | Page | Data |
|---|---|---|
| `/` | Home: hero with photo, name, title, intro, CTAs, quick facts, featured projects | profile, featured projects |
| `/about` | Introduction, education, background, career objectives | profile, education |
| `/skills` | Skills grouped by category with 5-step level meters | skills |
| `/projects` | Project gallery with technology filter | projects |
| `/projects/:id` | Project detail (`:id` is the slug or UUID) | one project |
| `/resume` | Printable CV with Download CV (PDF) | profile, education, experience, skills, projects |
| `/contact` | Contact details and validated contact form | profile, POST contact |
| `/404` and any unknown path | Custom not-found page | none |

### API endpoints

All responses use `{ "data": ... }` on success and `{ "error": { "message", "details?" } }` on failure.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check (no database) |
| GET | `/api/health/db` | Database reachability check |
| GET | `/api/profile` | The active profile |
| GET | `/api/skills` | Published skills |
| GET | `/api/projects` | Published projects (`?featured=true` for featured only) |
| GET | `/api/projects/:id` | One project by UUID or slug |
| GET | `/api/education` | Published education entries |
| GET | `/api/experience` | Published experience entries |
| POST | `/api/contact` | Store a validated contact message |

---

## 2. Project structure

```
portfolio/
├── client/                      React + Vite frontend
│   ├── index.html               Fonts, default meta, no-flash theme script
│   ├── vercel.json              SPA rewrites + security headers
│   ├── vite.config.js           Tailwind plugin, /api dev proxy
│   ├── .env.example
│   └── src/
│       ├── components/          One component per file (Navbar, CircuitBoard, ProjectCard, ...)
│       ├── constants/           Navigation, skill categories, site metadata, form limits
│       ├── context/             ThemeContext, ProfileContext
│       ├── hooks/               useApi, useDocumentMeta, useTheme, useProfile
│       ├── layouts/             MainLayout (Navbar, main, Footer)
│       ├── pages/               Home, About, Skills, Projects, ProjectDetail, Resume, Contact, NotFound
│       ├── services/            Axios instance and API calls
│       ├── utils/               Formatting, placeholder helpers, form validation
│       ├── index.css            Design tokens, animations, print styles
│       ├── App.jsx              Routes
│       └── main.jsx             Providers
├── server/                      Express API
│   ├── .env.example
│   └── src/
│       ├── config/              env validation, Supabase clients, CORS
│       ├── controllers/         Thin request handlers
│       ├── middleware/          Validation, rate limits, caching, errors, 404
│       ├── routes/              One router per resource
│       ├── services/            Supabase queries
│       ├── utils/               HttpError, DB error mapping, identifiers
│       ├── app.js               Express app
│       └── server.js            Starts the HTTP server
├── database/
│   └── schema.sql               Tables, RLS, grants, storage bucket, placeholder seed data
├── render.yaml                  Optional Render Blueprint
└── README.md
```

---

## 3. Database schema

`database/schema.sql` creates:

| Table | Purpose | Public access |
|---|---|---|
| `profiles` | Personal info, photo URL, CV URL. One row with `is_active = true`. | SELECT active row |
| `skills` | Name, category (`language`, `frontend`, `backend`, `database`, `tools`, `other`), level 1–5 | SELECT published |
| `projects` | Slug, title, summary, description, tech stack, links, image | SELECT published |
| `education` | Institution, degree, field, years, status | SELECT published |
| `experience` | Role, organization, dates, description (added so the Resume's experience section is editable) | SELECT published |
| `contact_messages` | Messages from the contact form | **None.** Only the backend secret key can insert. |

It also adds CHECK constraints (lengths, URL format, email format), `updated_at` triggers, explicit grants, a public storage bucket `portfolio-media` (5 MB per file; JPEG, PNG, WebP, AVIF, PDF), and seed data. Seeds contain only facts Owen provided (name, age 22, Computer Engineering graduate, aspiring software developer). Everything else is a marked placeholder.

The script is idempotent: re-running it won't duplicate tables or seed rows.

---

## 4. Run locally

### Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 7 requires it). Check with `node -v`.
- A free Supabase account: https://supabase.com

### Step 1: Create the Supabase project

1. In the Supabase dashboard, select **New project**. Choose a strong database password and a region close to your visitors. Singapore is closest to Laos.
2. Open **SQL Editor → New query**, paste all of `database/schema.sql`, and select **Run**.
3. Open **Project Settings → API Keys** and copy:
   - the **Project URL**
   - a **Publishable key** (`sb_publishable_…`)
   - a **Secret key** (`sb_secret_…`). Create one if none exists.

### Step 2: Start the backend

```bash
cd server
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
# Edit .env: set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY
npm install
npm run dev                 # http://localhost:5000
```

You should see `API listening on port 5000`. If a required variable is missing, the server exits with a message naming it.

### Step 3: Start the frontend (second terminal)

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Leave `VITE_API_URL` unset locally. Vite proxies `/api` to `http://localhost:5000`.

### Production build check

```bash
cd client
npm run build && npm run preview   # http://localhost:4173
```

When previewing a build locally, create `client/.env.local` with `VITE_API_URL=http://localhost:5000/api`, and add `http://localhost:4173` to `CLIENT_ORIGINS` in `server/.env`.

---

## 5. Test every route and API

### API (backend running on port 5000)

```bash
# Health
curl -i http://localhost:5000/api/health
curl -i http://localhost:5000/api/health/db

# Portfolio data
curl -s http://localhost:5000/api/profile
curl -s http://localhost:5000/api/skills
curl -s http://localhost:5000/api/projects
curl -s "http://localhost:5000/api/projects?featured=true"
curl -s http://localhost:5000/api/projects/placeholder-project-one   # by slug
curl -i http://localhost:5000/api/projects/does-not-exist            # expect 404
curl -s http://localhost:5000/api/education
curl -s http://localhost:5000/api/experience
curl -i http://localhost:5000/api/nope                               # expect 404 JSON

# Contact: valid message -> 201, then check the contact_messages table in Supabase
curl -i -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Visitor","email":"test@example.com","subject":"Hello","message":"This is a test message."}'

# Contact: invalid fields -> 400 with field details
curl -i -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"not-an-email","subject":"","message":"short"}'

# Contact: malformed JSON -> 400
curl -i -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" -d '{bad json'

# Contact: honeypot filled -> 201 but nothing is stored
curl -i -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","subject":"Spam","message":"Buy now buy now","website":"http://spam"}'

# Rate limit: the 6th POST within 15 minutes from one IP -> 429

# CORS: allowed origin gets Access-Control-Allow-Origin; others do not
curl -i -H "Origin: http://localhost:5173" http://localhost:5000/api/profile | grep -i access-control
curl -i -H "Origin: https://evil.example"  http://localhost:5000/api/profile | grep -i access-control
```

**Verify RLS directly.** This confirms visitors can't write even with the publishable key. Replace the values with your own:

```bash
# Should FAIL (401/403 or RLS error): public insert into contact_messages
curl -i -X POST "https://YOUR-REF.supabase.co/rest/v1/contact_messages" \
  -H "apikey: sb_publishable_..." -H "Content-Type: application/json" \
  -d '{"name":"x","email":"x@x.io","subject":"xxx","message":"xxxxxxxxxx"}'

# Should FAIL: public update of the profile
curl -i -X PATCH "https://YOUR-REF.supabase.co/rest/v1/profiles?is_active=eq.true" \
  -H "apikey: sb_publishable_..." -H "Content-Type: application/json" \
  -d '{"full_name":"Hacked"}'

# Should return [] or fail: reading contact messages publicly
curl -s "https://YOUR-REF.supabase.co/rest/v1/contact_messages?select=*" -H "apikey: sb_publishable_..."
```

### Frontend checklist (http://localhost:5173)

| Check | Expected |
|---|---|
| `/` | Board animation plays once; name, title, intro, three CTA buttons, quick facts, featured projects |
| `/about` | Quick facts, introduction, education timeline, background, career objectives |
| `/skills` | One panel per category with LED meters |
| `/projects` | Cards; filter chips appear once two or more real technologies exist |
| `/projects/placeholder-project-one` | Detail page; `/projects/xyz` shows "This project doesn't exist" |
| `/resume` | CV layout; **Download CV (PDF)** opens print dialog, or downloads `cv_url` if set |
| `/contact` | Submit empty form for inline errors; submit valid form for "Message sent" |
| `/404`, `/anything` | Custom not-found page |
| Theme toggle | Switches light/dark and persists after reload |
| Mobile width (< 1024 px) | Hamburger menu opens, closes on Escape and on navigation |
| Stop the backend, reload | Pages show error states with **Try again** |
| Keyboard only | Tab shows copper focus rings; **Skip to content** link appears first |

---

## 6. Managing content

Everything is edited in **Supabase Dashboard → Table Editor**. Changes appear on the site within about a minute, because API responses are cached for 60 seconds.

### Replace placeholders

Edit any field that starts with `[Placeholder]`, and set `is_placeholder` to `false` on rows you've completed. Delete placeholder rows you don't need, such as the sample experience row.

### Upload the profile photo

1. Go to **Storage → portfolio-media → Upload file**. Use a portrait image (4:5 crops best), JPEG or WebP, under 5 MB. Around 800×1000 px is plenty.
2. Click the file and select **Get URL**. The URL looks like `https://YOUR-REF.supabase.co/storage/v1/object/public/portfolio-media/owen.jpg`.
3. Paste it into `profiles.photo_url`.

### Project images and a ready-made CV PDF

Upload the file the same way, then put the URL in `projects.image_url` or `profiles.cv_url`. When `cv_url` is set, **Download CV (PDF)** downloads that file. Otherwise the button opens the browser's print dialog, and the Resume page is styled to print as a clean A4 CV.

### Add a project

Insert a row in `projects` with a unique lowercase `slug` (for example `smart-home-dashboard`). The page lives at `/projects/smart-home-dashboard`. Set `featured = true` to show it on the home page.

### Read contact messages

Open **Table Editor → contact_messages**. Update `status` as you handle them (`new`, `read`, `replied`, `archived`, `spam`).

---

## 7. Deploy for free

### 7.1 GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
# Create an empty repo on github.com, then:
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

Before pushing, confirm `git status` doesn't list any `.env` file. The `.gitignore` files exclude them.

### 7.2 Supabase

Already done in [step 4](#step-1-create-the-supabase-project). There's no extra production setup, because the same project serves local and production.

### 7.3 Backend on Render (free web service)

1. Sign in at https://render.com with GitHub and select **New → Web Service**. Pick your repository.
2. Configure:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install --omit=dev`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
   - **Health Check Path:** `/api/health`
3. Add environment variables:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NODE_VERSION` | `22` |
   | `SUPABASE_URL` | your project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
   | `SUPABASE_SECRET_KEY` | `sb_secret_…` |
   | `CLIENT_ORIGINS` | leave as `http://localhost:5173` for now; set after Vercel |
   | `TRUST_PROXY` | `1` |

4. Deploy, then open `https://YOUR-SERVICE.onrender.com/api/health`.

Alternatively, use **New → Blueprint** with the included `render.yaml`. It prompts for the secret values.

Render injects `PORT` itself; the server reads it automatically.

### 7.4 Frontend on Vercel (Hobby plan)

1. Sign in at https://vercel.com with GitHub and select **Add New → Project**. Import the repository.
2. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (auto-detected). Build command `npm run build`, output `dist`.
3. Add environment variables:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com/api` |
   | `VITE_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (update if you add a domain) |

4. Deploy. `client/vercel.json` rewrites every path to `index.html`, so refreshing `/projects/xyz` works.

`VITE_` variables are baked in at build time. After changing one, select **Redeploy**.

### 7.5 Connect frontend and backend (CORS)

On Render, set `CLIENT_ORIGINS` to your exact Vercel URL with no trailing slash, then redeploy:

```
CLIENT_ORIGINS=https://your-project.vercel.app
```

For several origins (custom domain, www), separate them with commas:

```
CLIENT_ORIGINS=https://your-project.vercel.app,https://owenthilakoun.com,https://www.owenthilakoun.com
```

Vercel preview deployments get their own URLs. If you want them to call the API, add each preview URL explicitly.

### 7.6 Custom domain (optional)

Domains are not free. Expect to pay a registrar yearly; the hosting itself stays free.

1. In Vercel, go to **Project → Settings → Domains → Add** and enter your domain. Follow the DNS records Vercel shows: an A record for the apex domain and a CNAME for `www`. HTTPS is automatic.
2. Add the new origin(s) to `CLIENT_ORIGINS` on Render.
3. Update `VITE_SITE_URL` on Vercel and redeploy.
4. Optional: add a custom domain to the Render service too, such as `api.yourdomain.com`, then update `VITE_API_URL`.

---

## 8. Free-tier limitations

Verified October 2026. Free tiers change, so re-check each provider's pricing page before relying on them.

**Render (free web service)**
- The service **spins down after 15 minutes without traffic**. The next request waits for it to start again, which takes about a minute. The site handles this: after 5 seconds, loading states tell visitors the server is starting up, and requests wait up to 70 seconds.
- **750 free instance hours per workspace per month**, shared across all free services. If they run out, free services are suspended until the next month.
- Render may restart free services at any time. Free instances are not meant for production workloads.
- Some people ping the service every ~14 minutes with an uptime monitor to avoid cold starts. That keeps one service awake around the clock, which uses roughly the whole monthly allowance. Render doesn't officially support it as a way to stay always-on.

**Supabase (Free plan)**
- 500 MB database and 1 GB file storage per project, 5 GB egress, and up to 2 active free projects.
- **Free projects are paused after 1 week of inactivity.** A paused project makes the API return errors until you restore it from the dashboard. Regular visitors count as activity. If the site might go quiet, a free uptime monitor hitting `/api/health/db` about once a day generates database activity. This also briefly wakes Render, which costs only a few minutes of instance hours.
- No automatic backups on Free. Export your tables occasionally from the Table Editor.
- Max upload size 50 MB on the plan; this project's bucket limits files to 5 MB.

**Vercel (Hobby)**
- Free, but **for personal, non-commercial use only**. A personal portfolio fits; a business site does not.
- Includes about 100 GB fast data transfer and 1M edge requests per month, which is far beyond what a portfolio needs. If you exceed usage limits, the feature stops until 30 days pass. You can't pay for overage on Hobby.
- Static sites like this one don't spin down.

**Contact form email.** Messages are stored in Supabase, but no email is sent, because reliable email sending usually needs another account. Check the `contact_messages` table regularly, or add a Supabase Database Webhook later.

---

## 9. Security notes

What's in place:

- **No secrets in the frontend.** The client only knows the public API URL. `VITE_*` variables are public by design and contain no keys.
- **RLS on every table.** Public roles can only SELECT published portfolio rows. `contact_messages` has no public policy, and explicit REVOKEs back that up.
- **Least-privilege server.** Reads use the publishable key, so RLS applies. The secret key is used in exactly one place (`server/src/services/contactService.js`). The server refuses to start if a secret key is placed in the publishable slot.
- **Input validation twice.** Client validation gives fast feedback. Server validation (`validateContact.js`) is the real gate: it trims, normalizes Unicode, strips control characters, and enforces length and email format. Database CHECK constraints are a third layer.
- **Spam controls.** A hidden honeypot field, plus rate limits of 5 contact posts per 15 minutes per IP and 300 API requests per 15 minutes per IP. `trust proxy` is set to exactly 1 hop, so limits use real visitor IPs on Render without allowing IP spoofing.
- **Helmet** security headers on the API, a 16 KB JSON body limit, and generic error messages in production. Database error details are only logged server-side.
- **CORS allowlist** of exact origins.
- **Security headers on Vercel** (`nosniff`, `DENY` framing, referrer policy, permissions policy).
- **No `dangerouslySetInnerHTML`.** All database text renders as text, so stored content can't inject scripts.
- **Safe external links** with `rel="noopener noreferrer"`.

Your responsibilities:

- Never commit `.env` files. If the secret key leaks, rotate it in **Project Settings → API Keys** and update Render.
- Keep the storage bucket free of anything private. It is public by URL.
- Run `npm audit` in both folders occasionally.

---

## 10. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Server exits with "Missing required environment variables" | `server/.env` is missing or incomplete. Copy `.env.example` and fill it in. |
| `/api/profile` returns 404 "No active profile found" | `schema.sql` wasn't run, or the profile row has `is_active = false`. |
| API returns 500 "not allowed to read this data" | Grants or RLS policies are missing. Re-run `schema.sql`. |
| Contact POST returns 502 | Wrong `SUPABASE_SECRET_KEY`, or the DB CHECK constraint rejected the data. See Render logs. |
| Browser console: "blocked by CORS policy" | `CLIENT_ORIGINS` doesn't exactly match the site's origin. Check `https`, the domain, and for a trailing slash. Redeploy Render after changing it. |
| Live site calls `/api/...` on vercel.app and gets HTML or 404 | `VITE_API_URL` isn't set on Vercel, or you didn't redeploy after setting it. |
| Refreshing `/about` on Vercel shows a 404 | Vercel's Root Directory isn't `client`, so `vercel.json` wasn't used. |
| First load takes about a minute | Render's free service was asleep. This is expected; see section 8. |
| Every request fails after a quiet week | The Supabase project was paused. Restore it in the dashboard. |
| Photo shows "photo placeholder" | `photo_url` is empty, the bucket isn't public, or the URL is wrong. Open the URL in a new tab to check. |
| `npm install` fails on Vite | Node is too old. Install Node 20.19+ or 22.12+. |
| Rate limit hits everyone at once on Render | `TRUST_PROXY` isn't `1`. |
