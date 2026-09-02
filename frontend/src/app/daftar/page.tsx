'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi email dasar
    if (!email.includes('@')) {
      setError('Format email tidak valid. Pastikan email Anda memiliki simbol @ (misalnya: yourmail@mail.com).');
      return;
    }

    // Validasi Kriteria Password
    if (password.length < 8) {
      setError('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setError('Kata sandi harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka.');
      return;
    }

    // Validasi Konfirmasi Password
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      
      if (data.accessToken && data.user) {
        login(data.accessToken, data.user, rememberMe);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Daftar Akun</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Mulai langkahmu untuk saling mendengarkan dan berbagi pengalaman di ruang yang aman.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              placeholder="yourmail@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 pr-10"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[10px] text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 pr-10"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[10px] text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
              Simpan info login untuk perangkat ini
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-2 rounded-xl py-6 font-medium text-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link href="/masuk" className="text-slate-900 font-medium hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
