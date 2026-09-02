# CeritaKita API Documentation

Dokumentasi API untuk tim frontend. Backend: **NestJS** di port `3001`, seluruh endpoint di-prefix `/api`.

- **Base URL (dev):** `http://localhost:3001/api`
- **Format request/response:** JSON
- **Bahasa pesan error:** Bahasa Indonesia

---

## 1. Autentikasi

| Metode | Deskripsi |
|---|---|
| `Authorization: Bearer <accessToken>` | Wajib untuk endpoint yang di-protect. Access token berlaku **15 menit**. |
| Cookie `refresh_token` (httpOnly) | Diset otomatis saat register/login/refresh di path `/api/auth`. Berlaku **7 hari**. Digunakan untuk memperpanjang sesi. |

**Alur frontend:**
1. `POST /auth/login` → dapat `accessToken` di body + cookie `refresh_token` otomatis.
2. Setiap request protected kirim header `Authorization: Bearer <accessToken>`.
3. Jika dapat `401`, panggil `POST /auth/refresh` (cookie dikirim otomatis oleh browser) untuk dapat `accessToken` baru.

> Catatan: cookie hanya dapat dibaca/ditulis oleh browser. Frontend **tidak perlu** menyimpan refresh token — cukup panggil `/auth/refresh`.

### Format Error Umum

```json
// 400 — validasi gagal
{ "statusCode": 400, "message": ["Password minimal 8 karakter"], "error": "Bad Request" }

// 401 — token tidak valid / belum login
{ "statusCode": 401, "message": "Unauthorized" }

// 403 — bukan admin (akses admin)
{ "statusCode": 403, "message": "Forbidden" }

// 404 — resource tidak ditemukan
{ "statusCode": 404, "message": "Cerita tidak ditemukan", "error": "Not Found" }
```

### Enumerasi

```text
Role:            USER, ADMIN
Category:        WORK, SCHOOL, HOME, PUBLIC_SPACE, SOCIAL_MEDIA, OTHER
ContentStatus:   PENDING, PUBLISHED, REMOVED
ReactionType:    RELATE, SUPPORT
ReportTargetType: STORY, COMMENT
ReportReason:    RUDE, HATE_SPEECH, SARA, PII_LEAK, OTHER
ReportStatus:    PENDING, REVIEWED
ReportAction:    KEEP, REMOVE, WARN
```

---

## 2. Auth — `/auth`

### `POST /auth/register` — Daftar akun baru
**Public.** Set cookie `refresh_token`, balas `accessToken`.

**Body:**
```json
{
  "username": "sari_dewi",          // 3-20 karakter: huruf, angka, underscore
  "email": "sari@ceritakita.id",
  "password": "password123"          // minimal 8 karakter
}
```
**Response 201:**
```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "9076d516-2144-42de-be5a-16777cd448af",
    "username": "sari_dewi",
    "email": "sari@ceritakita.id",
    "role": "USER",
    "createdAt": "2026-08-18T13:36:52.144Z"
  }
}
```
**Error:** `409` jika email/username sudah terdaftar.

---

### `POST /auth/login` — Masuk
**Public.** Set cookie `refresh_token`, balas `accessToken`. HTTP 200.

**Body:**
```json
{ "email": "sari@ceritakita.id", "password": "password123" }
```
**Response 200:** sama dengan register (`accessToken` + `user`).

---

### `POST /auth/refresh` — Perpanjang sesi
**Public.** Membaca cookie `refresh_token`. Jika cookie ada & valid, balas `accessToken` baru + set ulang cookie.

**Response 200:**
```json
{ "accessToken": "eyJhbGciOi...", "user": { ... } }
```

---

### `POST /auth/logout` — Keluar
**Public.** Menghapus cookie `refresh_token`. HTTP 200.

**Response 200:** `{ "ok": true }`

---

### `POST /auth/forgot-password` — Lupa password (kirim OTP)
**Public. Rate limit: 5 request/menit.** Mengirim OTP 6 digit ke email (di dev, OTP tercetak di log console server karena SMTP belum dikonfigurasi).

**Body:**
```json
{ "email": "sari@ceritakita.id" }
```
**Response 200:**
```json
{ "message": "Jika email terdaftar, kode verifikasi telah dikirim." }
```

