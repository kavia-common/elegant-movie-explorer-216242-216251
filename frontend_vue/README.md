# Elegant Movie Explorer (Vue 3 + Vite + Tailwind)

A Vue 3 single-page app with a Royal Purple theme. Features:
- Supabase Google OAuth authentication
- Per-user Movies CRUD backed by Supabase (`movies` table)
- TMDB integrations for Trending, Featured, and Search (debounced and abortable)
- Two routes: "/" landing and "/app" main app
- TailwindCSS-powered elegant UI components

## Setup

1) Install dependencies
```sh
npm install
```

2) Environment variables (create `.env` at project root):
```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
VITE_TMDB_API_KEY=YOUR_TMDB_V4_READ_TOKEN   # Bearer token
```

3) Supabase Database table
Create a table `movies`:
- id: uuid, primary key, default uuid_generate_v4() or use Supabase default
- user_id: uuid (references auth.users.id)
- title: text
- tmdb_id: int8 nullable
- notes: text nullable
- created_at: timestamptz default now()

Row Level Security: enable and add policy to allow a user to access only their rows.

4) Development
```sh
npm run dev
```
Runs at http://localhost:3000 (configured to allow cloud preview as well).

## Notes

- Sign in via Google uses Supabase OAuth. The redirect uses current origin + `/app`.
- Tailwind colors:
  - primary #8B5CF6
  - secondary #6B7280
  - success #10B981
  - error #EF4444
  - background #F3E8FF
  - surface #FFFFFF
  - text #374151

- Global alerts appear under the Navbar (success/error/info), auto-dismiss after 4s.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - type-check and build
- `npm run preview` - local preview
- `npm run test:unit` - run unit tests (template)
- `npm run lint` - lint
- `npm run format` - format src
