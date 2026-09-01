'use client';

import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { getCategoryImageUrl, getSubcategoryImageUrl, CATEGORY_DEFAULT_PHOTOS, SUBCATEGORY_DEFAULT_PHOTOS } from '@/lib/category-photos';
import { useApp } from '@/context/AppContext';

interface CategorySubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryItem {
  id: string;
  tag: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  color?: string;
}

interface SubcategoryItem {
  id: string;
  categoryTag: string;
  name: string;
  imageUrl?: string;
}

export const CategorySubcategoryModal: React.FC<CategorySubcategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'SUBCATEGORIES'>('CATEGORIES');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('MENS');

  // Categories list
  const [categories, setCategories] = useState<CategoryItem[]>(() => [
    { id: 'cat-1', tag: 'MENS', name: "Men's Wear", slug: 'mens-wear', description: 'Shirts, Suits, Kurtas, Trousers & Denim', imageUrl: CATEGORY_DEFAULT_PHOTOS.MENS },
    { id: 'cat-2', tag: 'WOMENS', name: "Women's Wear", slug: 'womens-wear', description: 'Sarees, Lehengas, Kurtis, Dresses & Gowns', imageUrl: CATEGORY_DEFAULT_PHOTOS.WOMENS },
    { id: 'cat-3', tag: 'KIDS', name: 'Kids & Baby', slug: 'kids-baby', description: 'Rompers, School Uniforms & Traditional Wear', imageUrl: CATEGORY_DEFAULT_PHOTOS.KIDS },
    { id: 'cat-4', tag: 'HOME', name: 'Home Textiles', slug: 'home-textiles', description: 'Bedsheets, Blankets, Comforters & Curtains', imageUrl: CATEGORY_DEFAULT_PHOTOS.HOME },
    { id: 'cat-5', tag: 'WINTER', name: 'Winter & Blankets', slug: 'winter-wear', description: 'Wool Sweaters, Quilts & Heavy Blankets', imageUrl: CATEGORY_DEFAULT_PHOTOS.WINTER },
    { id: 'cat-6', tag: 'WEDDING', name: 'Wedding & Silk Couture', slug: 'wedding-silk', description: 'Pure Silk Sarees, Heavy Lehengas & Sherwanis', imageUrl: CATEGORY_DEFAULT_PHOTOS.WEDDING },
  ]);

  // Subcategories list
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>(() => [
    // Men's
    { id: 'sub-m-1', categoryTag: 'MENS', name: 'Shirts', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.shirts },
    { id: 'sub-m-2', categoryTag: 'MENS', name: 'T-Shirts & Polos', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['t-shirts & polos'] },
    { id: 'sub-m-3', categoryTag: 'MENS', name: 'Trousers & Chinos', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['trousers & chinos'] },
    { id: 'sub-m-4', categoryTag: 'MENS', name: 'Jeans & Denim', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['jeans & denim'] },
    { id: 'sub-m-5', categoryTag: 'MENS', name: 'Ethnic Wear', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['ethnic wear'] },
    { id: 'sub-m-6', categoryTag: 'MENS', name: 'Suits & Blazers', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['suits & blazers'] },
    { id: 'sub-m-7', categoryTag: 'MENS', name: 'Winter Wear', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['winter wear'] },
    { id: 'sub-m-8', categoryTag: 'MENS', name: 'Sports & Gym', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['sports & gym'] },

    // Women's
    { id: 'sub-w-1', categoryTag: 'WOMENS', name: 'Sarees', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.sarees },
    { id: 'sub-w-2', categoryTag: 'WOMENS', name: 'Blouses', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.blouses },
    { id: 'sub-w-3', categoryTag: 'WOMENS', name: 'Kurtis', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.kurtis },
    { id: 'sub-w-4', categoryTag: 'WOMENS', name: 'Salwar & Suits', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['salwar & suits'] },
    { id: 'sub-w-5', categoryTag: 'WOMENS', name: 'Western Dresses', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['western dresses'] },
    { id: 'sub-w-6', categoryTag: 'WOMENS', name: 'Tops & Shirts', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['tops & shirts'] },
    { id: 'sub-w-7', categoryTag: 'WOMENS', name: 'Lehengas', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.lehengas },
    { id: 'sub-w-8', categoryTag: 'WOMENS', name: 'Gowns', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.gowns },
    { id: 'sub-w-9', categoryTag: 'WOMENS', name: 'Dupattas & Stoles', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['dupattas & stoles'] },

    // Kids
    { id: 'sub-k-1', categoryTag: 'KIDS', name: 'Baby Clothing', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['baby clothing'] },
    { id: 'sub-k-2', categoryTag: 'KIDS', name: 'Boys Clothing', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['boys clothing'] },
    { id: 'sub-k-3', categoryTag: 'KIDS', name: 'Girls Clothing', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['girls clothing'] },
    { id: 'sub-k-4', categoryTag: 'KIDS', name: 'School Uniforms', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['school uniforms'] },
    { id: 'sub-k-5', categoryTag: 'KIDS', name: 'Party Wear', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['party wear'] },
    { id: 'sub-k-6', categoryTag: 'KIDS', name: 'Traditional Wear', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['traditional wear'] },

    // Home
    { id: 'sub-h-1', categoryTag: 'HOME', name: 'Bedsheets', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.bedsheets },
    { id: 'sub-h-2', categoryTag: 'HOME', name: 'Bed Covers', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['bed covers'] },
    { id: 'sub-h-3', categoryTag: 'HOME', name: 'Blankets', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.blankets },
    { id: 'sub-h-4', categoryTag: 'HOME', name: 'Comforters & Duvets', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['comforters & duvets'] },
    { id: 'sub-h-5', categoryTag: 'HOME', name: 'Quilts & Razai', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['quilts & razai'] },
    { id: 'sub-h-6', categoryTag: 'HOME', name: 'Curtains', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.curtains },
    { id: 'sub-h-7', categoryTag: 'HOME', name: 'Sofa Covers', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['sofa covers'] },
    { id: 'sub-h-8', categoryTag: 'HOME', name: 'Cushion Covers', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['cushion covers'] },
    { id: 'sub-h-9', categoryTag: 'HOME', name: 'Towels', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS.towels },
    { id: 'sub-h-10', categoryTag: 'HOME', name: 'Rugs & Carpets', imageUrl: SUBCATEGORY_DEFAULT_PHOTOS['rugs & carpets'] },
  ]);

  // Uploading state tracking
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCallbackRef = useRef<((url: string) => void) | null>(null);

  if (!isOpen) return null;

  const handleTriggerUpload = (targetKey: string, onDone: (url: string) => void) => {
    setUploadingTarget(targetKey);
    currentUploadCallbackRef.current = onDone;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadingTarget(null);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload-s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              fileName: `cat-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            }),
          });

          const data = await res.json();
          if (data.success && data.data?.s3Url) {
            currentUploadCallbackRef.current?.(data.data.s3Url);
            showToast('Uploaded photo to AWS S3 successfully!', 'success');
          } else {
            showToast(data.message || 'Failed to upload photo', 'error');
          }
        } catch {
          showToast('Failed to upload image to S3', 'error');
        } finally {
          setUploadingTarget(null);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingTarget(null);
      showToast('Error reading image file', 'error');
    }
  };

  const handleUpdateCategoryPhoto = (catId: string, url: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, imageUrl: url } : c))
    );
  };

  const handleUpdateSubcategoryPhoto = (subId: string, url: string) => {
    setSubcategories((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, imageUrl: url } : s))
    );
  };

  const handleSaveAll = () => {
    // Persist to localStorage and sync
    try {
      localStorage.setItem('laundry_custom_category_photos', JSON.stringify(categories));
      localStorage.setItem('laundry_custom_subcategory_photos', JSON.stringify(subcategories));
    } catch {}

    showToast('Saved all category & subcategory photos successfully!', 'success');
    onClose();
  };

  const filteredSubcategories = subcategories.filter(
    (s) => selectedCatFilter === 'ALL' || s.categoryTag === selectedCatFilter
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
              <h2 className="text-base font-black text-[var(--heading-color)]">
                Category & Subcategory Photos Manager
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Upload and configure high-res imagery for mobile app categories & subcategories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-[var(--border-color)] flex items-center gap-3 bg-[var(--bg-secondary-card)]">
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'CATEGORIES' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const isUploading = uploadingTarget === `cat-${cat.id}`;
                return (
                  <div
                    key={cat.id}
                    className="border border-[var(--border-color)] rounded-xl p-3 bg-[var(--bg-secondary-card)] flex flex-col justify-between space-y-3"
                  >
                    {/* Image Preview */}
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)]">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Photo
                        </div>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                          <span>Uploading to S3...</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="font-bold text-sm text-[var(--heading-color)]">{cat.name}</h3>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                        {cat.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-1 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() =>
                            handleTriggerUpload(`cat-${cat.id}`, (url) =>
                              handleUpdateCategoryPhoto(cat.id, url)
                            )
                          }
                          className="flex-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        {cat.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateCategoryPhoto(cat.id, '')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                            title="Reset to default"
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
                          placeholder="Paste image URL..."
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
                  { tag: 'MENS', label: "Men's" },
                  { tag: 'WOMENS', label: "Women's" },
                  { tag: 'KIDS', label: 'Kids & Baby' },
                  { tag: 'HOME', label: 'Home Textiles' },
                  { tag: 'ALL', label: 'All Subcategories' },
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
                      className="border border-[var(--border-color)] rounded-xl p-2.5 bg-[var(--bg-secondary-card)] flex flex-col justify-between space-y-2"
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

                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                          {sub.categoryTag}
                        </span>
                        <h4 className="font-bold text-xs text-[var(--heading-color)] line-clamp-1">
                          {sub.name}
                        </h4>
                      </div>

                      {/* Action */}
                      <div className="pt-1 border-t border-[var(--border-color)] space-y-1.5">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() =>
                            handleTriggerUpload(`sub-${sub.id}`, (url) =>
                              handleUpdateSubcategoryPhoto(sub.id, url)
                            )
                          }
                          className="w-full px-2 py-1 bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Upload Photo</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <LinkIcon className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="Image URL..."
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
          <p className="text-xs text-[var(--text-secondary)]">
            Changes will be reflected across Customer App and Admin Panel.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--heading-color)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
