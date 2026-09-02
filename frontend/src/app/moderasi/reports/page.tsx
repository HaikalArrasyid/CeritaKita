'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await apiFetch(`/admin/reports`);
      setReports(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setReports([
        { id: '1', reason: 'HATE_SPEECH', details: 'Komentar sangat kasar', status: 'PENDING', targetType: 'COMMENT', targetId: 'c1', reporter: { username: 'user1' }, createdAt: new Date().toISOString() },
        { id: '2', reason: 'PII_LEAK', details: 'Membocorkan nomor telepon', status: 'REVIEWED', targetType: 'STORY', targetId: 's1', reporter: { username: 'user2' }, createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string, action: string) => {
    if (!confirm(`Tindak lanjuti laporan ini dengan aksi: ${action}?`)) return;
    try {
      await apiFetch(`/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action })
      });
      fetchReports();
    } catch (e: any) {
      alert(e.message || 'Gagal menindaklanjuti laporan.');
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Laporan Konten</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-4 px-6">Pelapor</th>
              <th className="py-4 px-6">Alasan</th>
              <th className="py-4 px-6">Target</th>
              <th className="py-4 px-6">Tanggal</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{report.reporter?.username || 'Seseorang'}</td>
                <td className="py-4 px-6 text-slate-600">{report.reason}</td>
                <td className="py-4 px-6">
                  <Badge variant="default">{report.targetType}</Badge>
                  <a href={`/cerita/${report.targetId}`} target="_blank" rel="noreferrer" className="ml-2 text-indigo-600 hover:underline text-sm inline-flex items-center gap-1"><LinkIcon size={12}/> Lihat</a>
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm">{new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                  <button onClick={() => handleResolve(report.id, 'KEEP')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Abaikan (Keep)">
                    <ShieldCheck size={16} />
                  </button>
                  <button onClick={() => handleResolve(report.id, 'WARN')} className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Peringatkan Penulis">
                    <ShieldAlert size={16} />
                  </button>
                  <button onClick={() => handleResolve(report.id, 'REMOVE')} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Hapus Konten (Remove)">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">Tidak ada laporan yang menunggu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
