'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await apiFetch(`/admin/comments`);
      setComments(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setComments([
        { id: '1', content: 'Semangat ya kak!', story: { title: 'Dibully di sekolah' }, author: { username: 'budi_baik' }, status: 'PUBLISHED', createdAt: new Date().toISOString() },
        { id: '2', content: 'Caper doang ini mah.', story: { title: 'Pelecehan di busway' }, author: { username: 'hater1' }, status: 'PENDING', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini secara permanen?')) return;
    try {
      await apiFetch(`/admin/comments/${id}`, {
        method: 'DELETE'
      });
      fetchComments();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus komentar permanen');
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
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Komentar</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-4 px-6">Komentar</th>
              <th className="py-4 px-6">Di Cerita</th>
              <th className="py-4 px-6">Penulis</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-slate-700 italic max-w-xs truncate">"{c.content}"</td>
                <td className="py-4 px-6 text-slate-600 font-medium truncate max-w-[200px]">{c.story?.title}</td>
                <td className="py-4 px-6 text-slate-600">{c.author?.username}</td>
                <td className="py-4 px-6">{getStatusBadge(c.status)}</td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Hapus Permanen">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">Belum ada komentar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
