'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/lib/api';

export default function BannedWordsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWords = async () => {
    try {
      const data = await apiFetch(`/admin/banned-words`);
      setWords(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setWords([
        { id: '1', word: 'bodoh', createdAt: new Date().toISOString() },
        { id: '2', word: 'babi', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/admin/banned-words`, {
        method: 'POST',
        body: JSON.stringify({ word: newWord.trim().toLowerCase() })
      });
      setIsModalOpen(false);
      setNewWord('');
      fetchWords();
    } catch (e: any) {
      alert(e.message || 'Gagal menambahkan kata terlarang.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kata ini dari daftar?')) return;
    try {
      await apiFetch(`/admin/banned-words/${id}`, {
        method: 'DELETE'
      });
      fetchWords();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus kata terlarang.');
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kata Terlarang (Filter)</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Tambah Kata
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-4 px-6">Kata / Frasa</th>
              <th className="py-4 px-6">Tanggal Ditambahkan</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">
                  <Badge variant="destructive">{w.word}</Badge>
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm">{new Date(w.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleDelete(w.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {words.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">Belum ada kata terlarang.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Kata Terlarang">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kata atau Frasa</label>
            <input required type="text" value={newWord} onChange={e => setNewWord(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Masukkan kata kotor/terlarang" />
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
