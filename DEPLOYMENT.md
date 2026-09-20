# Production Deployment Notes

## Current Architecture
- **Frontend**: React (Vite) hosted on GitHub Pages.
- **Backend**: Serverless Functions hosted on Vercel.
- **Data Sync**: Automated via GitHub Actions (Daily for Projects, Monthly for Blogs).

## Pre-Push Checklist
1. **API URL**: `src/pages/About.tsx` is environment-aware (`DEV ? '/api/chat' : 'https://portfolio-liard-alpha-anenqdv7wr.vercel.app/api/chat'`); prod still hits absolute Vercel URL.
2. **CORS**: `api/chat.ts` includes `https://Sabari-Vijayan.github.io` in its allowed origins.
3. **Paths**: Shared data files have been moved to `src/data/` to avoid routing conflicts.
4. **Environment**: Ensure **both** `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) **and** `OPENROUTER_API_KEY` (for Jev `~typesafe/jev-latest`) are set in the Vercel Dashboard environment variables. For optional GitHub rate-limit bump, add `GITHUB_TOKEN`. Also accept `VITE_*/NEXT_PUBLIC_*` prefixes. Before prod, set `DEBUG_JEV=false` in `api/chat.ts:16` (or remove `DEBUG_JEV` blocks in `api/chat.ts` + `if (data.debug)` in `About.tsx`).

## How to Deploy
1. **Frontend**:
   ```bash
   npm run deploy
   ```
   (This builds the project and pushes to the `gh-pages` branch).
2. **Backend**:
   Simply push your changes to the `main` branch. Vercel will automatically pick up the new serverless functions in the `api/` directory.

## Testing Locally

No manual `API_URL` swapping needed — `About.tsx:5-6` is already `DEV ? '/api/chat' : '<prod URL>'`.

1. Create `.env` at repo root (gitignored) or run `vercel env pull .env.local` to sync dashboard vars locally:
   ```
   GEMINI_API_KEY=your_google_key          # or GOOGLE_API_KEY
   OPENROUTER_API_KEY=sk-or-v1-…           # for Jev
   # optional: GITHUB_TOKEN=ghp_…          # raises GitHub 60/hr limit
   ```
   A boilerplate is committed as `.env` placeholder — fill `GEMINI_API_KEY`.
2. Run `vercel dev` (runs `api/chat.ts` Edge locally; `vite` alone won't serve `api/`). Logs:
   - Terminal (local): `vercel dev` prints `[AGENT] POST HIT`, `[JEV] raw answers`/`compact view`/`→ DECISION`, `[AGENT] → calling generateContentStream()`.
   - Browser DevTools → Console: `[AGENT] handleAsk START`, `[AGENT] ★ ROUTER DECISION: source=… router=jev|gemini-fallback`, `[JEV] full jev payload`, `[STREAM]` NDJSON lines. Filter by `[JEV]`/`[GEMINI]`.
   - Prod (Vercel Dashboard → Logs): same `[JEV]`/`[AGENT]` lines when `DEBUG_JEV=true`.
3. Tuning: watch `vercel dev` `maxNeed` / per-repo `noul` values; adjust thresholds `NEEDS_THRESHOLD=0.55`, `REPO_THRESHOLD=0.60`, `OFF_TOPIC=0.80` in `api/chat.ts:299-302`.
4. **CRITICAL**: Before `npm run deploy` (prod), ensure `DEBUG_JEV=false` and check Vercel env vars are set — otherwise `debug` field leaks to clients (first NDJSON line).
