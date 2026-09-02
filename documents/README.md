# CeritaKita — Documentation Pack

**CeritaKita** is a safe digital sharing platform tackling **SDG 5: Gender Equality**. The core problem it addresses is a cultural belief that *men feel superior to women*. The platform gives anyone (especially women and others who experience gender bias) a safe space to share experiences, read others' stories, receive community support, and access short educational content — with the goal of building cross-gender empathy and normalizing open, respectful discussion about equality.

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** NestJS + Prisma ORM
- **Database:** PostgreSQL via Docker Compose
- **Auth:** Login required, register with username/email/password, forgot-password via OTP (Nodemailer SMTP), optional anonymous publishing

---

## Document index

| # | File | Purpose |
|---|------|---------|
| 1 | [`01-PRD.md`](./01-PRD.md) | Product Requirements Document — problem, personas, journeys, full feature specs, design system, content strategy, risks |
| 2 | [`02-Scrum-Process.md`](./02-Scrum-Process.md) | Scrum setup — roles, ceremonies, Definition of Ready/Done, estimation, sprint roadmap |
| 3 | [`03-Product-Backlog.md`](./03-Product-Backlog.md) | Prioritized backlog — epics, user stories, acceptance criteria, story points, sprint allocation |
| 4 | [`04-Architecture.md`](./04-Architecture.md) | Technical design — monorepo layout, ERD, data model, auth flows, API contract, email templates, security |
| 5 | [`05-Antigravity-Prompts/`](./05-Antigravity-Prompts/) | Sequenced, self-contained prompts to paste into Antigravity to build the app |
| 6 | [`06-Glossary.md`](./06-Glossary.md) | Domain terminology (SDG 5, anonymous mode, moderation statuses, reaction types) |
| 7 | [`07-Templates.md`](./07-Templates.md) | Reusable templates — user story, sprint review, retro, Definition of Done checklist |

---

## Reading order

**For a business-class grader / reviewer** (understanding the *why* and *what*):

```
01-PRD.md  →  03-Product-Backlog.md  →  02-Scrum-Process.md  →  04-Architecture.md
```

**For building the app** (executing in Antigravity):

```
04-Architecture.md (skim for schema + API)  →  05-Antigravity-Prompts/  (in order 01 → 07)
```

---

## How to execute in Antigravity

The `05-Antigravity-Prompts/` folder contains **7 prompts** that build the project incrementally. Each prompt is self-contained: it states the context, the exact files to create, the features to implement, and a Definition of Done.

### Rules for execution

1. **Run in order** — each prompt depends on the previous one's output.
2. **One prompt per session** (or clear checkpoint) so you can verify each step before moving on.
3. **Paste the whole prompt** — do not summarize it.
4. **Verify before advancing** — each prompt ends with a `Definition of Done` + `Verification` checklist. Run the commands there before the next prompt.
5. **Start fresh context if stuck** — the prompts are self-contained; you can resume from any prompt with a clean agent session.

### Prompt sequence

| # | Prompt | What it builds |
|---|--------|----------------|
| 01 | `01-setup-monorepo.md` | Docker Compose (Postgres), NestJS + Next.js scaffolds, Prisma schema, seed data |
| 02 | `02-backend-auth.md` | Register, login, JWT, refresh, forgot-password OTP, `/auth/me`, anonymous persona |
| 03 | `03-backend-content.md` | Stories, comments, reactions, bookmarks, reports, keyword moderation, articles, admin endpoints |
| 04 | `04-frontend-core.md` | Landing, auth pages, home feed, story create/detail, comments, report modal |
| 05 | `05-frontend-discovery-edu.md` | Search, trending, sort, bookmarks, social sharing, education hub, profile |
| 06 | `06-admin-moderation.md` | Admin dashboard, report queue, moderation actions, analytics, report email alerts |
| 07 | `07-integration-polish.md` | Wire frontend↔backend, seed content, UX polish, production readiness checklist |

---

## Conventions

- **Feature IDs** (`FR-AUTH-01`, `FR-STORY-03`, …) are defined in `01-PRD.md` and referenced by `03-Product-Backlog.md` and `04-Architecture.md`.
- **User story IDs** (`US-01`, `US-02`, …) are defined in `03-Product-Backlog.md`.
- **Acceptance criteria** use the Given/When/Then format.
- **App UI/copy is in Bahasa Indonesia**; all documents are in English.
- **"Must be logged in"** is a hard rule: even anonymous stories are linked to a real account in the database for moderation purposes.