---

### `POST /auth/verify-otp` — Verifikasi OTP
**Public. Rate limit: 5 request/menit.**

**Body:**
```json
{ "email": "sari@ceritakita.id", "otp": "123456" }
```
**Response 200:** `{ "ok": true }`
**Error:** `400` jika OTP salah/kadaluwarsa.

---

### `POST /auth/reset-password` — Reset password
**Public.** OTP hanya berlaku 10 menit & sekali pakai.

**Body:**
```json
{ "email": "sari@ceritakita.id", "otp": "123456", "newPassword": "passwordbaru123" }
```
**Response 200:** `{ "ok": true }`

---

### `GET /auth/me` — Info user saat ini
**Protected.** Membaca dari token.

**Response 200:**
```json
{ "user": { "id": "...", "username": "sari_dewi", "email": "sari@ceritakita.id", "role": "USER" } }
```

---

## 3. Stories — `/stories`

### `GET /stories` — Feed cerita
**Public.** Hanya menampilkan status `PUBLISHED`.

**Query params:**
| Param | Nilai | Default |
|---|---|---|
| `category` | `WORK`, `SCHOOL`, `HOME`, `PUBLIC_SPACE`, `SOCIAL_MEDIA`, `OTHER` | semua |
| `search` | kata kunci (judul/isi) | - |
| `sort` | `newest`, `trending`, `supportive` | `newest` |
| `page` | ≥ 1 | 1 |
| `limit` | 1–50 | 10 |

**Response 200:**
```json
{
  "data": [
    {
      "id": "41db215c-9370-4d20-906f-34bef0bf5e20",
      "title": "Cerita dari sisi pria",
      "category": "OTHER",
      "contentPreview": "Sejak kecil aku diajarkan bahwa menangis...",
      "isAnonymous": false,
      "displayName": "bima_dev",
      "reactionCounts": { "relate": 3, "support": 5 },
      "commentCount": 2,
      "createdAt": "2026-08-18T13:36:28.310Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 17 }
}
```
> `displayName` menampilkan `Anonim #<6 digit pertama userId>` jika `isAnonymous: true`.

---

### `POST /stories` — Buat cerita
**Protected.**

**Body:**
```json
{
  "title": "Kisahku di kantor",       // 3-120 karakter
  "category": "WORK",                 // lihat enum Category
  "content": "Isi cerita...",         // 1-5000 karakter
  "isAnonymous": true                 // opsional, default false
}
```
**Response 201:** objek cerita lengkap + `status` (`PUBLISHED` atau `PENDING` jika terdeteksi kata terlarang).

---

### `GET /stories/:id` — Detail cerita
**Public.** Menampilkan konten penuh + komentar (status `PUBLISHED` saja) + jumlah reaksi.

**Response 200:**
```json
{
  "id": "...",
  "title": "Kisahku di kantor",
  "category": "WORK",
  "content": "Isi cerita...",
  "isAnonymous": true,
  "displayName": "Anonim #9076d5",
  "status": "PUBLISHED",
  "reactionCounts": { "relate": 0, "support": 1 },
  "comments": [
    {
      "id": "95c4ecc5-a755-4c5f-a6ad-3fe3f2dab00e",
      "content": "Kamu berani banget!",
      "displayName": "sari_dewi",
      "createdAt": "2026-08-18T13:38:00.000Z"
    }
  ],
  "createdAt": "2026-08-18T13:37:50.144Z"
}
```
**Error:** `404` jika tidak ada / status bukan PUBLISHED (kecuali pemilik/admin).

---

### `PATCH /stories/:id` — Edit cerita
**Protected.** Hanya pemilik (atau admin). Semua field opsional.

**Body:**
```json
{ "title": "Judul baru", "category": "HOME", "content": "Konten baru", "isAnonymous": false }
```
**Response 200:** objek cerita yang diupdate (bisa jadi `status: PENDING` jika konten baru mengandung kata terlarang).

---

### `DELETE /stories/:id` — Hapus cerita
**Protected.** Hanya pemilik (atau admin).

**Response 200:** `{ "ok": true }`

---

