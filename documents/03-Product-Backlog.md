# CeritaKita — Product Backlog

Prioritized backlog for the MVP. Stories are grouped by epic and reference feature IDs (`FR-*`) from `01-PRD.md`. Estimation uses Fibonacci points (1 ≈ half-day).

## Priority legend

- **Must** — required for MVP demo.
- **Should** — expected if time allows; valuable but deferrable.
- **Could** — nice-to-have; lowest risk to drop.

---

## Epics

| Epic | Title | Stories |
|---|---|---|
| E1 | Foundation | US-01 |
| E2 | Authentication & Accounts | US-02 … US-05 |
| E3 | Stories & Sharing Loop | US-06 … US-11 |
| E4 | Discovery & Engagement | US-12 … US-17 |
| E5 | Moderation & Trust & Safety | US-18 … US-22 |
| E6 | Education & Content | US-16, US-23 |

---

## Backlog items

### E1 — Foundation

#### US-01 — Project & infrastructure setup
- **As a** developer, **I want** a monorepo with Dockerized PostgreSQL, NestJS backend, and Next.js frontend scaffolds, **so that** the team can build on a shared, reproducible foundation.
- **FR:** (none — infra) · **Priority:** Must · **Points:** 5 · **Sprint:** 1
- **Acceptance criteria:**
  - Given `docker compose up -d`, then a PostgreSQL instance is reachable at the configured port.
  - Given the backend runs migrations, then the Prisma schema is applied successfully.
  - Given both `backend` and `frontend` run, then each serves its dev server without errors.
- **Notes:** See `04-Architecture.md` §2 for tree; `.env.example` provided for both apps.

---

### E2 — Authentication & Accounts

#### US-02 — Register & login
- **As a** new visitor, **I want** to register with a username, email, and password, **so that** I can create an account and start using the platform.
- **FR:** FR-AUTH-01, FR-AUTH-02 · **Priority:** Must · **Points:** 5 · **Sprint:** 1
- **Acceptance criteria:**
  - Given a valid unique username, email, and password ≥ 8 chars, then the account is created and the user is authenticated.
  - Given an existing email/username, then a 409 error with a field-level message is returned.
  - Given a registered account, then logging in with correct credentials returns tokens.
  - Given wrong credentials, then a 401 error is returned without revealing which field was wrong.
- **Notes:** Passwords hashed with bcrypt/argon2.

#### US-03 — Forgot password via OTP
- **As a** user who forgot my password, **I want** to reset it using a code emailed to me, **so that** I can regain access securely.
- **FR:** FR-AUTH-03 · **Priority:** Must · **Points:** 5 · **Sprint:** 1
- **Acceptance criteria:**
  - Given a registered email, then a 6-digit OTP is emailed and a verify screen appears.
  - Given an unregistered email, then a generic success message is shown (no existence leak).
  - Given a correct, unexpired OTP, then the user can set a new password.
  - Given an expired or wrong OTP, then an error is shown and resend is possible (60s cooldown).

#### US-04 — Session persistence & logout
- **As a** logged-in user, **I want** my session to persist across reloads and be revocable, **so that** I stay signed in conveniently but can log out.
- **FR:** FR-AUTH-04, FR-AUTH-05 · **Priority:** Must · **Points:** 3 · **Sprint:** 1
- **Acceptance criteria:**
  - Given valid access + refresh tokens, then the frontend stays authenticated across page reloads.
  - Given an expired access token, then a refresh token renews the session silently.
  - Given a logout, then tokens are invalidated and the user returns to the landing page.

#### US-05 — Anonymous persona (data model)
- **As a** user, **I want** to publish a story anonymously while my identity is still recorded internally, **so that** I feel safe sharing while moderators can hold bad actors accountable.
- **FR:** FR-AUTH-06 (enabler) · **Priority:** Must · **Points:** 2 · **Sprint:** 1
- **Acceptance criteria:**
  - Given a story is created with `isAnonymous=true`, then it is stored with a real `authorId` and flagged anonymous.
  - Given an anonymous story is rendered, then only "Anonim #<id>" is shown publicly.
