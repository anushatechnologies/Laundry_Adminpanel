'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { db } from '@/lib/db';
import { ClothType, ServicePriceItem } from '@/types';
import { 
  Search, Plus, Camera, Edit2, X, 
  RefreshCw, ShieldCheck, Link2, ExternalLink, Layers, Sparkles, Tag, Clock, ArrowRight, Settings
} from 'lucide-react';
import { 
  getAdminCategories, 
  updateAdminCategory, 
  updateAdminServiceMaster, 
  getAdminCatalog 
} from '@/lib/api';
import { CategorySubcategoryModal } from './CategorySubcategoryModal';

const INITIAL_MASTER_CATEGORIES = [
  { 
    id: 'MENS', 
    name: "Men's Wear", 
    icon: '👔', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/mens-wear.jpg', 
    description: 'Shirts, T-Shirts, Trousers, Suits, Blazers & Jackets.' 
  },
  { 
    id: 'WOMENS', 
    name: "Women's Wear", 
    icon: '👗', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/womens-wear.jpg', 
    description: 'Sarees, Kurtis, Suits, Dresses, Gowns & Tops.' 
  },
  { 
    id: 'KIDS', 
    name: 'Kids & Baby', 
    icon: '👦', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/kids-baby.jpg', 
    description: 'School Uniforms, Frocks, Baby Rompers & Daily Wear.' 
  },
  { 
    id: 'HOME_TEXTILES', 
    name: 'Home Textiles', 
    icon: '🏡', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/home-textiles.jpg', 
    description: 'Bedsheets, Mink Blankets, Razais, Comforters, Curtains & Towels.' 
  },
  { 
    id: 'BRIDAL', 
    name: 'Premium & Bridal', 
    icon: '🥻', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/wedding-silk.jpg', 
    description: 'Bridal Lehengas, Heavy Zari Sarees, Gowns & Sherwanis.' 
  },
  { 
    id: 'SPECIAL', 
    name: 'Deep Treatment', 
    icon: '✨', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/winter-wear.jpg', 
    description: 'Mattress, Carpet, Rug & Sofa Cover Deep Extraction.' 
  },
];

const INITIAL_SERVICES_MASTERS = [
  { 
    id: 'srv-m-steam-iron', 
    name: 'Iron Only (Steam Press)', 
    icon: '🔥', 
    pricingType: 'PER_ITEM', 
    turnaroundHours: 18, 
    description: 'High-pressure wrinkle removal, sharp crease setting & crisp hanger finish.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/steam-iron.jpg' 
  },
  { 
    id: 'srv-m-wash-fold', 
    name: 'Wash & Fold', 
    icon: '🧺', 
    pricingType: 'PER_KG', 
    baseKgPrice: 60, 
    turnaroundHours: 24, 
    description: 'Hygienic wash, tumble dry, and neat compact fold for daily garments.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/wash-and-fold.jpg' 
  },
  { 
    id: 'srv-m-wash-iron', 
    name: 'Wash & Steam Iron', 
    icon: '👔', 
    pricingType: 'PER_KG', 
    baseKgPrice: 85, 
    turnaroundHours: 36, 
    description: 'Eco-wash + industrial steam pressing on custom hangers.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/wash-and-iron.jpg' 
  },
  { 
    id: 'srv-m-dry-clean', 
    name: 'Dry Cleaning', 
    icon: '🧥', 
    pricingType: 'PER_ITEM', 
    turnaroundHours: 48, 
    description: 'Hydrocarbon solvent treatment with breathable garment cover & shape retention.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/dry-cleaning.jpg' 
  },
  { 
    id: 'srv-m-charak', 
    name: 'Saree Polishing & Charak', 
    icon: '✨', 
    pricingType: 'PER_ITEM', 
    turnaroundHours: 48, 
    description: 'Traditional starching, roll pressing & zari shine revival for silk sarees.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/saree-charak.jpg' 
  },
  { 
    id: 'srv-m-starch', 
    name: 'Starch & Crisp Finish', 
    icon: '👔', 
    pricingType: 'PER_ITEM', 
    turnaroundHours: 24, 
    description: 'Stiff starching for crisp cotton shirts, dhotis & school uniforms.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/starch-finish.jpg' 
  },
  { 
    id: 'srv-m-spa', 
    name: 'Deep Shoe & Leather Spa', 
    icon: '👞', 
    pricingType: 'PER_ITEM', 
    turnaroundHours: 48, 
    description: 'Ultrasonic stain treatment and antibacterial ozone sanitization for footwear.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/shoe-spa.jpg' 
  },
  { 
    id: 'srv-m-express', 
    name: 'Express Emergency Laundry', 
    icon: '⚡', 
    pricingType: 'PER_KG', 
    baseKgPrice: 120, 
    turnaroundHours: 12, 
    description: 'Dedicated machine slot with guaranteed same-day 12-hour turnaround.', 
    imageUrl: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/express-emergency.jpg' 
  },
];

