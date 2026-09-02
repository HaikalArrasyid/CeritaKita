# CeritaKita — Technical Architecture

## 1. Tech stack & rationale

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS | SSR/SEO-friendly; server + client components; Tailwind speeds up design-system implementation |
| Backend | NestJS (TypeScript) | Modular, scalable; first-class DI, guards, pipes for auth & validation |
| ORM | Prisma | Type-safe schema, migrations, easy seed; PostgreSQL support |
| Database | PostgreSQL 16 (Docker) | Relational fits the model; production-grade; chosen over SQLite per product decision |
| Auth | JWT (access + refresh) via `@nestjs/jwt` + Passport | Stateless, standard; refresh rotation |
| Email | Nodemailer (SMTP) | OTP delivery + report alerts; Mailtrap for dev |
| Validation | `class-validator` + `class-transformer` | Declarative DTO validation |
| Password hashing | `bcrypt` (or `argon2`) | Industry standard |
| API client | Axios (frontend) | Simple; interceptors for tokens |

## 2. Monorepo layout

```
CeritaKita/
├── docker-compose.yml            # PostgreSQL service
├── README.md                     # root run instructions
├── documents/                    # this documentation pack
├── backend/                      # NestJS
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── prisma/               # PrismaModule + PrismaService
│   │   ├── auth/                 # controller, service, strategies, guards, dto
│   │   ├── users/
│   │   ├── stories/
│   │   ├── comments/
│   │   ├── reactions/
│   │   ├── bookmarks/
│   │   ├── reports/
│   │   ├── articles/
│   │   ├── moderation/           # keyword filter service
│   │   ├── mail/                 # mail service (OTP, report alert)
│   │   └── admin/                # admin controller + analytics
│   ├── .env.example
│   └── package.json
└── frontend/                     # Next.js
    ├── src/
    │   ├── app/                  # App Router pages (landing, auth, feed, story, hub, profile, admin)
    │   ├── components/           # UI components
    │   ├── lib/                  # api client, auth context, utils
    │   └── styles/               # Tailwind + design tokens
    ├── .env.example
    └── package.json
```

## 3. Data model (Prisma)

```mermaid
erDiagram
    User ||--o{ Story : "writes"
    User ||--o{ Comment : "writes"
    User ||--o{ Reaction : "gives"
    User ||--o{ Bookmark : "saves"
    User ||--o{ Report : "files"
    Story ||--o{ Comment : "has"
    Story ||--o{ Reaction : "receives"
    Story ||--o{ Bookmark : "bookmarked"
    Report }o--|| User : "resolved_by (admin)"
    Otp }o--|| User : "belongs_to"

    User {
        string id PK
        string username UK
        string email UK
        string passwordHash
        enum role
        datetime createdAt
        datetime updatedAt
    }
    Story {
        string id PK
        string authorId FK
        string title
        enum category
        string content
        boolean isAnonymous
        enum status
        datetime createdAt
        datetime updatedAt
    }
    Comment {
        string id PK
        string storyId FK
        string authorId FK
        string content
        enum status
        datetime createdAt
    }
    Reaction {
        string id PK
        string storyId FK
        string userId FK
        enum type
    }
    Bookmark {
        string id PK
        string userId FK
        string storyId FK
    }
    Report {
        string id PK
        enum targetType
        string targetId
        string reporterId FK
        enum reason
        string details
        enum status
        string resolvedById FK
        enum action
        datetime createdAt
        datetime resolvedAt
    }
    Otp {
        string id PK
        string email
        string codeHash
        enum purpose
        datetime expiresAt
        datetime consumedAt
        datetime createdAt
    }
    Article {
        string id PK
        string title
        string slug UK
        string summary
        string content
        string coverImage
        boolean published
        datetime createdAt
    }
    BannedWord {
        string id PK
        string word UK
        datetime createdAt
    }
```

### 3.1 Field details & enums

