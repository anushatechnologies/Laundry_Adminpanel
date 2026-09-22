'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { db } from '@/lib/db';
import { ClothType, ServicePriceItem } from '@/types';
import { 
  Search, Plus, Camera, Edit2, X, 
  RefreshCw, ShieldCheck, Link2, ExternalLink, Layers, Sparkles, Tag, Clock, ArrowRight, Settings,
  Trash2, Check, CheckCircle2, Loader2, UploadCloud, Eye, EyeOff, AlertTriangle, FolderPlus, ArrowUpRight
} from 'lucide-react';
import { 
  getAdminCategories, 
  createAdminCategory,
  updateAdminCategory, 
  deleteAdminCategory,
  getAdminServiceMasters,
  createAdminServiceMaster,
  updateAdminServiceMaster, 
  deleteAdminServiceMaster,
  getAdminCatalog,
  getAdminSubcategories,
} from '@/lib/api';
import { CategorySubcategoryModal } from './CategorySubcategoryModal';
import { getLocalFallbackPhoto } from '@/components/common/GarmentImage';
import { SubcategorySelectDropdown } from './SubcategorySelectDropdown';
import { MasterCategorySelectDropdown } from './MasterCategorySelectDropdown';
import { SubcategoriesManager } from './SubcategoriesManager';
import { getCategoryImageUrl } from '@/lib/category-photos';
import { 
  isServiceAllowedForCategory, 
  getCategoryServiceFocusOptions, 
  CATEGORY_SERVICES_RULES 
} from '@/lib/catalogCategoryServices';

export interface MasterCategoryItem {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  description: string;
  slug?: string;
  isActive?: boolean;
}

const INITIAL_MASTER_CATEGORIES: MasterCategoryItem[] = [];

export interface ServiceMasterItem {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
  pricingType?: 'PER_ITEM' | 'PER_KG' | string;
  baseKgPrice?: number;
  minOrderKg?: number;
  turnaroundHours?: number;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

const INITIAL_SERVICES_MASTERS: ServiceMasterItem[] = [];

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

export interface AddProductServiceItem {
  serviceId: string;
  serviceName: string;
  serviceIcon?: string;
  price: number;
  turnaroundHours: number;
}

export interface UnifiedCatalogManagerProps {
  initialMode?: 'GARMENTS' | 'CATEGORIES' | 'SUBCATEGORIES' | 'SERVICES';
  lockedMode?: 'GARMENTS' | 'CATEGORIES' | 'SUBCATEGORIES' | 'SERVICES';
  hideModeTabs?: boolean;
}

export function UnifiedCatalogManager({
  initialMode,
  lockedMode,
  hideModeTabs = false,
}: UnifiedCatalogManagerProps = {}) {
  const { 
    clothTypes, 
    serviceMasters, 
    priceMatrix,
    addClothType,
    updateClothType,
    deleteClothType,
    upsertPriceItem,
    deletePriceItem,
    showToast 
  } = useApp();

  // Top-level Navigation Mode: Garments | Categories | Subcategories | Services
  const [viewMode, setViewMode] = useState<'GARMENTS' | 'CATEGORIES' | 'SUBCATEGORIES' | 'SERVICES'>(
    lockedMode || initialMode || 'GARMENTS'
  );

  // Master Categories State (with live photo overrides) - initialized to master default to prevent initial flash/delay
  const [categories, setCategories] = useState<MasterCategoryItem[]>(INITIAL_MASTER_CATEGORIES);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [liveSubcategories, setLiveSubcategories] = useState<any[]>([]);

  // Category matching helper
  const isSubInCat = (subTag: string, cat: { id: string; name?: string; slug?: string }) => {
    if (!subTag || !cat) return false;
    const s = subTag.trim().toLowerCase();
    const id = (cat.id || '').trim().toLowerCase();
    const slug = (cat.slug || '').trim().toLowerCase();
    const name = (cat.name || '').trim().toLowerCase();
    if (s === id || s === slug || s === name) return true;

    const MENS_TAGS = ['m', 'cat-1', 'mens', 'men'];
    const WOMENS_TAGS = ['w', 'cat-2', 'womens', 'women'];
    const KIDS_TAGS = ['k', 'cat-3', 'kids', 'kid'];
    const HOME_TAGS = ['cat-4', 'home_textiles', 'home-textiles', 'home'];
    const FOOT_TAGS = ['cat-5', 'footwear', 'shoes', 'foot'];
    const ACC_TAGS = ['cat-6', 'accessories', 'bags'];
    const BRIDAL_TAGS = ['cat-7', 'bridal', 'wedding'];
    const BULK_TAGS = ['cat-8', 'bulk', 'commercial'];

    const matchesGroup = (tags: string[]) => {
      const sMatches = tags.some((t) => s === t || s.includes(t));
      const catMatches = tags.some((t) => id === t || slug.includes(t) || name.includes(t));
      return sMatches && catMatches;
    };

    if (matchesGroup(MENS_TAGS)) return true;
    if (matchesGroup(WOMENS_TAGS)) return true;
    if (matchesGroup(KIDS_TAGS)) return true;
    if (matchesGroup(HOME_TAGS)) return true;
    if (matchesGroup(FOOT_TAGS)) return true;
    if (matchesGroup(ACC_TAGS)) return true;
    if (matchesGroup(BRIDAL_TAGS)) return true;
    if (matchesGroup(BULK_TAGS)) return true;

    return false;
  };

  // Services State (with live photo overrides)
  const [servicesList, setServicesList] = useState<ServiceMasterItem[]>(INITIAL_SERVICES_MASTERS);

  // Category & Subcategory Management Modal
  const [showCatSubModal, setShowCatSubModal] = useState(false);

  // Read URL query parameter for tab (if not locked)
  useEffect(() => {
    if (lockedMode) {
      setViewMode(lockedMode);
      return;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'subcategories' || tab === 'subcategory') {
        setViewMode('SUBCATEGORIES');
      } else if (tab === 'cloths' || tab === 'products') {
        setViewMode('GARMENTS');
      } else if (tab === 'categories') {
        setViewMode('CATEGORIES');
      } else if (tab === 'services') {
        setViewMode('SERVICES');
      }
    }
  }, [lockedMode]);

  // Load live categories and service masters from API & S3
  const loadLiveCatalog = async () => {
    setIsLoadingCategories(true);
    try {
      const [catsRes, catalogRes, ovRes, subsRes, mastersRes] = await Promise.allSettled([
        getAdminCategories(),
        getAdminCatalog(),
        fetch('/api/catalog-overrides?t=' + Date.now(), { cache: 'no-store' }).then((r) =>
          r.ok ? r.json() : null
        ),
        getAdminSubcategories(),
        getAdminServiceMasters(),
      ]);

      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value)) {
        setLiveSubcategories(subsRes.value);
      }

      const ovJson = ovRes.status === 'fulfilled' ? ovRes.value : null;
      const ovData = ovJson?.data || ovJson;
      const {
        fullCategoryOverrides,
        deletedCategoryIds,
        categoryOverrides,
        serviceOverrides,
        fullServiceOverrides,
        deletedServiceIds,
      } = ovData || {};
      // Core categories are protected and can never be wiped out by stale cloud override deletion lists
      const PROTECTED_CORE_CATS = new Set([
        'MENS', 'WOMENS', 'KIDS', 'HOME_TEXTILES', 'FOOTWEAR', 'ACCESSORIES', 'BRIDAL', 'SPECIAL',
        'CAT-1', 'CAT-2', 'CAT-3', 'CAT-4', 'CAT-5', 'CAT-6', 'CAT-7', 'CAT-8', 'M'
      ]);
      const delSet = new Set(
        Array.isArray(deletedCategoryIds)
          ? deletedCategoryIds
              .map((id: string) => String(id).trim().toUpperCase())
              .filter((id: string) => !PROTECTED_CORE_CATS.has(id))
          : []
      );

      // Deduplicate categories by uppercase ID and ensure initial master categories are always seeded
      const catMap = new Map<string, any>();
      for (const initCat of INITIAL_MASTER_CATEGORIES) {
        const upperId = String(initCat.id).toUpperCase();
        const customImg =
          categoryOverrides?.[upperId] ||
          categoryOverrides?.[initCat.id] ||
          (fullCategoryOverrides?.[initCat.id]?.imageUrl) ||
          initCat.imageUrl;
        catMap.set(upperId, {
          ...initCat,
          imageUrl: getCategoryImageUrl(upperId, customImg),
        });
      }

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
        const remoteCats = catsRes.value;
        const mapped = remoteCats.map((rc: any) => ({
          id: rc.id,
          name: rc.name || 'Category',
          slug: rc.slug || '',
          icon: rc.icon || '🧺',
          imageUrl: rc.imageUrl || rc.image || '',
          description: rc.description || '',
          isActive: rc.isActive !== false,
        }));

