'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  UploadCloud,
  Loader2,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Link as LinkIcon,
  Shirt,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import {
  getAdminSubcategories,
  createAdminSubcategory,
  updateAdminSubcategory,
  deleteAdminSubcategory,
} from '@/lib/api';
import { getSubcategoryImageUrl } from '@/lib/category-photos';
import { useApp } from '@/context/AppContext';

interface SubcategoryItem {
  id: string;
  categoryTag: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

const CATEGORY_TABS = [
  { tag: 'ALL', label: 'All Subcategories', icon: '✨' },
  { tag: 'MENS', label: "Men's Wear", icon: '👔' },
  { tag: 'WOMENS', label: "Women's Wear", icon: '👗' },
  { tag: 'KIDS', label: 'Kids & Baby', icon: '🧸' },
  { tag: 'HOME_TEXTILES', label: 'Home Textiles', icon: '🛏️' },
  { tag: 'FOOTWEAR', label: 'Footwear', icon: '👟' },
  { tag: 'ACCESSORIES', label: 'Accessories', icon: '🎒' },
  { tag: 'BULK', label: 'Bulk Laundry', icon: '🧺' },
];

const DEFAULT_SEEDED_SUBCATEGORIES: Array<{ tag: string; name: string; sortOrder: number }> = [
  { tag: 'MENS', name: 'Shirts', sortOrder: 1 },
  { tag: 'MENS', name: 'T-Shirts & Polos', sortOrder: 2 },
  { tag: 'MENS', name: 'Trousers & Chinos', sortOrder: 3 },
  { tag: 'MENS', name: 'Jeans & Denim', sortOrder: 4 },
  { tag: 'MENS', name: 'Ethnic Wear', sortOrder: 5 },
  { tag: 'MENS', name: 'Suits & Blazers', sortOrder: 6 },
  { tag: 'MENS', name: 'Jackets & Coats', sortOrder: 7 },
  { tag: 'MENS', name: 'Winter Wear', sortOrder: 8 },
  { tag: 'WOMENS', name: 'Sarees', sortOrder: 1 },
  { tag: 'WOMENS', name: 'Blouses', sortOrder: 2 },
  { tag: 'WOMENS', name: 'Kurtis & Kurtas', sortOrder: 3 },
  { tag: 'WOMENS', name: 'Salwar & Suits', sortOrder: 4 },
  { tag: 'WOMENS', name: 'Western Dresses', sortOrder: 5 },
  { tag: 'WOMENS', name: 'Tops & Shirts', sortOrder: 6 },
  { tag: 'WOMENS', name: 'Lehengas', sortOrder: 7 },
  { tag: 'WOMENS', name: 'Gowns', sortOrder: 8 },
  { tag: 'WOMENS', name: 'Dupattas & Stoles', sortOrder: 9 },
  { tag: 'KIDS', name: 'Baby Clothing', sortOrder: 1 },
  { tag: 'KIDS', name: 'Boys Clothing', sortOrder: 2 },
  { tag: 'KIDS', name: 'Girls Clothing', sortOrder: 3 },
  { tag: 'KIDS', name: 'School Uniforms', sortOrder: 4 },
  { tag: 'KIDS', name: 'Party Wear', sortOrder: 5 },
  { tag: 'HOME_TEXTILES', name: 'Bedsheets', sortOrder: 1 },
  { tag: 'HOME_TEXTILES', name: 'Bed Covers', sortOrder: 2 },
  { tag: 'HOME_TEXTILES', name: 'Blankets', sortOrder: 3 },
  { tag: 'HOME_TEXTILES', name: 'Comforters & Quilts', sortOrder: 4 },
  { tag: 'HOME_TEXTILES', name: 'Curtains', sortOrder: 5 },
  { tag: 'HOME_TEXTILES', name: 'Sofa & Cushion Covers', sortOrder: 6 },
  { tag: 'HOME_TEXTILES', name: 'Towels', sortOrder: 7 },
  { tag: 'FOOTWEAR', name: 'Sneakers', sortOrder: 1 },
  { tag: 'FOOTWEAR', name: 'Formal Shoes', sortOrder: 2 },
  { tag: 'FOOTWEAR', name: 'Sports Shoes', sortOrder: 3 },
  { tag: 'ACCESSORIES', name: 'Backpacks', sortOrder: 1 },
  { tag: 'ACCESSORIES', name: 'Handbags', sortOrder: 2 },
  { tag: 'ACCESSORIES', name: 'Belts & Wallets', sortOrder: 3 },
];

export const SubcategoriesManager: React.FC<{ onRefreshCatalog?: () => void }> = ({
  onRefreshCatalog,
}) => {
  const { clothTypes, showToast } = useApp();
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Uploading State
  const [uploadingSubId, setUploadingSubId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadSubIdRef = useRef<string | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubcategoryItem | null>(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    categoryTag: 'MENS',
    imageUrl: '',
    isActive: true,
    sortOrder: 1,
  });
  const [modalUploadingS3, setModalUploadingS3] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Load Subcategories from MySQL
  const loadSubcategories = async () => {
    setLoading(true);
    try {
      const data = await getAdminSubcategories().catch(() => []);
      if (Array.isArray(data) && data.length > 0) {
        setSubcategories(
          data.map((item: any) => ({
            id: item.id || `sub-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            categoryTag: (item.categoryTag || item.category_tag || 'MENS').toUpperCase(),
            name: item.name,
            imageUrl: item.imageUrl || item.image_url || '',
            isActive: item.isActive !== false && item.is_active !== 0,
            sortOrder: Number(item.sortOrder || item.sort_order || 1),
          }))
        );
      } else {
        // Fallback seed
        const seeded: SubcategoryItem[] = DEFAULT_SEEDED_SUBCATEGORIES.map((s, idx) => ({
          id: `sub-seed-${idx + 1}`,
          categoryTag: s.tag,
          name: s.name,
          imageUrl: getSubcategoryImageUrl(s.name, s.tag),
          isActive: true,
          sortOrder: s.sortOrder,
        }));
        setSubcategories(seeded);
      }
    } catch (err) {
      console.warn('Could not load subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, []);

  // Client-side image compression
  const compressImage = (file: File, maxDim = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
      };
    });
  };

  // Direct S3 Upload from Card
  const handleCardUploadClick = (subId: string) => {
    targetUploadSubIdRef.current = subId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleCardFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const subId = targetUploadSubIdRef.current;
    if (!file || !subId) return;

    setUploadingSubId(subId);
    try {
      const compressedBase64 = await compressImage(file);
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: `subcat-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        }),
      });

      const data = await res.json();
      const s3Url = data.data?.s3Url || compressedBase64;

      // Update state
      setSubcategories((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, imageUrl: s3Url } : s))
      );

      // Persist to backend
      await updateAdminSubcategory(subId, { imageUrl: s3Url }).catch(() => {});
      showToast('Uploaded new photo to AWS S3 & saved subcategory!', 'success');
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Failed to upload image: ' + (err.message || 'Error'), 'error');
    } finally {
      setUploadingSubId(null);
    }
  };

