'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { db } from '@/lib/db';
import { ClothType, ServicePriceItem } from '@/types';
import { 
  Search, Plus, Camera, Edit2, X, 
  RefreshCw, ShieldCheck, Link2, ExternalLink
} from 'lucide-react';

const MASTER_CATEGORIES = [
  { id: 'MENS', name: "Men's Wear", icon: '👔' },
  { id: 'WOMENS', name: "Women's Wear", icon: '👗' },
  { id: 'KIDS', name: 'Kids & Baby', icon: '👶' },
  { id: 'HOME_TEXTILES', name: 'Home Textiles', icon: '🏠' },
  { id: 'ALL', name: 'All Garments', icon: '✨' },
];

const SERVICE_FOCUS_OPTIONS = [
  { id: 'ALL', name: 'All Services (Full View)', icon: '✨', badge: null },
  { id: 'srv-m-steam-iron', name: 'Iron Only (Steam Press)', icon: '🔥', badge: 'DAILY' },
  { id: 'srv-m-dry-clean', name: 'Dry Cleaning', icon: '👔', badge: 'POPULAR' },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', icon: '👕', badge: null },
  { id: 'srv-m-wash-fold', name: 'Wash & Fold', icon: '🧺', badge: null },
];

const KEY_SERVICES = [
  { id: 'srv-m-steam-iron', name: 'Iron Only (Steam Press)', icon: '🔥' },
  { id: 'srv-m-dry-clean', name: 'Dry Clean', icon: '👔' },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', icon: '👕' },
  { id: 'srv-m-wash-fold', name: 'Wash & Fold', icon: '🧺' },
];

// Helper: Compress image in browser before sending to server/S3
function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
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
          if (!ctx) return resolve(event.target?.result as string);

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error("The selected file is not a valid image format or is corrupted. Please choose a real JPG, PNG, or WebP photo."));
    };
    reader.onerror = (err) => reject(err);
  });
}