| Model | Field | Type | Notes |
|---|---|---|---|
| User | `id` | uuid | PK |
| User | `username` | string (unique) | `^[a-zA-Z0-9_]{3,20}$` |
| User | `email` | string (unique) | lowercased |
| User | `passwordHash` | string | bcrypt |
| User | `role` | enum `USER`, `ADMIN` | default `USER` |
| Story | `category` | enum `WORK`, `SCHOOL`, `HOME`, `PUBLIC_SPACE`, `SOCIAL_MEDIA`, `OTHER` | maps to ID labels |
| Story | `status` | enum `PENDING`, `PUBLISHED`, `REMOVED` | `PENDING` = awaiting review |
| Comment | `status` | enum `PENDING`, `PUBLISHED`, `REMOVED` | |
| Reaction | `type` | enum `RELATE`, `SUPPORT` | "Aku relate" / "Aku dukung" |
| Reaction | unique | `(storyId, userId)` | one reaction per user/story |
| Bookmark | unique | `(userId, storyId)` | |
| Report | `targetType` | enum `STORY`, `COMMENT` | |
| Report | `reason` | enum `RUDE`, `HATE_SPEECH`, `SARA`, `PII_LEAK`, `OTHER` | |
| Report | `status` | enum `PENDING`, `REVIEWED` | |
| Report | `action` | enum `KEEP`, `REMOVE`, `WARN` (nullable) | admin decision |
| Otp | `purpose` | enum `PASSWORD_RESET` | |
| Otp | `codeHash` | string | hashed OTP |

### 3.2 Anonymous persona resolution

- A story with `isAnonymous=true` still has a real `authorId`.
- **Display name** is computed in the API layer, never stored as the primary identifier:
  - `isAnonymous` → `"Anonim #" + shortId(authorId)` (e.g., first 6 hex chars).
  - otherwise → the author's `username`.
- The real `authorId`/username is returned **only** to the author themself or admins (in profile/admin endpoints).

## 4. Auth flows

### 4.1 Register / login

1. Client → `POST /auth/register` (or `/auth/login`).
2. Backend validates DTO; hashes password; persists user.
3. Backend issues **access token** (15 min) + **refresh token** (7 days).
4. Refresh token stored as **httpOnly cookie**; access token returned in body and used as `Authorization: Bearer`.

### 4.2 Refresh

```
Client (access expired) → POST /auth/refresh (with httpOnly refresh cookie)
  → verify refresh token → issue new access + rotated refresh → set new cookie
```

### 4.3 Forgot password (OTP)

```mermaid
sequenceDiagram
    participant U as User
    participant B as Backend
    participant M as Mailer
    U->>B: POST /auth/forgot-password {email}
    B->>B: generate 6-digit OTP, hash, store (10 min TTL)
    B->>M: send email via SMTP
    U->>B: POST /auth/verify-otp {email, otp}
    B->>B: verify hash + expiry
    U->>B: POST /auth/reset-password {email, otp, newPassword}
    B->>B: mark OTP consumed, update password
```

## 5. Moderation pipeline

1. On `POST /stories` / `POST /stories/:id/comments`, the moderation service:
   1. Normalizes text (lowercase, strip diacritics).
   2. Checks against `BannedWord` list (substring match).
   3. Also checks for sensitive PII patterns (email, phone, KTP-like digits).
2. If **no match** → `status=PUBLISHED`.
3. If **match** → `status=PENDING`; content visible only in the admin queue; author sees "under review".
4. Admin reviews `PENDING` content and publishes/removes (FR-ADMIN-03).
5. User reports (FR-MOD-02) create a `Report` row and trigger the email alert (FR-MOD-03).

## 6. REST API contract

Base URL: `http://localhost:3001/api`

### 6.1 Auth

| Method | Path | Body / Query | Response | Auth |
|---|---|---|---|---|
| POST | `/auth/register` | `{ username, email, password }` | `{ accessToken, user }` + refresh cookie | — |
| POST | `/auth/login` | `{ email, password }` | `{ accessToken, user }` + refresh cookie | — |
| POST | `/auth/refresh` | (cookie) | `{ accessToken }` + new cookie | refresh |
| POST | `/auth/logout` | (cookie) | `{ ok }` | — |
| POST | `/auth/forgot-password` | `{ email }` | `{ message }` | — |
| POST | `/auth/verify-otp` | `{ email, otp }` | `{ resetToken }` | — |
| POST | `/auth/reset-password` | `{ email, otp, newPassword }` | `{ ok }` | — |
| GET | `/auth/me` | — | `{ user }` | access |

### 6.2 Stories

