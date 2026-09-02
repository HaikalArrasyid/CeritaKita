'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/lib/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', published: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      const data = await apiFetch(`/admin/articles`);
      setArticles(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setArticles([
        { id: '1', title: 'Cara Mengelola Stres', published: true, createdAt: new Date().toISOString() },
        { id: '2', title: 'Tips Menjaga Keamanan Digital', published: false, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = `/admin/articles${editingArticle ? `/${editingArticle.id}` : ''}`;
      const method = editingArticle ? 'PATCH' : 'POST';
      
      await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchArticles();
    } catch (e: any) {
      alert(e.message || 'Gagal menyimpan artikel.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await apiFetch(`/admin/articles/${id}`, {
        method: 'DELETE'
      });
      fetchArticles();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus artikel.');
    }
  };

  const openModal = (article: any = null) => {
    setEditingArticle(article);
    if (article) {
      setFormData({ title: article.title, content: article.content, published: article.published });
    } else {
      setFormData({ title: '', content: '', published: true });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Artikel Edukasi</h1>
        <Button className="flex items-center gap-2" onClick={() => openModal()}>
          <Plus size={16} /> Tulis Artikel
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-4 px-6">Judul</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Dibuat Pada</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{article.title}</td>
                <td className="py-4 px-6">
                  {article.published ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">Publik</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">Draft</span>
                  )}
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm">{new Date(article.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => openModal(article)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">Belum ada artikel edukasi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Artikel</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Isi Artikel</label>
            <textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
            <label htmlFor="published" className="text-sm font-medium text-slate-700">Terbitkan langsung</label>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
