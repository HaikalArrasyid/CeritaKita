# Design Specification: CeritaKita Frontend (Next.js)

Dokumen ini merupakan panduan spesifikasi desain antarmuka (*Design System & UI/UX Specification*) untuk pengembangan frontend platform **CeritaKita** berbasis **Next.js**, **Tailwind CSS**, dan **TypeScript**. Panduan ini diturunkan langsung dari analisis visual antarmuka web.

---

## 1. Ikhtisar Desain & Filosofi Visual

* **Karakter Visual**: *Editorial, Empathetic, Trustworthy, Safe-space, Minimalist, Modern Literary*.
* **Tujuan Antarmuka**: Memberikan ruang aman (*safe space*), inklusif, dan tenang bagi pengguna untuk membaca, membagikan cerita kesetaraan gender, serta berinteraksi secara anonim maupun bernama tanpa distraksi visual berlebihan.
* **Gaya Estetika**:
  * Perpaduan tipografi **Serif klasik/editorial** untuk judul & narasi dengan **Sans-serif modern/clean** untuk elemen UI fungsional.
  * Latar belakang bermotif titik halus (*subtle micro-dot grid pattern*) di atas warna dasar krem/off-white lembut (*warm ivory*).
  * Struktur kartu (*card-based content*) dengan hierarki informasi yang sangat terstruktur, rapi, dan lugas.

---

## 2. Design Tokens & Visual Styles

### 2.1. Skema Warna (Color Palette)

