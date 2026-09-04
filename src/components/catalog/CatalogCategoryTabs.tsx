'use client';

import React from 'react';
import { ClothCategoryTag, ClothType } from '@/types';
import { getCategoryImageUrl } from '@/lib/category-photos';

export interface CategoryInfo {
  tag: string;
  label: string;
  icon: string;
}

export const CATALOG_MAIN_CATEGORIES: CategoryInfo[] = [
  { tag: 'MENS', label: "Men's Wear", icon: '👔' },
  { tag: 'WOMENS', label: "Women's Wear", icon: '👗' },
  { tag: 'KIDS', label: 'Kids & Baby', icon: '👶' },
  { tag: 'HOME_TEXTILES', label: 'Home Textiles', icon: '🛏️' },
  { tag: 'ALL', label: 'All Garments', icon: '🌐' },
];

interface CatalogCategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (categoryTag: string) => void;
  clothTypes: ClothType[];
}

export const CatalogCategoryTabs: React.FC<CatalogCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  clothTypes,
}) => {
  const getCategoryCount = (tag: string) => {
    if (tag === 'ALL') return clothTypes.length;
    return clothTypes.filter((c) => c.categoryTag === tag).length;
  };

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
      {CATALOG_MAIN_CATEGORIES.map((cat) => {
        const count = getCategoryCount(cat.tag);
        const isActive = activeCategory === cat.tag;
        const photoUrl =
          cat.tag === 'ALL'
            ? 'https://anjanilaundry.s3.ap-south-2.amazonaws.com/garments/cloth-bedsheet-king.jpg'
            : getCategoryImageUrl(cat.tag);

        return (
          <button
            key={cat.tag}
            type="button"
            onClick={() => onSelectCategory(cat.tag)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2.5 border cursor-pointer shrink-0 shadow-xs ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/30'
                : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)] hover:border-blue-400/50'
            }`}
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-slate-100 dark:bg-slate-800 shadow-xs">
              <img
                src={photoUrl}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold">{cat.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
