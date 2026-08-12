# AGENTS.md

School website (SD Negeri Mulyoagung 1). React 19 + Vite + Tailwind 4 frontend (`src/`) with a plain PHP/MySQL backend (`backend/`) served by XAMPP Apache. No tests, no real linter.

## Commands
- `npm run dev` — Vite dev server on port 3000 (requires XAMPP Apache + MySQL running for the backend).
- `npm run lint` — actually just `tsc --noEmit` (typecheck, not a linter).
- `npm run build` — `vite build` into `dist/` (gitignored).

## Local setup & gotchas
- Backend is a set of standalone PHP files in `backend/API/*.php` (no framework/routing). Each does its own `require_once '../config/koneksi.php'`.
- DB: import `backend/db_sdn1mulyoagung.sql` into MySQL database `db_sdn1mulyoagung` (phpMyAdmin). Credentials read from env vars `DB_HOST`/`DB_USER`/`DB_PASS`/`DB_NAME`; defaults `localhost` / `root` / empty password.
- API base URL is resolved by `src/config/api.ts`: on `localhost:3000` it hardcodes `http://localhost/sd-negeri-mulyoagung-1` (lowercase), and on `*.sch.id` hosts it uses `window.origin`. Override only via `VITE_API_BASE_URL`.
- `.env` is AI Studio boilerplate (`GEMINI_API_KEY` is unused); the real override is `VITE_API_BASE_URL`.

## Architecture
- Public routes: `/`, `/profile`, `/directory`, `/gallery`, `/news`, `/contact`. CMS lives at `/cms` (route handled in `src/App.tsx`, guarded client-side via `localStorage['cms_user']`).
- Public data is fetched via hooks in `src/hooks/`; CMS CRUD lives in `src/CMS/*Crud.tsx` backed by hooks in `src/CMS/hooks/`, one per `backend/API/*.php` endpoint.
- Static fallback data lives in `src/data/schoolData.ts` and `src/utils/*.ts`.
- Import convention: relative paths (`../../config/api`). The `@/*` alias in `vite.config.ts`/`tsconfig.json` maps to the repo root (not `src/`) and is unused — do not rely on it.
- Requests: reads are GET (CMS/admin pass `?status=all` to include unverified rows); writes are POST with `multipart/form-data` carrying an `action` field (`create`/`update`/`delete`/`verify`). New endpoints should follow `backend/API/newsAPI.php` as the pattern.
- Uploaded files go to `backend/uploads/<entity>/`; DB stores `backend/uploads/<entity>/<file>` paths and the frontend renders them via `getImageUrl()` from `src/config/api.ts`.

## Rules to preserve
- Roles: `ADMIN` has full CRUD; `TIM` may only upload berita/galeri, which require admin verification. `TIM` must never access other CRUD. Enforced in the UI — see `src/CMS/components/RoleAccess.md` (marked IMPORTANT).
- Verification: `status_verifikasi` is `Pending`/`Verified`/`Rejected`. Public endpoints only return `Verified`. Editing content as `TIM` resets it to `Pending`.
- Backend has no auth middleware; role checks are client-side only.
- UI copy and DB column names are Indonesian — keep new UI text in Indonesian.
- Commit messages are in Indonesian. Branch flow: feature branches (e.g. `devhafiz`, `devp`) → PR into `dev` → `main`.

## Notes
- `src/CMS/*.md`, `src/quicklink.md` are Indonesian work notes; some are pending feature requests, not docs.
- README.md is stale AI Studio boilerplate; trust `package.json`/`vite.config.ts` over it.