## 4. Comments — `/stories/:id/comments`

### `GET /stories/:id/comments` — Daftar komentar cerita
**Public.** Hanya komentar status `PUBLISHED`.

**Response 200:**
```json
[
  { "id": "...", "content": "Semangat!", "displayName": "sari_dewi", "createdAt": "..." }
]
```

---

### `POST /stories/:id/comments` — Tambah komentar
**Protected.**

**Body:**
```json
{ "content": "Kamu berani banget!" }
```
**Response 201:** objek komentar (status `PENDING` jika mengandung kata terlarang).

---

## 5. Reactions — `/stories/:id/reactions`

Reaksi bersifat **toggle** (kirim lagi dengan tipe sama = batal; tipe beda = ganti).

### `POST /stories/:id/reactions` — Reaksi (RELATE/SUPPORT)
**Protected. HTTP 200.**

**Body:**
```json
{ "type": "RELATE" }
```
**Response 200:**
```json
{ "relate": 1, "support": 0 }
```

---

### `DELETE /stories/:id/reactions` — Hapus reaksi saya
**Protected. HTTP 200.**

**Response 200:** `{ "relate": 0, "support": 0 }`

---

## 6. Bookmarks — `/stories/:id/bookmark`

Toggle bookmark (kirim lagi = batal).

### `POST /stories/:id/bookmark` — Simpan / batal simpan
**Protected. HTTP 200.**

**Response 200:** `{ "bookmarked": true }` atau `{ "bookmarked": false }`

---

## 7. Reports — `/reports`

### `POST /reports` — Laporkan cerita/komentar
**Protected.**

**Body:**
```json
{
  "targetType": "STORY",       // STORY | COMMENT
  "targetId": "<id cerita/komentar>",
  "reason": "HATE_SPEECH",     // RUDE | HATE_SPEECH | SARA | PII_LEAK | OTHER
  "details": "Penjelasan opsional"
}
```
**Response 201:** objek laporan dengan `status: "PENDING"`.

---

## 8. Articles — `/articles`

### `GET /articles` — Daftar artikel edukasi
**Public.**

**Response 200:**
```json
[
  {
    "id": "...",
    "title": "Apa itu Kesetaraan Gender?",
    "slug": "apa-itu-kesetaraan-gender",
    "summary": "Ringkasan...",
    "coverImage": "url-gambar" | null,
    "createdAt": "..."
  }
]
```

---

### `GET /articles/:slug` — Detail artikel
**Public.**

**Response 200:** objek artikel lengkap (`title`, `slug`, `content`, `summary`, `coverImage`, `createdAt`).
**Error:** `404` jika tidak ditemukan / belum dipublish.

---

## 9. Profile — `/profile`

Semua endpoint **Protected**.

### `GET /profile` — Info profil + jumlah cerita & bookmark
**Response 200:**
```json
{
  "user": { "id": "...", "username": "sari_dewi", "email": "sari@ceritakita.id", "role": "USER" },
  "counts": { "stories": 3, "bookmarks": 5 }
}
```

---

### `GET /profile/stories` — Cerita milik saya (semua status)
**Response 200:** array cerita milik user (termasuk PENDING/REMOVED), terbaru dulu.

---

### `GET /profile/bookmarks` — Daftar bookmark saya
**Response 200:**
```json
[
  {
    "id": "<storyId>",
    "title": "Kisahku",
    "category": "WORK",
    "contentPreview": "Sebagian isi cerita...",
    "isAnonymous": true,
    "displayName": "Anonim #9076d5",
    "createdAt": "..."
  }
]
```

---

### `PATCH /profile` — Update username
**Body:**
```json
{ "username": "nama_baru" }
```
**Response 200:**
```json
{ "id": "...", "username": "nama_baru", "email": "sari@ceritakita.id", "role": "USER" }
```
**Error:** `409` jika username sudah dipakai.

---

## 10. Admin — `/admin`

Semua endpoint **Protected + role `ADMIN`** (non-admin → `403`).

### `GET /admin/reports` — Daftar laporan pending
**Response 200:**
```json
[
  {
    "id": "...",
    "targetType": "STORY",
    "targetId": "<storyId>",
    "reason": "HATE_SPEECH",
    "details": "...",
    "status": "PENDING",
    "reporter": { "id": "...", "username": "sari_dewi" },
    "createdAt": "..."
  }
]
```

