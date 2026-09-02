'use client';

import Link from 'next/link';
import { BookOpen, Heart, Bookmark, Lock } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export interface StoryCardProps {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  isAnonymous: boolean;
  authorName: string;
  readTimeMinutes?: number;
  supportCount: number;
  hasSupported?: boolean;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  status?: string;
}

export const StoryCard = ({
  id,
  category,
  title,
  excerpt,
  isAnonymous,
  authorName,
  readTimeMinutes,
  supportCount: initialSupportCount,
  hasSupported: initialHasSupported = false,
  isBookmarked: initialIsBookmarked = false,
  isFeatured = false,
  status,
}: StoryCardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const bgClass = isFeatured ? 'bg-[#F3ECE2] border-[#E6DDCE]' : 'bg-white border-[#E5E2DC]';
  
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [hasSupported, setHasSupported] = useState(initialHasSupported);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isReacting, setIsReacting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const calculatedReadTime = readTimeMinutes || Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 200));

  const handleSupport = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return router.push('/masuk');
    if (isReacting) return;
    
    setIsReacting(true);
    // Optimistic UI
    setHasSupported(!hasSupported);
    setSupportCount(prev => hasSupported ? prev - 1 : prev + 1);
    
    try {
      await apiFetch(`/stories/${id}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ type: 'SUPPORT' }),
      });
    } catch (err) {
      // Revert on failure
      setHasSupported(hasSupported);
      setSupportCount(initialSupportCount);
    } finally {
      setIsReacting(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return router.push('/masuk');
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    // Optimistic UI
    setIsBookmarked(!isBookmarked);
    
    try {
      await apiFetch(`/stories/${id}/bookmark`, {
        method: 'POST',
      });
    } catch (err) {
      // Revert on failure
      setIsBookmarked(isBookmarked);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className={`flex flex-col border rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${bgClass}`}>
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">
            {category}
          </span>
          {status === 'REMOVED' && (
            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              Ditolak
            </span>
          )}
          {status === 'PENDING' && (
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              Menunggu
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
          {isAnonymous && <Lock className="w-3 h-3" />}
          <span>{authorName}</span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="space-y-3 mb-6 flex-grow">
        <h3 className="font-serif text-xl md:text-2xl text-slate-900 font-normal leading-snug">
          {title}
        </h3>
        <p className="font-sans text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
      </div>
      
      {/* Card Meta Row */}
      <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{calculatedReadTime} menit baca</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSupport}
            disabled={isReacting}
            className={`flex items-center gap-1.5 transition-colors group ${hasSupported ? 'text-[#D4836A]' : 'hover:text-[#D4836A]'}`}
            title={hasSupported ? "Batal Dukung" : "Dukung Cerita"}
          >
            <Heart className={`w-3.5 h-3.5 ${hasSupported ? 'fill-[#D4836A]' : 'group-hover:fill-[#D4836A]'}`} />
            <span>{supportCount} dukungan</span>
          </button>
          <button 
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`transition-colors ${isBookmarked ? 'text-slate-900' : 'hover:text-slate-800'}`}
            title={isBookmarked ? "Batal Simpan" : "Simpan Cerita"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-slate-900' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Card Action Footer */}
      <div className="mt-4 pt-2">
        <Link href={`/cerita/${id}`} className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 w-max">
          Baca cerita ↗
        </Link>
      </div>
    </div>
  );
};