  // Upload inside Modal
  const handleModalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModalUploadingS3(true);
    try {
      const compressedBase64 = await compressImage(file);
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: `subcat-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        }),
      });

      const data = await res.json();
      const s3Url = data.data?.s3Url || compressedBase64;
      setModalForm((prev) => ({ ...prev, imageUrl: s3Url }));
      showToast('Photo uploaded to AWS S3!', 'success');
    } catch (err: any) {
      showToast('Failed to upload image: ' + (err.message || 'Error'), 'error');
    } finally {
      setModalUploadingS3(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSub(null);
    setModalForm({
      name: '',
      categoryTag: activeCategoryFilter === 'ALL' ? 'MENS' : activeCategoryFilter,
      imageUrl: '',
      isActive: true,
      sortOrder: subcategories.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sub: SubcategoryItem) => {
    setEditingSub(sub);
    setModalForm({
      name: sub.name,
      categoryTag: sub.categoryTag,
      imageUrl: sub.imageUrl || '',
      isActive: sub.isActive,
      sortOrder: sub.sortOrder,
    });
    setIsModalOpen(true);
  };

  // Save Modal (Create or Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;

    setIsSaving(true);
    try {
      if (editingSub) {
        // Update
        const updatedItem = {
          ...editingSub,
          name: modalForm.name.trim(),
          categoryTag: modalForm.categoryTag,
          imageUrl: modalForm.imageUrl.trim() || undefined,
          isActive: modalForm.isActive,
          sortOrder: Number(modalForm.sortOrder) || 1,
        };

        setSubcategories((prev) =>
          prev.map((s) => (s.id === editingSub.id ? updatedItem : s))
        );

        await updateAdminSubcategory(editingSub.id, {
          name: updatedItem.name,
          categoryTag: updatedItem.categoryTag,
          imageUrl: updatedItem.imageUrl,
          isActive: updatedItem.isActive,
          sortOrder: updatedItem.sortOrder,
        }).catch(() => {});

        showToast(`Subcategory "${updatedItem.name}" updated!`, 'success');
      } else {
        // Create
        const newId = `sub-${modalForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
        const newItem: SubcategoryItem = {
          id: newId,
          name: modalForm.name.trim(),
          categoryTag: modalForm.categoryTag,
          imageUrl: modalForm.imageUrl.trim() || undefined,
          isActive: modalForm.isActive,
          sortOrder: Number(modalForm.sortOrder) || subcategories.length + 1,
        };

        const created = await createAdminSubcategory({
          categoryTag: newItem.categoryTag,
          name: newItem.name,
          imageUrl: newItem.imageUrl,
          isActive: newItem.isActive,
          sortOrder: newItem.sortOrder,
        }).catch(() => null);

        setSubcategories((prev) => [...prev, created || newItem]);
        showToast(`Subcategory "${newItem.name}" created successfully!`, 'success');
      }

      setIsModalOpen(false);
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Error saving subcategory: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Active Status directly
  const handleToggleActive = async (sub: SubcategoryItem) => {
    const updatedStatus = !sub.isActive;
    setSubcategories((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, isActive: updatedStatus } : s))
    );

