# Antigravity Prompt 01 — Setup Monorepo & Infrastructure

> Paste this entire prompt into Antigravity (or any coding agent) and let it execute. Run it first.

## Context

We are building **CeritaKita**, a safe gender-equality story-sharing platform (SDG 5). Stack: **Next.js** (App Router) + **Tailwind CSS** frontend, **NestJS** backend, **PostgreSQL** via Docker Compose, **Prisma** ORM. Login is required to use the platform; users register with username/email/password and can publish stories anonymously.

You are operating inside the repo root at `/Users/haikal/Coding/CeritaKita` with empty `backend/`, `frontend/`, and `documents/` folders already present.

## Task

Set up the monorepo foundation: Dockerized PostgreSQL, a NestJS backend scaffold, a Next.js frontend scaffold, the Prisma schema, and a seed script.

## Steps

### 1. Root

- Create `docker-compose.yml` with a `postgres:16-alpine` service (user/password/db all `ceritakita`), port `5432:5432`, named volume `pgdata`.
- Create a root `README.md` with run instructions.

### 2. Backend (NestJS)

- Scaffold NestJS in `backend/` (TypeScript, npm). Use `@nestjs/cli` style layout.
- Install: `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`, `nodemailer`, `@prisma/client`, and dev deps `prisma`, `@types/nodemailer`, `@types/bcrypt`, `@types/passport-jwt`.
- Set up a `PrismaModule` with a `PrismaService` (`extends PrismaClient`) with `onModuleInit` → `$connect()`.
- Create `backend/.env.example` with all vars from the architecture doc:
  ```
  DATABASE_URL=postgresql://ceritakita:ceritakita@localhost:5432/ceritakita?schema=public
  JWT_ACCESS_SECRET=change_me_access
  JWT_REFRESH_SECRET=change_me_refresh
  JWT_ACCESS_TTL=15m
  JWT_REFRESH_TTL=7d
  SMTP_HOST=smtp.mailtrap.io
  SMTP_PORT=2525
  SMTP_USER=
  SMTP_PASS=
  MAIL_FROM=CeritaKita <no-reply@ceritakita.id>
  ADMIN_EMAIL=admin@ceritakita.id
  FRONTEND_URL=http://localhost:3000
  PORT=3001
  ```
- Configure global `ValidationPipe({ whitelist: true, transform: true })` and CORS allowlist = `http://localhost:3000`.
- Configure `ConfigModule.forRoot({ isGlobal: true })`.

### 3. Prisma schema

Create `backend/prisma/schema.prisma` with exactly these models (match `04-Architecture.md` §3):

- `User`: `id` (uuid, default `uuid()`), `username` (unique), `email` (unique), `passwordHash`, `role` enum `USER|ADMIN` (default `USER`), `createdAt`, `updatedAt`.
- `Story`: `id`, `authorId` (FK User), `title`, `category` enum `WORK|SCHOOL|HOME|PUBLIC_SPACE|SOCIAL_MEDIA|OTHER`, `content` (Text), `isAnonymous` (Boolean default false), `status` enum `PENDING|PUBLISHED|REMOVED` (default `PENDING`), `createdAt`, `updatedAt`.
- `Comment`: `id`, `storyId` (FK Story), `authorId` (FK User), `content`, `status` enum `PENDING|PUBLISHED|REMOVED` (default `PENDING`), `createdAt`.
- `Reaction`: `id`, `storyId`, `userId`, `type` enum `RELATE|SUPPORT`; unique `(storyId, userId)`.
- `Bookmark`: `id`, `userId`, `storyId`; unique `(userId, storyId)`.
- `Report`: `id`, `targetType` enum `STORY|COMMENT`, `targetId`, `reporterId` (FK User), `reason` enum `RUDE|HATE_SPEECH|SARA|PII_LEAK|OTHER`, `details` (nullable Text), `status` enum `PENDING|REVIEWED` (default `PENDING`), `action` enum `KEEP|REMOVE|WARN` (nullable), `resolvedById` (nullable FK User), `createdAt`, `resolvedAt` (nullable).
- `Otp`: `id`, `email`, `codeHash`, `purpose` enum `PASSWORD_RESET`, `expiresAt`, `consumedAt` (nullable), `createdAt`.
- `Article`: `id`, `title`, `slug` (unique), `summary`, `content` (Text), `coverImage` (nullable), `published` (Boolean default true), `createdAt`.
- `BannedWord`: `id`, `word` (unique), `createdAt`.

Add relations with `onDelete: Cascade` where sensible (Story→Comment/Reaction/Bookmark cascade; User→Story cascade). Run `npx prisma migrate dev --name init` and `npx prisma generate`.

### 4. Seed script

Create `backend/prisma/seed.ts` that:
- Creates an admin (`admin@ceritakita.id` / `admin123`) and two users (`sari@ceritakita.id`, `bima@ceritakita.id`, both `password123`), passwords hashed with bcrypt.
- Inserts 15 stories across all 6 categories (mix of anonymous and named; status `PUBLISHED`), 6 education articles, and ~20 banned words (Indonesian profanity/hate/SARA terms).
- Wire `"prisma": { "seed": "ts-node prisma/seed.ts" }` in package.json and run the seed.

### 5. Frontend (Next.js)

- Scaffold Next.js in `frontend/` (TypeScript, App Router, Tailwind CSS).
- Add `frontend/.env.local.example` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`.
- Create a minimal design-system foundation: a `tailwind.config.ts` (or CSS variables) defining the palette from PRD §7.2 (`primary #2F9E8E`, `primary-dark #1E6F63`, `primary-light #E0F2EF`, `accent-relate #8B7FC7`, `accent-support #E88B6B`, `background #FBF9F7`, `surface #FFFFFF`, `text-primary #2D2A2E`, `text-secondary #6B676E`, `border #E6E1DC`, `danger #C0463D`, `success #3D8B5E`, `warning #D9932F`).
- Import Google Fonts `Poppins` (headings) and `Nunito Sans` (body) via `next/font`.
- Set `lang="id"` on the root layout.

## Definition of Done

- [ ] `docker compose up -d` starts PostgreSQL.
- [ ] `cd backend && npm run start:dev` boots without errors; Prisma connects.
- [ ] `npx prisma migrate dev` succeeds and `seed.ts` populates data.
- [ ] `cd frontend && npm run dev` serves the app at `localhost:3000`.
- [ ] No secrets committed (only `.env.example`).

## Verification

```
docker compose up -d
cd backend && npx prisma migrate dev && npm run seed (or npm run prisma:seed)
cd backend && npm run start:dev
cd frontend && npm run dev
```
