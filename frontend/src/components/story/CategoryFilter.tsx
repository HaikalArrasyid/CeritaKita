'use client';

import { Search } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  'Semua',
  'Lingkungan Kerja',
  'Pendidikan',
  'Rumah Tangga',
  'Ruang Publik',
  'Media Sosial',
  'Lainnya',
];

export const CategoryFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'Semua';
  const currentSearch = searchParams.get('search') || '';

  const [searchValue, setSearchValue] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'Semua') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (category: string) => {
    router.push(`${pathname}?${createQueryString('category', category)}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`${pathname}?${createQueryString('search', searchValue)}`, { scroll: false });
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E2DC] mb-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-[1px]">
        {CATEGORIES.map((category) => {
          const isActive = currentCategory === category;
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`whitespace-nowrap pb-2 text-sm transition-colors relative ${
                isActive
                  ? 'font-semibold text-slate-900 border-b-2 border-slate-900 -mb-[2px]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative pb-2 md:pb-0 mb-[-1px] md:mb-0">
        <div className="flex items-center border-b border-transparent md:border-[#E5E2DC] pb-1">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Cari cerita... (tekan enter)"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400 w-full md:w-56"
          />
        </div>
      </div>
    </div>
  );
};