- **Notes:** The `displayName` resolution logic lives in the backend.

---

### E3 — Stories & Sharing Loop

#### US-06 — Create a story
- **As a** logged-in user, **I want** to write a story with a title, category, body, and an anonymous toggle, **so that** I can share my experience.
- **FR:** FR-STORY-01 · **Priority:** Must · **Points:** 5 · **Sprint:** 2
- **Acceptance criteria:**
  - Given valid title (3–120), category, and body (1–5000), then the story is created and moderated.
  - Given empty/invalid fields, then validation errors are shown.
  - Given the anonymous toggle is on, then the story is displayed anonymously.
  - Given a logged-out user, then the create action redirects to login.

#### US-07 — Home feed with category filter
- **As a** user, **I want** a feed of published stories filterable by category, **so that** I can browse relevant experiences.
- **FR:** FR-FEED-01, FR-FEED-02 · **Priority:** Must · **Points:** 5 · **Sprint:** 2
- **Acceptance criteria:**
  - Given a logged-in user, then the feed shows only `PUBLISHED` stories, newest first.
  - Given a category is selected, then only that category is shown.
  - Given an empty result, then an empty state is shown.
  - Given long content, then a preview (~160 chars) with "Baca selengkapnya" is shown.

#### US-08 — Story detail view
- **As a** reader, **I want** to open a story and see its full content and metadata, **so that** I can understand the experience.
- **FR:** FR-STORY-02 · **Priority:** Must · **Points:** 3 · **Sprint:** 2
- **Acceptance criteria:**
  - Given a published story, then the detail page shows title, category, display name, full body, reactions, and comments.
  - Given a removed story, then a "not available" state is shown.

#### US-09 — Reactions ("Aku relate" / "Aku dukung")
- **As a** reader, **I want** to react supportively, **so that** I can show empathy without an aggressive like/dislike.
- **FR:** FR-STORY-04 · **Priority:** Must · **Points:** 3 · **Sprint:** 2
- **Acceptance criteria:**
  - Given a tap on a reaction, then the count increments and the state toggles active.
  - Given a second tap, then the reaction is removed.
  - Given a switch of reaction type, then the previous is replaced (one per user).

#### US-10 — Comments with community guideline
- **As a** reader, **I want** to comment on a story (with a first-time kindness reminder), **so that** I can engage respectfully.
- **FR:** FR-STORY-05 · **Priority:** Must · **Points:** 5 · **Sprint:** 2
- **Acceptance criteria:**
  - Given a first comment, then the guideline pop-up appears once.
  - Given a submitted comment, then it is moderated and shown/pending accordingly.
  - Given comments exist, then they are listed newest-first.

#### US-11 — Automated keyword filter on publish
- **As a** moderator, **I want** stories/comments checked against a banned-word list, **so that** harmful content is blocked before publication.
- **FR:** FR-MOD-01 · **Priority:** Must · **Points:** 3 · **Sprint:** 2
- **Acceptance criteria:**
  - Given content containing a banned word, then status is `PENDING` (queued for review).
  - Given clean content, then status is `PUBLISHED`.
  - Given a pending story, then the author sees "under review" notice.

---

### E4 — Discovery & Engagement

#### US-12 — Search
- **As a** user, **I want** to search stories by keyword, **so that** I can find specific experiences.
- **FR:** FR-FEED-03 · **Priority:** Should · **Points:** 3 · **Sprint:** 3

#### US-13 — Trending & sort
- **As a** user, **I want** to sort by newest/trending/most-supportive, **so that** I can discover popular content.
- **FR:** FR-FEED-04, FR-FEED-05 · **Priority:** Should · **Points:** 5 · **Sprint:** 3

