'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchEducationFeed } from '@/lib/api';

interface EducationItem {
  id: string;
  label: string;
  title: string;
  excerpt: string;
  createdAt: string;
}

export default function EducationPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationFeed()
      .then((data: EducationItem[]) => {
        // Here we can filter out seen ones from localStorage, or just pick random 3.
        // For now, let's just pick the latest 3 or random 3 to make it "varied".
        const shuffled = data.sort(() => 0.5 - Math.random());
        setItems(shuffled.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const backgrounds = ['bg-[#fdf8f0]', 'bg-[#f0f0fa]', 'bg-[#eef5ef]'];
  const borders = ['border-[#f3e8d6]', 'border-[#e4e4f5]', 'border-[#e0ebd3]'];

  return (
    <div className="min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-[#1e293b] leading-[1.1] tracking-tight mb-8">
            Belajar untuk <br />
            <span className="italic text-slate-500">bergerak setara.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
            Pengetahuan kecil yang membantu kita mengenali bias, merespons dengan empati, dan menciptakan ruang yang lebih adil.
          </p>
        </div>

        <hr className="border-t border-[#e2e8f0] mb-16" />

        {loading ? (
          <div className="flex justify-center text-slate-500 py-12">Mencari materi edukasi terbaru...</div>
        ) : items.length === 0 ? (
          <div className="flex justify-center text-slate-500 py-12">Belum ada data edukasi.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const bgClass = backgrounds[index % backgrounds.length];
              const borderClass = borders[index % borders.length];
              
              return (
                <div key={item.id} className={`${bgClass} p-8 md:p-10 border ${borderClass} flex flex-col justify-between group cursor-pointer transition-transform hover:-translate-y-1`}>
                  <div>
                    <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-6">
                      {item.label}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-12">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
