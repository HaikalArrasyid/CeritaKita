# Antigravity Prompt 03 — Backend: Content, Moderation & Admin

> Paste after Prompt 02 is complete and verified.

## Context

Auth is done. Now build the content domain: **stories, comments, reactions, bookmarks, reports, keyword moderation, articles, and admin endpoints**. The backend is NestJS + Prisma + PostgreSQL with JWT guards already in place.

## Task

Implement modules for stories, comments, reactions, bookmarks, reports, articles, moderation, and admin.

## Steps

### 1. Moderation service

- `ModerationService.check(text): boolean` — normalize (lowercase, strip diacritics) and check against all `BannedWord` rows (substring match). Also flag obvious PII patterns (email regex, `+62`/`08` phone, 16-digit ID numbers).
- Return matched word/reason for logging (and optionally store on `Report` when admin removes).

### 2. Stories module

| Endpoint | Behavior |
|---|---|
| `GET /stories` | Guards: only `PUBLISHED`. Query: `category`, `search` (title/content ILIKE), `sort` (`newest` default | `trending` = reaction count in last 7 days | `supportive` = most support reactions), `page`/`limit` (default 10). Return `{ data, meta: { page, limit, total } }`. Each item: `id, title, category, contentPreview (160), isAnonymous, displayName, reactionCounts { relate, support }, commentCount, createdAt`. |
| `POST /stories` | Validate `{ title (3–120), category, content (1–5000), isAnonymous }`. Run moderation → `status = clean ? PUBLISHED : PENDING`. |
| `GET /stories/:id` | Full story (only if `PUBLISHED`, or the author/admin). Include reactions summary + comments. |
| `PATCH /stories/:id` | Author only; re-run moderation on update. |
| `DELETE /stories/:id` | Author or admin. |

**Display name resolution:** `isAnonymous` → `"Anonim #" + authorId.slice(0,6)`; else author username. Public endpoints must never leak the real author of an anonymous story.

### 3. Comments module

| Endpoint | Behavior |
|---|---|
| `GET /stories/:id/comments` | Only `PUBLISHED` comments (or admin), newest-first. |
| `POST /stories/:id/comments` | `{ content }` 1–2000; run moderation → `PENDING`/`PUBLISHED`. |

### 4. Reactions module

| Endpoint | Behavior |
|---|---|
| `POST /stories/:id/reactions` | `{ type: RELATE|SUPPORT }`; upsert (one per user/story — switching type replaces). Return updated counts. |
| `DELETE /stories/:id/reactions` | Remove reaction; return counts. |

### 5. Bookmarks module

| Endpoint | Behavior |
|---|---|
| `POST /stories/:id/bookmark` | Create; return `{ bookmarked: true }`. |
| `DELETE /stories/:id/bookmark` | Delete; return `{ bookmarked: false }`. |

### 6. Reports module

| Endpoint | Behavior |
|---|---|
| `POST /reports` | `{ targetType, targetId, reason, details? }`; validate target exists; create `Report` (`PENDING`); trigger `MailService.sendReportAlert` to `ADMIN_EMAIL`. |

### 7. Articles module

| Endpoint | Behavior |
|---|---|
| `GET /articles` | `published=true` list: `{ id, title, slug, summary, coverImage, createdAt }`. |
| `GET /articles/:slug` | Full article. |

### 8. Admin module (all guarded by `@Roles('ADMIN')`)

| Endpoint | Behavior |
|---|---|
| `GET /admin/reports` | `PENDING` reports, joined with target content. |
| `PATCH /admin/reports/:id` | `{ action: KEEP|REMOVE|WARN }` → set report `REVIEWED` + `resolvedAt` + `resolvedById`; if `REMOVE`, set target story/comment `status=REMOVED`. |
| `GET /admin/moderation` | `PENDING` stories + comments (from keyword filter). |
| `PATCH /admin/stories/:id/status` | `{ status }` (publish/remove). |
| `PATCH /admin/comments/:id/status` | `{ status }`. |
| `GET /admin/analytics` | `{ totalUsers, totalStories, storiesByCategory, totalReactions, reportsPending, reportsResolved, contentRemoved }`. |
| `GET /admin/banned-words` | list. |
| `POST /admin/banned-words` | `{ word }` (unique). |
| `DELETE /admin/banned-words/:id` | delete. |

### 9. Share endpoint

- `GET /stories/:id/share` returns `{ url, waUrl, twitterUrl }` (frontend origin + path + encoded text). (Build the share URLs on the frontend; this endpoint may just return the story metadata — keep it minimal.)

## Definition of Done

- [ ] Clean story → `PUBLISHED`; flagged story → `PENDING`.
- [ ] Feed filters by category, searches, sorts, paginates.
- [ ] Anonymous stories never expose real username on public endpoints.
- [ ] Reactions toggle/switch correctly (unique constraint honored).
- [ ] Comments moderated; first commenter logic handled on frontend (Prompt 04).
- [ ] Report creates row + email alert (verify Mailtrap).
- [ ] Admin endpoints require `ADMIN` role (403 otherwise).
- [ ] Analytics returns correct aggregates.

## Verification

```
# create story (TOKEN from login)
curl -X POST localhost:3001/api/stories -H "Authorization: Bearer TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Pengalaman saya","category":"WORK","content":"Isi cerita...","isAnonymous":true}'
# feed
curl "localhost:3001/api/stories?category=WORK&sort=trending" -H "Authorization: Bearer TOKEN"
# admin (ADMIN token) reports
curl localhost:3001/api/admin/reports -H "Authorization: Bearer ADMIN_TOKEN"
```
