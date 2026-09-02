# CeritaKita Backend

CeritaKita adalah platform *sharing* untuk kesetaraan gender. Repositori ini berisi layanan **Backend API** yang dibangun menggunakan [NestJS](https://nestjs.com/), Prisma ORM, dan PostgreSQL.

## 🚀 Fitur Utama
- **Autentikasi**: Sistem *login*, pendaftaran, dan sesi pengguna (berbasis JWT/Cookies).
- **Cerita (Stories)**: Manajemen pembuatan, pengambilan, pembaruan, dan penghapusan cerita (mendukung mode Anonim).
- **Interaksi**: Dukungan (*likes*), *bookmarks*, dan komentar pada setiap cerita.
- **Moderasi & Keamanan**: Sistem pelaporan konten (*reports*) dan filter otomatis menggunakan *banned words*.

## 🛠️ Prasyarat
- Node.js (v18 atau lebih baru)
- Database PostgreSQL yang aktif

## 📦 Instalasi

1. *Clone* repositori dan masuk ke folder `backend`.
2. Instal *dependencies*:
   ```bash
   npm install
   ```

## ⚙️ Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan isi variabel yang diperlukan:
```bash
cp .env.example .env
```
Pastikan `DATABASE_URL` sudah menunjuk ke database PostgreSQL Anda yang valid.

## 🗄️ Database Setup
Jalankan migrasi Prisma untuk menyiapkan skema tabel di database:
```bash
npx prisma migrate dev
```

## 🏃‍♂️ Menjalankan Aplikasi

```bash
# development mode
npm run start

# watch mode (rekomendasi untuk development)
npm run start:dev

# production mode
npm run start:prod
```

Server API akan berjalan secara bawaan di `http://localhost:3001/api`.
Frontend CeritaKita dikonfigurasi untuk terhubung ke endpoint ini.
