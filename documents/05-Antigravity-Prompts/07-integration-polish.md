# Antigravity Prompt 07 — Integration, Seed & Polish

> Paste after Prompt 06 is complete and verified. This is the final pass.

## Context

All features are built. Now do end-to-end integration, seed/verify content, and apply UX + production-readiness polish.

## Task

Wire everything together, verify the full demo flow, polish the UX, and prepare for handoff.

## Steps

### 1. End-to-end integration audit

- Confirm the frontend talks to the backend through `NEXT_PUBLIC_API_URL` in all environments.
- Walk the complete journey and fix any broken wiring:
  1. Landing → register → feed
  2. Create story (named) → appears on feed
  3. Create story (anonymous) → shows "Anonim #…"
  4. Keyword-flagged story → "sedang ditinjau" → appears in admin moderation
  5. React + comment (with guideline modal) → persists
  6. Bookmark → appears in profile "Tersimpan"
  7. Search/trending/sort → correct results
  8. Education hub → read article → share
  9. Report a comment → admin email (Mailtrap) + admin queue → resolve
  10. Forgot password → OTP → reset → login with new password
  11. Non-admin blocked from `/admin`

### 2. Seed verification

- Confirm the seed creates: admin + 2 users, 15 stories across all 6 categories (mix anon/named), 6 articles, 20 banned words.
- If any seed data looks placeholder/low-quality, improve the story/article copy so the demo feels real (see PRD §8 for exact titles).

### 3. UX polish

- Consistent spacing/typography/colors across all pages (PRD §7).
- Loading states (skeletons/spinners) on feed, story detail, admin lists.
- Empty states everywhere (feed, comments, saved, admin queues).
- Error toasts for network/API failures.
- Responsive check at 360px and 1280px.
- Add a small "Anonim" info tooltip explaining anonymity ("Identitas kamu tetap tercatat untuk keamanan, tapi tidak ditampilkan").

### 4. Accessibility pass

- Focus states, `aria-label`s, semantic landmarks, `alt` text, contrast ≥ 4.5:1.

### 5. Production readiness

- Root `README.md`: prerequisites (Docker, Node ≥ 20), setup steps, seed command, demo accounts table.
- Ensure `.env`/`.env.local` are gitignored; `.env.example`/`.env.local.example` present.
- Add a root `npm` script convenience (optional: `Makefile` or `docker compose` note).
- Build both apps: `cd backend && npm run build` and `cd frontend && npm run build` succeed with no type/lint errors.

### 6. Demo script

- Write a `DEMO.md` at repo root with a 5-minute demo script (what to click, which stories to show, how to demo moderation + anonymity).

## Definition of Done

- [ ] All 11 journey steps above work end-to-end.
- [ ] Seed data is realistic and complete.
- [ ] No visible UI inconsistencies or missing empty/loading/error states.
- [ ] `npm run build` passes for backend and frontend.
- [ ] `README.md` + `DEMO.md` are written.

## Verification

```
docker compose up -d
cd backend && npm run build && npm run start:dev
cd frontend && npm run build && npm run dev
# follow DEMO.md script end-to-end
```
