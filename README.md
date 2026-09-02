# CeritaKita

A safe digital sharing platform for gender-equality storytelling (SDG 5).

## Prerequisites

- Node.js ≥ 20
- Docker + Docker Compose
- npm

## Quick start

```bash
# 1. Start the database
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env   # fill in SMTP credentials and AWS S3 config if needed
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev      # runs on http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev            # runs on http://localhost:3000
```

## Demo accounts

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| Admin | admin@ceritakita.id     | admin123     |
| User  | sari@ceritakita.id      | password123  |
| User  | bima@ceritakita.id      | password123  |

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend  | NestJS + Prisma ORM           |
| Database | PostgreSQL 16 (Docker)        |
| Auth     | JWT (access + refresh cookie) |
| Email    | Nodemailer (Mailtrap in dev)  |
| Storage  | Local & AWS S3 (Optional)     |