| Method | Path | Query / Body | Response | Auth |
|---|---|---|---|---|
| GET | `/stories` | `?category=&search=&sort=newest|trending|supportive&page=&limit=` | paginated list | access |
| POST | `/stories` | `{ title, category, content, isAnonymous }` | created story | access |
| GET | `/stories/:id` | — | story + reactions summary + comments | access |
| PATCH | `/stories/:id` | partial | updated | author |
| DELETE | `/stories/:id` | — | `{ ok }` | author/admin |

### 6.3 Comments & reactions & bookmarks

| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/stories/:id/comments` | — | comments | access |
| POST | `/stories/:id/comments` | `{ content }` | comment | access |
| POST | `/stories/:id/reactions` | `{ type }` | reaction | access |
| DELETE | `/stories/:id/reactions` | — | `{ ok }` | access |
| POST | `/stories/:id/bookmark` | — | `{ bookmarked }` | access |
| DELETE | `/stories/:id/bookmark` | — | `{ bookmarked }` | access |
| GET | `/stories/:id/share` | — | `{ url, waUrl, twitterUrl }` | access |

### 6.4 Reports

| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/reports` | `{ targetType, targetId, reason, details? }` | report | access |

### 6.5 Articles

| Method | Path | Response | Auth |
|---|---|---|---|
| GET | `/articles` | list | access |
| GET | `/articles/:slug` | article | access |

### 6.6 Profile

| Method | Path | Response | Auth |
|---|---|---|---|
| GET | `/profile` | `{ user, counts }` | access |
| GET | `/profile/stories` | my stories (incl. anonymous) | access |
| GET | `/profile/bookmarks` | saved stories | access |
| PATCH | `/profile` | `{ username? }` | access |

### 6.7 Admin (role = ADMIN)

| Method | Path | Response | Auth |
|---|---|---|---|
| GET | `/admin/reports` | pending reports | admin |
| PATCH | `/admin/reports/:id` | `{ action }` | admin |
| GET | `/admin/moderation` | pending stories/comments | admin |
| PATCH | `/admin/stories/:id/status` | `{ status }` | admin |
| PATCH | `/admin/comments/:id/status` | `{ status }` | admin |
| GET | `/admin/analytics` | summary stats | admin |
| GET | `/admin/banned-words` | list | admin |
| POST | `/admin/banned-words` | `{ word }` | admin |
| DELETE | `/admin/banned-words/:id` | `{ ok }` | admin |

### 6.8 Error format

All errors return a consistent shape:

```json
{ "statusCode": 409, "message": "Email sudah terdaftar", "field": "email" }
```

| Code | Meaning |
|---|---|
| 400 | Validation failed |
| 401 | Unauthorized / invalid token |
| 403 | Forbidden (e.g., non-admin) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limit exceeded |

## 7. Email templates (Nodemailer)

### 7.1 OTP email

```
Subject: Kode verifikasi CeritaKita
Body:
  Halo,
  Kode verifikasi kamu adalah: {OTP}
  Kode berlaku 10 menit. Jika kamu tidak meminta, abaikan email ini.
```

### 7.2 Report alert (admin)

```
Subject: [CeritaKita] Laporan baru — {STORY|COMMENT}
Body:
  Target: {targetId}
  Alasan: {reason}
  Detail: {details}
  Buka dashboard admin untuk meninjau.
```

## 8. Environment variables

### backend `.env`

```
DATABASE_URL=postgresql://ceritakita:ceritakita@localhost:5432/ceritakita?schema=public
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=CeritaKita <no-reply@ceritakita.id>
ADMIN_EMAIL=admin@ceritakita.id
FRONTEND_URL=http://localhost:3000
```

### frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ceritakita
      POSTGRES_PASSWORD: ceritakita
      POSTGRES_DB: ceritakita
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## 9. Security considerations

- Passwords and OTPs stored hashed (bcrypt).
- Refresh tokens in httpOnly, SameSite cookies; rotated on refresh.
- Role guards (`@Roles(ADMIN)`) protect admin endpoints.
- Input validation on all DTOs.
- Rate limiting on auth endpoints (esp. `/forgot-password`, `/verify-otp`).
- CORS allowlist = frontend origin only.
- Anonymous authors are never exposed publicly; admin-only access to real identity.
- `.env` never committed; `.env.example` committed instead.
