'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { fetchMyStories, fetchMyBookmarks, fetchProfile, updateProfile, updatePassword } from '@/lib/api';
import { StoryGrid } from '@/components/story/StoryGrid';
import { LogOut, Settings, Bookmark, FileText, UserCircle, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'stories' | 'bookmarks' | 'settings'>('stories');
  
  const [stories, setStories] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [profileStats, setProfileStats] = useState({ stories: 0, bookmarks: 0 });
  
  const [newUsername, setNewUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/masuk');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
      
      Promise.all([
        fetchProfile(),
        fetchMyStories(),
        fetchMyBookmarks()
      ]).then(([profileRes, storiesRes, bookmarksRes]) => {
        setProfileStats(profileRes.counts || { stories: 0, bookmarks: 0 });
        
        const mapToCardProps = (s: any, isMine: boolean) => ({
          id: s.id,
          category: s.category,
          title: s.title,
          excerpt: s.contentPreview || s.content || '',
          isAnonymous: s.isAnonymous,
          authorName: isMine ? (s.isAnonymous ? 'Anonim (Saya)' : user.username) : s.displayName,
          supportCount: s.reactionCounts?.support || 0,
          hasSupported: s.hasSupported || false,
          isBookmarked: s.isBookmarked || false,
          readTimeMinutes: s.content ? Math.max(1, Math.ceil(s.content.split(/\s+/).length / 200)) : undefined,
        });
        
        setStories((Array.isArray(storiesRes) ? storiesRes : []).map(s => mapToCardProps(s, true)) as any);
        setBookmarks((Array.isArray(bookmarksRes) ? bookmarksRes : []).map(s => mapToCardProps(s, false)) as any);
      }).catch(console.error)
      .finally(() => {
        setIsLoading(false);
        // Force scroll to top after loading finishes
        setTimeout(() => window.scrollTo(0, 0), 0);
      });
    }
  }, [user]);

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pt-10 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto animate-pulse">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-slate-200 shrink-0"></div>
            <div className="flex-1 text-center md:text-left space-y-4 w-full">
              <div className="h-8 bg-slate-200 rounded w-48 mx-auto md:mx-0"></div>
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="w-24 h-6 bg-slate-200 rounded"></div>
                <div className="w-24 h-6 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
          {/* Tabs Skeleton */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100 px-4">
              <div className="w-32 h-14 bg-slate-200 mr-2"></div>
              <div className="w-32 h-14 bg-slate-200 mr-2"></div>
              <div className="w-32 h-14 bg-slate-200"></div>
            </div>
            <div className="p-8">
              <div className="w-48 h-8 bg-slate-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-slate-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || newUsername === user.username) return;
    
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      await updateProfile({ username: newUsername });
      setUpdateMessage('Profil berhasil diperbarui. Silakan muat ulang halaman jika diperlukan.');
    } catch (err: any) {
      setUpdateMessage(err.message || 'Gagal memperbarui profil.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    
    if (newPassword.length < 8) {
      setPasswordMessage('Gagal: Kata sandi baru harus terdiri dari minimal 8 karakter.');
      return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(newPassword)) {
      setPasswordMessage('Gagal: Kata sandi baru harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('Gagal: Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      setPasswordMessage('Kata sandi berhasil diperbarui.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMessage(`Gagal: ${err.message}` || 'Gagal: Terjadi kesalahan.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-24 h-24 bg-brand-surface-tinted rounded-full flex items-center justify-center flex-shrink-0 text-brand-primary">
            <UserCircle size={48} strokeWidth={1.5} />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{user.username}</h1>
            <p className="text-slate-500 mb-4">{user.email}</p>
            
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg">{profileStats.stories}</span>
                <span className="text-slate-500">Cerita</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg">{profileStats.bookmarks}</span>
                <span className="text-slate-500">Disimpan</span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Keluar
          </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'stories' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('stories')}
            >
              <FileText size={18} /> Cerita Saya
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'bookmarks' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('bookmarks')}
            >
              <Bookmark size={18} /> Disimpan
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Pengaturan
            </button>
          </div>

          <div className="p-8 md:p-10">
            {activeTab === 'stories' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Cerita yang Anda Tulis</h2>
                <StoryGrid 
                  stories={stories} 
                  emptyMessage={
                    <span>Anda belum membagikan cerita apa pun. <br/>Mari mulai menulis dan suarakan pengalaman Anda di sini!</span>
                  }
                />
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Cerita Tersimpan</h2>
                <StoryGrid 
                  stories={bookmarks} 
                  emptyMessage="Belum ada cerita yang Anda simpan. Jelajahi beranda untuk menemukan cerita yang menginspirasi."
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Informasi Profil</h2>
                  
                  {updateMessage && (
                    <div className={`mb-6 p-4 rounded-lg text-sm border ${updateMessage.includes('Gagal') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {updateMessage}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
                      />
                      <p className="text-xs text-slate-500 mt-2">Ini akan menjadi nama tampilan publik Anda kecuali Anda memilih opsi anonim saat bercerita.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-2">Email tidak dapat diubah.</p>
                    </div>
                    <div className="pt-2">
                      <Button type="submit" disabled={isUpdating || newUsername === user.username}>
                        {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </Button>
                    </div>
                  </form>
                </div>

                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Ubah Kata Sandi</h2>
                  
                  {passwordMessage && (
                    <div className={`mb-6 p-4 rounded-lg text-sm border ${passwordMessage.includes('Gagal') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {passwordMessage}
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi Lama</label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10 transition-shadow"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-[14px] text-slate-400 hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Kata Sandi Baru</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10 transition-shadow"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-[14px] text-slate-400 hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10 transition-shadow"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-[14px] text-slate-400 hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button type="submit" disabled={isUpdatingPassword}>
                        {isUpdatingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