#### US-14 — Bookmark / save
- **As a** user, **I want** to save stories, **so that** I can re-read them later.
- **FR:** FR-STORY-06 · **Priority:** Should · **Points:** 2 · **Sprint:** 3

#### US-15 — Social sharing
- **As a** user, **I want** to share a story to WhatsApp/Twitter, **so that** I can bring others into the conversation.
- **FR:** FR-STORY-07 · **Priority:** Should · **Points:** 2 · **Sprint:** 3

#### US-16 — Education hub
- **As a** user, **I want** to read short education articles, **so that** I can learn about gender equality.
- **FR:** FR-EDU-01, FR-EDU-02 · **Priority:** Must · **Points:** 5 · **Sprint:** 3

#### US-17 — Profile
- **As a** user, **I want** a profile with my stories and saved items, **so that** I can manage my content.
- **FR:** FR-PROF-01…04 · **Priority:** Should · **Points:** 5 · **Sprint:** 3

---

### E5 — Moderation, Trust & Safety, Admin

#### US-18 — Report content
- **As a** user, **I want** to report a story or comment, **so that** inappropriate content is reviewed.
- **FR:** FR-MOD-02 · **Priority:** Must · **Points:** 3 · **Sprint:** 4

#### US-19 — Report email alert
- **As an** admin, **I want** an email when a report is filed, **so that** I can act promptly.
- **FR:** FR-MOD-03 · **Priority:** Should · **Points:** 2 · **Sprint:** 4

#### US-20 — Admin report queue & moderation
- **As an** admin, **I want** a queue of reports with keep/remove actions, **so that** I can maintain a safe space.
- **FR:** FR-ADMIN-01, FR-ADMIN-02, FR-ADMIN-03 · **Priority:** Must · **Points:** 8 · **Sprint:** 4

#### US-21 — Admin analytics
- **As an** admin, **I want** summary analytics, **so that** I can monitor platform health.
- **FR:** FR-ADMIN-04 · **Priority:** Should · **Points:** 3 · **Sprint:** 4

#### US-22 — Banned-word management
- **As an** admin, **I want** to add/remove banned words, **so that** the filter stays current.
- **FR:** FR-ADMIN-05 · **Priority:** Should · **Points:** 3 · **Sprint:** 4

---

### E6 — Content

#### US-23 — Seed content & UX polish
- **As a** stakeholder, **I want** realistic seed data and polished UX, **so that** the demo feels real.
- **FR:** (content) · **Priority:** Must · **Points:** 5 · **Sprint:** 4
- **Acceptance criteria:**
  - Given a fresh DB seed, then 15 stories (all categories), 6 articles, demo accounts, and banned words exist.
  - Given the app, then all screens follow the design system and copy is in Bahasa Indonesia.

---

## Priority matrix summary

| Story | Priority | Points | Sprint |
|---|---|---|---|
| US-01 | Must | 5 | 1 |
| US-02 | Must | 5 | 1 |
| US-03 | Must | 5 | 1 |
| US-04 | Must | 3 | 1 |
| US-05 | Must | 2 | 1 |
| US-06 | Must | 5 | 2 |
| US-07 | Must | 5 | 2 |
| US-08 | Must | 3 | 2 |
| US-09 | Must | 3 | 2 |
| US-10 | Must | 5 | 2 |
| US-11 | Must | 3 | 2 |
| US-12 | Should | 3 | 3 |
| US-13 | Should | 5 | 3 |
| US-14 | Should | 2 | 3 |
| US-15 | Should | 2 | 3 |
| US-16 | Must | 5 | 3 |
| US-17 | Should | 5 | 3 |
| US-18 | Must | 3 | 4 |
| US-19 | Should | 2 | 4 |
| US-20 | Must | 8 | 4 |
| US-21 | Should | 3 | 4 |
| US-22 | Should | 3 | 4 |
| US-23 | Must | 5 | 4 |