| Kategori Token | HEX Code | Tailwind Class / Arbitrary | Kegunaan & Konteks Visual |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FAFAF7` | `bg-[#FAFAF7]` | Latar belakang halaman utama (warm ivory / off-white). |
| **Surface Card (Default)** | `#FFFFFF` | `bg-white` | Latar belakang kartu cerita standar. |
| **Surface Card (Tinted)** | `#F3ECE2` | `bg-[#F3ECE2]` / `bg-[#F7EFE4]` | Latar kartu cerita *featured* / *highlighted*. |
| **Primary Navy (Brand/Hero)** | `#1E293B` / `#16202C` | `text-[#16202C]` / `bg-[#16202C]` | Teks judul utama, tombol CTA primer, latar footer. |
| **Footer Background** | `#1C2733` | `bg-[#1C2733]` | Area footer gelap kontras di bagian bawah. |
| **Text Primary** | `#1A202C` | `text-slate-900` | Judul artikel, heading H1/H2, teks aktif. |
| **Text Secondary** | `#4A5568` | `text-slate-600` | Deskripsi hero, ringkasan cerita (*excerpt*). |
| **Text Muted / Metadata** | `#718096` | `text-slate-500` / `text-stone-400` | Kategori, durasi baca, jumlah dukungan, label filter. |
| **Text Footer Muted** | `#A0AEC0` | `text-slate-400` | Tagline footer dan link navigasi footer. |
| **Border Neutral** | `#E5E2DC` | `border-[#E5E2DC]` | Garis pembatas kartu, separator seksi, dan input bar. |
| **Accent Coral / Terracotta**| `#D98A76` / `#D4836A` | `bg-[#D4836A]` | Garis aksen kecil di atas kartu fitur "Aman untuk berbagi". |
| **Active Indicator** | `#1A202C` | `border-b-2 border-slate-900` | Garis aktif pada tab filter kategori ("Semua"). |

---

### 2.2. Tipografi (Typography Hierarchy)

Platform ini mengadopsi konsep *dual-font typography* (Serif untuk tajuk editorial & narasi, Sans-serif untuk interaksi UI).

| Level Elemen | Font Family | Size / Leading | Weight | Tracking / Style |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Headline (H1)** | Editorial Serif (*Playfair Display / Lora / Merriweather*) | `text-5xl md:text-6xl lg:text-7xl leading-[1.1]` | Regular (400) & Italic (400) | Normal / `-tracking-[0.02em]` (Baris ke-2 beraksen miring/italic: *"tak terucapkan."*) |
| **Section Title (H2)** | Editorial Serif | `text-3xl md:text-4xl leading-tight` | Regular (400) | Normal (*"Yang ingin didengar."*) |
| **Feature Title (H3)** | Editorial Serif | `text-xl md:text-2xl` | Medium (500) | Normal (*"Aman untuk berbagi"*) |
| **Story Card Title** | Editorial Serif / Clean Serif | `text-xl md:text-2xl leading-snug` | Semi-bold (600) / Regular | Normal |
| **Section / Tag Eyebrow** | Sans-serif (*Plus Jakarta Sans / Inter*) | `text-xs md:text-sm` | Medium (500) | Uppercase `tracking-[0.15em]` (`PLATFORM SHARING UNTUK...`, `KOLEKSI SUARA`) |
| **Body / Description** | Sans-serif | `text-sm md:text-base leading-relaxed` | Regular (400) | Normal (Warna slate-600) |
| **Card Excerpt** | Sans-serif | `text-xs md:text-sm leading-relaxed` | Regular (400) | Normal, multiline clamp |
| **Metadata & Badges** | Sans-serif | `text-[11px] md:text-xs` | Medium (500) | `tracking-wider` uppercase / capitalize |
| **Nav Links & Buttons** | Sans-serif | `text-xs md:text-sm` | Medium (500) / Semi-bold (600) | Normal |

---

### 2.3. Latar Belakang Tekstur (Dot Grid Canvas)

Latar belakang halaman menggunakan pola titik berulang (*dot matrix*) yang halus dan berjarak lega.

```css
/* Custom Dot Matrix Background Pattern */
.bg-dot-grid {
  background-color: #FAFAF7;
  background-image: radial-gradient(#D6D1C7 1px, transparent 1px);
  background-size: 24px 24px;
}
```

---

## 3. Rincian Anatomi Komponen UI (Atomic & Section Breakdown)

### 3.1. Navigation Bar (Top Header)

* **Layout**: Sticky/Fixed top, `w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between`.
* **Kiri (Brand Lockup)**:
  * Logo Icon: Lingkaran gelap dengan siluet balon percakapan + ikon hati/senyum.
  * Brand Name: `CeritaKita` (`font-sans font-bold text-base text-slate-900`).
* **Kanan (Navigation Links & Actions)**:
  * Link: `Cerita` (Text link, text-slate-700 hover:text-slate-900).
  * Link: `💡 Edukasi` (Icon lampu/idea + label).
  * Link: `👤 Profil` (Icon user outline + label).
  * Link: `🛡️ Moderasi` (Icon perisai centang + label).
  * Tombol CTA: `Tulis cerita ↗` (Border tipis rounded `rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100 transition`).
  * Separator: Garis vertikal `h-4 w-[1px] bg-slate-300 mx-2`.
  * Status Badge: `🔒 ANONIM` (`text-xs font-mono tracking-wider text-slate-600 flex items-center gap-1.5`).

---

### 3.2. Hero Section

* **Grid / Layout**: 2 Kolom asimetris (`lg:grid lg:grid-cols-12 lg:gap-12 items-start py-12 md:py-20`).
* **Kolom Kiri (Main Hero Pitch - Col Span 8)**:
  1. **Eyebrow Header**:
     * Format: `— PLATFORM SHARING UNTUK KESETARAAN GENDER`
     * CSS: `text-xs uppercase tracking-[0.2em] text-slate-500 font-medium flex items-center gap-2 mb-4`.
  2. **Headline H1**:
     * Teks: "Dengarkan yang / *tak terucapkan.*"
     * Tipografi: Serif font besar. Baris kedua dibuat miring (*italic*).
  3. **Sub-description**:
     * Teks: *"Ruang aman untuk membaca pengalaman, berbagi cerita, dan belajar membangun empati lintas gender."*
     * Warna: `text-slate-600 max-w-xl text-base md:text-lg mb-8`.
  4. **Call To Action (CTA Group)**:
     * **Primary CTA**: Tombol `Buat cerita ↗` (`bg-[#1A232E] text-white px-5 py-3 rounded-md text-sm font-medium hover:bg-slate-800 transition shadow-sm`).
     * **Secondary Anchor**: Link `Mulai membaca ↓` (`text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1`).
     * **Tertiary Link**: `Pilih akses` (`text-sm text-slate-500 hover:text-slate-700`).
* **Kolom Kanan (Value Proposition Feature Box - Col Span 4)**:
  * **Card Container**: Border kiri subtle `border-l border-slate-200 pl-8 py-2`.
  * **Top Line Accent**: Garis kecil warna peach/terracotta (`w-8 h-[3px] bg-[#D4836A] mb-4`).
  * **Icon**: Gembok (`🔒` / Lucide `Lock` icon).
  * **Judul**: *"Aman untuk berbagi"* (Serif, `text-xl font-medium text-slate-900 mt-2 mb-2`).
  * **Deskripsi**: *"Anonim atau dengan nama. Moderasi menjaga setiap cerita tetap manusiawi."* (`text-sm text-slate-600 leading-relaxed`).

---

### 3.3. Section Divider

* Garis horizontal penuh dengan warna abu-abu netral tipis: `border-t border-[#E5E2DC] my-8`.

---

### 3.4. Story Feed Section (Koleksi Suara)

* **Section Header**:
  * Eyebrow: `KOLEKSI SUARA` (`text-xs uppercase tracking-[0.15em] text-slate-500`).
  * Title H2: `Yang ingin didengar.` (`font-serif text-3xl text-slate-900 mt-1`).
  * Story Counter: `13 cerita` (`text-xs text-slate-400 font-mono self-end`).
* **Filter & Search Bar Area**:
  * **Category Tabs (Horizontal Scrollable)**:
    * Item: `Semua`, `Lingkungan Kerja`, `Pendidikan`, `Rumah Tangga`, `Ruang Publik`, `Media Sosial`, `Lainnya`.
    * Status Aktif: `Semua` dengan `border-b-2 border-slate-900 font-semibold text-slate-900 pb-2`.
    * Status Default: `text-slate-500 hover:text-slate-800 transition pb-2`.
  * **Search Input (Right Aligned)**:
    * Input placeholder: `🔍 Cari cerita...`
    * Style: Minimalist input dengan icon search, border bawah / subtle border, text-xs.

---

### 3.5. Story Card Architecture

Kartu cerita memiliki 2 varian gaya visual:
1. **Default Card**: Background putih (`bg-white`), border abu tipis (`border border-[#E5E2DC]`).
2. **Tinted / Featured Card**: Background krem hangat (`bg-[#F3ECE2]`), border senada (`border border-[#E6DDCE]`).

#### Struktur Konten Tiap Kartu (Card Structure):
* **Card Header (`flex justify-between items-center mb-4`)**:
  * Kiri: Kategori badge (`PENDIDIKAN`, `LAINNYA`, `RUANG PUBLIK`, `MEDIA SOSIAL`) -> uppercase, tracking-wider, text-[11px] font-semibold text-slate-500.
  * Kanan: Status anonimitas (`🔒 budi yang tersakiti`, `🔒 Pengguna Anonim`, `🔒 Sari`) -> text-xs text-slate-500 flex items-center gap-1.
* **Card Body (`space-y-3 mb-6`)**:
  * Title: Judul cerita (Serif font, `text-xl md:text-2xl text-slate-900 font-normal leading-snug`).
  * Excerpt: Kutipan teks cerita (Sans font, `text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed`).
* **Card Meta Row (`flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-100/60`)**:
  * Kiri: `📖 X menit baca` (Icon buku terbuka + estimasi waktu).
  * Kanan:
    * `🤍 X dukungan` (Icon hati outline + jumlah likes/dukungan).
    * `🔖` Bookmark button (Icon bookmark outline untuk simpan cerita).
* **Card Action Footer (`mt-4 pt-2`)**:
  * Link: `Baca cerita ↗` (`text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1`).

---

### 3.6. Global Footer

* **Latar Belakang**: Dark Navy (`bg-[#1C2733] text-white py-12 px-6`).
* **Struktur Layout**: `max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6`.
* **Kiri (Brand Info)**:
  * Brand Name: `CeritaKita` (`font-serif text-2xl text-white tracking-tight`).
  * Tagline: `mendengar adalah langkah pertama menuju setara.` (`text-xs text-slate-400 mt-1`).
* **Kanan (Footer Navigation Links)**:
  * Link `Hub edukasi` (`text-xs text-slate-300 hover:text-white transition`).
  * Link `Cara masuk` (`text-xs text-slate-300 hover:text-white transition`).

---

## 4. Rekomendasi Setup Teknis di Next.js

### 4.1. Konfigurasi Tailwind CSS (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF7',
        surface: {
          DEFAULT: '#FFFFFF',
          tinted: '#F3ECE2',
        },
        brand: {
          navy: '#1A232E',
          footer: '#1C2733',
          coral: '#D4836A',
        },
        border: {
          subtle: '#E5E2DC',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-lora)', 'serif'],
        sans: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

### 4.2. Next.js App Router Structure & Component Mapping

```text
src/
├── app/
│   ├── layout.tsx             # Root layout with fonts (Playfair & Plus Jakarta Sans) & Dot-grid background
│   ├── page.tsx               # Homepage (Hero, Filter Bar, Story Grid, Footer)
│   ├── cerita/
│   │   ├── [id]/page.tsx      # Detail cerita page
│   │   └── buat/page.tsx      # Form pembuatan cerita anonim/bernama
│   ├── edukasi/page.tsx       # Hub edukasi gender
│   └── moderasi/page.tsx      # Halaman antrean moderasi
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Top navigation header
│   │   └── Footer.tsx         # Dark navy footer
│   ├── hero/
│   │   ├── HeroSection.tsx    # Hero title, CTA buttons, and Value proposition card
│   │   └── ValueCard.tsx      # "Aman untuk berbagi" card
│   ├── story/
│   │   ├── CategoryFilter.tsx # Filter horizontal tabs & search bar
│   │   ├── StoryCard.tsx      # Standard & Tinted card component
│   │   └── StoryGrid.tsx      # Responsive grid container
│   └── ui/
│       ├── Button.tsx         # Reusable primary/secondary buttons
│       ├── Badge.tsx          # Anonymous & category tags
│       └── Icons.tsx          # Lucide-react icon wrappers
└── types/
    └── story.ts               # TypeScript interfaces
```

---

### 4.3. TypeScript Data Model (`types/story.ts`)

```typescript
export type Category = 
  | 'Semua'
  | 'Lingkungan Kerja'
  | 'Pendidikan'
  | 'Rumah Tangga'
  | 'Ruang Publik'
  | 'Media Sosial'
  | 'Lainnya';

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: Category;
  author: {
    isAnonymous: boolean;
    name: string; // "Pengguna Anonim" atau nama samaran/asli
  };
  readTimeMinutes: number;
  supportCount: number;
  isFeatured?: boolean; // If true, applies tinted background (#F3ECE2)
  isBookmarked?: boolean;
  createdAt: string;
}
```

---

## 5. Responsive Breakpoint & Interaction Guidelines

| Device | Breakpoint | Penyesuaian Layout |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Header nav links beralih ke hamburger/drawer; Hero layout 1 kolom; Filter kategori scrollable horizontal (`overflow-x-auto no-scrollbar`); Story card 1 kolom (`grid-cols-1`). |
| **Tablet** | `640px - 1024px` | Hero 1 kolom lebar dengan Value Card di bawahnya; Story grid 2 kolom (`grid-cols-2`). |
| **Desktop**| `> 1024px` | Hero 2 kolom asimetris (8 col text + 4 col value card); Story grid 3 kolom (`grid-cols-3`); Sticky search & category bar. |

### Micro-interactions:
1. **Card Hover**: `transition-all duration-200 hover:-translate-y-1 hover:shadow-md`.
2. **Category Tab Switch**: Transisi smooth border-bottom indicator dengan layout animation (Framer Motion / Tailwind transitions).
3. **Like & Bookmark Button**: Micro-bounce animation saat di-klik dengan feedback state aktif (*hearted / saved*).
## 6. Referensi Visual (Design Previews)

Untuk memudahkan pemahaman antarmuka, silakan unggah gambar desain Anda ke dalam folder `assets/` (atau direktori serupa) dan referensikan di bawah ini:

* **Hero Section & Navigation**:  
  ![Hero Section](./assets/hero-section.png)
  *(Preview untuk Hero 2 kolom, badge anonim, dan navigasi utama)*

* **Story Feed & Filter**:  
  ![Story Feed](./assets/story-feed.png)
  *(Preview untuk Tab Kategori, Search bar, dan daftar cerita)*

* **Story Cards Grid**:  
  ![Story Grid](./assets/story-grid.png)
  *(Preview untuk variasi kartu cerita standar dan kartu berlatar warna krem `isFeatured`)*

* **Edukasi Hub (Contoh Layout)**:  
  ![Edukasi Layout](./assets/edukasi-hub.png)
  *(Preview untuk halaman edukasi dengan grid kartu)*