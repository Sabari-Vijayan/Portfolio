# Production Deployment Notes

## Current Architecture
- **Frontend**: React (Vite) hosted on GitHub Pages.
- **Backend**: Serverless Functions hosted on Vercel.
- **Data Sync**: Automated via GitHub Actions (Daily for Projects, Monthly for Blogs).

## Pre-Push Checklist
1. **API URL**: `src/pages/About.tsx` is set to the absolute Vercel URL.
2. **CORS**: `api/chat.ts` includes `https://Sabari-Vijayan.github.io` in its allowed origins.
3. **Paths**: Shared data files have been moved to `src/data/` to avoid routing conflicts.
4. **Environment**: Ensure `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) is set in the Vercel Dashboard environment variables.

## How to Deploy
1. **Frontend**:
   ```bash
   npm run deploy
   ```
   (This builds the project and pushes to the `gh-pages` branch).
2. **Backend**:
   Simply push your changes to the `main` branch. Vercel will automatically pick up the new serverless functions in the `api/` directory.

## Testing Locally
To test the API locally after these changes:
1. Temporarily change `API_URL` back to `/api/chat` in `About.tsx`.
2. Run `vercel dev`.
3. **CRITICAL**: Revert `API_URL` to the absolute URL before pushing to production.
