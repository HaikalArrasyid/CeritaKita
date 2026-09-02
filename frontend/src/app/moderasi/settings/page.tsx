'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Info } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function SettingsPage() {
  const [requireManualReview, setRequireManualReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/admin/settings');
      if (data && data.REQUIRE_MANUAL_REVIEW === 'true') {
        setRequireManualReview(true);
      } else {
        setRequireManualReview(false);
      }
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    const newValue = !requireManualReview;
    try {
      await apiFetch('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          key: 'REQUIRE_MANUAL_REVIEW',
          value: newValue ? 'true' : 'false'
        })
      });
      setRequireManualReview(newValue);
      setToastMessage('Pengaturan berhasil disimpan');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">Memuat pengaturan...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Pengaturan Sistem
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Kebijakan Moderasi</h2>
            <p className="text-sm text-slate-500 mb-6">
              Atur bagaimana sistem menangani konten baru (cerita dan komentar) yang dikirim oleh pengguna.
            </p>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className={`p-3 rounded-full mt-1 ${requireManualReview ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <Shield className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">Moderasi Pra-Terbit (Manual Review)</h3>
                  
                  {/* Toggle Switch */}
                  <button 
                    onClick={handleToggle}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${requireManualReview ? 'bg-indigo-600' : 'bg-slate-300'} ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${requireManualReview ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Jika diaktifkan, <strong>semua</strong> cerita dan komentar baru akan masuk ke Antrean Moderasi (status PENDING) dan membutuhkan persetujuan manual dari admin sebelum muncul di publik.
                </p>

                <div className="flex gap-2 items-start bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Catatan:</strong> Saat dimatikan, sistem akan kembali menggunakan <em>Filter Kata Otomatis</em>. Hanya konten yang mengandung kata-kata kasar yang akan masuk ke antrean, sedangkan sisanya akan otomatis terbit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg text-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
