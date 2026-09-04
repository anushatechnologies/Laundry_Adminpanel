'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  Loader2,
  Check,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import {
  getAdminCategories,
  getAdminSubcategories,
  updateAdminCategory,
  updateAdminSubcategory,
  createAdminSubcategory,
  deleteAdminSubcategory,
} from '@/lib/api';
import { useApp } from '@/context/AppContext';

interface CategorySubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCatalog?: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  isPopular?: boolean;
}

interface SubcategoryItem {
  id: string;
  categoryTag: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export const CategorySubcategoryModal: React.FC<CategorySubcategoryModalProps> = ({
  isOpen,
  onClose,
  onRefreshCatalog,
}) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'SUBCATEGORIES'>('CATEGORIES');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('ALL');

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCallbackRef = useRef<((url: string) => Promise<void>) | null>(null);

  // Add new subcategory modal/form state
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategoryTag, setNewSubCategoryTag] = useState('MENS');
  const [newSubImageUrl, setNewSubImageUrl] = useState('');
  const [isSubmittingNewSub, setIsSubmittingNewSub] = useState(false);

  // Load live data from Backend API
  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        getAdminCategories().catch(() => []),
        getAdminSubcategories().catch(() => []),
      ]);

      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      if (Array.isArray(subs) && subs.length > 0) {
        setSubcategories(subs);
      }
    } catch (err: any) {
      console.error('Failed to load category/subcategory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerUpload = (targetKey: string, onDone: (url: string) => Promise<void>) => {
    setUploadingTarget(targetKey);
    currentUploadCallbackRef.current = onDone;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadCallbackRef.current) {
      setUploadingTarget(null);
      return;
    }

    try {
      showToast('Compressing and uploading image to AWS S3...', 'info');
      const compressedBase64 = await compressImageFile(file);

      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: `catalog-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.s3Url) {
        const s3Url = data.data.s3Url;
        await currentUploadCallbackRef.current(s3Url);
        showToast('Photo uploaded to AWS S3 & saved to database!', 'success');
        onRefreshCatalog?.();
      } else {
        showToast(data.message || 'Failed to upload photo to S3', 'error');
      }
    } catch (err: any) {
      console.error('S3 Upload Error:', err);
      showToast('Failed to upload image: ' + (err.message || 'Network error'), 'error');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Direct backend update for Category
  const handleUpdateCategoryPhoto = async (catId: string, url: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, imageUrl: url } : c))
    );
    try {
      await updateAdminCategory(catId, { imageUrl: url });
      showToast('Category photo updated directly in cloud database!', 'success');
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Failed to update category photo in DB: ' + err.message, 'error');
    }
  };

  // Direct backend update for Subcategory
  const handleUpdateSubcategoryPhoto = async (subId: string, url: string) => {
    setSubcategories((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, imageUrl: url } : s))
    );
    try {
      await updateAdminSubcategory(subId, { imageUrl: url });
      showToast('Subcategory photo updated directly in cloud database!', 'success');
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Failed to update subcategory photo: ' + err.message, 'error');
    }
  };

  // Create new subcategory in backend
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    setIsSubmittingNewSub(true);
    try {
      const created = await createAdminSubcategory({
        categoryTag: newSubCategoryTag.toUpperCase(),
        name: newSubName.trim(),
        imageUrl: newSubImageUrl.trim() || undefined,
        isActive: true,
        sortOrder: subcategories.length + 1,
      });

      if (created) {
        setSubcategories((prev) => [...prev, created]);
        showToast(`Subcategory "${newSubName}" created in database!`, 'success');
        setNewSubName('');
        setNewSubImageUrl('');
        setIsAddingSub(false);
        onRefreshCatalog?.();
      }
    } catch (err: any) {
      showToast('Failed to create subcategory: ' + err.message, 'error');
    } finally {
      setIsSubmittingNewSub(false);
    }
  };

  // Delete subcategory from backend
  const handleDeleteSubcategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;

    try {
      await deleteAdminSubcategory(id);
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      showToast(`Subcategory "${name}" deleted.`, 'info');
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Failed to delete subcategory: ' + err.message, 'error');
    }
  };

  const filteredSubcategories = subcategories.filter(
    (s) => selectedCatFilter === 'ALL' || s.categoryTag.toUpperCase() === selectedCatFilter.toUpperCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="bg-[var(--bg-primary-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary-card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--heading-color)] flex items-center gap-2">
                <span>Category & Subcategory Cloud Manager</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  Direct AWS S3
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Directly upload high-res images to S3 with real-time MySQL persistence for the mobile app
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh from cloud database"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Action Bar */}
        <div className="px-5 pt-3 pb-2 border-b border-[var(--border-color)] flex items-center justify-between gap-3 bg-[var(--bg-secondary-card)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('CATEGORIES')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'CATEGORIES'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-[var(--bg-primary-card)] text-[var(--text-secondary)] hover:text-[var(--heading-color)] border border-[var(--border-color)]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Main Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SUBCATEGORIES')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'SUBCATEGORIES'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-[var(--bg-primary-card)] text-[var(--text-secondary)] hover:text-[var(--heading-color)] border border-[var(--border-color)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Subcategories ({subcategories.length})</span>
            </button>
          </div>

          {activeTab === 'SUBCATEGORIES' && (
            <button
              onClick={() => setIsAddingSub(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subcategory</span>
            </button>
          )}
        </div>

        {/* New Subcategory Inline Drawer Form */}
        {isAddingSub && activeTab === 'SUBCATEGORIES' && (
          <form
            onSubmit={handleCreateSubcategory}
            className="bg-blue-50/70 dark:bg-blue-950/40 p-4 border-b border-blue-200 dark:border-blue-900/50 flex flex-wrap items-center gap-3 text-xs"
          >
            <div className="font-bold text-blue-900 dark:text-blue-200">New Subcategory:</div>
            <select
              value={newSubCategoryTag}
              onChange={(e) => setNewSubCategoryTag(e.target.value)}
              className="admin-input py-1 px-2.5 text-xs bg-white dark:bg-slate-900"
            >
              <option value="MENS">Men's Wear</option>
              <option value="WOMENS">Women's Wear</option>
              <option value="KIDS">Kids & Baby</option>
              <option value="HOME_TEXTILES">Home Textiles</option>
              <option value="FOOTWEAR">Footwear</option>
              <option value="ACCESSORIES">Accessories</option>
              <option value="BULK">Bulk Laundry</option>
            </select>
            <input
              type="text"
              required
              placeholder="Subcategory name (e.g. Formal Shirts)..."
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="admin-input py-1 px-3 text-xs w-52 bg-white dark:bg-slate-900"
            />
            <input
              type="text"
              placeholder="Image URL (optional)..."
              value={newSubImageUrl}
              onChange={(e) => setNewSubImageUrl(e.target.value)}
              className="admin-input py-1 px-3 text-xs flex-1 min-w-[200px] bg-white dark:bg-slate-900"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingNewSub}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer disabled:opacity-50"
              >
                {isSubmittingNewSub ? 'Saving...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSub(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-xs">Loading categories and subcategories from database...</p>
            </div>
          ) : activeTab === 'CATEGORIES' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const isUploading = uploadingTarget === `cat-${cat.id}`;
                return (
                  <div
                    key={cat.id}
                    className="border border-[var(--border-color)] rounded-xl p-3 bg-[var(--bg-secondary-card)] flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    {/* Image Preview with S3 indicator */}
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] group">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                          No Custom Photo
                        </div>
                      )}

                      {cat.imageUrl && cat.imageUrl.includes('s3') && (
                        <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider backdrop-blur-xs">
                          AWS S3
                        </span>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
                          <span className="font-bold">Uploading to S3...</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{cat.icon || '🧺'}</span>
                        <h3 className="font-bold text-sm text-[var(--heading-color)]">{cat.name}</h3>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                        {cat.description || cat.slug}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-1 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() =>
                            handleTriggerUpload(`cat-${cat.id}`, async (url) => {
                              await handleUpdateCategoryPhoto(cat.id, url);
                            })
                          }
                          className="flex-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploading ? 'Uploading...' : 'Upload S3 Photo'}</span>
                        </button>

                        {cat.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateCategoryPhoto(cat.id, '')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                            title="Clear image URL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Direct URL input */}
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Paste direct URL..."
                          value={cat.imageUrl || ''}
                          onChange={(e) => handleUpdateCategoryPhoto(cat.id, e.target.value)}
                          className="admin-input text-[10px] py-1 px-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category Filter Pills for Subcategories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { tag: 'ALL', label: 'All Subcategories' },
                  { tag: 'MENS', label: "Men's" },
                  { tag: 'WOMENS', label: "Women's" },
                  { tag: 'KIDS', label: 'Kids & Baby' },
                  { tag: 'HOME_TEXTILES', label: 'Home Textiles' },
                  { tag: 'FOOTWEAR', label: 'Footwear' },
                  { tag: 'ACCESSORIES', label: 'Accessories' },
                ].map((c) => (
                  <button
                    key={c.tag}
                    onClick={() => setSelectedCatFilter(c.tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                      selectedCatFilter === c.tag
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                        : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredSubcategories.map((sub) => {
                  const isUploading = uploadingTarget === `sub-${sub.id}`;
                  return (
                    <div
                      key={sub.id}
                      className="border border-[var(--border-color)] rounded-xl p-2.5 bg-[var(--bg-secondary-card)] flex flex-col justify-between space-y-2 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      {/* Image Preview */}
                      <div className="relative w-full h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)]">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No Photo
                          </div>
                        )}

                        {sub.imageUrl && sub.imageUrl.includes('s3') && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow-2xs uppercase">
                            S3
                          </span>
                        )}

                        {isUploading && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-[10px] gap-1.5 font-bold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                            <span>Uploading S3...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            {sub.categoryTag}
                          </span>
                          <h4 className="font-bold text-xs text-[var(--heading-color)] line-clamp-1">
                            {sub.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete subcategory"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Action */}
                      <div className="pt-1 border-t border-[var(--border-color)] space-y-1.5">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() =>
                            handleTriggerUpload(`sub-${sub.id}`, async (url) => {
                              await handleUpdateSubcategoryPhoto(sub.id, url);
                            })
                          }
                          className="w-full px-2 py-1 bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>{isUploading ? 'Uploading...' : 'Upload S3 Photo'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <LinkIcon className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="Direct URL..."
                            value={sub.imageUrl || ''}
                            onChange={(e) => handleUpdateSubcategoryPhoto(sub.id, e.target.value)}
                            className="admin-input text-[9px] py-0.5 px-1.5 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary-card)]">
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All uploads save directly to AWS S3 & MySQL cloud database immediately.</span>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
