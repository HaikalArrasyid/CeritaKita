'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';

export default function QueuePage() {
  const [data, setData] = useState<{stories: any[], comments: any[]}>({ stories: [], comments: [] });
  const [loading, setLoading] = useState(true);

  const fetchModeration = async () => {
    try {
      const result = await apiFetch(`/admin/moderation`);
      setData(result);
    } catch (e) {
      console.error(e);
      // Fallback
      setData({
        stories: [{ id: '1', title: 'Pelecehan di busway', author: { username: 'anon123' }, createdAt: new Date().toISOString() }],
        comments: [{ id: '2', content: 'Komentar tidak jelas', author: { username: 'user2' }, story: { title: 'Pelecehan di busway' }, createdAt: new Date().toISOString() }]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModeration();
  }, []);

  const handleUpdateStory = async (id: string, status: string) => {
    try {
      await apiFetch(`/admin/stories/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchModeration();
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status cerita');
    }
  };

  const handleUpdateComment = async (id: string, status: string) => {
    try {
      await apiFetch(`/admin/comments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchModeration();
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status komentar');
    }
  };

  if (loading) return <div>Memuat antrean...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Antrean Moderasi</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stories Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
            Cerita Menunggu <Badge variant="warning">{data.stories.length}</Badge>
          </h2>
          <div className="space-y-4">
            {data.stories.map(story => (
              <div key={story.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                <h3 className="font-bold text-slate-900">{story.title}</h3>
                <p className="text-sm text-slate-500 mb-3">Oleh: {story.author?.username} • {new Date(story.createdAt).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdateStory(story.id, 'PUBLISHED')} className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium flex items-center gap-1"><ShieldCheck size={14}/> Setujui</button>
                  <button onClick={() => handleUpdateStory(story.id, 'REMOVED')} className="px-3 py-1.5 text-sm bg-rose-100 text-rose-700 rounded hover:bg-rose-200 font-medium flex items-center gap-1"><ShieldAlert size={14}/> Tolak</button>
                </div>
              </div>
            ))}
            {data.stories.length === 0 && <p className="text-slate-500">Tidak ada cerita dalam antrean.</p>}
          </div>
        </div>

        {/* Comments Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
            Komentar Menunggu <Badge variant="warning">{data.comments.length}</Badge>
          </h2>
          <div className="space-y-4">
            {data.comments.map(comment => (
              <div key={comment.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                <p className="text-slate-700 italic mb-2">"{comment.content}"</p>
                <p className="text-sm text-slate-500 mb-3">Oleh: {comment.author?.username} di "{comment.story?.title}"</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdateComment(comment.id, 'PUBLISHED')} className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium flex items-center gap-1"><ShieldCheck size={14}/> Setujui</button>
                  <button onClick={() => handleUpdateComment(comment.id, 'REMOVED')} className="px-3 py-1.5 text-sm bg-rose-100 text-rose-700 rounded hover:bg-rose-200 font-medium flex items-center gap-1"><ShieldAlert size={14}/> Tolak</button>
                </div>
              </div>
            ))}
            {data.comments.length === 0 && <p className="text-slate-500">Tidak ada komentar dalam antrean.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
