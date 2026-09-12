'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Plus, Search, Sparkles, X } from 'lucide-react';
import { getAdminSubcategories } from '@/lib/api';
import { getSubcategoryImageUrl } from '@/lib/category-photos';
import { useApp } from '@/context/AppContext';

// Standard fallback subcategories per category
const DEFAULT_CATEGORY_SUBCATS: Record<string, string[]> = {
  MENS: [
    'Shirts',
    'T-Shirts & Polos',
    'Trousers & Chinos',
    'Jeans & Denim',
    'Ethnic Wear',
    'Suits & Blazers',
    'Jackets & Coats',
    'Winter Wear',
    'Sports & Gym',
    'Shorts',
    'Nightwear',
    'Innerwear',
  ],
  WOMENS: [
    'Sarees',
    'Blouses',
    'Kurtis & Kurtas',
    'Salwar & Suits',
    'Western Dresses',
    'Tops & Shirts',
    'Jeans & Pants',
    'Skirts & Shorts',
    'Lehengas',
    'Gowns',
    'Dupattas & Stoles',
    'Occasion Wear',
    'Winter Wear',
    'Nightwear',
  ],
  KIDS: [
    'Baby Clothing',
    'Boys Clothing',
    'Girls Clothing',
    'School Uniforms',
    'Party Wear',
    'Traditional Wear',
    'Tops & Shirts',
    'Bottoms',
    'Winter Wear',
  ],
  HOME_TEXTILES: [
    'Bedsheets',
    'Bed Covers',
    'Blankets',
    'Comforters & Quilts',
    'Curtains',
    'Sofa & Cushion Covers',
    'Towels',
    'Carpets & Rugs',
    'Table Linen',
  ],
  FOOTWEAR: [
    'Sneakers',
    'Formal Shoes',
    'Sports Shoes',
    'Boots',
    'Sandals & Slippers',
    'Leather Shoes',
  ],
  ACCESSORIES: [
    'Backpacks',
    'Handbags',
    'Belts & Wallets',
    'Caps & Hats',
    'Luggage & Trolley',
    'Ties & Scarves',
  ],
  SPECIAL: [
    'Wedding & Bridal',
    'Leather & Suede Care',
    'Delicate Embroidery',
    'Curtain Steam Press',
  ],
  BULK: [
    'Everyday Wash & Fold',
    'Steam Press Bulk',
    'Bed Linen Slabs',
    'Hotel & Commercial',
  ],
};

interface SubcategorySelectDropdownProps {
  value: string;
  categoryTag: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const SubcategorySelectDropdown: React.FC<SubcategorySelectDropdownProps> = ({
  value,
  categoryTag,
  onChange,
  label = 'Subcategory',
  required = false,
  placeholder = 'Select a subcategory...',
  className = '',
}) => {
  const { clothTypes } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customInputMode, setCustomInputMode] = useState(false);
  const [remoteSubcategories, setRemoteSubcategories] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize category tag (e.g. MENS, WOMENS, etc.)
  const normalizedCategory = useMemo(() => {
    if (!categoryTag) return 'MENS';
    const upper = categoryTag.toUpperCase().replace(/-/g, '_');
    if (upper.includes('MEN') && !upper.includes('WOMEN')) return 'MENS';
    if (upper.includes('WOMEN')) return 'WOMENS';
    if (upper.includes('KID')) return 'KIDS';
    if (upper.includes('HOME') || upper.includes('TEXTILE')) return 'HOME_TEXTILES';
    if (upper.includes('FOOT') || upper.includes('SHOE')) return 'FOOTWEAR';
    if (upper.includes('ACCESSOR')) return 'ACCESSORIES';
    return upper;
  }, [categoryTag]);

