# Bri – AI Tarot Reading App

A psychoanalytically-grounded tarot reading web app. Users choose from 7 spread types, view card draws with images from the Diary of a Broken Soul deck, and get AI-generated interpretations powered by Claude Haiku via NaraRouter.

## Run & Operate

- `pnpm --filter @workspace/bri run dev` — run the frontend (Vite static, port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- Required env: `NARA_API_KEY` — NaraRouter API key for Claude Haiku access

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: Pure HTML/CSS/Vanilla JS served by Vite (no framework)
- **API**: Express 5 + OpenAI SDK pointed at `https://router.bynara.id/v1`
- **AI model**: `claude-haiku` via NaraRouter (OpenAI-compatible endpoint)

## Where things live

- `artifacts/bri/index.html` — spread selection page (entry point)
- `artifacts/bri/spread.html` — spread display & AI reading page
- `artifacts/bri/public/styles.css` — dark theme styling
- `artifacts/bri/public/tarotSpreads.js` — deck logic and spread generators
- `artifacts/bri/public/spread-display.js` — card layout rendering
- `artifacts/bri/public/card-descriptions.js` — per-card AI description fetcher
- `artifacts/bri/public/ai-reading.js` — full reading AI handler
- `artifacts/bri/public/{clubs,diamonds,hearts,spades,majors}/` — card images (.webp)
- `artifacts/api-server/src/routes/tarot.ts` — `/api/health`, `/api/reading`, `/api/card-description`, `/api/quick-read`

## API Endpoints

- `GET  /api/health` — model/service status
- `POST /api/reading` — full spread reading `{ query, cards[] }`
- `POST /api/card-description` — one-sentence card interpretation
- `POST /api/quick-read` — single card quick read

## Architecture decisions

- Frontend is served as a multi-page static site by Vite (index.html + spread.html both as rollup inputs)
- All AI calls go through the shared Express API server at `/api`, routed by the Replit reverse proxy
- `API_BASE = '/api'` is defined inline in `spread.html` before the JS scripts load
- The OpenAI SDK is used with a custom `baseURL` pointing to NaraRouter — no Replit AI integration needed

## User preferences

_Populate as needed._

## Gotchas

- Card images use relative paths (e.g. `clubs/clubs01ace.webp`) — they must live in `artifacts/bri/public/`
- `spread.html` must define `API_BASE` before the `<script src="...">` tags load
- Vite still loads `src/index.css` for the cartographer plugin — keep that file even though the app is plain HTML
