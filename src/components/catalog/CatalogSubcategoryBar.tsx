'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SubcategoryCount {
  name: string;
  count: number;
}

interface CatalogSubcategoryBarProps {
  subcategories: SubcategoryCount[];
  activeSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalFilteredCount: number;
}

export const CatalogSubcategoryBar: React.FC<CatalogSubcategoryBarProps> = ({
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
  searchQuery,
  onSearchChange,
  totalFilteredCount,
}) => {
  const allCount = subcategories.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-3 pt-1">
      {/* Search & Counter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search within this category..."
            className="admin-input w-full pl-9 text-xs"
          />
        </div>

        <div className="text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md font-semibold">
            <Sparkles className="w-3 h-3" />
            Showing <strong className="font-bold">{totalFilteredCount}</strong> items
          </span>
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectSubcategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
              activeSubcategory === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
            }`}
          >
            All Subcategories ({allCount})
          </button>

          {subcategories.map((sub) => {
            const isSelected = activeSubcategory === sub.name;
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => onSelectSubcategory(sub.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)] hover:border-slate-300'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {sub.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
