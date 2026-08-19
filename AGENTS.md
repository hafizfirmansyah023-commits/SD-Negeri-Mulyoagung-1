# AGENTS.md

School website (SD Negeri Mulyoagung 1). React 19 + Vite + Tailwind 4 frontend (`src/`) with a plain PHP/MySQL backend (`backend/`) served by XAMPP Apache. No tests, no real linter.

## Commands
- `npm run dev` — Vite dev server on port 3000 (requires XAMPP Apache + MySQL running for the backend).
- `npm run lint` — actually just `tsc --noEmit` (typecheck, not a linter).
- `npm run build` — `vite build` into `dist/` (gitignored).

## Local setup & gotchas
- Backend is a set of standalone PHP files in `backend/API/*.php` (no framework/routing). Each does its own `require_once '../config/koneksi.php'`.
- DB: import `backend/db_sdn1mulyoagung.sql` into MySQL database `db_sdn1mulyoagung` (phpMyAdmin). Credentials read from env vars `DB_HOST`/`DB_USER`/`DB_PASS`/`DB_NAME`; defaults `localhost` / `root` / empty password.
- API base URL is resolved by `src/config/api.ts`: on `localhost:3000`/`localhost:5173` it hardcodes `http://localhost/sd-negeri-mulyoagung-1` (lowercase), on `*.sch.id` hosts it uses `window.origin`. Override only via `VITE_API_BASE_URL`.
- No `.env` is committed (`.gitignore` ignores `.env*`). The AI Studio boilerplate `GEMINI_API_KEY` is unused; the only real override is `VITE_API_BASE_URL`.

## Architecture
- Public routes: `/`, `/profile`, `/directory`, `/gallery`, `/news`, `/contact`. CMS is the `/cms` path: `src/App.tsx` renders `Dashboard` when `location.pathname.startsWith('/cms')`, guarded client-side via `localStorage['cms_user']`.
- Public data is fetched via hooks in `src/hooks/`; CMS CRUD lives in `src/CMS/*Crud.tsx` (plus per-entity folders `src/CMS/<entity>/`), the main CRUD pages backed by hooks in `src/CMS/hooks/`.
- CMS login: `backend/API/auth.php` (`action=login`); user & role management: `backend/API/users.php`. Beware duplicate names: `src/hooks/useGalleryData.ts` (public) and `src/CMS/hooks/useGalleryData.ts` (CMS) are different files.
- Static fallback data lives in `src/data/schoolData.ts` and `src/utils/*.ts`.
- Import convention: relative paths (`../../config/api`). The `@/*` alias in `vite.config.ts`/`tsconfig.json` maps to the repo root (not `src/`) and is unused — do not rely on it.
- Requests: reads are GET (CMS/admin pass `?status=all` to include unverified rows); writes are POST with `multipart/form-data` carrying an `action` field (`create`/`update`/`delete`/`verify`). Exception: `auth.php` and `users.php` read a JSON body (`php://input`) with POST fallback. New endpoints should follow `backend/API/newsAPI.php` as the pattern, including the shared photo helpers in `backend/API/foto_helper.php` (`foto_ensure_column`, `foto_handle_create`/`foto_handle_update`, `foto_map_rows`, `foto_unlink`).
- Uploaded files go to `backend/uploads/<entity>/`; DB stores `backend/uploads/<entity>/<file>` paths and the frontend renders them via `getImageUrl()` from `src/config/api.ts`.

## Rules to preserve
- Roles: `ADMIN` has full CRUD; `TIM` may only upload berita/galeri, which require admin verification. `TIM` must never access other CRUD. Enforced in `src/CMS/Dashboard.tsx` (client-side redirect on login + on mount).
- Verification: `status_verifikasi` is `Pending`/`Verified`/`Rejected`. Public endpoints only return `Verified`. Editing content as `TIM` resets it to `Pending`.
- Backend has no auth middleware; role checks are client-side only.
- UI copy and DB column names are Indonesian — keep new UI text in Indonesian.
- Commit messages are in Indonesian. Branch flow: feature branches (e.g. `devhafiz`, `devp`) → PR into `dev` → `main`.

## Notes
- Indonesian `.md` files scattered across `src/` (e.g. `src/CMS/guru/crop.md`, `src/CMS/user/user.md`) are work notes / pending feature prompts, not docs.
- `README.md` and `metadata.json` are stale AI Studio boilerplate; `scratch_check.ps1` is a one-off script. Trust `package.json`/`vite.config.ts` and `src/config/api.ts` over them.
