# Antigravity Prompt 05 — Frontend: Discovery, Education Hub & Profile

> Paste after Prompt 04 is complete and verified.

## Context

Core flow is done. Now add **discovery** (search, trending, sort), **bookmarks**, **social sharing**, the **education hub**, and the **profile** page. Backend endpoints already exist from Prompt 03.

## Task

Extend the frontend with discovery, education, and profile features.

## Steps

### 1. Search & sort (`/feed` enhancements)

- Add a search input that calls `GET /stories?search=...` (debounced ~300ms).
- Add a sort dropdown: `Terbaru` (newest) | `Sedang tren` (trending) | `Paling didukung` (supportive).
- Keep category chips working together with search + sort (compose query params).

### 2. Trending section

- Add a "Sedang tren" section/banner on the feed when `sort=trending`: show top 3 stories by recent reactions with a small fire/trend badge.

### 3. Bookmarks

- Story detail bookmark button persists to backend (`POST/DELETE /stories/:id/bookmark`), with optimistic UI.
- Profile "Tersimpan" tab lists bookmarked stories (`GET /profile/bookmarks`).

### 4. Social sharing

- Implement "Bagikan" on story detail:
  - Copy link button (`navigator.clipboard`) → toast "Tautan disalin".
  - WhatsApp: `https://wa.me/?text=<encoded title + url>`
  - Twitter/X: `https://twitter.com/intent/tweet?text=<encoded title>&url=<url>`
  - Use `navigator.share` when available (mobile).

### 5. Education hub (`/edukasi`)

- List articles from `GET /articles`: card with cover image, title, summary.
- Article detail (`/edukasi/[slug]`): render title, summary, body (markdown — use a lightweight renderer or simple formatting), and a share button.
- Add "Hub Edukasi" link in the header.

### 6. Profile (`/profil`)

- Header card: avatar (initial), username, join date, stats (total stories, bookmarks).
- Tabs: **Cerita Saya** (`GET /profile/stories`) and **Tersimpan** (`GET /profile/bookmarks`).
  - "Cerita Saya" shows the user's own stories, including anonymous ones (marked with a small "Anonim" badge visible only to self) and status badge for `PENDING` stories.
- **Pengaturan** (`/profil/pengaturan`): change username (`PATCH /profile`) and change password.
- Logout button in the profile menu.

### 7. Auth guard integration

- Protect `/feed`, `/buat-cerita`, `/cerita/*`, `/edukasi/*`, `/profil/*` routes (redirect to `/login`).

## Definition of Done

- [ ] Search + sort + category compose correctly against the API.
- [ ] Trending section appears with `sort=trending`.
- [ ] Bookmark toggle works and persists; "Tersimpan" lists them.
- [ ] Share produces working WA/Twitter/copy links.
- [ ] Education hub lists + renders articles.
- [ ] Profile shows my stories (incl. anonymous + pending badges) and saved stories.
- [ ] Username change works.

## Verification

```
cd frontend && npm run dev
# test search "bias", sort "Sedang tren", bookmark a story, share to WhatsApp, open /edukasi, open /profil tabs
```
