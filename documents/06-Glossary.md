# CeritaKita — Glossary

| Term | Definition |
|---|---|
| **SDG 5** | Sustainable Development Goal 5 — *Achieve gender equality and empower all women and girls*. The UN goal CeritaKita addresses. |
| **Gender equality** | The state of equal rights, responsibilities, and opportunities regardless of gender. |
| **Superiority bias** | The belief that one gender (typically men) is inherently superior to another, which the platform targets via empathy-building. |
| **Anonymous mode** | A story is published with `isAnonymous=true`: the author's real username is hidden publicly and shown as "Anonim #<id>", while the real account remains recorded for moderation. |
| **Anonymous persona** | The displayed identity "Anonim #<id>" derived from the author's id; not a separate account. |
| **Category** | One of six story topics: Lingkungan Kerja (WORK), Pendidikan (SCHOOL), Rumah Tangga (HOME), Ruang Publik (PUBLIC_SPACE), Media Sosial (SOCIAL_MEDIA), Lainnya (OTHER). |
| **Reaction** | A non-aggressive response: "Aku relate" (RELATE) or "Aku dukung" (SUPPORT). One per user per story. |
| **Comment** | A user reply under a story; subject to the same moderation as stories. |
| **Bookmark** | A saved story for later reading ("Tersimpan"). |
| **Moderation** | The process keeping the space safe: automated keyword filter + human admin review. |
| **Keyword filter** | Automated check of submitted text against a banned-word list; matching content becomes `PENDING`. |
| **Banned word** | A term in the `BannedWord` table (profanity, hate speech, SARA, or sensitive data) that triggers the filter. |
| **SARA** | Indonesian acronym for *Suku, Agama, Ras, Antar-golongan* (ethnicity, religion, race, inter-group) — content targeting these is prohibited and moderated. |
| **Status (content)** | `PENDING` (awaiting review), `PUBLISHED` (live), `REMOVED` (taken down). |
| **Report** | A user-submitted complaint about a story or comment, reviewed by admin. |
| **Report reason** | Enum: `RUDE` (konten kasar), `HATE_SPEECH` (ujaran kebencian), `SARA`, `PII_LEAK` (membocorkan data pribadi), `OTHER` (lainnya). |
| **Admin action** | The decision on a report/moderation item: `KEEP` (pertahankan), `REMOVE` (hapus), or `WARN` (peringatan). |
| **OTP** | One-time password — a 6-digit code emailed for password reset, hashed and expiring (10 min). |
| **Access token** | Short-lived JWT (15 min) sent in the `Authorization` header. |
| **Refresh token** | Longer-lived JWT (7 days) stored in an httpOnly cookie, used to renew the access token. |
| **JWT** | JSON Web Token — signed token carrying user identity/role. |
| **Prisma** | TypeScript ORM used to model the PostgreSQL schema, run migrations, and seed data. |
| **MoSCoW** | Prioritization: Must / Should / Could / Won't. |
| **Story point** | Relative effort estimate on the Fibonacci scale (1 ≈ half-day). |
| **Definition of Done (DoD)** | The checklist a story must satisfy to be considered complete. |
| **Definition of Ready (DoR)** | The checklist a story must satisfy before entering a sprint. |
| **Epic** | A large body of work (e.g., "Stories & Sharing Loop") grouping related user stories. |
| **User story** | A requirement in `As a… I want… so that…` format with acceptance criteria. |
| **Sprint** | A timeboxed (here compressed) iteration delivering a usable increment. |
| **Persona** | A representative user archetype guiding design decisions (Sari, Bima, Ibu Ratna, Dito). |
| **Empathy map** | A diagram capturing what a persona thinks, sees, hears, says, and feels. |
