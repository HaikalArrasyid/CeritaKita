# CeritaKita — Scrum Process

## 1. Scrum team

| Role | Responsibility | Assigned to |
|---|---|---|
| Product Owner (PO) | Owns the PRD & backlog; prioritizes stories; accepts/rejects work | Business-class team lead |
| Scrum Master (SM) | Facilitates ceremonies; removes blockers; tracks velocity | Team member (rotating) |
| Developer (Frontend) | Next.js UI, Tailwind, API integration | Dev A |
| Developer (Backend) | NestJS API, Prisma, DB, auth, moderation | Dev B |
| Designer/QA | Design system adherence; acceptance testing | Dev A + B (shared) |

> For a small team, roles are **cross-functional** — the two developers also handle design & QA, and the SM/PO roles may overlap.

## 2. Scrum artifacts

| Artifact | Location | Purpose |
|---|---|---|
| Product Backlog | `03-Product-Backlog.md` | Ordered list of all work (epics → stories) |
| Sprint Backlog | `02-Scrum-Process.md` §5 | Subset committed to this sprint |
| Increment | `backend/` + `frontend/` code | The usable, tested output of a sprint |
| Definition of Ready (DoR) | §3.1 | Checklist a story must meet before sprinting |
| Definition of Done (DoD) | §3.2 | Checklist a story must meet to be "done" |

## 3. Definition of Ready & Done

### 3.1 Definition of Ready (a story is sprint-ready when…)

- [ ] Has a clear user story in `As a… I want… so that…` format.
- [ ] Has acceptance criteria in **Given/When/Then** format.
- [ ] Has a story-point estimate (Fibonacci).
- [ ] Has a `Must/Should/Could` (MoSCoW) priority.
- [ ] Dependencies are identified and not blocking.
- [ ] UI stories reference the design system (§7 of PRD) or include a mock description.

### 3.2 Definition of Done (a story is done when…)

- [ ] All acceptance criteria pass manual testing.
- [ ] Code is committed and builds without errors (`npm run build`).
- [ ] No lint/type errors (`npm run lint`, `tsc --noEmit`).
- [ ] Backend endpoints verified via a request (Postman/curl/Insomnia) and return expected status codes.
- [ ] Happy path **and** at least one edge/error path are manually tested.
- [ ] UI matches design system (colors, spacing, copy in Bahasa Indonesia).
- [ ] No secrets committed (`.env` excluded, `.env.example` updated).
- [ ] A short demo note (what to show) is added to the sprint review notes.

## 4. Ceremonies & cadence

| Ceremony | Frequency | Duration | Purpose |
|---|---|---|---|
| Sprint Planning | Start of sprint | 30–45 min | Select backlog items → sprint goal |
| Daily Scrum | Daily | 10 min | What did I do / will do / blockers |
| Sprint Review | End of sprint | 30 min | Demo increment to PO/stakeholders |
| Sprint Retrospective | End of sprint | 30 min | What went well / improve / actions |
| Backlog Refinement | Mid-sprint | 30 min | Groom upcoming stories |

## 5. Sprint roadmap (ASAP, MVP-first)

The build is compressed into **4 sprints**. Ordering is **value-first**: authentication & the core sharing loop ship before discovery and admin tooling. Story references (`US-*`) map to `03-Product-Backlog.md`.

### Sprint 1 — Foundation & Authentication
- **Goal:** Monorepo + database running; users can register, log in, and reset passwords via OTP.
- **Scope:** `US-01` (setup), `US-02` (register/login), `US-03` (forgot password OTP), `US-04` (session persistence), `US-05` (anonymous persona data model).
- **Exit:** `docker compose up` works; register→login→reset flow demoable via Postman + basic auth pages.

### Sprint 2 — Content core
- **Goal:** The sharing loop works end-to-end: create story → feed → detail → react → comment.
- **Scope:** `US-06` (create story + anonymous toggle), `US-07` (feed + category filter), `US-08` (story detail), `US-09` (reactions), `US-10` (comments + guideline), `US-11` (keyword filter on publish).
- **Exit:** A user can publish a story and see it on the feed; a second user can react and comment.

### Sprint 3 — Discovery, education & profile
- **Goal:** Make content findable and the experience complete for the reader.
- **Scope:** `US-12` (search), `US-13` (trending + sort), `US-14` (bookmark), `US-15` (share), `US-16` (education hub), `US-17` (profile).
- **Exit:** Reader can search/trend/bookmark/share stories and read education articles; profile shows my stories & saved.

### Sprint 4 — Moderation, admin & polish
- **Goal:** Make the space safe and demo-ready.
- **Scope:** `US-18` (report), `US-19` (report email alert), `US-20` (admin report queue + moderation), `US-21` (admin analytics), `US-22` (banned-word management), `US-23` (seed + polish).
- **Exit:** Full moderation loop + admin dashboard demo; seed content live; polished UX.

## 6. Estimation

- **Scale:** Fibonacci (1, 2, 3, 5, 8, 13).
- **Basis:** 1 point ≈ half-day of a single developer's focused effort.
- **Velocity assumption:** 2 developers × ~10 points/sprint ≈ 20 points/sprint (used for planning; revisit each retro).

| Sprint | Planned points |
|---|---|
| 1 | ~19 |
| 2 | ~24 |
| 3 | ~21 |
| 4 | ~22 |

## 7. Burndown & progress tracking

- Track remaining story points daily.
- A **burndown chart** can be generated in the sprint review (see `07-Templates.md` for a simple table).
- If velocity is consistently below plan, the PO trims `Should/Could` items before `Must` items.

## 8. Sprint review & retrospective

- **Review:** demo each "done" story against its acceptance criteria; PO accepts or sends back with notes.
- **Retrospective** uses the template in `07-Templates.md` (What went well / What didn't / Action items).

## 9. Reporting & grading (business class)

- Each sprint ends with a 1-page summary linking **committed vs completed** stories, burndown, and a demo link.
- The final deliverable ties back to **SDG 5** with the metrics from PRD §3.2.
