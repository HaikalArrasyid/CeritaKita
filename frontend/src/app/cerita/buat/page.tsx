'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { createStory } from '@/lib/api';

const CATEGORIES = [
  'Lingkungan Kerja',
  'Pendidikan',
  'Rumah Tangga',
  'Ruang Publik',
  'Media Sosial',
  'Lainnya',
];

export default function CreateStoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-start">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-xl">✨</span>
          </div>
          <h2 className="text-xl font-serif font-bold mb-3 text-slate-900">Mari Mulai Bercerita</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            Setiap pengalaman Anda sangat berharga. Silakan masuk ke akun Anda untuk mulai berbagi cerita dan membangun ruang yang saling mendukung.
          </p>
          <Button 
            size="md" 
            className="w-full rounded-xl py-6 font-medium text-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]" 
            onClick={() => router.push('/masuk')}
          >
            Masuk untuk Melanjutkan
          </Button>
        </div>
      </div>
    );
  }

  const CATEGORY_MAP: Record<string, string> = {
    'Lingkungan Kerja': 'WORK',
    'Pendidikan': 'SCHOOL',
    'Rumah Tangga': 'HOME',
    'Ruang Publik': 'PUBLIC_SPACE',
    'Media Sosial': 'SOCIAL_MEDIA',
    'Lainnya': 'OTHER'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setIsLoading(true);
    setError('');

    try {
      const data = await createStory({
        title,
        content,
        category: CATEGORY_MAP[category] || 'OTHER',
        isAnonymous,
      });
      router.replace(`/cerita/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan cerita. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Tulis Cerita Anda</h1>
          <p className="text-slate-500">Ruang aman untuk berbagi pengalaman Anda terkait kesetaraan gender.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Judul Cerita</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Berikan judul singkat tentang cerita Anda..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori Topik</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    category === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cerita Anda</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Ceritakan pengalaman Anda di sini..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-y"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="anonymous" className="text-sm text-slate-700 select-none">
              <span className="font-medium block">Sembunyikan Identitas Saya (Anonim)</span>
              <span className="text-slate-500">Nama Anda tidak akan ditampilkan pada cerita ini.</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={isLoading || !title || !content}>
              {isLoading ? 'Menyimpan...' : 'Bagikan Cerita'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
