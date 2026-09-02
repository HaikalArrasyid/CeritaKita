# Antigravity Prompt 04 — Frontend: Core Flow (Landing, Auth, Feed, Story)

> Paste after Prompt 03 is complete and verified.

## Context

Next.js (App Router) + Tailwind frontend is scaffolded with the design system tokens from Prompt 01. The NestJS backend (auth + content) is complete. Now build the **core user flow**: landing page, authentication pages, home feed, story creation, story detail, comments, reactions, and the report modal.

All UI copy is **Bahasa Indonesia**. Design must feel **safe, warm, and supportive** (PRD §7). API base = `NEXT_PUBLIC_API_URL`.

## Task

Build the frontend core flow with an API client and auth context.

## Steps

### 1. API client & auth context

- `lib/api.ts`: Axios instance with baseURL `NEXT_PUBLIC_API_URL`, `withCredentials: true`. Request interceptor attaches `Authorization: Bearer <accessToken>`. Response interceptor: on 401, try `POST /auth/refresh`, retry once, else redirect to `/login`.
- `lib/auth.tsx`: React context `AuthProvider` exposing `{ user, login, register, logout, loading }`. Persist access token in memory + refresh cookie (httpOnly). On mount, call `GET /auth/me` to restore session.
- A route guard: pages under the feed/story/hub/profile/admin require auth; redirect to `/login` if unauthenticated.

### 2. Landing page (`/`)

- Hero: product name "CeritaKita", tagline "Ceritamu didengar.", short mission paragraph, CTA "Mulai".
- If logged in → CTA goes to `/feed`; else → `/login` (or `/daftar`).
- Brief "Mengapa CeritaKita?" section (3 points: ruang aman, anonim, edukasi). Footer.

### 3. Auth pages (`/login`, `/daftar`, `/lupa-password`)

- `/daftar`: register form (username, email, password). Client validation mirrors backend (username regex, password ≥ 8). Show field-level errors from API (e.g., "Email sudah terdaftar"). On success → auto-login → `/feed`.
- `/login`: email + password. Link "Lupa password?". On success → `/feed`.
- `/lupa-password`: 3-step wizard:
  1. Enter email → call `forgot-password` → generic success message.
  2. Enter 6-digit OTP → `verify-otp`.
  3. Enter new password → `reset-password` → redirect to `/login`.
  - Include resend button with 60s cooldown.
- Polish: branded, calm colors, clear labels.

### 4. Home feed (`/feed`)

- Header: logo, "Buat Cerita" button, education hub link, profile menu (avatar/username → profile, logout).
- Category filter chips: `Semua`, `Lingkungan Kerja`, `Pendidikan`, `Rumah Tangga`, `Ruang Publik`, `Media Sosial`, `Lainnya`.
- Story cards: `displayName` (or "Anonim #…"), category badge, title, content preview (~160 chars + "Baca selengkapnya"), reaction counts ("Aku relate" ×N, "Aku dukung" ×N), comment count, relative time.
- Infinite scroll or "Muat lebih banyak" pagination.
- Empty state: "Belum ada cerita di kategori ini — jadi yang pertama!"
- Tapping a card → `/cerita/[id]`.

### 5. Create story (`/buat-cerita`)

- Form: judul, kategori (dropdown), isi (textarea with char counter 5000), toggle "Tampilkan sebagai anonim".
- Submit → `POST /stories`. If response `status=PENDING` → show notice "Cerita kamu sedang ditinjau moderator." If `PUBLISHED` → toast "Cerita berhasil dibagikan" → navigate to `/cerita/[id]`.
- Validation errors inline.

### 6. Story detail (`/cerita/[id]`)

- Full story: category badge, title, display name, relative time, full body.
- Reaction bar: two buttons "Aku relate" / "Aku dukung" with counts, active state filled with accent color. Toggle behavior.
- Bookmark button (toggles).
- Share button → native share / copy link + WhatsApp + Twitter links (Prompt 05 expands; basic copy here).
- Comments section: list (newest first), each with display name + time + content.
- Comment form: on first comment show **guideline modal** "Gunakan bahasa yang sopan dan saling menghargai." with "Mengerti" button. Then submit.
- "Laporkan" button (on story + each comment) → opens report modal.

### 7. Report modal (`/laporkan`)

- Modal with reason radio: `Konten kasar`, `Ujaran kebencian`, `SARA`, `Membocorkan data pribadi`, `Lainnya` + optional textarea details.
- Submit → `POST /reports` → toast "Terima kasih, laporan kamu akan ditinjau."

### 8. Shared components

- `Button`, `Input`, `Textarea`, `Badge`, `CategoryChip`, `ReactionButton`, `Modal`, `Toast`, `EmptyState`, `Card`.
- Use the design tokens (Poppins headings / Nunito Sans body).

## Definition of Done

- [ ] Full journey works: landing → daftar → feed → buat cerita → cerita detail → react/comment → report.
- [ ] Login required: visiting `/feed` logged-out redirects to `/login`.
- [ ] Anonymous toggle produces "Anonim #…" display.
- [ ] Guideline modal shows on first comment only.
- [ ] Report modal submits and shows confirmation.
- [ ] All copy in Bahasa Indonesia; design matches palette/typography.

## Verification

```
cd frontend && npm run dev
# manually test: register → login → create story (anon + named) → react → comment → report
# confirm logged-out redirects work
```
