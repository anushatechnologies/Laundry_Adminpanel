'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Plus, Search, Sparkles, X, Loader2 } from 'lucide-react';
import { getAdminSubcategories, createAdminSubcategory } from '@/lib/api';
import { getSubcategoryImageUrl } from '@/lib/category-photos';
import { useApp } from '@/context/AppContext';
import { isSubcategoryInCategory } from '@/lib/categoryMatching';

export const isTagInCat = (subTag: string, catTag: string) => {
  return isSubcategoryInCategory(subTag, catTag);
};

interface SubcategorySelectDropdownProps {
  value: string;
  categoryTag: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onSubcategoryCreated?: (name: string) => void;
}

export const SubcategorySelectDropdown: React.FC<SubcategorySelectDropdownProps> = ({
  value,
  categoryTag,
  onChange,
  label = 'Subcategory',
  required = false,
  placeholder = 'Select a subcategory...',
  className = '',
  onSubcategoryCreated,
}) => {
  const { clothTypes, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customInputMode, setCustomInputMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [remoteSubcategories, setRemoteSubcategories] = useState<any[]>([]);
  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load live subcategories from backend API
  const loadSubs = () => {
    getAdminSubcategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setRemoteSubcategories(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSubs();
  }, [categoryTag]);

  // Compute available subcategories for this category tag (from DB and clothTypes only)
  const availableSubcategories = useMemo(() => {
    const list: Array<{ name: string; imageUrl?: string; isRemote?: boolean }> = [];
    const seen = new Set<string>();

    // 1. Remote DB subcategories matching this category tag
    remoteSubcategories
      .filter((s) => {
        const sCat = s.categoryTag || s.category_tag || '';
        return isTagInCat(sCat, categoryTag);
      })
      .forEach((s) => {
        const trimmed = (s.name || '').trim();
        if (trimmed && !seen.has(trimmed.toLowerCase())) {
          seen.add(trimmed.toLowerCase());
          list.push({ name: trimmed, imageUrl: s.imageUrl || s.image_url, isRemote: true });
        }
      });

    // 2. Existing subcategories attached to clothes in this category
    if (Array.isArray(clothTypes)) {
      clothTypes
        .filter((c) => isTagInCat(c.categoryTag || '', categoryTag))
        .forEach((c) => {
          const sub = (c.subCategory || '').trim();
          if (sub && !seen.has(sub.toLowerCase())) {
            seen.add(sub.toLowerCase());
            list.push({ name: sub });
          }
        });
    }

    return list;
  }, [remoteSubcategories, categoryTag, clothTypes]);

  // Filtered list by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return availableSubcategories;
    const q = searchQuery.toLowerCase().trim();
    return availableSubcategories.filter((item) => item.name.toLowerCase().includes(q));
  }, [availableSubcategories, searchQuery]);

  // Auto focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

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

  const handleSelect = (subName: string) => {
    onChange(subName);
    setIsOpen(false);
    setSearchQuery('');
    setCustomInputMode(false);
  };

  const handleCreateAndSelect = async (nameToCreate: string) => {
    const trimmed = nameToCreate.trim();
    if (!trimmed) return;

    setIsCreatingSub(true);
    try {
      await createAdminSubcategory({
        categoryTag: categoryTag || 'MENS',
        name: trimmed,
        isActive: true,
        sortOrder: remoteSubcategories.length + 1,
      });
      showToast(`Subcategory "${trimmed}" created in database!`, 'success');
      loadSubs();
      onSubcategoryCreated?.(trimmed);
    } catch {
      // Still apply to product locally
      showToast(`Using "${trimmed}" for this product.`, 'info');
    } finally {
      setIsCreatingSub(false);
      handleSelect(trimmed);
    }
  };

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [value, categoryTag]);

  const currentPhoto = useMemo(() => {
    if (!value) return undefined;
    const match = remoteSubcategories.find(
      (s) => (s.name || '').trim().toLowerCase() === value.trim().toLowerCase()
    );
    const remoteUrl = match?.imageUrl || match?.image_url;
    if (remoteUrl && typeof remoteUrl === 'string' && remoteUrl.trim().length > 10) {
      return remoteUrl.trim();
    }
    return getSubcategoryImageUrl(value, categoryTag) || undefined;
  }, [value, remoteSubcategories, categoryTag]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--heading-color)] flex items-center gap-1.5">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => {
              setCustomInputMode(!customInputMode);
              if (!customInputMode) setCustomText(value || '');
            }}
            className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            {customInputMode ? '← Choose from list' : '+ Type custom'}
          </button>
        </div>
      )}

      {/* Mode A: Direct text input */}
      {customInputMode ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            required={required}
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Type custom subcategory (e.g. Formal Shirts)..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleCreateAndSelect(customText)}
            disabled={!customText.trim() || isCreatingSub}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isCreatingSub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
          </button>
        </div>
      ) : (
        /* Mode B: Dropdown Picker */
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all text-left flex items-center justify-between cursor-pointer ${
              isOpen
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-[var(--border-color)] hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {value ? (
                <>
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-blue-50 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    {currentPhoto && !imgError ? (
                      <img
                        src={currentPhoto}
                        alt={value}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span className="text-[10px]">🏷️</span>
                    )}
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
                  placeholder="Search subcategory or type new..."
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
                  const photo = item.imageUrl || getSubcategoryImageUrl(item.name, categoryTag);

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
                        <div className="w-6 h-6 rounded-lg overflow-hidden bg-blue-50 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-700 shadow-2xs flex items-center justify-center">
                          {photo ? (
                            <img
                              src={photo}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className="text-[10px]">🏷️</span>
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
                {searchQuery.trim() && !filteredList.some((i) => i.name.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                  <div className="p-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      disabled={isCreatingSub}
                      onClick={() => handleCreateAndSelect(searchQuery.trim())}
                      className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isCreatingSub ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span>Create &quot;{searchQuery.trim()}&quot;</span>
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {availableSubcategories.length === 0 && !searchQuery.trim() && (
                  <div className="p-4 text-center space-y-2">
                    <p className="text-xs text-[var(--text-secondary)]">
                      No subcategories attached to this category yet.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Type above to create a subcategory on the fly.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown Footer: Quick Custom Add */}
              <div className="p-2 border-t border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-secondary)] font-medium">
                  {availableSubcategories.length} in database
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCustomInputMode(true);
                    setIsOpen(false);
                    setCustomText(value || '');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom typing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
