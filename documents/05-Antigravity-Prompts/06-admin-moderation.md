# Antigravity Prompt 06 — Admin Dashboard & Moderation

> Paste after Prompt 05 is complete and verified.

## Context

All user-facing features are built. Now build the **admin dashboard** for moderation and analytics. The backend admin endpoints exist from Prompt 03 (`@Roles('ADMIN')`). The report email alert (Nodemailer) already fires on new reports.

## Task

Build the admin frontend (role-gated) and verify the full moderation loop.

## Steps

### 1. Admin guard

- Create an `AdminGuard`/`withAdmin` check on the frontend: redirect non-admin users away from `/admin`.
- Only show the "Dashboard Admin" link in the profile menu if `user.role === 'ADMIN'`.

### 2. Admin layout (`/admin`)

- Sidebar or tab navigation: **Laporan** (reports), **Moderasi** (pending content), **Analitik** (analytics), **Kata Terlarang** (banned words).

### 3. Reports queue (`/admin/laporan`)

- List `GET /admin/reports`: each row shows target type, target content preview, reporter (anonymized or username), reason, details, date.
- Action buttons per report: **Pertahankan** (KEEP) / **Hapus** (REMOVE) / **Peringatan** (WARN) → `PATCH /admin/reports/:id`.
- After action, row moves to "reviewed" state (or disappears from pending list).

### 4. Moderation queue (`/admin/moderasi`)

- List `GET /admin/moderation`: pending stories and comments flagged by the keyword filter.
- For each: show content + which banned word triggered it, with **Terbitkan** (`PATCH .../status` → PUBLISHED) or **Hapus** (→ REMOVED).

### 5. Analytics (`/admin/analitik`)

- Render `GET /admin/analytics` as cards + simple bar chart (pure CSS/SVG, no heavy chart lib):
  - Total users, total stories, reactions, reports pending/resolved, content removed.
  - Stories by category breakdown.

### 6. Banned words (`/admin/kata-terlarang`)

- List `GET /admin/banned-words`; add via `POST`; delete via `DELETE`.
- Confirm before delete.

### 7. Report email alert verification

- Confirm `POST /reports` triggers an email to `ADMIN_EMAIL` (check Mailtrap). No frontend change needed here, just verify.

## Definition of Done

- [ ] Non-admin users cannot access `/admin` (redirected).
- [ ] Report queue lists pending reports with target preview.
- [ ] Keep/remove/warn actions resolve reports and apply content status changes.
- [ ] Moderation queue lists keyword-flagged content; publish/remove works.
- [ ] Analytics renders all metrics + category breakdown.
- [ ] Banned-word add/remove works and immediately affects new submissions.

## Verification

```
cd frontend && npm run dev
# log in as admin@ceritakita.id / admin123
# 1. file a report as a normal user
# 2. open /admin/laporan → resolve it
# 3. submit a story containing a banned word → find it in /admin/moderasi → publish/remove
# 4. check /admin/analitik and /admin/kata-terlarang
```