    try {
      await updateAdminSubcategory(sub.id, { isActive: updatedStatus });
      showToast(
        `"${sub.name}" is now ${updatedStatus ? 'Active' : 'Hidden'} in catalog.`,
        'info'
      );
      onRefreshCatalog?.();
    } catch (err) {
      console.warn('Failed to update active state in DB:', err);
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (sub: SubcategoryItem) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) return;

    setSubcategories((prev) => prev.filter((s) => s.id !== sub.id));
    try {
      await deleteAdminSubcategory(sub.id);
      showToast(`Deleted subcategory "${sub.name}".`, 'info');
      onRefreshCatalog?.();
    } catch (err: any) {
      showToast('Failed to delete subcategory: ' + err.message, 'error');
    }
  };

  // Count garments attached to each subcategory
  const clothCountsBySub = useMemo(() => {
    const counts: Record<string, number> = {};
    if (Array.isArray(clothTypes)) {
      clothTypes.forEach((c) => {
        const sub = (c.subCategory || '').trim().toLowerCase();
        if (sub) {
          counts[sub] = (counts[sub] || 0) + 1;
        }
      });
    }
    return counts;
  }, [clothTypes]);

  // Filter and Search Subcategories
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((sub) => {
      const matchesCategory =
        activeCategoryFilter === 'ALL' ||
        sub.categoryTag.toUpperCase() === activeCategoryFilter.toUpperCase();
      const matchesSearch =
        !searchQuery.trim() ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        sub.categoryTag.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [subcategories, activeCategoryFilter, searchQuery]);

  // Counts per Category Tab
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: subcategories.length };
    subcategories.forEach((s) => {
      const tag = s.categoryTag.toUpperCase();
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, [subcategories]);

  return (
    <div className="space-y-4">
      {/* Hidden Card Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCardFileSelected}
      />

      {/* Subcategories Top Action & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[var(--heading-color)]">
                Subcategories Management
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {subcategories.length} total
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Manage product taxonomy, attach high-res AWS S3 photography, and control customer app grouping
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--heading-color)] w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <button
            type="button"
            onClick={loadSubcategories}
            disabled={loading}
            title="Reload from MySQL cloud"
            className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = activeCategoryFilter === tab.tag;
          const count = categoryCounts[tab.tag] || 0;

          return (
            <button
              key={tab.tag}
              type="button"
              onClick={() => setActiveCategoryFilter(tab.tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/25 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategories Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-xs font-semibold">Loading subcategories from cloud database...</p>
        </div>
      ) : filteredSubcategories.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl">
          <p className="text-xs text-[var(--text-secondary)]">
            No subcategories found matching your filter &quot;{searchQuery || activeCategoryFilter}&quot;
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Subcategory</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSubcategories.map((sub) => {
            const isUploadingThis = uploadingSubId === sub.id;
            const garmentCount = clothCountsBySub[sub.name.toLowerCase()] || 0;
            const photoUrl = sub.imageUrl || getSubcategoryImageUrl(sub.name, sub.categoryTag);
            const isS3 = Boolean(sub.imageUrl && sub.imageUrl.includes('s3'));

            return (
              <div
                key={sub.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  !sub.isActive
                    ? 'opacity-60 border-dashed border-slate-300 dark:border-slate-800'
                    : 'border-[var(--border-color)]'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-16/10 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                  <img
                    src={photoUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* S3 Badge */}
                  {isS3 ? (
                    <span className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> AWS S3
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Default Photo
                    </span>
                  )}

                  {/* Garment count badge */}
                  <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                    <Shirt className="w-3 h-3 text-blue-400" />
                    <span>{garmentCount} items</span>
                  </span>

                  {/* Upload Overlay while uploading */}
                  {isUploadingThis && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs gap-1.5">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                      <span className="font-bold">Uploading to S3...</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md">
                        {sub.categoryTag}
                      </span>

                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                        #{sub.sortOrder}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-[var(--heading-color)] line-clamp-1">
                      {sub.name}
                    </h4>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                    <div className="flex items-center gap-1.5">
                      {/* Upload Photo button */}
                      <button
                        type="button"
                        disabled={isUploadingThis}
                        onClick={() => handleCardUploadClick(sub.id)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--heading-color)] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <UploadCloud className="w-3 h-3 text-blue-600" />
                        <span>Upload Photo</span>
                      </button>

                      {/* Status Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(sub)}
                        title={sub.isActive ? 'Hide from catalog' : 'Make active'}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          sub.isActive
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                            : 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sub.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(sub)}
                        title="Edit subcategory details"
                        className="p-1.5 rounded-xl border border-[var(--border-color)] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSubcategory(sub)}
                        title="Delete subcategory"
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold text-sm">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--heading-color)]">
                    {editingSub ? `Edit Subcategory: ${editingSub.name}` : 'Add New Subcategory'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Configure name, category assignment, and upload photo to AWS S3
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. Formal Shirts, Sarees, Denim"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">
                    Master Category *
                  </label>
                  <select
                    value={modalForm.categoryTag}
                    onChange={(e) => setModalForm({ ...modalForm, categoryTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MENS">Men&apos;s Wear</option>
                    <option value="WOMENS">Women&apos;s Wear</option>
                    <option value="KIDS">Kids & Baby</option>
                    <option value="HOME_TEXTILES">Home Textiles</option>
                    <option value="FOOTWEAR">Footwear</option>
                    <option value="ACCESSORIES">Accessories</option>
                    <option value="BULK">Bulk Laundry</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={modalForm.sortOrder}
                    onChange={(e) => setModalForm({ ...modalForm, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)] space-y-2.5">
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleModalFileSelected}
                />

                <label className="font-bold text-[var(--heading-color)] block">
                  Subcategory Image (Stores to AWS S3)
                </label>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-[var(--border-color)] relative">
                    <img
                      src={
                        modalForm.imageUrl ||
                        getSubcategoryImageUrl(modalForm.name || 'default', modalForm.categoryTag)
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {modalUploadingS3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      disabled={modalUploadingS3}
                      onClick={() => modalFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {modalUploadingS3 ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to S3...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Choose Image File</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      Auto-compressed & stored directly in AWS S3 for customer app
                    </p>
                  </div>
                </div>

                {/* Direct URL Input */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-color)]">
                  <LinkIcon className="w-3 h-3 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={modalForm.imageUrl}
                    onChange={(e) => setModalForm({ ...modalForm, imageUrl: e.target.value })}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-[10px] font-mono text-[var(--heading-color)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--border-color)]">
                <div>
                  <span className="font-bold text-[var(--heading-color)] block text-xs">
                    Visibility in Customer App
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {modalForm.isActive ? 'Active and visible to customers' : 'Hidden from customer app'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalForm({ ...modalForm, isActive: !modalForm.isActive })}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    modalForm.isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {modalForm.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || modalUploadingS3}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingSub ? 'Save Changes' : 'Create Subcategory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