const SERVICE_FOCUS_OPTIONS = [
  { id: 'ALL', name: 'All Services (Full View)', icon: '✨', badge: null },
  { id: 'srv-m-steam-iron', name: 'Iron Only (Steam Press)', icon: '🔥', badge: 'DAILY' },
  { id: 'srv-m-dry-clean', name: 'Dry Cleaning', icon: '🧥', badge: 'POPULAR' },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', icon: '👔', badge: null },
  { id: 'srv-m-wash-fold', name: 'Wash & Fold', icon: '🧺', badge: null },
];

const KEY_SERVICES = [
  { id: 'srv-m-steam-iron', name: 'Iron Only (Steam Press)', icon: '🔥' },
  { id: 'srv-m-dry-clean', name: 'Dry Clean', icon: '🧥' },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', icon: '👔' },
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

  // Top-level Navigation Mode: Garments | Categories | Services
  const [viewMode, setViewMode] = useState<'GARMENTS' | 'CATEGORIES' | 'SERVICES'>('GARMENTS');

  // Master Categories State (with live photo overrides)
  const [categories, setCategories] = useState(INITIAL_MASTER_CATEGORIES);

  // Services State (with live photo overrides)
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES_MASTERS);

  // Category & Subcategory Management Modal
  const [showCatSubModal, setShowCatSubModal] = useState(false);

  // Load live categories and service masters from API & S3
  const loadLiveCatalog = async () => {
    try {
      const [catsRes, catalogRes] = await Promise.allSettled([
        getAdminCategories(),
        getAdminCatalog(),
      ]);

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        const remoteCats = catsRes.value;
        const mapped = remoteCats.map((rc: any) => {
          const localMatch = INITIAL_MASTER_CATEGORIES.find(
            (c) =>
              c.id === rc.id ||
              c.id.toLowerCase().replace(/_/g, '-') === rc.slug ||
              (c.id === 'MENS' && rc.slug === 'mens-wear') ||
              (c.id === 'WOMENS' && rc.slug === 'womens-wear') ||
              (c.id === 'KIDS' && rc.slug === 'kids-wear') ||
              (c.id === 'HOME_TEXTILES' && rc.slug === 'home-textiles') ||
              (c.id === 'BRIDAL' && rc.slug === 'bridal-wear') ||
              (c.id === 'SPECIAL' && rc.slug === 'special-cleaning')
          );
          return {
            id: localMatch?.id || rc.id,
            name: rc.name || localMatch?.name || 'Category',
            icon: rc.icon || localMatch?.icon || '🧺',
            imageUrl: rc.imageUrl || rc.image || localMatch?.imageUrl || '',
            description: rc.description || localMatch?.description || '',
          };
        });
        setCategories(mapped);
      }

      if (catalogRes.status === 'fulfilled' && catalogRes.value) {
        const catData = catalogRes.value;
        if (Array.isArray(catData.serviceMasters) && catData.serviceMasters.length > 0) {
          setServicesList((prev) => {
            return prev.map((localSrv) => {
              const found = catData.serviceMasters.find((sm: any) => sm.id === localSrv.id);
              if (found && (found.imageUrl || found.image)) {
                return { ...localSrv, imageUrl: found.imageUrl || found.image };
              }
              return localSrv;
            });
          });
        }
      }
    } catch (err) {
      console.warn('Could not load live catalog updates', err);
    }
  };

  useEffect(() => {
    loadLiveCatalog();
  }, []);

  // Filter States for Garments View
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('ALL');
  const [activeServiceFocus, setActiveServiceFocus] = useState<string>('srv-m-dry-clean');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Uploading State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    type: 'CLOTH' | 'CATEGORY' | 'SERVICE';
    id: string;
    name: string;
  } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Manual URL Modal
  const [editingUrlTarget, setEditingUrlTarget] = useState<{
    type: 'CLOTH' | 'CATEGORY' | 'SERVICE';
    id: string;
    name: string;
    icon?: string;
    currentUrl?: string;
  } | null>(null);
  const [manualImageUrl, setManualImageUrl] = useState('');

  // Add Garment Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick Price Inspector Modal
  const [editingPriceData, setEditingPriceData] = useState<{
    cloth: ClothType;
    serviceId: string;
    serviceName: string;
    currentPrice: number;
    expressPrice: number;
    turnaround: number;
  } | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: clothTypes.length };
    categories.forEach((cat) => {
      counts[cat.id] = clothTypes.filter((c) => c.categoryTag === cat.id).length;
    });
    return counts;
  }, [clothTypes, categories]);

  // Subcategories for current active category
  const availableSubcategories = useMemo(() => {
    const relevant = activeCategory === 'ALL'
      ? clothTypes
      : clothTypes.filter((c) => c.categoryTag === activeCategory);

    const subs = new Set<string>();
    relevant.forEach((c) => {
      if (c.subCategory) subs.add(c.subCategory);
    });
    return Array.from(subs).sort();
  }, [clothTypes, activeCategory]);

  // Filtered Garment Items
  const filteredClothes = useMemo(() => {
    return clothTypes.filter((cloth) => {
      if (activeCategory !== 'ALL' && cloth.categoryTag !== activeCategory) {
        return false;
      }
      if (activeSubcategory !== 'ALL' && cloth.subCategory !== activeSubcategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cloth.name.toLowerCase().includes(q);
        const matchesSub = (cloth.subCategory || '').toLowerCase().includes(q);
        const matchesDesc = (cloth.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc) return false;
      }
      return true;
    });
  }, [clothTypes, activeCategory, activeSubcategory, searchQuery]);

  // Trigger Upload for any Entity
  const handleTriggerUpload = (type: 'CLOTH' | 'CATEGORY' | 'SERVICE', id: string, name: string) => {
    setUploadTarget({ type, id, name });
    fileInputRef.current?.click();
  };

  // Process File Selection & Direct AWS S3 Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const isImageExt = /\.(jpe?g|png|webp|gif|jfif|bmp|svg)$/i.test(file.name);
    if (!file.type.startsWith('image/') && !isImageExt) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const { type, id, name } = uploadTarget;
    setUploadingId(id);

    try {
      showToast(`Compressing & uploading photo for ${name} to AWS S3...`, 'info');

      // 1. Compress image to max 1200px / 85% quality (~150-250KB)
      const compressedBase64 = await compressImage(file, 1200, 0.85);

      // 2. Upload to AWS S3 via Next.js endpoint
      const prefix = type === 'CATEGORY' ? 'cat' : type === 'SERVICE' ? 'srv' : 'cloth';
      const cleanId = id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: `${prefix}-${cleanId}-${Date.now()}.jpg`,
        }),
      });

      const json = await res.json();
      const s3Url = json?.data?.s3Url;

      if (!res.ok || !s3Url) {
        throw new Error(json?.message || 'Failed to upload image to S3');
      }

      console.log(`✅ AWS S3 Image URL for [${type}] ${name}:`, s3Url);

      // 3. Update State & S3 Cloud Overrides
      if (type === 'CLOTH') {
        updateClothType(id, { imageUrl: s3Url });
        db.updateClothType(id, { imageUrl: s3Url });
      } else if (type === 'CATEGORY') {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, imageUrl: s3Url } : c)));
        try {
          await updateAdminCategory(id, { imageUrl: s3Url });
        } catch (err) {
          console.warn('Could not sync category update to MySQL API', err);
        }
        try {
          await fetch('/api/catalog-overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryTag: id, categoryImageUrl: s3Url }),
          });
        } catch (err) {
          console.warn('Could not sync category override to S3', err);
        }
      } else if (type === 'SERVICE') {
        setServicesList((prev) => prev.map((s) => (s.id === id ? { ...s, imageUrl: s3Url } : s)));
        try {
          await updateAdminServiceMaster(id, { imageUrl: s3Url });
        } catch (err) {
          console.warn('Could not sync service master update to MySQL API', err);
        }
        try {
          await fetch('/api/catalog-overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId: id, serviceImageUrl: s3Url }),
          });
        } catch (err) {
          console.warn('Could not sync service override to S3', err);
        }
      }

      showToast(`✅ Photo for ${name} uploaded to AWS S3!`, 'success');
    } catch (err: any) {
      console.error('S3 Upload Error:', err);
      showToast('S3 Upload failed: ' + err.message, 'error');
    } finally {
      setUploadingId(null);
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Manual URL Save
  const handleSaveManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUrlTarget || !manualImageUrl.trim()) return;

    const url = manualImageUrl.trim();
    const { type, id, name } = editingUrlTarget;

    if (type === 'CLOTH') {
      updateClothType(id, { imageUrl: url });
      db.updateClothType(id, { imageUrl: url });
    } else if (type === 'CATEGORY') {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, imageUrl: url } : c)));
      try {
        await updateAdminCategory(id, { imageUrl: url });
      } catch (err) {}
      try {
        await fetch('/api/catalog-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryTag: id, categoryImageUrl: url }),
        });
      } catch (err) {}
    } else if (type === 'SERVICE') {
      setServicesList((prev) => prev.map((s) => (s.id === id ? { ...s, imageUrl: url } : s)));
      try {
        await updateAdminServiceMaster(id, { imageUrl: url });
      } catch (err) {}
      try {
        await fetch('/api/catalog-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceId: id, serviceImageUrl: url }),
        });
      } catch (err) {}
    }

    showToast(`Updated image URL for ${name}!`, 'success');
    setEditingUrlTarget(null);
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

  // Save Price from Inspector
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
              {clothTypes.length} Core Items • 4 Categories • 8 Services
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your clean commercial laundry catalog, upload high-res photography to AWS S3 for Products, Categories and Services.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCatSubModal(true)}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Categories & Subcategories</span>
          </button>

          {viewMode === 'GARMENTS' && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Primary Section Mode Selector: Garments / Categories / Services */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => setViewMode('GARMENTS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === 'GARMENTS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
          }`}
        >
          <span>👔 Products & Garments</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
            viewMode === 'GARMENTS' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {clothTypes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('CATEGORIES')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === 'CATEGORIES'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
          }`}
        >
          <span>🗂️ Categories Photography</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
            viewMode === 'CATEGORIES' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {categories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('SERVICES')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === 'SERVICES'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
          }`}
        >
          <span>🧺 Services Photography</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
            viewMode === 'SERVICES' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {servicesList.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CATEGORIES PHOTOGRAPHY VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'CATEGORIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black text-[var(--heading-color)]">
                Master Category Banners & Photography
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Upload direct high-definition photography to AWS S3 for customer app home category cards.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {categories.length} Master Categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Header with Live S3 Tag */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/mens-wear.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {cat.icon}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <ShieldCheck className="w-3 h-3" /> AWS S3 Live
                      </span>
                      <span className="text-2xl drop-shadow-md">{cat.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white drop-shadow-sm">{cat.name}</h4>
                      <p className="text-[11px] text-slate-200 font-medium line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-bold">Active Garments:</span>
                    <span className="font-black text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                      {categoryCounts[cat.id] || 0} Products
                    </span>
                  </div>

                  {/* Photo Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      disabled={uploadingId === cat.id}
                      onClick={() => handleTriggerUpload('CATEGORY', cat.id, cat.name)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{uploadingId === cat.id ? 'Uploading S3...' : 'Upload Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingUrlTarget({ 
                          type: 'CATEGORY', 
                          id: cat.id, 
                          name: cat.name, 
                          icon: cat.icon,
                          currentUrl: cat.imageUrl || '' 
                        });
                        setManualImageUrl(cat.imageUrl || '');
                      }}
                      className="p-2 border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--heading-color)] rounded-xl transition-all cursor-pointer"
                      title="Paste Image URL"
                    >
                      <Link2 className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SERVICES PHOTOGRAPHY VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'SERVICES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black text-[var(--heading-color)]">
                Laundry Services Photography & Masters
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Manage high-res cover photos for customer service selection (Dry Clean, Steam Iron, Wash & Fold, etc.)
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {servicesList.length} Active Services
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicesList.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Header with Live S3 Tag */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                  {srv.imageUrl ? (
                    <img
                      src={srv.imageUrl}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/services/dry-cleaning.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {srv.icon}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <Clock className="w-3 h-3" /> {srv.turnaroundHours}h TAT
                      </span>
                      <span className="text-2xl drop-shadow-md">{srv.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white drop-shadow-sm">{srv.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        {srv.pricingType === 'PER_KG' ? 'Per Kilogram' : 'Per Item'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Photo Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      disabled={uploadingId === srv.id}
                      onClick={() => handleTriggerUpload('SERVICE', srv.id, srv.name)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{uploadingId === srv.id ? 'Uploading...' : 'Upload Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingUrlTarget({ 
                          type: 'SERVICE', 
                          id: srv.id, 
                          name: srv.name, 
                          icon: srv.icon,
                          currentUrl: srv.imageUrl || '' 
                        });
                        setManualImageUrl(srv.imageUrl || '');
                      }}
                      className="p-2 border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--heading-color)] rounded-xl transition-all cursor-pointer"
                      title="Paste Image URL"
                    >
                      <Link2 className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PRODUCTS & GARMENTS VIEW (72 Commercial Items) */}
      {/* ========================================================================= */}
      {viewMode === 'GARMENTS' && (
        <>
          {/* Tier 1: Master Category Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">
                1. Select Master Category
              </label>
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                Click 📷 on any chip to change Category banner photo
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.concat([{ id: 'ALL', name: 'All Garments', icon: '✨', imageUrl: '', description: '' }]).map((cat) => {
                const isSelected = activeCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <div
                    key={cat.id}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-[var(--heading-color)] border-[var(--border-color)] hover:border-blue-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setActiveSubcategory('ALL');
                      }}
                      className="flex items-center gap-2 text-left cursor-pointer flex-1 min-w-0"
                    >
                      <span className="text-base shrink-0">{cat.icon}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate">{cat.name}</span>
                        <span className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {count} items
                        </span>
                      </div>
                    </button>

                    {cat.id !== 'ALL' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerUpload('CATEGORY', cat.id, cat.name);
                        }}
                        className={`p-1.5 rounded-lg transition-all ml-1 ${
                          isSelected 
                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'
                        }`}
                        title={`Upload Photo for ${cat.name}`}
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier 2: Subcategory Pills Filter */}
          {availableSubcategories.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-3 shadow-xs">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider block mb-2 px-1">
                2. Filter by Subcategory
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setActiveSubcategory('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeSubcategory === 'ALL'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  All Subcategories ({filteredClothes.length})
                </button>
                {availableSubcategories.map((sub) => {
                  const subCount = clothTypes.filter(
                    (c) => (activeCategory === 'ALL' || c.categoryTag === activeCategory) && c.subCategory === sub
                  ).length;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeSubcategory === sub
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                      }`}
                    >
                      <span>{sub}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeSubcategory === sub ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                      }`}>
                        {subCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tier 3: Service Focus Mode */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider block mb-1 px-1">
                3. Service Focus Mode
              </label>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Select a service to highlight its rates and enable 1-click price edits across all garments
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {SERVICE_FOCUS_OPTIONS.map((srv) => {
                const isSelected = activeServiceFocus === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setActiveServiceFocus(srv.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-[var(--border-color)] text-[var(--heading-color)] hover:border-blue-300'
                    }`}
                  >
                    <span>{srv.icon}</span>
                    <span>{srv.name}</span>
                    {srv.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {srv.badge}
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
              // Find prices for key services
              const dcPrice = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === 'srv-m-dry-clean')?.price || 80;
              const siPrice = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === 'srv-m-steam-iron')?.price || 20;
              const wiPrice = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === 'srv-m-wash-iron')?.price || 49;
              const wfPrice = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === 'srv-m-wash-fold')?.price || 35;

              const isUploadingThis = uploadingId === cloth.id;

              return (
                <div
                  key={cloth.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    cloth.isActive === false
                      ? 'opacity-60 border-dashed border-slate-300 dark:border-slate-800'
                      : 'border-[var(--border-color)]'
                  }`}
                >
                  <div>
                    {/* Image Header with Camera & Link Controls */}
                    <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                      {cloth.imageUrl && !cloth.imageUrl.includes('Invalid signature') ? (
                        <img
                          key={cloth.imageUrl}
                          src={cloth.imageUrl}
                          alt={cloth.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/garments/cloth-shirt.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                          <span className="text-4xl">{cloth.icon}</span>
                          <span className="text-[10px] font-bold">No Photo</span>
                        </div>
                      )}

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3" /> AWS S3 Live
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(cloth)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all shadow-xs ${
                            cloth.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300'
                          }`}
                        >
                          {cloth.isActive !== false ? 'Active' : 'Hidden'}
                        </button>
                      </div>

                      {/* Bottom Action Bar on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={isUploadingThis}
                          onClick={() => handleTriggerUpload('CLOTH', cloth.id, cloth.name)}
                          className="px-2.5 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Camera className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isUploadingThis ? 'Uploading...' : 'Upload Photo'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingUrlTarget({ 
                              type: 'CLOTH', 
                              id: cloth.id, 
                              name: cloth.name, 
                              icon: cloth.icon,
                              currentUrl: cloth.imageUrl || '' 
                            });
                            setManualImageUrl(cloth.imageUrl || '');
                          }}
                          className="p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-all cursor-pointer backdrop-blur-xs"
                          title="Paste direct image URL"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Garment Title & Subcategory */}
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h3 className="text-sm font-black text-[var(--heading-color)] flex items-center gap-1.5">
                            <span>{cloth.icon}</span>
                            <span>{cloth.name}</span>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                              {cloth.subCategory || 'General'}
                            </span>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              • {cloth.categoryLabel || cloth.categoryTag}
                            </span>
                          </div>
                        </div>
                      </div>

                      {cloth.description && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                          {cloth.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4-Tier Service Rate Grid */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)]">
                    <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider mb-2 flex items-center justify-between">
                      <span>Service Rates</span>
                      <span className="text-[9px] font-medium text-slate-400">Click to edit rate</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Dry Clean */}
                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(cloth, 'srv-m-dry-clean')}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          activeServiceFocus === 'srv-m-dry-clean'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-[var(--border-color)] hover:border-blue-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold flex items-center gap-1">
                          <span>🧥</span> Dry Clean
                        </span>
                        <span className="text-xs font-black">₹{dcPrice}</span>
                      </button>

                      {/* Iron Only */}
                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(cloth, 'srv-m-steam-iron')}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          activeServiceFocus === 'srv-m-steam-iron'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-[var(--border-color)] hover:border-blue-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold flex items-center gap-1">
                          <span>🔥</span> Steam Iron
                        </span>
                        <span className="text-xs font-black">₹{siPrice}</span>
                      </button>

                      {/* Wash & Steam Iron */}
                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(cloth, 'srv-m-wash-iron')}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          activeServiceFocus === 'srv-m-wash-iron'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-[var(--border-color)] hover:border-blue-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold flex items-center gap-1">
                          <span>👔</span> Wash+Iron
                        </span>
                        <span className="text-xs font-black">₹{wiPrice}</span>
                      </button>

                      {/* Wash & Fold */}
                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(cloth, 'srv-m-wash-fold')}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          activeServiceFocus === 'srv-m-wash-fold'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-[var(--border-color)] hover:border-blue-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold flex items-center gap-1">
                          <span>🧺</span> Wash+Fold
                        </span>
                        <span className="text-xs font-black">₹{wfPrice}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Manual Image URL Input (Supports Cloth, Category & Service) */}
      {/* ========================================================================= */}
      {editingUrlTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Update {editingUrlTarget.type === 'CATEGORY' ? 'Category' : editingUrlTarget.type === 'SERVICE' ? 'Service' : 'Garment'} Photo
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {editingUrlTarget.icon} {editingUrlTarget.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUrlTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualUrl} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Image URL (AWS S3 or Web Image)
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
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)]">
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
                  onClick={() => setEditingUrlTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  Save Photo URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Quick Price Inspector */}
      {/* ========================================================================= */}
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
                  Standard Price (₹)
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Add New Garment to Catalog */}
      {/* ========================================================================= */}
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
                    defaultValue="General"
                    placeholder="e.g. Shirts, Kurtas..."
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
                    <span className="text-[10px] text-[var(--text-secondary)] block">Iron Only</span>
                    <input
                      name="siPrice"
                      type="number"
                      defaultValue={20}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Wash & Fold</span>
                    <input
                      name="wfPrice"
                      type="number"
                      defaultValue={35}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Wash & Iron</span>
                    <input
                      name="wiPrice"
                      type="number"
                      defaultValue={49}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Dry Clean</span>
                    <input
                      name="dcPrice"
                      type="number"
                      defaultValue={80}
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Category & Subcategory Management Modal */}
      <CategorySubcategoryModal
        isOpen={showCatSubModal}
        onClose={() => setShowCatSubModal(false)}
        onRefreshCatalog={loadLiveCatalog}
      />
    </div>
  );
}
