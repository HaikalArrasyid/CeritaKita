'use client';

import Link from 'next/link';
import { Lightbulb, User, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF7]/80 backdrop-blur-md border-b border-border-subtle">
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M12 11h.01" />
              <path d="M8 11h.01" />
              <path d="M16 11h.01" />
            </svg>
          </div>
          <span className="font-sans font-bold text-base text-slate-900">CeritaKita</span>
        </Link>

        {/* Navigation Links & Actions */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/edukasi" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" /> Edukasi
            </Link>
            {user && (
              <Link href="/profil" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                <User className="h-4 w-4" /> Profil
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/moderasi" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Moderasi
              </Link>
            )}
          </nav>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-slate-300 pl-6 ml-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/cerita/buat">Tulis cerita ↗</Link>
              </Button>
              <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5">
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          ) : (
            !loading && (
              <div className="flex items-center gap-4 border-l border-slate-300 pl-6 ml-2">
                <Button size="sm" asChild className="rounded-full px-5 shadow-sm hover:shadow-md transition-all">
                  <Link href="/masuk">Mari Bercerita ✨</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