        for (const cat of mapped) {
          const upperId = String(cat.id || '').trim().toUpperCase();
          const upperSlug = String(cat.slug || '').trim().toUpperCase();
          if (delSet.has(upperId) || delSet.has(upperSlug)) continue;

          let updated = { ...cat };
          const overrideImg =
            categoryOverrides?.[cat.id] ||
            categoryOverrides?.[upperId] ||
            categoryOverrides?.[upperSlug];
          if (overrideImg) {
            updated.imageUrl = overrideImg;
          }
          if (fullCategoryOverrides && fullCategoryOverrides[cat.id]) {
            updated = { ...updated, ...fullCategoryOverrides[cat.id] };
          }
          if (!updated.imageUrl) {
            updated.imageUrl = getCategoryImageUrl(upperId);
          }
          catMap.set(upperId, { ...(catMap.get(upperId) || {}), ...updated });
        }
      }
      setCategories(Array.from(catMap.values()));

      // Load and merge live service masters
      const delServiceSet = new Set(
        Array.isArray(deletedServiceIds)
          ? deletedServiceIds.map((id: string) => String(id).trim())
          : []
      );

      let remoteServices: any[] = [];
      if (mastersRes.status === 'fulfilled' && Array.isArray(mastersRes.value) && mastersRes.value.length > 0) {
        remoteServices = mastersRes.value;
      } else if (catalogRes.status === 'fulfilled' && Array.isArray(catalogRes.value?.serviceMasters) && catalogRes.value.serviceMasters.length > 0) {
        remoteServices = catalogRes.value.serviceMasters;
      } else {
        remoteServices = INITIAL_SERVICES_MASTERS;
      }

      const srvMap = new Map<string, any>();
      for (const s of remoteServices) {
        if (delServiceSet.has(s.id)) continue;
        let srv = { ...s };
        if (serviceOverrides && serviceOverrides[s.id]) {
          srv.imageUrl = serviceOverrides[s.id];
        }
        if (fullServiceOverrides && fullServiceOverrides[s.id]) {
          srv = { ...srv, ...fullServiceOverrides[s.id] };
        }
        srvMap.set(s.id, srv);
      }
      if (fullServiceOverrides && typeof fullServiceOverrides === 'object') {
        for (const [sId, sData] of Object.entries(fullServiceOverrides)) {
          if (delServiceSet.has(sId)) continue;
          if (!srvMap.has(sId) && sData && typeof sData === 'object') {
            srvMap.set(sId, { id: sId, ...(sData as any) });
          }
        }
      }
      setServicesList(Array.from(srvMap.values()));
    } catch (err) {
      console.warn('Could not load live catalog updates', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadLiveCatalog();
  }, []);

  // Filter States for Garments View
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('ALL');
  const [activeServiceFocus, setActiveServiceFocus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Category Search & Filter State
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Category Add / Edit Modal State
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    slug?: string;
    icon?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
  }>({
    id: '',
    name: '',
    slug: '',
    icon: '👔',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [categoryUploadingS3, setCategoryUploadingS3] = useState(false);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // Category Delete Confirmation Modal State
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    name: string;
    icon?: string;
  } | null>(null);
  const [isDeletingCategoryLoading, setIsDeletingCategoryLoading] = useState(false);

  // Filtered categories for Categories View
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categories;
    const q = categorySearchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q)
    );
  }, [categories, categorySearchQuery]);

  const handleOpenAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      slug: '',
      icon: '👔',
      description: '',
      imageUrl: '',
      isActive: true,
    });
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setIsAddingCategory(false);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.id.toLowerCase().replace(/_/g, '-'),
      icon: cat.icon || '👔',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isActive: cat.isActive !== false,
    });
  };

  const handleCategoryModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCategoryUploadingS3(true);
    try {
      const compressedBase64 = await compressImage(file, 1200, 0.85);
      const cleanName = (categoryForm.name || 'category').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const fileName = `category-${cleanName}-${Date.now()}.jpg`;
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: 'categories',
          fileName,
          imageBase64: compressedBase64,
          contentType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Upload failed');
      const s3Url = data.data?.s3Url || data.url || data.s3Url;
      setCategoryForm((prev) => ({ ...prev, imageUrl: s3Url }));
      showToast('Cover photo uploaded to AWS S3!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload category image', 'error');
    } finally {
      setCategoryUploadingS3(false);
      if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
    }
  };

  const handleSaveCategory = async () => {
    const rawName = (categoryForm.name || '').trim();
    if (!rawName) {
      showToast('Category name is required', 'error');
      return;
    }

    const catId = isAddingCategory
      ? ((categoryForm.id || '').trim() || rawName.toUpperCase().replace(/[^A-Z0-9]/g, '_'))
      : editingCategory!.id;

    const catData = {
      id: catId,
      name: rawName,
      slug: (categoryForm.slug || '').trim() || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: (categoryForm.icon || '').trim() || '👔',
      description: (categoryForm.description || '').trim(),
      imageUrl: (categoryForm.imageUrl || '').trim(),
      isActive: categoryForm.isActive !== false,
    };

    // 1. Optimistic update
    if (isAddingCategory) {
      setCategories((prev) => [...prev.filter((c) => c.id !== catId), catData]);
    } else {
      setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, ...catData } : c)));
    }

    // 2. Call backend API
    try {
      if (isAddingCategory) {
        await createAdminCategory(catData);
      } else {
        await updateAdminCategory(catId, catData);
      }
    } catch (err) {
      console.warn('Could not sync category to backend API', err);
    }

    // 3. Sync to S3 cloud overrides
    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: catId,
          categoryData: catData,
          categoryTag: catId,
          categoryImageUrl: catData.imageUrl,
        }),
      });
    } catch (err) {}

    showToast(`Category "${catData.name}" ${isAddingCategory ? 'created' : 'updated'} successfully!`, 'success');
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  const handleToggleCategoryActive = async (cat: any) => {
    const newActive = cat.isActive === false;
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, isActive: newActive } : c)));
    try {
      await updateAdminCategory(cat.id, { isActive: newActive });
    } catch (err) {}
    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: cat.id,
          categoryData: { isActive: newActive },
        }),
      });
    } catch (err) {}
    showToast(`Category "${cat.name}" is now ${newActive ? 'Active' : 'Hidden'}.`, 'info');
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    const catId = deletingCategory.id;
    setIsDeletingCategoryLoading(true);

    // 1. Optimistic update
    setCategories((prev) => prev.filter((c) => c.id !== catId));

    // 2. Call backend API
    try {
      await deleteAdminCategory(catId);
    } catch (err) {
      console.warn('Could not delete category via backend API', err);
    }

    // 3. Sync deletion to S3 cloud overrides
    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: catId,
          isCategoryDeleted: true,
        }),
      });
    } catch (err) {}

    showToast(`Category "${deletingCategory.name}" deleted.`, 'success');
    setIsDeletingCategoryLoading(false);
    setDeletingCategory(null);
  };

  const handleJumpToGarments = (categoryId: string) => {
    setActiveCategory(categoryId);
    setViewMode('GARMENTS');
  };

  const serviceFocusOptions = useMemo(
    () => getCategoryServiceFocusOptions(activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    if (activeServiceFocus !== 'ALL' && !serviceFocusOptions.some((o) => o.id === activeServiceFocus)) {
      setActiveServiceFocus('ALL');
    }
  }, [activeCategory, serviceFocusOptions, activeServiceFocus]);

  // Services Search & Filters State
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [servicePricingFilter, setServicePricingFilter] = useState<'ALL' | 'PER_ITEM' | 'PER_KG'>('ALL');
  const [serviceStatusFilter, setServiceStatusFilter] = useState<'ALL' | 'ACTIVE' | 'HIDDEN'>('ALL');

  // Service Add / Edit Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    pricingType: 'PER_ITEM' | 'PER_KG';
    baseKgPrice: number | string;
    minOrderKg: number | string;
    turnaroundHours: number;
    description: string;
    isActive: boolean;
    imageUrl: string;
  }>({
    id: '',
    name: '',
    slug: '',
    icon: '✨',
    pricingType: 'PER_ITEM',
    baseKgPrice: 60,
    minOrderKg: 3,
    turnaroundHours: 24,
    description: '',
    isActive: true,
    imageUrl: '',
  });
  const [isSavingService, setIsSavingService] = useState(false);
  const [serviceUploadingS3, setServiceUploadingS3] = useState(false);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);

  // Service Delete Modal State
  const [deletingService, setDeletingService] = useState<any | null>(null);
  const [isDeletingServiceLoading, setIsDeletingServiceLoading] = useState(false);

  const filteredServices = useMemo(() => {
    return servicesList.filter((srv) => {
      if (serviceSearchQuery.trim()) {
        const q = serviceSearchQuery.toLowerCase().trim();
        const matchesName = (srv.name || '').toLowerCase().includes(q);
        const matchesDesc = (srv.description || '').toLowerCase().includes(q);
        const matchesId = (srv.id || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesId) return false;
      }
      if (servicePricingFilter !== 'ALL') {
        const srvPricing = srv.pricingType || (srv.baseKgPrice ? 'PER_KG' : 'PER_ITEM');
        if (srvPricing !== servicePricingFilter) return false;
      }
      if (serviceStatusFilter === 'ACTIVE' && srv.isActive === false) return false;
      if (serviceStatusFilter === 'HIDDEN' && srv.isActive !== false) return false;
      return true;
    });
  }, [servicesList, serviceSearchQuery, servicePricingFilter, serviceStatusFilter]);

  const serviceCounts = useMemo(() => {
    let perItem = 0;
    let perKg = 0;
    let active = 0;
    for (const s of servicesList) {
      if (s.isActive !== false) active++;
      if (s.pricingType === 'PER_KG' || s.baseKgPrice) perKg++;
      else perItem++;
    }
    return { perItem, perKg, active, total: servicesList.length };
  }, [servicesList]);

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      id: `srv-m-${Date.now()}`,
      name: '',
      slug: '',
      icon: '✨',
      pricingType: 'PER_ITEM',
      baseKgPrice: 60,
      minOrderKg: 3,
      turnaroundHours: 24,
      description: '',
      isActive: true,
      imageUrl: '',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: any) => {
    setEditingService(srv);
    setServiceForm({
      id: srv.id,
      name: srv.name || '',
      slug: srv.slug || srv.id.replace(/^srv-m-|^srv-/, ''),
      icon: srv.icon || '✨',
      pricingType: srv.pricingType || (srv.baseKgPrice ? 'PER_KG' : 'PER_ITEM'),
      baseKgPrice: srv.baseKgPrice || 60,
      minOrderKg: srv.minOrderKg || 3,
      turnaroundHours: srv.turnaroundHours || 24,
      description: srv.description || '',
      isActive: srv.isActive !== false,
      imageUrl: srv.imageUrl || '',
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async () => {
    const rawName = (serviceForm.name || '').trim();
    if (!rawName) {
      showToast('Service name is required', 'error');
      return;
    }

    const srvId = editingService
      ? editingService.id
      : (serviceForm.id.trim() || `srv-m-${Date.now()}`);

    const cleanSlug = (serviceForm.slug || '').trim() || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const serviceData = {
      id: srvId,
      name: rawName,
      slug: cleanSlug,
      icon: serviceForm.icon || '✨',
      pricingType: serviceForm.pricingType,
      baseKgPrice: serviceForm.pricingType === 'PER_KG' ? Number(serviceForm.baseKgPrice) || 60 : undefined,
      minOrderKg: serviceForm.pricingType === 'PER_KG' ? Number(serviceForm.minOrderKg) || 3 : undefined,
      turnaroundHours: Number(serviceForm.turnaroundHours) || 24,
      description: serviceForm.description || '',
      isActive: Boolean(serviceForm.isActive),
      imageUrl: serviceForm.imageUrl || undefined,
    };

    setIsSavingService(true);

    try {
      if (editingService) {
        await updateAdminServiceMaster(srvId, serviceData);
        setServicesList((prev) =>
          prev.map((s) => (s.id === srvId ? { ...s, ...serviceData } : s))
        );
        showToast(`Service "${rawName}" updated successfully!`, 'success');
      } else {
        await createAdminServiceMaster(serviceData);
        setServicesList((prev) => [...prev, serviceData]);
        showToast(`Service "${rawName}" created successfully!`, 'success');
      }

      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: srvId,
          serviceData,
        }),
      }).catch(() => {});

      setIsServiceModalOpen(false);
      loadLiveCatalog();
    } catch (err: any) {
      try {
        await fetch('/api/catalog-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: srvId,
            serviceData,
          }),
        });
        if (editingService) {
          setServicesList((prev) =>
            prev.map((s) => (s.id === srvId ? { ...s, ...serviceData } : s))
          );
        } else {
          setServicesList((prev) => [...prev, serviceData]);
        }
        showToast(`Saved "${rawName}" to cloud overrides`, 'success');
        setIsServiceModalOpen(false);
      } catch {
        showToast(err.message || 'Failed to save service', 'error');
      }
    } finally {
      setIsSavingService(false);
    }
  };

  const handleToggleServiceActive = async (srv: any) => {
    const newActive = srv.isActive === false;
    setServicesList((prev) =>
      prev.map((s) => (s.id === srv.id ? { ...s, isActive: newActive } : s))
    );

    try {
      await updateAdminServiceMaster(srv.id, { isActive: newActive });
    } catch (err) {}

    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: srv.id,
          serviceData: { isActive: newActive },
        }),
      });
    } catch {}

    showToast(`Service "${srv.name}" is now ${newActive ? 'Active' : 'Hidden'}.`, 'info');
  };

  const handleConfirmDeleteService = async () => {
    if (!deletingService) return;
    const srvId = deletingService.id;
    setIsDeletingServiceLoading(true);

    setServicesList((prev) => prev.filter((s) => s.id !== srvId));

    try {
      await deleteAdminServiceMaster(srvId);
    } catch (err) {
      console.warn('Could not delete service via backend API', err);
    }

    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: srvId,
          isServiceDeleted: true,
        }),
      });
    } catch {}

    showToast(`Service "${deletingService.name}" deleted.`, 'success');
    setIsDeletingServiceLoading(false);
    setDeletingService(null);
  };

  const handleServiceModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceUploadingS3(true);
    try {
      const compressedBase64 = await compressImage(file, 1200, 0.85);
      const cleanName = (serviceForm.name || 'service').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const fileName = `service-${cleanName}-${Date.now()}.jpg`;
      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: 'services',
          fileName,
          imageBase64: compressedBase64,
          contentType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Upload failed');
      const s3Url = data.data?.s3Url || data.url || data.s3Url;
      setServiceForm((prev) => ({ ...prev, imageUrl: s3Url }));
      showToast('Cover photo uploaded to AWS S3!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload service image', 'error');
    } finally {
      setServiceUploadingS3(false);
      if (serviceFileInputRef.current) serviceFileInputRef.current.value = '';
    }
  };

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

  // Add Garment Modal Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addGarmentCategory, setAddGarmentCategory] = useState('MENS');
  const [addGarmentSubcategory, setAddGarmentSubcategory] = useState('');
  const [addGarmentImageUrl, setAddGarmentImageUrl] = useState('');
  const [addGarmentUploadingS3, setAddGarmentUploadingS3] = useState(false);
  const [isSubmittingNewProduct, setIsSubmittingNewProduct] = useState(false);
  const addGarmentFileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Service Matrix State for Add Product
  const [addGarmentServices, setAddGarmentServices] = useState<AddProductServiceItem[]>([]);
  const [newServiceForAddModal, setNewServiceForAddModal] = useState<{
    serviceId: string;
    price: number;
    turnaroundHours: number;
  }>({ serviceId: '', price: 50, turnaroundHours: 24 });

  const getCategoryKey = (catId: string) => {
    const upper = (catId || '').toUpperCase().trim();
    if (upper === 'M' || upper === 'CAT-1' || upper.includes('MEN')) return 'MENS';
    if (upper === 'W' || upper === 'CAT-2' || upper.includes('WOMEN')) return 'WOMENS';
    if (upper === 'K' || upper === 'CAT-3' || upper.includes('KID')) return 'KIDS';
    if (upper === 'CAT-4' || upper.includes('HOME') || upper.includes('TEXTILE')) return 'HOME_TEXTILES';
    if (upper === 'CAT-5' || upper.includes('FOOT') || upper.includes('SHOE')) return 'FOOTWEAR';
    if (upper === 'CAT-6' || upper.includes('ACCESS')) return 'ACCESSORIES';
    if (upper === 'CAT-7' || upper.includes('BRIDAL')) return 'BRIDAL';
    if (upper === 'CAT-8' || upper.includes('BULK')) return 'BULK';
    return upper;
  };

  const addCategoryRule = useMemo(() => {
    const normCat = getCategoryKey(addGarmentCategory || 'MENS');
    return CATEGORY_SERVICES_RULES[normCat] || CATEGORY_SERVICES_RULES.MENS;
  }, [addGarmentCategory]);

  // Available services from servicesList not yet added to this new garment
  const availableServicesToAdd = useMemo(() => {
    const currentIds = new Set(addGarmentServices.map((s) => s.serviceId));
    return servicesList.filter((s) => !currentIds.has(s.id));
  }, [servicesList, addGarmentServices]);

  useEffect(() => {
    if (availableServicesToAdd.length > 0) {
      if (!availableServicesToAdd.some((s) => s.id === newServiceForAddModal.serviceId)) {
        const first = availableServicesToAdd[0];
        setNewServiceForAddModal({
          serviceId: first.id,
          price: first.baseKgPrice || 50,
          turnaroundHours: first.turnaroundHours || 24,
        });
      }
    } else {
      setNewServiceForAddModal({ serviceId: '', price: 50, turnaroundHours: 24 });
    }
  }, [availableServicesToAdd]);

  const handleOpenAddGarment = () => {
    const defaultCat = activeCategory !== 'ALL' ? activeCategory : (categories[0]?.id || 'MENS');
    setAddGarmentCategory(defaultCat);
    const matching = liveSubcategories.filter((s: any) =>
      isSubInCat(s.categoryTag || s.category_tag || '', { id: defaultCat })
    );
    setAddGarmentSubcategory(matching[0]?.name || '');
    setAddGarmentImageUrl('');

    const normCat = getCategoryKey(defaultCat);
    const rule = CATEGORY_SERVICES_RULES[normCat] || CATEGORY_SERVICES_RULES.MENS;
    const initialServices: AddProductServiceItem[] = rule.defaultServices.map((defSrv) => {
      const found = servicesList.find((s) => s.id === defSrv.serviceId);
      return {
        serviceId: defSrv.serviceId,
        serviceName: defSrv.name,
        serviceIcon: found?.icon || '🧺',
        price: defSrv.defaultPrice,
        turnaroundHours: defSrv.serviceId === 'srv-m-express' ? 12 : defSrv.serviceId === 'srv-m-spa' ? 48 : 24,
      };
    });
    setAddGarmentServices(initialServices);
    setShowAddModal(true);
  };

  const handleAddGarmentCategoryChange = (newCat: string) => {
    setAddGarmentCategory(newCat);
    const matching = liveSubcategories.filter((s: any) =>
      isSubInCat(s.categoryTag || s.category_tag || '', { id: newCat })
    );
    setAddGarmentSubcategory(matching[0]?.name || '');

    const normCat = getCategoryKey(newCat);
    const rule = CATEGORY_SERVICES_RULES[normCat] || CATEGORY_SERVICES_RULES.MENS;
    const newServices: AddProductServiceItem[] = rule.defaultServices.map((defSrv) => {
      const found = servicesList.find((s) => s.id === defSrv.serviceId);
      return {
        serviceId: defSrv.serviceId,
        serviceName: defSrv.name,
        serviceIcon: found?.icon || '🧺',
        price: defSrv.defaultPrice,
        turnaroundHours: defSrv.serviceId === 'srv-m-express' ? 12 : defSrv.serviceId === 'srv-m-spa' ? 48 : 24,
      };
    });
    setAddGarmentServices(newServices);
  };

  const handleUpdateAddGarmentServicePrice = (serviceId: string, price: number) => {
    setAddGarmentServices((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, price } : s))
    );
  };

  const handleRemoveAddGarmentService = (serviceId: string) => {
    setAddGarmentServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
  };

  const handleAddAnotherServiceToAddGarment = () => {
    if (!newServiceForAddModal.serviceId) return;
    const srvMeta = servicesList.find((s) => s.id === newServiceForAddModal.serviceId);
    if (!srvMeta) return;
    if (addGarmentServices.some((s) => s.serviceId === srvMeta.id)) {
      showToast(`${srvMeta.name} is already added.`, 'info');
      return;
    }
    setAddGarmentServices((prev) => [
      ...prev,
      {
        serviceId: srvMeta.id,
        serviceName: srvMeta.name,
        serviceIcon: srvMeta.icon || '🧺',
        price: Number(newServiceForAddModal.price) || 50,
        turnaroundHours: Number(newServiceForAddModal.turnaroundHours) || (srvMeta.turnaroundHours || 24),
      },
    ]);
  };

  // Edit Garment & Manage its Services Modal
  const [editingCloth, setEditingCloth] = useState<ClothType | null>(null);
  const [editGarmentUploadingS3, setEditGarmentUploadingS3] = useState(false);
  const editGarmentFileInputRef = useRef<HTMLInputElement>(null);
  const [editingClothForm, setEditingClothForm] = useState<{
    name: string;
    icon: string;
    categoryTag: string;
    subCategory: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
  }>({
    name: '',
    icon: '👔',
    categoryTag: 'MENS',
    subCategory: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  const [newServiceToAdd, setNewServiceToAdd] = useState<{
    serviceId: string;
    price: number;
    expressPrice: number;
    turnaroundHours: number;
  }>({
    serviceId: 'srv-m-starch',
    price: 50,
    expressPrice: 75,
    turnaroundHours: 24,
  });

  const getServiceMeta = (serviceId: string) => {
    const srv = servicesList.find((s) => s.id === serviceId) || serviceMasters.find((s) => s.id === serviceId);
    if (srv) return { name: srv.name.replace(' Only', ''), icon: srv.icon || '🧺' };
    if (serviceId.includes('dry-clean')) return { name: 'Dry Clean', icon: '🧥' };
    if (serviceId.includes('steam-iron')) return { name: 'Steam Iron', icon: '🔥' };
    if (serviceId.includes('wash-iron')) return { name: 'Wash+Iron', icon: '👔' };
    if (serviceId.includes('wash-fold')) return { name: 'Wash+Fold', icon: '🧺' };
    if (serviceId.includes('starch')) return { name: 'Starch Finish', icon: '✨' };
    if (serviceId.includes('charak')) return { name: 'Saree Polishing', icon: '🥻' };
    if (serviceId.includes('spa')) return { name: 'Shoe Spa', icon: '👞' };
    if (serviceId.includes('express')) return { name: 'Express Emergency', icon: '⚡' };
    return { name: 'Service', icon: '🧺' };
  };

  useEffect(() => {
    if (editingCloth) {
      setEditingClothForm({
        name: editingCloth.name,
        icon: editingCloth.icon || '👔',
        categoryTag: editingCloth.categoryTag,
        subCategory: editingCloth.subCategory || 'General',
        description: editingCloth.description || '',
        imageUrl: editingCloth.imageUrl || '',
        isActive: editingCloth.isActive !== false,
      });

      const existingIds = new Set(
        priceMatrix
          .filter((p) => p.clothTypeId === editingCloth.id && p.isActive !== false && Number(p.price) > 0)
          .map((p) => p.serviceId)
      );
      const unassigned = servicesList.find(
        (s) => !existingIds.has(s.id) && isServiceAllowedForCategory(editingCloth.categoryTag, s.id)
      );
      const defaultService = unassigned || servicesList.find((s) => isServiceAllowedForCategory(editingCloth.categoryTag, s.id));
      setNewServiceToAdd({
        serviceId: defaultService?.id || 'srv-m-dry-clean',
        price: defaultService?.id === 'srv-m-spa' ? 250 : 50,
        expressPrice: defaultService?.id === 'srv-m-spa' ? 350 : 75,
        turnaroundHours: defaultService?.turnaroundHours || 24,
      });
    }
  }, [editingCloth, priceMatrix, servicesList]);

  const handleSaveClothDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCloth) return;

    const catMatch = categories.find((c) => c.id === editingClothForm.categoryTag);
    const updatedData: Partial<ClothType> = {
      name: editingClothForm.name,
      icon: editingClothForm.icon,
      categoryTag: editingClothForm.categoryTag,
      categoryLabel: catMatch ? catMatch.name : (editingClothForm.categoryTag === 'MENS' ? "Men's Clothing" : "Women's Clothing"),
      subCategory: editingClothForm.subCategory,
      description: editingClothForm.description,
      imageUrl: editingClothForm.imageUrl || undefined,
      isActive: editingClothForm.isActive,
    };

    updateClothType(editingCloth.id, updatedData);
    showToast(`Saved product details for ${editingClothForm.name}!`, 'success');
    setEditingCloth(null);
  };

  const handleAddServiceToCloth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCloth || !newServiceToAdd.serviceId) return;

    if (!isServiceAllowedForCategory(editingCloth.categoryTag, newServiceToAdd.serviceId)) {
      showToast(`This service is not available for ${editingCloth.categoryTag} items.`, 'error');
      return;
    }

    const srvMeta = getServiceMeta(newServiceToAdd.serviceId);
    const newPriceItem: ServicePriceItem = {
      id: `pr-${editingCloth.id}-${newServiceToAdd.serviceId}`,
      clothTypeId: editingCloth.id,
      clothName: editingClothForm.name || editingCloth.name,
      clothIcon: editingClothForm.icon || editingCloth.icon,
      categoryTag: editingClothForm.categoryTag || editingCloth.categoryTag,
      serviceId: newServiceToAdd.serviceId,
      serviceName: srvMeta.name,
      price: Number(newServiceToAdd.price) || 50,
      expressPrice: Number(newServiceToAdd.expressPrice) || Math.round(Number(newServiceToAdd.price || 50) * 1.5),
      turnaroundHours: Number(newServiceToAdd.turnaroundHours) || 24,
      isActive: true,
      isAvailable: true,
    };

    upsertPriceItem(newPriceItem);
    showToast(`Added ${srvMeta.name} (₹${newPriceItem.price}) to ${editingCloth.name}!`, 'success');
  };

  const handleRemoveServiceFromCloth = async (priceItemId: string, serviceName: string, clothItem?: ClothType) => {
    const targetCloth = clothItem || editingCloth;
    if (priceItemId) {
      await deletePriceItem(priceItemId);
    }
    if (targetCloth) {
      showToast(`Removed ${serviceName} from ${targetCloth.name}.`, 'info');
    }
  };

  const handleDeleteCloth = () => {
    if (!editingCloth) return;
    if (window.confirm(`Are you sure you want to permanently delete "${editingCloth.name}"? This removes the garment and its rates from the catalog.`)) {
      deleteClothType(editingCloth.id);
      showToast(`Deleted ${editingCloth.name} from catalog.`, 'info');
      setEditingCloth(null);
    }
  };

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
      counts[cat.id] = clothTypes.filter((c) => isSubInCat(c.categoryTag, cat)).length;
    });
    return counts;
  }, [clothTypes, categories]);

  // Subcategories for current active category (combines garments + database subcategories)
  const availableSubcategories = useMemo(() => {
    const relevantClothSubs = (activeCategory === 'ALL'
      ? clothTypes
      : clothTypes.filter((c) => isSubInCat(c.categoryTag, { id: activeCategory }))
    ).map((c) => c.subCategory).filter(Boolean);

    const activeCatObj = categories.find((c) => c.id === activeCategory);
    const relevantLiveSubs = liveSubcategories
      .filter((s: any) => {
        const tag = s.categoryTag || s.category_tag || '';
        return activeCategory === 'ALL' || isSubInCat(tag, activeCatObj || { id: activeCategory });
      })
      .map((s: any) => s.name)
      .filter(Boolean);

    return Array.from(new Set([...relevantClothSubs, ...relevantLiveSubs])).sort();
  }, [clothTypes, activeCategory, categories, liveSubcategories]);

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
              {viewMode === 'CATEGORIES'
                ? 'Master Categories & Photography'
                : viewMode === 'SUBCATEGORIES'
                ? 'Subcategories Management'
                : viewMode === 'SERVICES'
                ? 'Garment Services Photography & Rates'
                : 'Products & Cloth Types Catalog'}
            </h2>
            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-300">
              {viewMode === 'CATEGORIES'
                ? `${categories.length} Master Categories`
                : viewMode === 'SUBCATEGORIES'
                ? 'Dedicated Manager'
                : viewMode === 'SERVICES'
                ? `${servicesList.length} Active Services`
                : `${clothTypes.length} Products`}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {viewMode === 'CATEGORIES'
              ? 'Manage core laundry categories and upload direct high-definition photography to AWS S3 for customer app cards.'
              : viewMode === 'SUBCATEGORIES'
              ? 'Organize taxonomy, upload AWS S3 photography, and control customer app grouping.'
              : viewMode === 'SERVICES'
              ? 'Manage commercial service turnaround times, pricing types (per item / per kg), and high-resolution service photography.'
              : 'Manage commercial laundry garments catalog, search items, upload high-res photography to AWS S3, and organize by subcategories.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(viewMode === 'CATEGORIES' || (!lockedMode && !hideModeTabs)) && (
            <button
              type="button"
              onClick={() => setShowCatSubModal(true)}
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Taxonomy Structure</span>
            </button>
          )}

          {viewMode === 'GARMENTS' && (
            <button
              type="button"
              onClick={handleOpenAddGarment}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}

          {viewMode === 'SERVICES' && (
            <button
              type="button"
              onClick={handleOpenAddService}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Section Mode Selector: Only shown when not locked and tabs not hidden */}
      {!lockedMode && !hideModeTabs && (
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
            <span>🗂️ Categories</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              viewMode === 'CATEGORIES' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('SUBCATEGORIES')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              viewMode === 'SUBCATEGORIES'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
            }`}
          >
            <span>✨ Subcategories</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              viewMode === 'SUBCATEGORIES' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
            }`}>
              Dedicated
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
      )}

      {/* ========================================================================= */}
      {/* 1. CATEGORIES MANAGEMENT & PHOTOGRAPHY VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'CATEGORIES' && (
        <div className="space-y-5">
          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Master Categories & Taxonomy
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Organize customer app categories, manage high-res S3 photography, edit metadata, and control visibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Search Filter */}
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500"
                />
                {categorySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Add Master Category Button */}
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="py-2 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={loadLiveCatalog}
                className="p-2 border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--heading-color)] rounded-xl transition-all cursor-pointer shadow-2xs"
                title="Reload Categories from API"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
            <div className="flex items-center gap-2.5 font-bold">
              <span className="text-[var(--heading-color)]">
                Showing {filteredCategories.length} of {categories.length} Categories
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-slate-500 font-medium">
                {clothTypes.length} Total Garments in Catalog
              </span>
            </div>
          </div>

          {/* Cards Grid or Loading Skeleton */}
          {isLoadingCategories ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-xs font-semibold">Loading categories from database...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-6">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[var(--heading-color)]">
                  {categories.length === 0
                    ? 'No categories in your catalog'
                    : `No categories found matching "${categorySearchQuery}"`}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  {categories.length === 0
                    ? 'All default categories were deleted or none exist yet. Click "+ Add Category" above to create one.'
                    : 'Try adjusting your search query.'}
                </p>
              </div>
              {categories.length === 0 && (
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Category</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => {
              const garmentsCount = categoryCounts[cat.id] || 0;
              const liveSubs = liveSubcategories.filter((s: any) =>
                isSubInCat(s.categoryTag || s.category_tag || '', cat)
              );
              const clothSubs = clothTypes
                .filter((c) => isSubInCat(c.categoryTag || '', cat) && c.subCategory)
                .map((c) => c.subCategory);

              const subcategoriesForCat = Array.from(
                new Set([...liveSubs.map((s: any) => s.name), ...clothSubs])
              ).filter(Boolean);
              const subCount = Math.max(liveSubs.length, subcategoriesForCat.length);
              const isUploadingThis = uploadingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                    cat.isActive === false
                      ? 'opacity-70 border-dashed border-slate-300 dark:border-slate-700'
                      : 'border-[var(--border-color)]'
                  }`}
                >
                  <div>
                    {/* Image Header with Scrim and Floating Badges */}
                    <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://anjanilaundry.s3.ap-south-2.amazonaws.com/services/service_wash_fold.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                          <span className="text-5xl">{cat.icon || '🧺'}</span>
                          <span className="text-[10px] font-bold text-slate-400 mt-2">No Photo Set</span>
                        </div>
                      )}

                      {/* Gradient Scrim for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent flex flex-col justify-between p-3.5">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/95 text-white flex items-center gap-1.5 shadow-sm backdrop-blur-md border border-white/10">
                            <ShieldCheck className="w-3.5 h-3.5" /> AWS S3 Live
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Active / Hidden Status Pill */}
                            <button
                              type="button"
                              onClick={() => handleToggleCategoryActive(cat)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all shadow-sm backdrop-blur-md border border-white/20 flex items-center gap-1 ${
                                cat.isActive !== false
                                  ? 'bg-emerald-600/90 hover:bg-emerald-700 text-white'
                                  : 'bg-amber-600/90 hover:bg-amber-700 text-white'
                              }`}
                              title="Click to toggle Category visibility in customer app"
                            >
                              {cat.isActive !== false ? (
                                <>
                                  <Check className="w-3 h-3" /> Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" /> Hidden
                                </>
                              )}
                            </button>

                            {/* Category Icon Badge */}
                            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-lg shadow-sm">
                              {cat.icon || '👔'}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Title & Description */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="text-lg font-black text-white tracking-tight drop-shadow-sm">
                              {cat.name}
                            </h4>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-slate-100 border border-white/20 uppercase tracking-wider">
                              {cat.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 line-clamp-2 font-medium drop-shadow-xs leading-relaxed">
                            {cat.description || 'Master category in the commercial laundry catalog.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleJumpToGarments(cat.id)}
                          className="p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/60 text-left transition-all cursor-pointer group/stat"
                          title={`View all ${garmentsCount} garments in ${cat.name}`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-0.5">
                            Active Garments
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-blue-950 dark:text-blue-100">
                              {garmentsCount} Products
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5 transition-transform" />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (hideModeTabs) {
                              window.location.href = '/subcategories';
                            } else {
                              setViewMode('SUBCATEGORIES');
                            }
                          }}
                          className="p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 border border-purple-200/70 dark:border-purple-800/60 text-left transition-all cursor-pointer group/sub"
                          title={`View & manage subcategories in ${cat.name}`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block mb-0.5">
                            Subcategories
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-purple-950 dark:text-purple-100">
                              {subCount} Groups
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-transform" />
                          </div>
                        </button>
                      </div>

                      {/* Subcategory Tags Preview */}
                      {subcategoriesForCat.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {subcategoriesForCat.slice(0, 4).map((sub) => (
                            <span
                              key={sub}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 flex items-center gap-1 shadow-2xs"
                            >
                              <span>🏷️</span> {sub}
                            </span>
                          ))}
                          {subcategoriesForCat.length > 4 && (
                            <span className="text-[10px] font-bold text-slate-400 px-1">
                              +{subcategoriesForCat.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic pt-0.5 flex items-center gap-1">
                          <span>🏷️</span> No subcategories attached
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-0">
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
                      {/* Edit Category Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title={`Edit ${cat.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Category Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer shadow-2xs"
                        title={`Delete ${cat.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Direct Upload Photo Button */}
                      <button
                        type="button"
                        disabled={isUploadingThis}
                        onClick={() => handleTriggerUpload('CATEGORY', cat.id, cat.name)}
                        className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Upload Cover Photo from Computer"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      {/* Paste Image URL Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUrlTarget({
                            type: 'CATEGORY',
                            id: cat.id,
                            name: cat.name,
                            icon: cat.icon,
                            currentUrl: cat.imageUrl || '',
                          });
                          setManualImageUrl(cat.imageUrl || '');
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)] transition-all cursor-pointer shadow-2xs"
                        title="Paste direct Image URL"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SERVICES PHOTOGRAPHY VIEW */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. SERVICES COMMAND CENTER & MASTERS VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'SERVICES' && (
        <div className="space-y-4">
          {/* Services Command Bar */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-4 shadow-xs space-y-3.5">
            {/* Row 1: Title, Dynamic Badges & Action CTAs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-[var(--heading-color)] flex items-center gap-2">
                  <span>✨</span>
                  <span>Laundry Services & Masters</span>
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {servicesList.length} Total Services
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                    {serviceCounts.perItem} Per Item
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {serviceCounts.perKg} Per Kg
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[var(--border-color)]">
                    {serviceCounts.active} Active
                  </span>
                </div>
              </div>

              {/* Search & Add Service CTA */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                  {serviceSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setServiceSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Row 2: Pricing Filter Pills & Status Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[var(--border-color)]">
              {/* Pricing Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setServicePricingFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    servicePricingFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  All Pricing ({servicesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setServicePricingFilter('PER_ITEM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    servicePricingFilter === 'PER_ITEM'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  <span>👔</span>
                  <span>Per Item ({serviceCounts.perItem})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setServicePricingFilter('PER_KG')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    servicePricingFilter === 'PER_KG'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  <span>⚖️</span>
                  <span>Per Kilogram ({serviceCounts.perKg})</span>
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    serviceStatusFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-900 text-[var(--heading-color)] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  All Status
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter('ACTIVE')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    serviceStatusFilter === 'ACTIVE'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Active Only
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter('HIDDEN')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    serviceStatusFilter === 'HIDDEN'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Hidden
                </button>
              </div>
            </div>
          </div>

          {/* Empty State when 0 services match */}
          {filteredServices.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-6 shadow-xs">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner text-2xl">
                <span>✨</span>
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  {servicesList.length === 0
                    ? 'No laundry services configured yet'
                    : `No services found matching "${serviceSearchQuery || servicePricingFilter}"`}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {servicesList.length === 0
                    ? 'Add your first commercial laundry service (e.g. Dry Cleaning, Wash & Fold, Steam Press) to enable customer bookings.'
                    : 'Try clearing your search query or pricing filter to view other services.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Service</span>
                </button>
                {(serviceSearchQuery || servicePricingFilter !== 'ALL' || serviceStatusFilter !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setServiceSearchQuery('');
                      setServicePricingFilter('ALL');
                      setServiceStatusFilter('ALL');
                    }}
                    className="px-4 py-2.5 border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-[var(--heading-color)] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredServices.map((srv) => {
                const isUploadingThis = uploadingId === srv.id;
                const isKg = srv.pricingType === 'PER_KG' || Boolean(srv.baseKgPrice);

                return (
                  <div
                    key={srv.id}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                      srv.isActive === false
                        ? 'opacity-60 border-dashed border-slate-300 dark:border-slate-800'
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                        {srv.imageUrl ? (
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://anjanilaundry.s3.ap-south-2.amazonaws.com/services/service_wash_fold.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                            <span className="text-4xl">{srv.icon || '✨'}</span>
                            <span className="text-[10px] font-bold">No Photo</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/90 text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                              <Clock className="w-3 h-3" /> {srv.turnaroundHours || 24}h TAT
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleServiceActive(srv)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all shadow-xs backdrop-blur-xs border ${
                                srv.isActive !== false
                                  ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border-emerald-400/50'
                                  : 'bg-amber-500/90 hover:bg-amber-600 text-white border-amber-400/50'
                              }`}
                              title={srv.isActive !== false ? 'Click to hide service' : 'Click to activate service'}
                            >
                              {srv.isActive !== false ? 'Active' : 'Hidden'}
                            </button>
                          </div>

                          {/* Title & Pricing Model in scrim */}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xl drop-shadow-md">{srv.icon || '✨'}</span>
                              <h4 className="text-sm font-black text-white drop-shadow-sm truncate">{srv.name}</h4>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                              {isKg ? 'Per Kilogram' : 'Per Item'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-3.5 space-y-2.5">
                        {/* Pricing Highlight Badge */}
                        <div className="flex items-center justify-between gap-2">
                          {isKg ? (
                            <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-xs font-black">
                              <span>⚖️</span>
                              <span>₹{srv.baseKgPrice || 60} / kg</span>
                              <span className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80">
                                (Min: {srv.minOrderKg || 3} kg)
                              </span>
                            </div>
                          ) : (
                            <div className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 flex items-center gap-1.5 text-xs font-black">
                              <span>👔</span>
                              <span>Per Item Matrix Rates</span>
                            </div>
                          )}
                          <span className="text-[10px] font-mono font-bold text-slate-400 truncate max-w-[80px]">
                            {srv.id}
                          </span>
                        </div>

                        {srv.description && (
                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                            {srv.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-3 pt-0">
                      <div className="flex items-center gap-1.5 pt-2.5 border-t border-[var(--border-color)]">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(srv)}
                          className="flex-1 py-1.5 px-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                          title={`Edit ${srv.name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingService(srv)}
                          className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer shadow-2xs"
                          title={`Delete ${srv.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Photo Upload from Computer */}
                        <button
                          type="button"
                          disabled={isUploadingThis}
                          onClick={() => handleTriggerUpload('SERVICE', srv.id, srv.name)}
                          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Upload Cover Photo from Computer"
                        >
                          <Camera className="w-3.5 h-3.5 text-blue-600" />
                        </button>

                        {/* Paste Image URL */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUrlTarget({
                              type: 'SERVICE',
                              id: srv.id,
                              name: srv.name,
                              icon: srv.icon,
                              currentUrl: srv.imageUrl || '',
                            });
                            setManualImageUrl(srv.imageUrl || '');
                          }}
                          className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)] transition-all cursor-pointer shadow-2xs"
                          title="Paste direct Image URL"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.5. SUBCATEGORIES MASTER MANAGEMENT VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'SUBCATEGORIES' && (
        <SubcategoriesManager onRefreshCatalog={loadLiveCatalog} />
      )}

      {/* ========================================================================= */}
      {/* 3. PRODUCTS & GARMENTS VIEW (72 Commercial Items) */}
      {/* ========================================================================= */}
      {viewMode === 'GARMENTS' && (
        <>
          {/* ========================================================= */}
          {/* UNIFIED COMMAND BAR: Category, Subcategory, & Service Focus */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-4 shadow-xs space-y-3.5">
            {/* Row 1: Categories & Quick Search & Add Action */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('ALL');
                    setActiveSubcategory('ALL');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                    activeCategory === 'ALL'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-[var(--heading-color)] border-[var(--border-color)] hover:border-blue-300'
                  }`}
                >
                  <span className="text-sm">✨</span>
                  <span>All Garments</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeCategory === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {clothTypes.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <div key={cat.id} className="relative flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveSubcategory('ALL');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : 'bg-slate-50 dark:bg-slate-800 text-[var(--heading-color)] border-[var(--border-color)] hover:border-blue-300'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-white/40 shadow-2xs flex items-center justify-center">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">{cat.icon || '👔'}</span>
                          )}
                        </div>
                        <span>{cat.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {count}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddGarment}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Row 2: Subcategory Pills & Service Focus Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
              {/* Subcategories Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-wrap">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1 shrink-0">
                  Subcategory:
                </span>

                <button
                  type="button"
                  onClick={() => setActiveSubcategory('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubcategory === 'ALL'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  All ({filteredClothes.length})
                </button>

                {availableSubcategories.map((sub) => {
                  const subCount = clothTypes.filter(
                    (c) => (activeCategory === 'ALL' || isSubInCat(c.categoryTag, { id: activeCategory })) && c.subCategory === sub
                  ).length;
                  const isSelected = activeSubcategory === sub;

                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100'
                      }`}
                    >
                      <span>🏷️ {sub}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-purple-200/70 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200'
                      }`}>
                        {subCount}
                      </span>
                    </button>
                  );
                })}

                {availableSubcategories.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No subcategories attached yet</span>
                )}
              </div>

              {/* Service Focus Mode Selector */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1 shrink-0">
                  Highlight:
                </span>
                {serviceFocusOptions.map((srv) => {
                  const isSelected = activeServiceFocus === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setActiveServiceFocus(srv.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                      }`}
                    >
                      <span>{srv.icon}</span>
                      <span>{srv.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Garments Cards Grid or Modern Empty State */}
          {filteredClothes.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-6 shadow-xs">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner text-2xl">
                <span>👔</span>
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  {clothTypes.length === 0
                    ? 'No products in your catalog yet'
                    : `No products found matching "${searchQuery || activeSubcategory}"`}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {clothTypes.length === 0
                    ? 'Add products to your catalog with high-resolution AWS S3 photography and customized rates per laundry service.'
                    : 'Try clearing your subcategory or search query to view other products.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddGarment}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Product</span>
                </button>
                {(searchQuery || activeSubcategory !== 'ALL' || activeCategory !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveSubcategory('ALL');
                      setActiveCategory('ALL');
                    }}
                    className="px-4 py-2.5 border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-[var(--heading-color)] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredClothes.map((cloth) => {
              const isUploadingThis = uploadingId === cloth.id;

              // Gather only services that are ACTUALLY configured for this cloth in the database AND allowed for this category
              const configuredForCloth = priceMatrix.filter(
                (p) => p.clothTypeId === cloth.id && 
                       p.isActive !== false && 
                       Number(p.price) > 0 &&
                       isServiceAllowedForCategory(cloth.categoryTag, p.serviceId)
              );

              // Deduplicate by serviceId so duplicate DB entries never produce double service rates
              const uniqueServiceMap = new Map<string, typeof priceMatrix[0]>();
              for (const p of configuredForCloth) {
                const existing = uniqueServiceMap.get(p.serviceId);
                if (!existing) {
                  uniqueServiceMap.set(p.serviceId, p);
                } else {
                  const existingScore = (existing.clothName ? 2 : 0) + (existing.id?.includes('srv-m') ? 1 : 0);
                  const newScore = (p.clothName ? 2 : 0) + (p.id?.includes('srv-m') ? 1 : 0);
                  if (newScore > existingScore) {
                    uniqueServiceMap.set(p.serviceId, p);
                  }
                }
              }
              const dedupedConfigured = Array.from(uniqueServiceMap.values());

              let clothServices: Array<{
                serviceId: string;
                name: string;
                icon: string;
                price: number;
                priceItemId?: string;
              }> = [];

              if (dedupedConfigured.length > 0) {
                clothServices = dedupedConfigured.map((p) => {
                  const meta = getServiceMeta(p.serviceId);
                  return {
                    serviceId: p.serviceId,
                    name: meta.name,
                    icon: meta.icon,
                    price: Number(p.price),
                    priceItemId: p.id,
                  };
                });
              } else {
                // If garment has no service prices saved yet, provide category-specific defaults
                const normCat = (cloth.categoryTag || '').toUpperCase().replace(/[^A-Z0-9]/g, '_');
                const rule = CATEGORY_SERVICES_RULES[normCat] || CATEGORY_SERVICES_RULES.MENS;
                clothServices = rule.defaultServices.map((d) => {
                  const meta = getServiceMeta(d.serviceId);
                  return {
                    serviceId: d.serviceId,
                    name: meta.name,
                    icon: meta.icon,
                    price: d.defaultPrice,
                  };
                });
              }

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
                            (e.target as HTMLImageElement).src = getLocalFallbackPhoto(cloth.name, cloth.categoryTag);
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

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingCloth(cloth)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer backdrop-blur-xs flex items-center gap-1 text-xs font-bold shadow-xs"
                            title="Edit Product & Services"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete "${cloth.name}"?`)) {
                                deleteClothType(cloth.id);
                              }
                            }}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer backdrop-blur-xs flex items-center gap-1 text-xs font-bold shadow-xs"
                            title={`Delete ${cloth.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                    </div>

                    {/* Garment Title & Subcategory */}
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black text-[var(--heading-color)] flex items-center gap-1.5">
                            <span>{cloth.icon}</span>
                            <span className="truncate">{cloth.name}</span>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                              {cloth.subCategory || 'General'}
                            </span>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              • {cloth.categoryLabel || cloth.categoryTag}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingCloth(cloth)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                            title="Edit Garment Details & Services"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete "${cloth.name}"? This removes the garment and its rates from the catalog.`)) {
                                deleteClothType(cloth.id);
                              }
                            }}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 cursor-pointer transition-all shadow-2xs"
                            title={`Delete ${cloth.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {cloth.description && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                          {cloth.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Service Rates Grid */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)]">
                    <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>Service Rates</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {clothServices.length}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingCloth(cloth)}
                        className="text-[9px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> Manage Services
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {clothServices.map((srv) => (
                        <div
                          key={srv.serviceId}
                          className={`group/srv p-1.5 px-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                            activeServiceFocus === srv.serviceId
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-[var(--border-color)] hover:border-blue-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenPriceModal(cloth, srv.serviceId)}
                            className="flex items-center justify-between flex-1 min-w-0 pr-1 cursor-pointer text-left"
                            title={`Click to edit ${srv.name} rate for ${cloth.name}`}
                          >
                            <span className="text-[11px] font-bold flex items-center gap-1 truncate pr-1">
                              <span>{srv.icon}</span>
                              <span className="truncate">{srv.name}</span>
                            </span>
                            <span className="text-xs font-black shrink-0">₹{srv.price}</span>
                          </button>

                          {srv.priceItemId && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Remove ${srv.name} service from ${cloth.name}?`)) {
                                  handleRemoveServiceFromCloth(srv.priceItemId!, srv.name, cloth);
                                }
                              }}
                              className="p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md opacity-0 group-hover/srv:opacity-100 transition-opacity cursor-pointer shrink-0 ml-0.5"
                              title={`Remove ${srv.name}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                  placeholder="https://anjanilaundry.s3.ap-south-2.amazonaws.com/..."
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] shrink-0">
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Add New Garment to Catalog
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Configure garment taxonomy, AWS S3 photography, and commercial service rates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
                if (!name) {
                  showToast('Garment name is required', 'error');
                  return;
                }
                const cat = addGarmentCategory;
                const sub = addGarmentSubcategory.trim() || 'General';
                const catMatch = categories.find((c) => c.id === cat);
                const icon = catMatch?.icon || '👔';

                setIsSubmittingNewProduct(true);
                try {
                  const categoryLabel = catMatch ? catMatch.name : (cat === 'MENS' ? "Men's Clothing" : "Commercial Garments");

                  const newId = `cloth-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
                  const newCloth: ClothType = {
                    id: newId,
                    name,
                    icon,
                    categoryTag: cat,
                    categoryLabel,
                    subCategory: sub,
                    description: `${name} laundry care & finishing.`,
                    imageUrl: addGarmentImageUrl || getLocalFallbackPhoto(name, cat),
                    isActive: true,
                    sortOrder: 99,
                  };

                  await addClothType(newCloth);

                  const newPriceItems: ServicePriceItem[] = addGarmentServices.map((srv) => {
                    const price = Number(srv.price) || 50;
                    return {
                      id: `pr-${newId}-${srv.serviceId}`,
                      clothTypeId: newId,
                      clothName: name,
                      clothIcon: icon,
                      categoryTag: cat,
                      serviceId: srv.serviceId,
                      serviceName: srv.serviceName,
                      price,
                      expressPrice: Math.round(price * 1.5),
                      turnaroundHours: srv.turnaroundHours || 24,
                      isActive: true,
                      isAvailable: true,
                    };
                  });

                  for (const p of newPriceItems) {
                    await upsertPriceItem(p);
                  }

                  showToast(`Added "${name}" to catalog with ${newPriceItems.length} service rates!`, 'success');
                  setShowAddModal(false);
                } catch (err: any) {
                  showToast('Failed to add product: ' + (err.message || 'Error'), 'error');
                } finally {
                  setIsSubmittingNewProduct(false);
                }
              }}
              className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1"
            >
              {/* Garment Name (Full Width - Icon Emoji Removed) */}
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Garment Name *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Linen Kurta, Silk Saree, Leather Jacket"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Master Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <MasterCategorySelectDropdown
                    value={addGarmentCategory}
                    onChange={handleAddGarmentCategoryChange}
                    categories={categories}
                    required
                  />
                  {categories.length === 0 && (
                    <div className="mt-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                      <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">No categories created yet</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setViewMode('CATEGORIES');
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        + Create Category First
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <SubcategorySelectDropdown
                    label="Subcategory"
                    categoryTag={addGarmentCategory}
                    value={addGarmentSubcategory}
                    onChange={setAddGarmentSubcategory}
                    required
                    onSubcategoryCreated={() => {
                      loadLiveCatalog();
                    }}
                  />
                </div>
              </div>

              {/* Photo Upload for New Garment (No misleading default photo) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)] space-y-2">
                <input
                  ref={addGarmentFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAddGarmentUploadingS3(true);
                    try {
                      const compressed = await compressImage(file, 800, 0.8);
                      const res = await fetch('/api/upload-s3', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          imageBase64: compressed,
                          fileName: `garment-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                        }),
                      });
                      const data = await res.json();
                      const s3Url = data.data?.s3Url || compressed;
                      setAddGarmentImageUrl(s3Url);
                      showToast('Photo uploaded to AWS S3!', 'success');
                    } catch (err: any) {
                      showToast('Failed to upload image: ' + err.message, 'error');
                    } finally {
                      setAddGarmentUploadingS3(false);
                    }
                  }}
                />

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Garment Photo (AWS S3)</span>
                  </label>
                  {addGarmentImageUrl?.includes('s3') && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> S3 Cloud Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border-2 border-dashed border-[var(--border-color)] relative flex items-center justify-center">
                    {addGarmentImageUrl ? (
                      <img
                        src={addGarmentImageUrl}
                        alt="Garment Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400" />
                    )}
                    {addGarmentUploadingS3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={addGarmentUploadingS3}
                        onClick={() => addGarmentFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {addGarmentUploadingS3 ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{addGarmentImageUrl ? 'Change Photo' : 'Choose Photo'}</span>
                          </>
                        )}
                      </button>
                      {addGarmentImageUrl && (
                        <button
                          type="button"
                          onClick={() => setAddGarmentImageUrl('')}
                          className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {addGarmentImageUrl
                        ? 'Photo ready. Stored in AWS S3 and shown in mobile app.'
                        : 'Optional. Fallback photography is automatically applied if omitted.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Attached Services & Pricing Builder */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Attached Services & Pricing ({addGarmentServices.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Shown in Customer App
                  </span>
                </div>

                {/* List of currently attached services with price input and delete button */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {addGarmentServices.map((srv) => (
                    <div
                      key={srv.serviceId}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--border-color)] gap-2 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{srv.serviceIcon || '🧺'}</span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-[var(--heading-color)] block truncate">
                            {srv.serviceName}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)]">
                            ⚡ {srv.turnaroundHours}h TAT • Express 1.5x
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-[var(--border-color)] shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={srv.price}
                            onChange={(e) =>
                              handleUpdateAddGarmentServicePrice(srv.serviceId, Number(e.target.value))
                            }
                            className="w-14 text-xs font-black text-[var(--heading-color)] text-right focus:outline-none"
                            placeholder="Price"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAddGarmentService(srv.serviceId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                          title={`Remove ${srv.serviceName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {addGarmentServices.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-1">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                        No services attached yet
                      </p>
                      <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
                        Select a service below to attach to this garment.
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Another Service Section */}
                {availableServicesToAdd.length > 0 && (
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <Plus className="w-3 h-3 text-blue-600" />
                        <span>Add Another Service</span>
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                        {availableServicesToAdd.length} available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <select
                          value={newServiceForAddModal.serviceId}
                          onChange={(e) => {
                            const found = servicesList.find((s) => s.id === e.target.value);
                            setNewServiceForAddModal({
                              serviceId: e.target.value,
                              price: found?.baseKgPrice || 50,
                              turnaroundHours: found?.turnaroundHours || 24,
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none"
                        >
                          {availableServicesToAdd.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.icon} {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-lg border border-[var(--border-color)]">
                          <span className="text-[10px] font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={newServiceForAddModal.price}
                            onChange={(e) =>
                              setNewServiceForAddModal({
                                ...newServiceForAddModal,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full text-xs font-bold text-[var(--heading-color)] focus:outline-none"
                            placeholder="Price"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={handleAddAnotherServiceToAddGarment}
                          disabled={!newServiceForAddModal.serviceId}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Attach</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewProduct}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingNewProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Adding to Catalog...</span>
                    </>
                  ) : (
                    <span>Add to Catalog</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: Edit Garment / Product & Manage its Services */}
      {/* ========================================================================= */}
      {editingCloth && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)]">
                  {editingClothForm.icon || editingCloth.icon}
                </span>
                <div>
                  <h3 className="text-base font-black text-[var(--heading-color)] flex items-center gap-2">
                    <span>Edit Product: {editingClothForm.name || editingCloth.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {editingCloth.id}
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Update product information, subcategory, photo, and configure attached laundry services.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCloth(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="overflow-y-auto pr-1 py-4 space-y-6 flex-1">
              {/* 1. Basic Product Info Form */}
              <form id="edit-cloth-form" onSubmit={handleSaveClothDetails} className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Product Details</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Product / Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClothForm.name}
                    onChange={(e) => setEditingClothForm({ ...editingClothForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <MasterCategorySelectDropdown
                      value={editingClothForm.categoryTag}
                      onChange={(catId) =>
                        setEditingClothForm({ ...editingClothForm, categoryTag: catId })
                      }
                      categories={categories}
                      required
                    />
                  </div>

                  <div>
                    <SubcategorySelectDropdown
                      value={editingClothForm.subCategory}
                      categoryTag={editingClothForm.categoryTag}
                      onChange={(sub) => setEditingClothForm({ ...editingClothForm, subCategory: sub })}
                      required
                    />
                  </div>
                </div>

                {/* Product Photo Upload directly inside Edit Modal */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)] space-y-2">
                  <input
                    ref={editGarmentFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setEditGarmentUploadingS3(true);
                      try {
                        const compressed = await compressImage(file, 800, 0.8);
                        const res = await fetch('/api/upload-s3', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            imageBase64: compressed,
                            fileName: `garment-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                          }),
                        });
                        const data = await res.json();
                        const s3Url = data.data?.s3Url || compressed;
                        setEditingClothForm((prev) => ({ ...prev, imageUrl: s3Url }));
                        showToast('✓ Photo uploaded to AWS S3 & applied to garment!', 'success');
                      } catch (err: any) {
                        showToast('Failed to upload image: ' + err.message, 'error');
                      } finally {
                        setEditGarmentUploadingS3(false);
                      }
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>Product Photography (AWS S3 Cloud)</span>
                    </label>
                    {editingClothForm.imageUrl?.includes('s3') && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> AWS S3 Synced
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-[var(--border-color)] relative">
                      <img
                        src={editingClothForm.imageUrl || getLocalFallbackPhoto(editingClothForm.name, editingClothForm.categoryTag)}
                        alt={editingClothForm.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {editGarmentUploadingS3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={editGarmentUploadingS3}
                          onClick={() => editGarmentFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {editGarmentUploadingS3 ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading to S3...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload New Photo</span>
                            </>
                          )}
                        </button>
                        {editingClothForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setEditingClothForm((prev) => ({ ...prev, imageUrl: '' }))}
                            className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        Uploads directly to AWS S3 & displays in customer mobile app
                      </p>
                    </div>
                  </div>

                  {/* Direct URL input */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-color)]">
                    <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={editingClothForm.imageUrl || ''}
                      onChange={(e) => setEditingClothForm({ ...editingClothForm, imageUrl: e.target.value })}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-[10px] font-mono text-[var(--heading-color)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Description & Care Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editingClothForm.description}
                    onChange={(e) => setEditingClothForm({ ...editingClothForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-medium text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Short description shown to customers..."
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-[var(--border-color)]">
                  <div>
                    <span className="text-xs font-bold text-[var(--heading-color)] block">Catalog Visibility</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {editingClothForm.isActive ? 'Visible to all customers in mobile app' : 'Hidden from customer app'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingClothForm({ ...editingClothForm, isActive: !editingClothForm.isActive })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      editingClothForm.isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {editingClothForm.isActive ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </form>

              {/* 2. Services & Price Matrix for this Garment */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>2. Services Linked to this Product (Appears in Mobile App)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {priceMatrix.filter((p) => p.clothTypeId === editingCloth.id && p.isActive !== false && Number(p.price) > 0 && isServiceAllowedForCategory(editingCloth.categoryTag, p.serviceId)).length} services active
                  </span>
                </div>

                {/* List of current services */}
                <div className="space-y-2">
                  {priceMatrix
                    .filter((p) => p.clothTypeId === editingCloth.id && p.isActive !== false && Number(p.price) > 0 && isServiceAllowedForCategory(editingCloth.categoryTag, p.serviceId))
                    .map((item) => {
                      const meta = getServiceMeta(item.serviceId);
                      return (
                        <div
                          key={item.id || item.serviceId}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--border-color)] gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{meta.icon}</span>
                            <div className="truncate">
                              <span className="text-xs font-black text-[var(--heading-color)] block truncate">
                                {meta.name}
                              </span>
                              <span className="text-[10px] text-[var(--text-secondary)]">
                                Turnaround: {item.turnaroundHours || 24}h • Express: ₹{item.expressPrice || Math.round(item.price * 1.5)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                              <span className="text-[11px] font-bold text-slate-400">₹</span>
                              <input
                                type="number"
                                min="1"
                                value={item.price}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  upsertPriceItem({
                                    ...item,
                                    price: val,
                                    expressPrice: Math.round(val * 1.5),
                                  });
                                }}
                                className="w-14 text-xs font-black text-[var(--heading-color)] text-right focus:outline-none"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenPriceModal(editingCloth, item.serviceId)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                              title="Full price details"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveServiceFromCloth(item.id, meta.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Remove service from this product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Add New Service to this Garment Form */}
                <form
                  onSubmit={handleAddServiceToCloth}
                  className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Add Another Service to {editingCloth.name}</span>
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      (Category: {editingCloth.categoryTag})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Select Service
                      </label>
                      <select
                        value={newServiceToAdd.serviceId}
                        onChange={(e) => {
                          const srvId = e.target.value;
                          const found = servicesList.find((s) => s.id === srvId);
                          setNewServiceToAdd({
                            ...newServiceToAdd,
                            serviceId: srvId,
                            turnaroundHours: found?.turnaroundHours || 24,
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none"
                      >
                        {servicesList
                          .filter((srv) => isServiceAllowedForCategory(editingCloth.categoryTag, srv.id))
                          .map((srv) => (
                            <option key={srv.id} value={srv.id}>
                              {srv.icon} {srv.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newServiceToAdd.price}
                        onChange={(e) => {
                          const p = Number(e.target.value);
                          setNewServiceToAdd({
                            ...newServiceToAdd,
                            price: p,
                            expressPrice: Math.round(p * 1.5),
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Turnaround (h)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newServiceToAdd.turnaroundHours}
                        onChange={(e) =>
                          setNewServiceToAdd({ ...newServiceToAdd, turnaroundHours: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service to Garment</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] shrink-0">
              <button
                type="button"
                onClick={handleDeleteCloth}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Garment</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCloth(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="edit-cloth-form"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Product Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Add / Edit Master Category */}
      {/* ========================================================================= */}
      {(editingCategory || isAddingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {isAddingCategory ? <FolderPlus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--heading-color)]">
                    {isAddingCategory ? 'Add Master Category' : `Edit Category: ${editingCategory?.name}`}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Configure name, category ID, customer app cover photo, and status.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsAddingCategory(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }} className="mt-4 space-y-4">
              {/* Category Name & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Men's Wear"
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setCategoryForm((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        id: isAddingCategory && !prev.id ? name.toUpperCase().replace(/[^A-Z0-9]/g, '_') : prev.id,
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                    Category ID / Code *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAddingCategory}
                    placeholder="e.g. MENS or ETHNIC"
                    value={categoryForm.id}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        id: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''),
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold disabled:opacity-60 focus:outline-hidden focus:border-blue-500 uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary for customer app cards (e.g. Shirts, T-Shirts, Trousers...)"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Cover Photo: Upload or URL */}
              <div>
                <label className="text-xs font-bold text-[var(--heading-color)] block mb-1">
                  Category Cover Photo (AWS S3)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--border-color)] overflow-hidden shrink-0 flex items-center justify-center">
                    {categoryForm.imageUrl ? (
                      <img
                        src={categoryForm.imageUrl}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <UploadCloud className="w-6 h-6 mb-0.5 text-slate-400" />
                        <span className="text-[9px] font-bold">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={categoryFileInputRef}
                      accept="image/*"
                      onChange={handleCategoryModalUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={categoryUploadingS3}
                      onClick={() => categoryFileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {categoryUploadingS3 ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to AWS S3...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Photo from Computer (AWS S3)</span>
                        </>
                      )}
                    </button>

                    <input
                      type="url"
                      placeholder="Or paste direct image URL https://..."
                      value={categoryForm.imageUrl}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)]">
                <div>
                  <span className="text-xs font-bold text-[var(--heading-color)] block">
                    Category Visibility
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    When active, category appears in customer mobile app
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    categoryForm.isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {categoryForm.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsAddingCategory(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAddingCategory ? 'Create Category' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Delete Category Confirmation */}
      {/* ========================================================================= */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Delete Category
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Permanent action affecting catalog navigation.
                </p>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <p className="text-xs text-[var(--heading-color)] font-medium leading-relaxed">
                Are you sure you want to permanently delete <span className="font-black text-rose-600">"{deletingCategory.name}"</span> ({deletingCategory.id})?
              </p>

              {(categoryCounts[deletingCategory.id] || 0) > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Linked Garments Warning</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    There are currently <strong>{categoryCounts[deletingCategory.id]} garments</strong> assigned to this category. Deleting this category will remove it from customer navigation.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                type="button"
                disabled={isDeletingCategoryLoading}
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingCategoryLoading}
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingCategoryLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Add / Edit Service Master */}
      {/* ========================================================================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[var(--border-color)] max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                  <span>{serviceForm.icon || '✨'}</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--heading-color)]">
                    {editingService ? `Edit Service: ${editingService.name}` : 'Add New Laundry Service'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Configure service name, turnaround time, pricing model & photo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden file input for photo upload */}
            <input
              ref={serviceFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleServiceModalUpload}
            />

            {/* Modal Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveService();
              }}
              className="mt-4 space-y-4"
            >
              {/* Service Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)] mb-1">
                    Service Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iron Only (Steam Press)"
                    value={serviceForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setServiceForm((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)] mb-1">
                    Service ID / Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. srv-m-steam-iron"
                    value={serviceForm.id}
                    disabled={Boolean(editingService)}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Icon Picker & Quick Presets */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)] mb-1.5">
                  Service Icon / Emoji
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-14 text-center px-2 py-1.5 text-lg rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none flex-1">
                    {['👔', '🧺', '🧥', '👞', '✨', '🪟', '🛏️', '🔥', '🧸', '🧽', '👗', '⚡'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setServiceForm((prev) => ({ ...prev, icon: emoji }))}
                        className={`p-1.5 rounded-lg text-base hover:bg-blue-50 dark:hover:bg-blue-950 transition-all cursor-pointer ${
                          serviceForm.icon === emoji ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Turnaround Time (TAT) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)]">
                    Turnaround Time (Hours) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {serviceForm.turnaroundHours} hours ({Math.round((serviceForm.turnaroundHours / 24) * 10) / 10} days)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="168"
                    required
                    value={serviceForm.turnaroundHours}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, turnaroundHours: Number(e.target.value) || 24 }))}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[12, 18, 24, 36, 48, 72].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setServiceForm((prev) => ({ ...prev, turnaroundHours: hrs }))}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          serviceForm.turnaroundHours === hrs
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                        }`}
                      >
                        {hrs}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Model Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)] mb-1.5">
                  Pricing Model <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setServiceForm((prev) => ({ ...prev, pricingType: 'PER_ITEM' }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      serviceForm.pricingType === 'PER_ITEM'
                        ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/40 ring-2 ring-violet-500/20'
                        : 'border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">👔</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        serviceForm.pricingType === 'PER_ITEM' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        Per Item
                      </span>
                    </div>
                    <div className="text-xs font-black text-[var(--heading-color)]">Individual Garments</div>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight">
                      Rates configured per cloth type in the 2D Pricing Matrix.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceForm((prev) => ({ ...prev, pricingType: 'PER_KG' }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      serviceForm.pricingType === 'PER_KG'
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : 'border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">⚖️</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        serviceForm.pricingType === 'PER_KG' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        Per Kilogram
                      </span>
                    </div>
                    <div className="text-xs font-black text-[var(--heading-color)]">Bulk Weight</div>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight">
                      Flat/tiered rate charged per kilogram for daily wash & fold.
                    </p>
                  </button>
                </div>
              </div>

              {/* If Per Kg: Base Price & Min Order Kg */}
              {serviceForm.pricingType === 'PER_KG' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200 mb-1">
                      Base Price per Kg (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={serviceForm.baseKgPrice}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, baseKgPrice: e.target.value }))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-black text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200 mb-1">
                      Min Order Weight (Kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={serviceForm.minOrderKg}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, minOrderKg: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-black text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="3"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--heading-color)] mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. High-pressure wrinkle removal, sharp crease setting & crisp hanger finish."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-xs font-medium text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[var(--heading-color)]">
                    Service Cover Photo
                  </label>
                  {serviceForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setServiceForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-[var(--border-color)] shadow-inner flex items-center justify-center text-xl">
                    {serviceForm.imageUrl ? (
                      <img
                        src={serviceForm.imageUrl}
                        alt="Service Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{serviceForm.icon || '✨'}</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      disabled={serviceUploadingS3}
                      onClick={() => serviceFileInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {serviceUploadingS3 ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to S3...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload from Computer</span>
                        </>
                      )}
                    </button>

                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={serviceForm.imageUrl}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--border-color)] text-[11px] text-[var(--heading-color)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)]">
                <div>
                  <div className="text-xs font-bold text-[var(--heading-color)]">Service Status</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {serviceForm.isActive ? 'Active and visible in customer booking screens' : 'Hidden from customer bookings'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    serviceForm.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                  }`}
                >
                  {serviceForm.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingService}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingService ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Service...</span>
                    </>
                  ) : (
                    <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Delete Service Confirmation */}
      {/* ========================================================================= */}
      {deletingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[var(--border-color)] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-color)]">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center text-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[var(--heading-color)]">
                  Delete Service Master
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Permanent action affecting catalog and customer bookings.
                </p>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <p className="text-xs text-[var(--heading-color)] font-medium leading-relaxed">
                Are you sure you want to permanently delete <span className="font-black text-rose-600">"{deletingService.name}"</span> ({deletingService.id})?
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                This will remove the service from all customer order flows, rate sheets, and the commercial catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                type="button"
                disabled={isDeletingServiceLoading}
                onClick={() => setDeletingService(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingServiceLoading}
                onClick={handleConfirmDeleteService}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingServiceLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Service</span>
                  </>
                )}
              </button>
            </div>
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
