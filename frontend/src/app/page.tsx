import { HeroSection } from '@/components/hero/HeroSection';
import { CategoryFilter } from '@/components/story/CategoryFilter';
import { StoryGrid } from '@/components/story/StoryGrid';
import { fetchStories } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const search = resolvedParams.search;

  let storiesList = [];
  try {
    const data = await fetchStories(category, search);
    const rawStories = Array.isArray(data) ? data : data.data || [];
    storiesList = rawStories.map((s: any) => ({
      id: s.id,
      category: s.category,
      title: s.title,
      excerpt: s.contentPreview || '',
      isAnonymous: s.isAnonymous,
      authorName: s.displayName,
      supportCount: s.reactionCounts?.support || 0,
    }));
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <HeroSection />

      <section id="koleksi-suara" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Koleksi Suara
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Baca cerita-cerita terbaru atau temukan berdasarkan kategori spesifik.
          </p>
        </div>
        
        <CategoryFilter />
        
        {storiesList.length > 0 ? (
          <StoryGrid stories={storiesList} />
        ) : (
          <div className="text-center py-20 bg-brand-surface-tinted/20 rounded-2xl border border-dashed border-[#E5E2DC]">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Cerita</h3>
            <p className="text-slate-500">Tidak ditemukan cerita untuk filter yang dipilih.</p>
          </div>
        )}
      </section>
    </>
  );
}