  // Load subcategories from API
  useEffect(() => {
    let isMounted = true;
    getAdminSubcategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setRemoteSubcategories(data);
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available subcategories for this category tag
  const availableSubcategories = useMemo(() => {
    const list: Array<{ name: string; imageUrl?: string; isRemote?: boolean }> = [];
    const seen = new Set<string>();

    // 1. Remote DB subcategories matching this category
    remoteSubcategories
      .filter((s) => {
        const sCat = (s.categoryTag || s.category_tag || '').toUpperCase().replace(/-/g, '_');
        return sCat === normalizedCategory || sCat === categoryTag.toUpperCase();
      })
      .forEach((s) => {
        const trimmed = s.name.trim();
        if (trimmed && !seen.has(trimmed.toLowerCase())) {
          seen.add(trimmed.toLowerCase());
          list.push({ name: trimmed, imageUrl: s.imageUrl || s.image_url, isRemote: true });
        }
      });

    // 2. Default standard catalog subcategories
    const defaults = DEFAULT_CATEGORY_SUBCATS[normalizedCategory] || [];
    defaults.forEach((defName) => {
      if (!seen.has(defName.toLowerCase())) {
        seen.add(defName.toLowerCase());
        list.push({ name: defName });
      }
    });

    // 3. Existing subcategories used across clothes in this category
    if (Array.isArray(clothTypes)) {
      clothTypes
        .filter((c) => (c.categoryTag || '').toUpperCase() === categoryTag.toUpperCase())
        .forEach((c) => {
          const sub = (c.subCategory || '').trim();
          if (sub && !seen.has(sub.toLowerCase())) {
            seen.add(sub.toLowerCase());
            list.push({ name: sub });
          }
        });
    }

    return list;
  }, [remoteSubcategories, normalizedCategory, categoryTag, clothTypes]);

  // Filtered by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return availableSubcategories;
    const q = searchQuery.toLowerCase().trim();
    return availableSubcategories.filter((item) => item.name.toLowerCase().includes(q));
  }, [availableSubcategories, searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (subName: string) => {
    onChange(subName);
    setIsOpen(false);
    setSearchQuery('');
    setCustomInputMode(false);
  };

  const handleAddCustom = () => {
    if (searchQuery.trim()) {
      handleSelect(searchQuery.trim());
    }
  };

  const currentPhoto = value ? getSubcategoryImageUrl(value, normalizedCategory) : null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-[var(--heading-color)] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>

          <button
            type="button"
            onClick={() => setCustomInputMode(!customInputMode)}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {customInputMode ? 'Switch to Dropdown' : '+ Type Custom'}
          </button>
        </div>
      )}

      {customInputMode ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type custom subcategory (e.g. Linen Kurtas)..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-blue-400 text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
          />
          <button
            type="button"
            onClick={() => setCustomInputMode(false)}
            className="px-2.5 py-2 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl hover:bg-slate-200 cursor-pointer shrink-0"
          >
            List
          </button>
        </div>
      ) : (
        <div>
          {/* Dropdown trigger button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all text-left cursor-pointer ${
              isOpen
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-[var(--border-color)] hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {value ? (
                <>
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600">
                    <img
                      src={currentPhoto || 'https://anjanilaundry.s3.ap-south-2.amazonaws.com/categories/mens-wear.jpg'}
                      alt={value}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--heading-color)] truncate">
                    {value}
                  </span>
                </>
              ) : (
                <span className="text-xs text-[var(--text-secondary)] font-medium truncate">
                  {placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {value && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  title="Clear subcategory"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                  isOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </div>
          </button>

          {/* Hidden input for HTML form submission compatibility */}
          <input type="hidden" name="subCategory" value={value} required={required} />

          {/* Dropdown Panel */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-72">
              {/* Search Header */}
              <div className="p-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${normalizedCategory.toLowerCase()} subcategories...`}
                  className="w-full bg-transparent text-xs font-semibold text-[var(--heading-color)] focus:outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Options List */}
              <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
                {filteredList.map((item) => {
                  const isSelected = value?.toLowerCase() === item.name.toLowerCase();
                  const photo = item.imageUrl || getSubcategoryImageUrl(item.name, normalizedCategory);

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelect(item.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--heading-color)] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-700 shadow-2xs">
                          <img
                            src={photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-xs truncate">{item.name}</span>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}

                {/* If search produces no results or user wants to add custom */}
                {filteredList.length === 0 && (
                  <div className="p-3 text-center space-y-2">
                    <p className="text-xs text-[var(--text-secondary)]">
                      No matching subcategories for &quot;{searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Use &quot;{searchQuery}&quot;</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Footer: Quick Custom Add */}
              <div className="p-2 border-t border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-secondary)] font-medium">
                  {availableSubcategories.length} available
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCustomInputMode(true);
                    setIsOpen(false);
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom subcategory</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
