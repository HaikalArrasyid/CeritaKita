# CeritaKita Frontend

CeritaKita adalah platform *sharing* untuk kesetaraan gender. Repositori ini berisi antarmuka pengguna (**Frontend**) yang dibangun dengan [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS v4](https://tailwindcss.com/), dan TypeScript.

## 🎨 Filosofi Desain
Mengadopsi visual *Editorial, Empathetic, Trustworthy,* dan *Safe-space*. 
- Menggunakan skema warna hangat (*warm ivory*).
- Tipografi paduan *Serif* (Playfair Display) dan *Sans-serif* (Plus Jakarta Sans).

## 🚀 Fitur Utama
- **Beranda Interaktif**: Menampilkan kutipan utama dan sekumpulan cerita terbaru.
- **Filter Cerita**: Memudahkan pembaca mencari cerita berdasarkan kategori (Pendidikan, Ruang Publik, dll).
- **Kartu Cerita (Story Cards)**: Komponen presentasi UI yang responsif.
- **Integrasi Seamless**: Terhubung langsung dengan *backend* NestJS CeritaKita.

## 🛠️ Prasyarat
- Node.js (v18 atau lebih baru)
- Backend CeritaKita sudah dijalankan secara lokal di port `3001` (atau *host* lain yang dikonfigurasi).

## 📦 Instalasi

1. Masuk ke folder `frontend`.
2. Instal *dependencies*:
   ```bash
   npm install
   ```

## ⚙️ Konfigurasi Environment

Aplikasi ini membutuhkan *environment variables* agar dapat terhubung dengan backend.
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Variabel `NEXT_PUBLIC_API_URL` harus menunjuk pada URL Backend Anda (secara bawaan: `http://localhost:3001/api`).

## 🏃‍♂️ Menjalankan Aplikasi

Jalankan *development server*:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) melalui peramban web (*browser*) Anda untuk melihat hasilnya. Halaman akan otomatis dimuat ulang jika ada perubahan kode.
