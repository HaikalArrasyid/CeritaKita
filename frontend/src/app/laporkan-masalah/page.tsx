'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LaporkanMasalahPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'TECHNICAL_ISSUE',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', category: 'TECHNICAL_ISSUE', description: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Laporkan Masalah</h1>
          <p className="text-slate-600">
            Halaman ini digunakan untuk melaporkan masalah teknis, penyalahgunaan, atau konten yang melanggar.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Laporan Terkirim!</h2>
              <p className="text-slate-600 mb-8">
                Terima kasih telah melaporkan masalah ini. Tim kami akan segera meninjaunya.
              </p>
              <Button asChild variant="secondary" className="px-8">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
              <button 
                onClick={() => setIsSuccess(false)}
                className="block mx-auto mt-4 text-blue-600 hover:underline text-sm"
              >
                Kirim laporan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nama (Opsional)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Alamat Email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Kategori Masalah *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                >
                  <option value="TECHNICAL_ISSUE">Masalah Teknis / Bug</option>
                  <option value="ABUSE">Pelanggaran Pengguna (Abuse)</option>
                  <option value="INAPPROPRIATE_CONTENT">Konten Tidak Pantas</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Masalah *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder="Jelaskan secara detail masalah yang Anda alami..."
                ></textarea>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <Link href="/">Batal</Link>
                </Button>
                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
