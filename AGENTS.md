# AGENTS.md

# AGENTS.md

SD Negeri Mulyoagung 1 — React 19 + Vite + Tailwind 4 frontend (`src/`) with PHP/MySQL backend (`backend/`) served by XAMPP Apache.

## Commands

```bash
npm run dev       # Vite dev server on port 3000 (requires XAMPP Apache + MySQL)
npm run build     # vite build → dist/ (gitignored)
npm run lint      # tsc --noEmit (typecheck only)
```

## Local setup

1. **Database**: Import `backend/db_sdn1mulyoagung.sql` into MySQL DB `db_sdn1mulyoagung` (phpMyAdmin).
2. **Environment**: Set `DB_HOST`/`DB_USER`/`DB_PASS`/`DB_NAME` env vars (defaults: `localhost` / `root` / empty password).
3. **API base URL**: Resolved in `src/config/api.ts`:
   - `localhost:3000` / `localhost:5173` → `http://localhost/sd-negeri-mulyoagung-1`
   - `*.sch.id` hosts → `window.origin`
   - Override via `VITE_API_BASE_URL`
4. No `.env` committed (`.gitignore` ignores `.env*`).

## Architecture

- **Public routes**: `/`, `/profile`, `/directory`, `/gallery`, `/news`, `/contact`
- **CMS**: `/cms/*` (client-side guarded via `localStorage['cms_user']`)
- **Data fetching**:
  - Public hooks: `src/hooks/` (`useTeachersData`, `useGalleryData`, `useHomepageConfig`)
  - CMS hooks: `src/CMS/hooks/` (`useNewsData`, `useTeacherData`, `useGalleryData`, etc.)
- **API pattern**:
  - Reads: `GET` (CMS/admin adds `?status=all` for unverified rows)
  - Writes: `POST` with `multipart/form-data` + `action` field (`create`/`update`/`delete`/`verify`)
  - Exceptions: `auth.php` and `users.php` read JSON from `php://input`
- **Photo handling**: Use `backend/API/foto_helper.php` helpers (`foto_ensure_column`, `foto_handle_create`, `foto_handle_update`, `foto_map_rows`, `foto_unlink`)
- **Uploads**: `backend/uploads/<entity>/`; rendered via `getImageUrl()` from `src/config/api.ts`

## Role-based access

- **ADMIN**: Full CRUD on all entities
- **TIM**: May only upload/edit berita/galeri → requires admin verification
- Role checks in `src/CMS/Dashboard.tsx` (client-side redirect)
- **Verification status**: `Pending`/`Verified`/`Rejected`; public endpoints return only `Verified`; TIM edits reset status to `Pending`

## API security

- **CORS**: Restricted to known origins in `backend/config/koneksi.php` (`localhost` by default)
- **Sec-Fetch-Mode**: Blocks direct browser navigation
- **IP restriction**: `backend/API/.htaccess` limits to localhost/192.168.x.x/10.x.x.x (update for production)

## Style guide

- **Language**: Indonesian for UI text and DB column names
- **Imports**: Relative paths (`../../config/api`); `@/*` alias maps to repo root but is unused
- **Commit messages**: Indonesian
- **Branch flow**: Feature branches (e.g. `devhafiz`, `devp`) → PR to `dev` → `main`

## Notes

- `backend/db_sdn1mulyoagung.sql` must be deleted from server after import (`.sql` in `.gitignore`)
- Indonesian `.md` files in `src/CMS/*/*.md` are work notes, not docs
- `README.md` and `metadata.json` are stale AI Studio boilerplate
- `scratch_check.ps1` is a one-off script