export function UnifiedCatalogManager() {
  const { 
    clothTypes, 
    serviceMasters, 
    priceMatrix,
    addClothType,
    updateClothType,
    upsertPriceItem,
    showToast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('MENS');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('ALL');
  const [activeServiceFilter, setActiveServiceFilter] = useState<string>('srv-m-dry-clean');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingImageUrlCloth, setEditingImageUrlCloth] = useState<ClothType | null>(null);
  const [manualImageUrl, setManualImageUrl] = useState<string>('');

  const [editingPriceData, setEditingPriceData] = useState<{
    cloth: ClothType;
    serviceId: string;
    serviceName: string;
    currentPrice: number;
    expressPrice: number;
    turnaround: number;
  } | null>(null);

  const [uploadingClothId, setUploadingClothId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetClothForUpload, setTargetClothForUpload] = useState<ClothType | null>(null);

  // Filtered Garments
  const filteredClothes = useMemo(() => {
    return clothTypes.filter((c) => {
      // 1. Category filter
      if (activeCategory !== 'ALL' && c.categoryTag !== activeCategory) {
        return false;
      }

      // 2. Subcategory filter
      if (activeSubcategory !== 'ALL') {
        const sub = c.subCategory || (c as any).subcategory;
        if (sub !== activeSubcategory) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesSub = (c.subCategory || '').toLowerCase().includes(q);
        const matchesDesc = (c.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc) return false;
      }

      return true;
    });
  }, [clothTypes, activeCategory, activeSubcategory, searchQuery]);

  // Subcategories with live counts
  const subcategoriesWithCounts = useMemo(() => {
    const list = clothTypes.filter((c) => activeCategory === 'ALL' || c.categoryTag === activeCategory);
    const map = new Map<string, number>();
    list.forEach((c) => {
      const sub = c.subCategory || 'General';
      map.set(sub, (map.get(sub) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [clothTypes, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: clothTypes.length };
    MASTER_CATEGORIES.forEach((cat) => {
      if (cat.id !== 'ALL') {
        counts[cat.id] = clothTypes.filter((c) => c.categoryTag === cat.id).length;
      }
    });
    return counts;
  }, [clothTypes]);

  // Handle Photo Upload directly to AWS S3
  const handleTriggerUpload = (cloth: ClothType) => {
    setTargetClothForUpload(cloth);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetClothForUpload) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const cloth = targetClothForUpload;
    setUploadingClothId(cloth.id);

    try {
      showToast(`Compressing & uploading ${cloth.name} to AWS S3...`, 'info');

      // 1. Compress image to max 1200px / 85% quality (~150-250KB)
      const compressedBase64 = await compressImage(file, 1200, 0.85);

      // 2. Immediate optimistic preview
      updateClothType(cloth.id, { imageUrl: compressedBase64 });

      // 3. Upload to AWS S3 via Next.js endpoint
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: `${cloth.id}-${Date.now()}.jpg`,
        }),
      });

      const json = await res.json();
      const s3Url = json?.data?.s3Url;

      if (!res.ok || !s3Url) {
        throw new Error(json?.message || 'Failed to upload image to S3');
      }

      console.log('✅ AWS S3 Image URL:', s3Url);

      // 4. Update state with real permanent S3 URL
      updateClothType(cloth.id, { imageUrl: s3Url });
      db.updateClothType(cloth.id, { imageUrl: s3Url });

      showToast(`✅ Photo for ${cloth.name} uploaded to AWS S3!`, 'success');
    } catch (err: any) {
      console.error('S3 Upload Error:', err);
      showToast('S3 Upload failed: ' + err.message, 'error');
    } finally {
      setUploadingClothId(null);
      setTargetClothForUpload(null);
    }
  };

  // Manual URL Save
  const handleSaveManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageUrlCloth || !manualImageUrl.trim()) return;

    updateClothType(editingImageUrlCloth.id, { imageUrl: manualImageUrl.trim() });
    db.updateClothType(editingImageUrlCloth.id, { imageUrl: manualImageUrl.trim() });

    showToast(`Updated image URL for ${editingImageUrlCloth.name}!`, 'success');
    setEditingImageUrlCloth(null);
    setManualImageUrl('');
  };

  // Toggle Active Status
  const handleToggleActive = (cloth: ClothType) => {
    const newStatus = cloth.isActive === false ? true : false;
    updateClothType(cloth.id, { isActive: newStatus });
    showToast(`${cloth.name} marked as ${newStatus ? 'Active' : 'Hidden'}`, 'info');
  };

  // Open Quick Price Inspector
  const handleOpenPriceModal = (cloth: ClothType, serviceId: string) => {
    const srv = serviceMasters.find((s) => s.id === serviceId) || { name: 'Dry Cleaning' };
    const priceItem = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === serviceId);

    setEditingPriceData({
      cloth,
      serviceId,
      serviceName: srv.name.replace(' Only', ''),
      currentPrice: priceItem?.price || 80,
      expressPrice: priceItem?.expressPrice || Math.round((priceItem?.price || 80) * 1.5),
      turnaround: priceItem?.turnaroundHours || 48,
    });
  };

  // Save Price
  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceData) return;

    const { cloth, serviceId, currentPrice, expressPrice, turnaround } = editingPriceData;

    const updatedItem: ServicePriceItem = {
      id: `pr-${cloth.id}-${serviceId}`,
      clothTypeId: cloth.id,
      clothName: cloth.name,
      clothIcon: cloth.icon,
      categoryTag: cloth.categoryTag,
      serviceId,
      serviceName: editingPriceData.serviceName,
      price: currentPrice,
      expressPrice,
      turnaroundHours: turnaround,
      isActive: true,
      isAvailable: true,
    };

    upsertPriceItem(updatedItem);

    showToast(`${cloth.name} ${editingPriceData.serviceName} price set to ₹${currentPrice}!`, 'success');
    setEditingPriceData(null);
  };

  return (
    <div className="space-y-6">
      {/* Hidden Global File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[var(--heading-color)]">
              Garments & Services Catalog
            </h2>
            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-300">
              {filteredClothes.length} of {clothTypes.length} Core Items
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your clean commercial laundry catalog, upload high-res product photos to AWS S3, and configure real-time rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments (e.g. Shirt, Jeans)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--heading-color)] w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Tier 1: Master Category Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-3 shadow-xs">
        <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider block mb-2 px-1">
          1. Select Master Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {MASTER_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubcategory('ALL');
                }}
                className={`p-3 rounded-xl text-left font-bold transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-[var(--heading-color)] border-[var(--border-color)] hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs">{cat.name}</span>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Subcategory Pills Filter */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-3 shadow-xs">
        <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider block mb-2 px-1">
          2. Filter by Subcategory
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveSubcategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubcategory === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
            }`}
          >
            All Subcategories ({filteredClothes.length})
          </button>
          {subcategoriesWithCounts.map((sub) => (
            <button
              key={sub.name}
              type="button"
              onClick={() => setActiveSubcategory(sub.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeSubcategory === sub.name
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
              }`}
            >
              {sub.name} ({sub.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tier 3: Service Focus Filter */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <label className="text-[11px] font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider block">
              3. Service Focus Mode
            </label>
            <p className="text-[11px] text-blue-700 dark:text-blue-400">
              Select a service to highlight its rates and enable 1-click price edits across all garments
            </p>
          </div>
          {activeServiceFilter !== 'ALL' && (
            <span className="text-[11px] font-extrabold text-blue-800 dark:text-blue-200 bg-white/80 dark:bg-blue-900/60 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-700 shadow-xs">
              Active Focus: {SERVICE_FOCUS_OPTIONS.find((s) => s.id === activeServiceFilter)?.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SERVICE_FOCUS_OPTIONS.map((s) => {
            const isSelected = activeServiceFilter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveServiceFilter(s.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/40 scale-102'
                    : 'bg-white dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)] border-[var(--border-color)] hover:border-blue-400'
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span>{s.name}</span>
                {s.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                      isSelected ? 'bg-white text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Garments Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredClothes.map((cloth) => {
          // Focus rate
          const focusedPrice = priceMatrix.find(
            (p) => p.clothTypeId === cloth.id && p.serviceId === activeServiceFilter
          );
          const focusedPriceVal = focusedPrice?.price || (activeServiceFilter === 'srv-m-dry-clean' ? 80 : 25);
          const isS3Live = cloth.imageUrl?.includes('s3.ap-south-1.amazonaws.com');

          return (
            <div
              key={cloth.id}
              className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Card Photo Header */}
              <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                {cloth.imageUrl && !cloth.imageUrl.includes('Invalid signature') ? (
                  <img
                    key={cloth.imageUrl}
                    src={cloth.imageUrl}
                    alt={cloth.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.warn('Image load error for', cloth.name, cloth.imageUrl);
                      // Do not replace with blue dotted shirt! Just keep natural or hide broken
                      (e.target as HTMLImageElement).style.opacity = '0.5';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                    <span className="text-4xl">{cloth.icon}</span>
                    <span className="text-xs mt-1 font-bold">{cloth.name}</span>
                  </div>
                )}

                {/* S3 Cloud Tag */}
                {isS3Live && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md">
                    <ShieldCheck className="w-3 h-3" />
                    <span>AWS S3 Live</span>
                  </div>
                )}

                {/* Active / Hidden Status */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(cloth)}
                  className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs transition-colors cursor-pointer ${
                    cloth.isActive !== false
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                  title="Click to toggle Active status"
                >
                  {cloth.isActive !== false ? 'Active' : 'Hidden'}
                </button>

                {/* Upload & Link Buttons Overlay */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImageUrlCloth(cloth);
                      setManualImageUrl(cloth.imageUrl || '');
                    }}
                    className="bg-black/75 hover:bg-black text-white p-1.5 rounded-xl shadow-md backdrop-blur-xs transition-all cursor-pointer hover:scale-105"
                    title="Paste direct Image URL"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(cloth)}
                    disabled={uploadingClothId === cloth.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                  >
                    {uploadingClothId === cloth.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingClothId === cloth.id ? 'Uploading...' : 'Upload Photo'}</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-sm font-black text-[var(--heading-color)] flex items-center gap-1.5">
                      <span>{cloth.icon}</span>
                      <span>{cloth.name}</span>
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {cloth.subCategory || 'General'}
                  </span>
                  {cloth.description && (
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-1">
                      {cloth.description}
                    </p>
                  )}
                </div>

                {/* Focused Service Banner (e.g. Dry Cleaning or Iron Only) */}
                {activeServiceFilter !== 'ALL' && (
                  <div
                    onClick={() => handleOpenPriceModal(cloth, activeServiceFilter)}
                    className="mt-3 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-between cursor-pointer transition-all shadow-xs group/banner"
                    title="Click to edit this price"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {SERVICE_FOCUS_OPTIONS.find((s) => s.id === activeServiceFilter)?.icon}
                      </span>
                      <div>
                        <span className="text-[9px] font-black uppercase text-blue-200 block tracking-wider">
                          {SERVICE_FOCUS_OPTIONS.find((s) => s.id === activeServiceFilter)?.name} Rate
                        </span>
                        <span className="text-xs font-black text-white">Active Price</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-white">₹{focusedPriceVal}</span>
                      <Edit2 className="w-3 h-3 text-blue-200 group-hover/banner:text-white" />
                    </div>
                  </div>
                )}

                {/* 4-Service Quick Price Rows */}
                <div className="mt-3 pt-2 border-t border-[var(--border-color)] space-y-1">
                  {KEY_SERVICES.map((srv) => {
                    const priceItem = priceMatrix.find(
                      (p) => p.clothTypeId === cloth.id && p.serviceId === srv.id
                    );
                    const isAvailable = priceItem ? priceItem.isAvailable !== false && priceItem.price > 0 : false;
                    const isFocused = activeServiceFilter === srv.id;

                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleOpenPriceModal(cloth, srv.id)}
                        className={`w-full flex items-center justify-between text-[11px] py-1 px-1.5 rounded-md transition-all cursor-pointer text-left group/price ${
                          isFocused
                            ? 'bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-[var(--text-secondary)]'
                        }`}
                        title={`Click to edit ${srv.name} price`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{srv.icon}</span>
                          <span>{srv.name}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[var(--heading-color)] group-hover/price:text-blue-600 transition-colors">
                            {isAvailable && priceItem ? `₹${priceItem.price}` : '—'}
                          </span>
                          <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover/price:opacity-100 text-blue-600 transition-opacity" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Image URL Modal */}
      {editingImageUrlCloth && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Edit Garment Photo URL
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {editingImageUrlCloth.icon} {editingImageUrlCloth.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingImageUrlCloth(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualUrl} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Image URL (AWS S3 or Web Link)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/..."
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-medium text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {manualImageUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-[var(--border-color)]">
                  <img
                    src={manualImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setEditingImageUrlCloth(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Save Photo URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Price Inspector Modal */}
      {editingPriceData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Edit {editingPriceData.serviceName} Rate
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {editingPriceData.cloth.icon} {editingPriceData.cloth.name} ({editingPriceData.cloth.categoryLabel || editingPriceData.cloth.categoryTag})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPriceData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingPriceData.currentPrice}
                  onChange={(e) =>
                    setEditingPriceData({
                      ...editingPriceData,
                      currentPrice: Number(e.target.value),
                      expressPrice: Math.round(Number(e.target.value) * 1.5),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-sm font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Express Delivery Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingPriceData.expressPrice}
                  onChange={(e) =>
                    setEditingPriceData({ ...editingPriceData, expressPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-sm font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Turnaround Hours
                </label>
                <input
                  type="number"
                  min="6"
                  required
                  value={editingPriceData.turnaround}
                  onChange={(e) =>
                    setEditingPriceData({ ...editingPriceData, turnaround: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-sm font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setEditingPriceData(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Garment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Add New Garment to Catalog
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Configure garment details and default prices across services
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const icon = (form.elements.namedItem('icon') as HTMLInputElement).value || '👔';
                const cat = (form.elements.namedItem('categoryTag') as HTMLSelectElement).value;
                const sub = (form.elements.namedItem('subCategory') as HTMLInputElement).value || 'General';
                const si = Number((form.elements.namedItem('siPrice') as HTMLInputElement).value) || 20;
                const dc = Number((form.elements.namedItem('dcPrice') as HTMLInputElement).value) || 80;
                const wi = Number((form.elements.namedItem('wiPrice') as HTMLInputElement).value) || 49;
                const wf = Number((form.elements.namedItem('wfPrice') as HTMLInputElement).value) || 35;

                const newId = `cloth-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
                const newCloth: ClothType = {
                  id: newId,
                  name,
                  icon,
                  categoryTag: cat,
                  categoryLabel: cat === 'MENS' ? "Men's Clothing" : cat === 'WOMENS' ? "Women's Clothing" : cat === 'KIDS' ? "Kids & Baby" : "Home Textiles",
                  subCategory: sub,
                  description: `${name} laundry care & finishing.`,
                  imageUrl: `https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/garments/${newId}.jpg`,
                  isActive: true,
                  sortOrder: 99,
                };

                addClothType(newCloth);

                const newPriceItems: ServicePriceItem[] = [
                  { id: `pr-${newId}-si`, clothTypeId: newId, clothName: name, clothIcon: icon, categoryTag: cat, serviceId: 'srv-m-steam-iron', serviceName: 'Iron Only (Steam Press)', price: si, expressPrice: Math.round(si * 1.5), turnaroundHours: 18, isActive: true },
                  { id: `pr-${newId}-dc`, clothTypeId: newId, clothName: name, clothIcon: icon, categoryTag: cat, serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: dc, expressPrice: Math.round(dc * 1.5), turnaroundHours: 48, isActive: true },
                  { id: `pr-${newId}-wi`, clothTypeId: newId, clothName: name, clothIcon: icon, categoryTag: cat, serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: wi, expressPrice: Math.round(wi * 1.5), turnaroundHours: 36, isActive: true },
                  { id: `pr-${newId}-wf`, clothTypeId: newId, clothName: name, clothIcon: icon, categoryTag: cat, serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: wf, expressPrice: Math.round(wf * 1.5), turnaroundHours: 24, isActive: true },
                ];

                newPriceItems.forEach((p) => upsertPriceItem(p));

                showToast(`Added ${name} to catalog!`, 'success');
                setShowAddModal(false);
              }}
              className="mt-4 space-y-3"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Garment Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Linen Kurta"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Icon Emoji
                  </label>
                  <input
                    name="icon"
                    defaultValue="👔"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Category
                  </label>
                  <select
                    name="categoryTag"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MENS">Men's Wear</option>
                    <option value="WOMENS">Women's Wear</option>
                    <option value="KIDS">Kids & Baby</option>
                    <option value="HOME_TEXTILES">Home Textiles</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Subcategory
                  </label>
                  <input
                    name="subCategory"
                    defaultValue="Shirts"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Default Service Prices (₹)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">🔥 Iron Only</span>
                    <input
                      type="number"
                      name="siPrice"
                      defaultValue={20}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">👔 Dry Clean</span>
                    <input
                      type="number"
                      name="dcPrice"
                      defaultValue={80}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">👕 Wash & Iron</span>
                    <input
                      type="number"
                      name="wiPrice"
                      defaultValue={49}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">🧺 Wash & Fold</span>
                    <input
                      type="number"
                      name="wfPrice"
                      defaultValue={35}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Create Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
