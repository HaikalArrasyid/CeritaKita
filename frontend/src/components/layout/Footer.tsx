'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/moderasi')) return null;

  return (
    <footer className="bg-[#1C2733] text-white pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-700/50 pb-12 mb-8">
        
        {/* Brand Info */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-3xl font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M12 11h.01" />
                <path d="M8 11h.01" />
                <path d="M16 11h.01" />
              </svg>
            </div>
            CeritaKita
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Mendengar adalah langkah pertama menuju ruang yang setara. Bagikan pengalaman Anda, atau pelajari bagaimana menjadi sekutu yang baik.
          </p>
        </div>
        
        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold text-slate-200 mb-6 uppercase tracking-wider text-xs">Jelajahi</h3>
          <ul className="space-y-4">
            <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Beranda Cerita</Link></li>
            <li><Link href="/edukasi" className="text-sm text-slate-400 hover:text-white transition-colors">Hub Edukasi & Panduan</Link></li>
            <li><Link href="/cerita/buat" className="text-sm text-slate-400 hover:text-white transition-colors">Tulis Cerita Baru</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h3 className="font-semibold text-slate-200 mb-6 uppercase tracking-wider text-xs">Akun Anda</h3>
          <ul className="space-y-4">
            <li><Link href="/masuk" className="text-sm text-slate-400 hover:text-white transition-colors">Masuk</Link></li>
            <li><Link href="/daftar" className="text-sm text-slate-400 hover:text-white transition-colors">Daftar Akun</Link></li>
            <li><Link href="/profil" className="text-sm text-slate-400 hover:text-white transition-colors">Profil Saya</Link></li>
          </ul>
        </div>

        {/* Legal & Moderation */}
        <div>
          <h3 className="font-semibold text-slate-200 mb-6 uppercase tracking-wider text-xs">Komunitas</h3>
          <ul className="space-y-4">
            <li><Link href="/panduan" className="text-sm text-slate-400 hover:text-white transition-colors">Panduan Ruang Aman</Link></li>
            <li><Link href="/laporkan-masalah" className="text-sm text-slate-400 hover:text-white transition-colors">Laporkan Masalah</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} CeritaKita. Seluruh hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-slate-300">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-slate-300">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
};
