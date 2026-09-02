'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiFetch, fetchStory } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Bookmark, ArrowLeft, Trash2, Edit2, Flag } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('RUDE');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchStory(unwrappedParams.id)
      .then((data) => setStory(data))
      .catch((err) => setError(err.message || 'Gagal memuat cerita'))
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  const handleReaction = async (type: 'RELATE' | 'SUPPORT') => {
    if (!user) return router.push('/masuk');
    try {
      await apiFetch(`/stories/${unwrappedParams.id}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
      // Refresh story to get new counts
      const updated = await fetchStory(unwrappedParams.id);
      setStory(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmark = async () => {
    if (!user) return router.push('/masuk');
    try {
      const res = await apiFetch(`/stories/${unwrappedParams.id}/bookmark`, {
        method: 'POST',
      });
      setStory((prev: any) => ({ ...prev, isBookmarked: res.bookmarked }));
      showToast(res.bookmarked ? 'Cerita berhasil disimpan ke profil Anda!' : 'Cerita dihapus dari profil Anda.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/masuk');
    setIsSubmittingReport(true);
    try {
      await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({
          targetType: 'STORY',
          targetId: unwrappedParams.id,
          reason: reportReason,
          details: reportDetails
        })
      });
      setIsReportModalOpen(false);
      setReportReason('RUDE');
      setReportDetails('');
      showToast('Laporan berhasil dikirim. Terima kasih atas partisipasi Anda.');
    } catch (e: any) {
      alert(e.message || 'Gagal mengirim laporan');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    
    try {
      await apiFetch(`/stories/${unwrappedParams.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: commentText }),
      });
      setCommentText('');
      // In a real app, we'd add the comment locally or refetch. For now, refetch.
      const updated = await fetchStory(unwrappedParams.id);
      setStory(updated);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim komentar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="w-24 h-4 bg-slate-200 rounded mb-8"></div>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <div className="flex gap-2 mb-6">
              <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
              <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
            </div>
            <div className="w-3/4 h-10 bg-slate-200 rounded mb-4"></div>
            <div className="w-1/2 h-10 bg-slate-200 rounded mb-10"></div>
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-8 mb-8">
              <div className="w-10 h-10 rounded-full bg-slate-200"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
                <div className="w-24 h-3 bg-slate-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full h-4 bg-slate-200 rounded"></div>
              <div className="w-full h-4 bg-slate-200 rounded"></div>
              <div className="w-5/6 h-4 bg-slate-200 rounded"></div>
              <div className="w-full h-4 bg-slate-200 rounded"></div>
              <div className="w-4/5 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="min-h-screen pt-32 text-center text-red-600">{error}</div>;
  if (!story) return <div className="min-h-screen pt-32 text-center">Cerita tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="category">{story.category}</Badge>
            {story.isAnonymous && <Badge variant="anonymous">Anonim</Badge>}
            
            {user && user.id === story.authorId && story.status === 'REMOVED' && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                Dihapus / Ditolak Admin
              </div>
            )}
            
            {user && user.id === story.authorId && story.status === 'PENDING' && (
              <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                Menunggu Persetujuan
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6">
            {story.title}
          </h1>

          <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                {story.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-slate-900">{story.displayName}</div>
                <div className="text-sm text-slate-500">
                  {new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user && user.id === story.authorId && (
                <>
                  <button 
                    onClick={() => router.push(`/cerita/${unwrappedParams.id}/edit`)}
                    className="text-indigo-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
                        try {
                          await apiFetch(`/stories/${unwrappedParams.id}`, { method: 'DELETE' });
                          router.replace('/');
                        } catch(e: any) {
                          alert(e.message || 'Gagal menghapus cerita');
                        }
                      }
                    }}
                    className="text-rose-500 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </>
              )}
              <button onClick={handleBookmark} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-50" title={story.isBookmarked ? "Hapus dari simpanan" : "Simpan cerita"}>
                <Bookmark className={`w-5 h-5 ${story.isBookmarked ? 'fill-slate-900 text-slate-900' : ''}`} />
              </button>
              {(!user || user.id !== story.authorId) && (
                <button 
                  onClick={() => {
                    if (!user) return router.push('/masuk');
                    setIsReportModalOpen(true);
                  }} 
                  className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50" 
                  title="Laporkan konten ini"
                >
                  <Flag className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg whitespace-pre-wrap">
            {story.content}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
            <button onClick={() => handleReaction('RELATE')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <Heart className="w-4 h-4" /> Relate ({story.reactionCounts.relate})
            </button>
            <button onClick={() => handleReaction('SUPPORT')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <span className="text-lg leading-none">👏</span> Dukung ({story.reactionCounts.support})
            </button>
          </div>
        </article>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Komentar ({story.comments.length})
          </h3>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis dukungan atau komentar positif Anda..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 mb-3 resize-y"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center mb-10">
              <p className="text-slate-600 mb-3">Masuk ke akun Anda untuk ikut memberikan komentar dan dukungan.</p>
              <Button variant="outline" size="sm" onClick={() => router.push('/masuk')}>Masuk Sekarang</Button>
            </div>
          )}

          <div className="space-y-6">
            {story.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-medium text-slate-600">
                  {comment.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-slate-900 text-sm">{comment.displayName}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            {story.comments.length === 0 && (
              <p className="text-slate-500 text-center py-4">Jadilah yang pertama memberikan dukungan!</p>
            )}
          </div>
        </section>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Laporkan Cerita">
        <form onSubmit={handleReport} className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Bantu kami menjaga ruang ini tetap aman. Mengapa Anda melaporkan cerita ini?
          </p>
          
          <div className="space-y-3">
            {[
              { value: 'RUDE', label: 'Kata-kata kasar atau tidak pantas' },
              { value: 'HATE_SPEECH', label: 'Ujaran kebencian / diskriminasi' },
              { value: 'SARA', label: 'Mengandung unsur SARA' },
              { value: 'PII_LEAK', label: 'Membocorkan informasi pribadi' },
              { value: 'OTHER', label: 'Lainnya' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="reason" 
                  value={option.value} 
                  checked={reportReason === option.value}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm font-medium text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Detail Tambahan (opsional)</label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={3}
              placeholder="Berikan informasi lebih lanjut untuk membantu kami mengevaluasi..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsReportModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmittingReport} className="bg-rose-600 hover:bg-rose-700 text-white">
              {isSubmittingReport ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
