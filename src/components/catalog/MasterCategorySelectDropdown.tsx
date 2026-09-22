'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { getCategoryImageUrl } from '@/lib/category-photos';

export interface CategoryOption {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  description?: string;
  itemCount?: number;
}

interface MasterCategorySelectDropdownProps {
  value: string;
  onChange: (categoryId: string) => void;
  categories: CategoryOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const MasterCategorySelectDropdown: React.FC<MasterCategorySelectDropdownProps> = ({
  value,
  onChange,
  categories,
  label = 'Master Category',
  required = false,
  placeholder = 'Select Master Category...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Find active selected category (case-insensitive and alias matching)
  const selectedCategory = useMemo(() => {
    if (!value) return categories[0] || null;
    const v = String(value).trim().toUpperCase();
    return (
      categories.find((c) => String(c.id).trim().toUpperCase() === v) ||
      categories.find((c) => String(c.name).trim().toUpperCase() === v) ||
      categories[0] ||
      null
    );
  }, [value, categories]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const getEffectiveImage = (cat: CategoryOption) => {
    if (imageErrorMap[cat.id]) return '';
    return getCategoryImageUrl(cat.id, cat.imageUrl);
  };

  const handleSelect = (catId: string) => {
    onChange(catId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all flex items-center justify-between gap-2 text-left cursor-pointer ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-[var(--border-color)] hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        {selectedCategory ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Category Photo Thumbnail */}
            <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-2xs">
              {getEffectiveImage(selectedCategory) ? (
                <img
                  src={getEffectiveImage(selectedCategory)}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setImageErrorMap((prev) => ({ ...prev, [selectedCategory.id]: true }))
                  }
                />
              ) : (
                <span className="text-xs">{selectedCategory.icon || '👔'}</span>
              )}
            </div>

            {/* Category Name */}
            <span className="text-xs font-bold text-[var(--heading-color)] truncate">
              {selectedCategory.name}
            </span>

            {/* ID Tag */}
            <span className="text-[10px] font-mono uppercase bg-slate-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 shrink-0">
              {selectedCategory.id}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">{placeholder}</span>
        )}

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[260px] max-w-[360px] bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Quick Search */}
          {categories.length > 4 && (
            <div className="p-2 border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-800/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-blue-500 text-[var(--heading-color)]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
            {filteredCategories.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 font-medium">
                No matching category found
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                const img = getEffectiveImage(cat);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full p-2 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Photo Thumbnail */}
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-2xs">
                        {img ? (
                          <img
                            src={img}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={() =>
                              setImageErrorMap((prev) => ({ ...prev, [cat.id]: true }))
                            }
                          />
                        ) : (
                          <span className="text-sm">{cat.icon || '👔'}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black truncate ${
                              isSelected
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-[var(--heading-color)]'
                            }`}
                          >
                            {cat.name}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Checkmark indicator */}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
