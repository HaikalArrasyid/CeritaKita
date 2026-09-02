# Antigravity Prompt 02 — Backend: Authentication & Accounts

> Paste this prompt after Prompt 01 is complete and verified.

## Context

CeritaKita backend (NestJS + Prisma + PostgreSQL) is set up. Now implement authentication: **register (username/email/password), login, JWT access+refresh, forgot-password via emailed OTP, logout, and `/auth/me`**. Users must be logged in to use the platform; anonymous applies only to how stories are displayed, not to account access.

## Task

Implement the `AuthModule` (and minimal `UsersModule`) with all auth endpoints below.

## Steps

### 1. Users service

- `UsersService` with `findByEmail`, `findById`, `create({ username, email, passwordHash })`.
- Normalize: lowercase + trim email; validate username with regex `^[a-zA-Z0-9_]{3,20}$`.
- Hash passwords with `bcrypt` (salt rounds 10).

### 2. DTOs (with class-validator)

- `RegisterDto`: `username` (regex + length), `email` (IsEmail), `password` (MinLength 8).
- `LoginDto`: `email`, `password`.
- `ForgotPasswordDto`: `email`.
- `VerifyOtpDto`: `email`, `otp` (6-digit string).
- `ResetPasswordDto`: `email`, `otp`, `newPassword` (MinLength 8).

### 3. JWT strategy & guards

- `JwtStrategy` (passport-jwt) reading `Authorization: Bearer`.
- `JwtAuthGuard` and `RolesGuard` with `@Roles('ADMIN')` decorator.
- `JwtRefreshStrategy` for the refresh cookie.

### 4. Auth service & controller

Implement endpoints returning a consistent shape:

| Endpoint | Behavior |
|---|---|
| `POST /auth/register` | Validate; 409 on duplicate email/username with field-level message; create user; return `{ accessToken, user }` and set refresh cookie (httpOnly, SameSite). |
| `POST /auth/login` | 401 on bad credentials (generic message); return tokens + set cookie. |
| `POST /auth/refresh` | Read refresh cookie; rotate; return new `{ accessToken }` + set new cookie. |
| `POST /auth/logout` | Clear the refresh cookie; return `{ ok: true }`. |
| `POST /auth/forgot-password` | Generate 6-digit OTP, store `codeHash` (bcrypt) with 10-min expiry; send email via Mailer; **always** return generic `{ message: "Jika email terdaftar, kode verifikasi telah dikirim." }`. |
| `POST /auth/verify-otp` | Verify hash + expiry + not consumed; return `{ ok: true }` (or a short reset token). |
| `POST /auth/reset-password` | Verify OTP again, mark consumed, update passwordHash. |
| `GET /auth/me` | Guarded; return current user (no passwordHash). |

### 5. Mailer service

- `MailModule`/`MailService` using `nodemailer` with SMTP config from env.
- Method `sendOtp(email, code)` with template:
  - Subject: `Kode verifikasi CeritaKita`
  - Body: `Kode verifikasi kamu adalah: {code}. Kode berlaku 10 menit.`
- Add rate limiting: resend cooldown 60s, max 3 verify attempts per OTP.

### 6. Rate limiting

- Apply a basic throttle (e.g., `@nestjs/throttler`) on `forgot-password` and `verify-otp` (5 req/min).

## Security notes

- Never return `passwordHash` or OTP plaintext in responses.
- `user` object returned by auth endpoints = `{ id, username, email, role, createdAt }`.
- Refresh cookie: `httpOnly: true, sameSite: 'lax', path: '/auth'`.

## Definition of Done

- [ ] Register → returns tokens; duplicate email/username → 409.
- [ ] Login → correct credentials return tokens; wrong → 401.
- [ ] Forgot password → OTP emailed (Mailtrap inbox shows it); wrong email → same generic message.
- [ ] Verify OTP → correct succeeds, expired/wrong fails with error.
- [ ] Reset password → new password works on next login.
- [ ] `GET /auth/me` returns user with a valid access token; 401 without.
- [ ] Admin `role` field present; `@Roles('ADMIN')` guard functional (test with a dummy endpoint or defer to Prompt 06).

## Verification

```
# register
curl -X POST localhost:3001/api/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
# login
curl -X POST localhost:3001/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'
# me (replace TOKEN)
curl localhost:3001/api/auth/me -H "Authorization: Bearer TOKEN"
```
