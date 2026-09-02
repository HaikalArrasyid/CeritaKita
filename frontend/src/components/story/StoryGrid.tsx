import { StoryCard, StoryCardProps } from './StoryCard';

export interface StoryGridProps {
  stories: StoryCardProps[];
  emptyMessage?: React.ReactNode;
}

export const StoryGrid = ({ stories, emptyMessage }: StoryGridProps) => {
  if (!stories || stories.length === 0) {
    return (
      <div className="w-full border border-dashed border-[#E5E2DC] rounded-lg p-12 text-center bg-white/50">
        <p className="text-slate-500 text-sm">
          {emptyMessage || 'Belum ada cerita yang cocok. Mungkin ceritamu yang pertama.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} {...story} />
      ))}
    </div>
  );
};
