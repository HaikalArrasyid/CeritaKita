'use client';

import { useState, useEffect } from 'react';
import { Eye, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';

export default function StoriesCRUD() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const data = await apiFetch(`/admin/stories`);
      setStories(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setStories([
        { id: '1', title: 'Pelecehan di busway', category: 'PUBLIC_SPACE', status: 'PENDING', author: { username: 'anon123' }, createdAt: new Date().toISOString() },
        { id: '2', title: 'Lingkungan kerja toxic', category: 'WORK', status: 'PUBLISHED', author: { username: 'workerA' }, createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiFetch(`/admin/stories/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchStories();
    } catch (e: any) {
      alert(e.message || 'Gagal mengupdate status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus cerita ini secara permanen?')) return;
    try {
      await apiFetch(`/admin/stories/${id}`, {
        method: 'DELETE'
      });
      fetchStories();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus cerita');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PUBLISHED': return <Badge variant="success">Dipublikasi</Badge>;
      case 'PENDING': return <Badge variant="warning">Menunggu</Badge>;
      case 'REMOVED': return <Badge variant="destructive">Dihapus</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Cerita</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-4 px-6">Judul</th>
              <th className="py-4 px-6">Penulis</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Tanggal</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900 truncate max-w-[200px]">{story.title}</td>
                <td className="py-4 px-6 text-slate-600">{story.author?.username || 'Anonim'}</td>
                <td className="py-4 px-6 text-sm text-slate-500">{story.category}</td>
                <td className="py-4 px-6">
                  {getStatusBadge(story.status)}
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm">{new Date(story.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                  <button onClick={() => window.open(`/cerita/${story.id}`, '_blank')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Lihat">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleUpdateStatus(story.id, 'PUBLISHED')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Terima (Publish)">
                    <ShieldCheck size={16} />
                  </button>
                  <button onClick={() => handleUpdateStatus(story.id, 'REMOVED')} className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Tolak (Remove)">
                    <ShieldAlert size={16} />
                  </button>
                  <button onClick={() => handleDelete(story.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Hapus Permanen">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">Belum ada cerita.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