---

### `PATCH /admin/reports/:id` — Putuskan laporan
**Body:**
```json
{ "action": "REMOVE" }
```
`REMOVE` = set status cerita/komentar menjadi `REMOVED`. Nilai lain: `KEEP`, `WARN`.

**Response 200:** objek laporan terupdate (`status: "REVIEWED"`, `action`, `resolvedAt`).

---

### `GET /admin/moderation` — Antrian moderasi (PENDING)
**Response 200:**
```json
{
  "stories": [
    { "id": "...", "title": "...", "status": "PENDING", "author": { "id": "...", "username": "..." } }
  ],
  "comments": [
    { "id": "...", "content": "...", "status": "PENDING", "author": { ... }, "story": { "id": "...", "title": "..." } }
  ]
}
```

---

### `PATCH /admin/stories/:id/status` — Ubah status cerita
**Body:**
```json
{ "status": "PUBLISHED" }
```
Nilai: `PENDING`, `PUBLISHED`, `REMOVED`. **Response 200:** objek cerita terupdate.

---

### `PATCH /admin/comments/:id/status` — Ubah status komentar
**Body:** `{ "status": "PUBLISHED" }` — **Response 200:** objek komentar terupdate.

---

### `GET /admin/analytics` — Statistik platform
**Response 200:**
```json
{
  "totalUsers": 4,
  "totalStories": 17,
  "totalComments": 3,
  "totalReactions": 2,
  "reportsPending": 1,
  "reportsReviewed": 1,
  "contentRemoved": 1,
  "storiesByCategory": [
    { "category": "SOCIAL_MEDIA", "count": 2 },
    { "category": "WORK", "count": 4 }
  ]
}
```

---

### `GET /admin/banned-words` — Daftar kata terlarang
**Response 200:** array `{ id, word, createdAt }`.

---

### `POST /admin/banned-words` — Tambah kata terlarang
**Body:**
```json
{ "word": "contoh" }
```
**Response 201:** objek kata terlarang. **Error:** `409` jika sudah ada.

---

### `DELETE /admin/banned-words/:id` — Hapus kata terlarang
**Response 200:** `{ "ok": true }`

---

## 11. Lainnya

### `GET /health` — Health check
**Public.** `{ "status": "ok", "service": "ceritakita-backend" }`

---

## 12. Ringkasan Proteksi Endpoint

| Public (tanpa token) | Protected (token) | Admin |
|---|---|---|
| `GET /auth/register` | `POST /stories` | semua `/admin/*` |
| `POST /auth/login` | `PATCH /stories/:id` | |
| `POST /auth/refresh` | `DELETE /stories/:id` | |
| `POST /auth/logout` | `POST /stories/:id/comments` | |
| `POST /auth/forgot-password` | `POST/DELETE /stories/:id/reactions` | |
| `POST /auth/verify-otp` | `POST /stories/:id/bookmark` | |
| `POST /auth/reset-password` | `POST /reports` | |
| `GET /stories` | `GET/PATCH /profile` | |
| `GET /stories/:id` | `GET /profile/stories` | |
| `GET /stories/:id/comments` | `GET /profile/bookmarks` | |
| `GET /articles`, `GET /articles/:slug` | `GET /auth/me` | |
| `GET /health` | | |

---

## 13. Akun Demo (Seeder)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ceritakita.id` | `admin123` |
| User | `sari@ceritakita.id` | `password123` |
| User | `bima@ceritakita.id` | `password123` |

---

## 14. Catatan untuk Frontend

- Setiap respon **success** di atas sudah sesuai dengan data aktual yang dikembalikan service.
- Untuk daftar cerita di feed, gunakan `data[].id` untuk navigasi ke detail.
- Anonymous story: tampilkan `displayName` apa adanya (`Anonim #xxxxxx`), **jangan** panggil endpoint lain untuk membongkar identitas (privasi).
- Setelah membuat cerita/komentar dengan `status: PENDING`, itu berarti menunggu moderasi admin dan belum tampil di feed publik.