'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  DollarSign,
  Save,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Layers,
  FolderPlus,
  Grid,
  List,
  Sliders,
  X,
  Check,
} from 'lucide-react';
import { ClothCategoryTag, ClothType, ServiceMaster, ServicePriceItem, PricingUnit } from '@/types';
import { GarmentImage, ServiceMasterBadge } from '@/components/common/GarmentImage';

interface CategoryTab {
  tag: string;
  label: string;
  icon: string;
}

const DEFAULT_CATEGORIES: CategoryTab[] = [
  { tag: 'ALL', label: 'All Items', icon: '🧺' },
  { tag: 'MENS', label: "Men's Wear", icon: '👔' },
  { tag: 'WOMENS', label: "Women's Wear", icon: '👗' },
  { tag: 'PREMIUM_BRIDAL', label: 'Premium & Bridal', icon: '💍' },
  { tag: 'KIDS', label: 'Kids Wear', icon: '👶' },
  { tag: 'HOME_TEXTILES', label: 'Home Textiles', icon: '🛏️' },
  { tag: 'SPECIAL_CLEANING', label: 'Special Cleaning', icon: '🧹' },
  { tag: 'BULK_KG', label: 'Bulk / KG Laundry', icon: '🧺' },
  { tag: 'BABY_CARE', label: 'Baby Care', icon: '👶' },
  { tag: 'WEDDING_CARE', label: 'Wedding Care', icon: '💍' },
  { tag: 'CORPORATE', label: 'Corporate', icon: '🏢' },
];

export default function AdminPricingEnginePage() {
  const {
    clothTypes,
    serviceMasters,
    priceMatrix,
    pricingSettings,
    addClothType,
    updateClothType,
    deleteClothType,
    updatePriceItem,
    upsertPriceItem,
    updatePricingSettings,
    showToast,
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic Category Tabs State
  const [categories, setCategories] = useState<CategoryTab[]>(DEFAULT_CATEGORIES);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryTab | null>(null);
  const [categoryForm, setCategoryForm] = useState({ label: '', icon: '🧥', tag: '' });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    taxPercentage: pricingSettings.taxPercentage || 18,
    minOrderValue: pricingSettings.minOrderValue || 299,
    freeDeliveryThreshold: pricingSettings.freeDeliveryThreshold || 499,
    standardDeliveryFee: pricingSettings.standardDeliveryFee || 40,
    expressDeliveryFee: pricingSettings.expressDeliveryFee || 150,
  });

  useEffect(() => {
    setSettingsForm({
      taxPercentage: pricingSettings.taxPercentage || 18,
      minOrderValue: pricingSettings.minOrderValue || 299,
      freeDeliveryThreshold: pricingSettings.freeDeliveryThreshold || 499,
      standardDeliveryFee: pricingSettings.standardDeliveryFee || 40,
      expressDeliveryFee: pricingSettings.expressDeliveryFee || 150,
    });
  }, [pricingSettings]);

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingSettings(settingsForm);
    showToast('Financial rules and pricing policies saved successfully!');
  };

  // Category Modal Handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label.trim()) return;

    let updated: CategoryTab[];
    if (editingCategory) {
      updated = categories.map((c) =>
        c.tag === editingCategory.tag
          ? { ...c, label: categoryForm.label, icon: categoryForm.icon }
          : c
      );
    } else {
      const generatedTag = categoryForm.tag.trim()
        ? categoryForm.tag.toUpperCase()
        : categoryForm.label.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      updated = [...categories, { tag: generatedTag, label: categoryForm.label, icon: categoryForm.icon }];
    }

    setCategories(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laundry_admin_category_tabs', JSON.stringify(updated));
    }
    setShowCategoryModal(false);
    setCategoryForm({ label: '', icon: '🧥', tag: '' });
    setEditingCategory(null);
    showToast(editingCategory ? 'Category updated!' : 'Category tab created!');
  };

  const handleDeleteCategory = (tag: string, label: string) => {
    if (tag === 'ALL') return;
    if (confirm(`Delete category tab "${label}"?`)) {
      const updated = categories.filter((c) => c.tag !== tag);
      setCategories(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('laundry_admin_category_tabs', JSON.stringify(updated));
      }
      if (activeCategory === tag) setActiveCategory('ALL');
      showToast(`Category "${label}" removed.`);
    }
  };

  // Add / Edit Cloth Modal State
  const [showClothModal, setShowClothModal] = useState(false);
  const [editingCloth, setEditingCloth] = useState<ClothType | null>(null);
  const [clothForm, setClothForm] = useState({
    name: '',
    icon: '👕',
    categoryTag: 'MENS' as ClothCategoryTag,
    description: '',
    defaultUnit: 'PER_PIECE' as PricingUnit,
    imageUrl: '',
    isActive: true,
  });

  const openAddClothModal = () => {
    setEditingCloth(null);
    setClothForm({
      name: '',
      icon: '👕',
      categoryTag: (activeCategory !== 'ALL' ? activeCategory : 'MENS') as ClothCategoryTag,
      description: '',
      defaultUnit: 'PER_PIECE',
      imageUrl: '',
      isActive: true,
    });
    setShowClothModal(true);
  };

  const openEditClothModal = (cloth: ClothType) => {
    setEditingCloth(cloth);
    setClothForm({
      name: cloth.name,
      icon: cloth.icon || '👕',
      categoryTag: cloth.categoryTag,
      description: cloth.description || '',
      defaultUnit: cloth.defaultUnit || 'PER_PIECE',
      imageUrl: cloth.imageUrl || '',
      isActive: cloth.isActive !== false,
    });
    setShowClothModal(true);
  };

  const handleSaveCloth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clothForm.name.trim()) return;

    if (editingCloth) {
      updateClothType(editingCloth.id, {
        name: clothForm.name,
        icon: clothForm.icon,
        categoryTag: clothForm.categoryTag,
        categoryLabel: categories.find((c) => c.tag === clothForm.categoryTag)?.label || clothForm.categoryTag,
        defaultUnit: clothForm.defaultUnit,
        description: clothForm.description,
        imageUrl: clothForm.imageUrl || undefined,
        isActive: clothForm.isActive,
      });
      showToast(`Updated "${clothForm.name}" successfully!`);
    } else {
      const newId = `ct-custom-${Date.now()}`;
      const newCloth: ClothType = {
        id: newId,
        name: clothForm.name,
        icon: clothForm.icon,
        categoryTag: clothForm.categoryTag,
        categoryLabel: categories.find((c) => c.tag === clothForm.categoryTag)?.label || clothForm.categoryTag,
        defaultUnit: clothForm.defaultUnit,
        description: clothForm.description,
        imageUrl: clothForm.imageUrl || undefined,
        availableServices: serviceMasters.map((s) => s.id),
        isActive: clothForm.isActive,
        sortOrder: clothTypes.length + 1,
      };

      addClothType(newCloth);
      showToast(`Added "${newCloth.name}" to catalog!`);
    }

    setShowClothModal(false);
  };

  // Cell Inspector Modal State
  const [inspectCell, setInspectCell] = useState<{ cloth: ClothType; service: ServiceMaster; item: ServicePriceItem } | null>(null);
  const [cellForm, setCellForm] = useState({
    isAvailable: true,
    price: 0,
    expressPrice: 0,
    pricingUnit: 'PER_PIECE' as PricingUnit,
    turnaroundHours: 24,
    expressTurnaroundHours: 12,
    minQuantity: 1,
    specialNotes: '',
  });

  const openCellInspector = (cloth: ClothType, service: ServiceMaster) => {
    const existing = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === service.id);
    const isAvailable = existing ? existing.isAvailable !== false && existing.price > 0 : (cloth.availableServices ? cloth.availableServices.includes(service.id) : true);

    const price = existing ? existing.price : 50;
    const expressPrice = existing?.expressPrice || Math.round(price * 1.5);

    const item: ServicePriceItem = existing || {
      id: `pr-${cloth.id}-${service.id}`,
      clothTypeId: cloth.id,
      clothName: cloth.name,
      clothIcon: cloth.icon,
      categoryTag: cloth.categoryTag,
      serviceId: service.id,
      serviceName: service.name,
      price,
      expressPrice,
      pricingUnit: cloth.defaultUnit || 'PER_PIECE',
      turnaroundHours: service.turnaroundHours,
      expressTurnaroundHours: 12,
      isActive: true,
      isAvailable,
    };

    setInspectCell({ cloth, service, item });
    setCellForm({
      isAvailable,
      price: item.price,
      expressPrice: item.expressPrice || Math.round(item.price * 1.5),
      pricingUnit: item.pricingUnit || cloth.defaultUnit || 'PER_PIECE',
      turnaroundHours: item.turnaroundHours || service.turnaroundHours,
      expressTurnaroundHours: item.expressTurnaroundHours || 12,
      minQuantity: item.minQuantity || 1,
      specialNotes: item.specialNotes || '',
    });
  };

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectCell) return;

    const updatedItem: ServicePriceItem = {
      ...inspectCell.item,
      price: cellForm.isAvailable ? cellForm.price : 0,
      expressPrice: cellForm.isAvailable ? cellForm.expressPrice : 0,
      pricingUnit: cellForm.pricingUnit,
      turnaroundHours: cellForm.turnaroundHours,
      expressTurnaroundHours: cellForm.expressTurnaroundHours,
      minQuantity: cellForm.minQuantity,
      isAvailable: cellForm.isAvailable,
      specialNotes: cellForm.specialNotes,
    };

    upsertPriceItem(updatedItem);
    setInspectCell(null);
    showToast(`Updated price rule for ${inspectCell.cloth.name} × ${inspectCell.service.name}!`);
  };

  const handleDeleteCloth = (clothId: string, name: string) => {
    if (confirm(`Delete garment "${name}" from catalog?`)) {
      deleteClothType(clothId);
      showToast(`Removed "${name}"`);
    }
  };

  // Filter Clothes with Smart Category Alias Matching
  const filteredClothes = clothTypes.filter((c) => {
    let matchesCategory = false;
    if (activeCategory === 'ALL') {
      matchesCategory = true;
    } else if (c.categoryTag === activeCategory) {
      matchesCategory = true;
    } else if (activeCategory === 'WEDDING_CARE') {
      matchesCategory =
        c.categoryTag === 'PREMIUM_BRIDAL' ||
        c.categoryTag === 'WEDDING_CARE' ||
        /wedding|gown|brid|lehenga|tuxedo|sherwani|anarkali/i.test(c.name);
    } else if (activeCategory === 'BABY_CARE') {
      matchesCategory =
        c.categoryTag === 'KIDS' ||
        c.categoryTag === 'BABY_CARE' ||
        /baby|kid|child|romper|onesie|infant|bib/i.test(c.name);
    } else if (activeCategory === 'CORPORATE') {
      matchesCategory =
        c.categoryTag === 'CORPORATE' ||
        /uniform|blazer|suit|apron|chef|lab coat|doctor/i.test(c.name);
    } else if (activeCategory === 'PREMIUM_BRIDAL') {
      matchesCategory =
        c.categoryTag === 'PREMIUM_BRIDAL' ||
        c.categoryTag === 'WEDDING_CARE' ||
        /wedding|gown|brid|lehenga|tuxedo|silk|saree/i.test(c.name);
    } else if (activeCategory === 'KIDS') {
      matchesCategory = c.categoryTag === 'KIDS' || c.categoryTag === 'BABY_CARE';
    }

    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-hover)] px-2.5 py-0.5 rounded-full border border-emerald-200">
            Laundry Engine & Dynamic Matrix
          </span>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1">
            Garment & Service 2D Pricing Matrix
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Configure exact pricing, express rates, turnaround times, and service availability for all 10 non-footwear categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="bg-[var(--bg-secondary-card)] border border-[var(--border-color)] p-1 rounded-[8px] flex items-center gap-1">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-[6px] transition-all flex items-center gap-1 text-xs font-bold ${
                viewMode === 'GRID' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
              title="2D Matrix Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2D Grid</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-[6px] transition-all flex items-center gap-1 text-xs font-bold ${
                viewMode === 'TABLE' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
              title="List Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryForm({ label: '', icon: '🧥', tag: '' });
              setShowCategoryModal(true);
            }}
            className="admin-btn-secondary"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Add Category</span>
          </button>

          <button onClick={openAddClothModal} className="admin-btn-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Global Financial Rules & Surcharge Card */}
      <div className="azea-card p-5 text-xs space-y-4" suppressHydrationWarning>
        <h3 className="font-bold text-sm text-[var(--heading-color)] pb-3 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[var(--primary)]" />
            <span>Global Financial & Delivery Pricing Rules</span>
          </div>
          <span className="text-[11px] font-normal text-[var(--text-secondary)]">Live on Customer Checkout</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                value={settingsForm.taxPercentage}
                onChange={(e) => setSettingsForm({ ...settingsForm, taxPercentage: parseFloat(e.target.value) || 0 })}
                className="admin-input w-full font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={settingsForm.minOrderValue}
                onChange={(e) => setSettingsForm({ ...settingsForm, minOrderValue: parseFloat(e.target.value) || 0 })}
                className="admin-input w-full font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Free Delivery Above (₹)</label>
              <input
                type="number"
                value={settingsForm.freeDeliveryThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                className="admin-input w-full font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Standard Delivery (₹)</label>
              <input
                type="number"
                value={settingsForm.standardDeliveryFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, standardDeliveryFee: parseFloat(e.target.value) || 0 })}
                className="admin-input w-full font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Express Surcharge (₹)</label>
              <input
                type="number"
                value={settingsForm.expressDeliveryFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, expressDeliveryFee: parseFloat(e.target.value) || 0 })}
                className="admin-input w-full font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" className="admin-btn-primary">
              <Save className="w-3.5 h-3.5" />
              <span>Save Financial Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Toolbar & Category Tabs Strip */}
      <div className="azea-card overflow-hidden text-xs">
        <div className="p-4 border-b border-[var(--border-color)] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirt, saree, bedsheet, blazer..."
                className="admin-input w-full pl-9"
              />
            </div>

            <div className="text-[11px] text-[var(--text-secondary)] font-medium" suppressHydrationWarning>
              Showing <span className="font-bold text-[var(--heading-color)]" suppressHydrationWarning>{isMounted ? filteredClothes.length : 0}</span> Garments ×{' '}
              <span className="font-bold text-[var(--heading-color)]" suppressHydrationWarning>{isMounted ? serviceMasters.length : 0}</span> Services
            </div>
          </div>

          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {categories.map((cat) => (
              <div key={cat.tag} className="relative group shrink-0">
                <button
                  onClick={() => setActiveCategory(cat.tag)}
                  className={`px-3 py-1.5 rounded-[8px] font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    activeCategory === cat.tag
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs'
                      : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2D MATRIX GRID VIEW */}
        {viewMode === 'GRID' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" suppressHydrationWarning>
              <thead>
                <tr className="bg-[var(--bg-secondary-card)] border-b border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] font-bold">
                  <th className="p-3 pl-6 w-64">Garment / Cloth Type</th>
                  {serviceMasters.map((srv) => (
                    <th key={srv.id} className="p-3 text-center min-w-[140px]">
                      <div className="flex items-center justify-center">
                        <ServiceMasterBadge name={srv.name} icon={srv.icon} />
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-right pr-6 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredClothes.length === 0 ? (
                  <tr>
                    <td colSpan={serviceMasters.length + 2} className="p-8 text-center text-[var(--text-secondary)]">
                      No garments found matching active category or search query.
                    </td>
                  </tr>
                ) : (
                  filteredClothes.map((cloth) => (
                    <tr key={cloth.id} className="hover:bg-slate-500/5 transition-colors">
                      {/* Garment Details with Rich Image Badge */}
                      <td className="p-3 pl-6">
                        <div className="flex items-center gap-3">
                          <GarmentImage
                            name={cloth.name}
                            icon={cloth.icon}
                            categoryTag={cloth.categoryTag}
                            imageUrl={cloth.imageUrl}
                            size="md"
                          />
                          <div>
                            <div className="font-bold text-[var(--heading-color)] text-xs">{cloth.name}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] font-medium">
                              {cloth.categoryTag} • {cloth.defaultUnit || 'PER_PIECE'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Matrix Cells */}
                      {serviceMasters.map((srv) => {
                        const priceItem = priceMatrix.find((p) => p.clothTypeId === cloth.id && p.serviceId === srv.id);
                        const isAvailable = priceItem ? priceItem.isAvailable !== false && priceItem.price > 0 : (cloth.availableServices ? cloth.availableServices.includes(srv.id) : true);

                        return (
                          <td key={srv.id} className="p-2 text-center">
                            <button
                              onClick={() => openCellInspector(cloth, srv)}
                              className={`w-full py-2 px-2 rounded-[8px] border transition-all cursor-pointer flex flex-col items-center justify-center ${
                                isAvailable
                                  ? 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--primary)] hover:shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                              }`}
                            >
                              {isAvailable && priceItem ? (
                                <>
                                  <span className="font-extrabold text-xs text-[var(--primary)]">₹{priceItem.price}</span>
                                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">
                                    Exp: ₹{priceItem.expressPrice || Math.round(priceItem.price * 1.5)}
                                  </span>
                                  <span className="text-[8px] text-[var(--text-secondary)] font-mono uppercase mt-0.5">
                                    {priceItem.pricingUnit || cloth.defaultUnit || 'PER_PIECE'}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[11px] font-bold text-slate-400">—</span>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Actions */}
                      <td className="p-3 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditClothModal(cloth)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[6px] transition-colors cursor-pointer"
                            title={`Edit ${cloth.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCloth(cloth.id, cloth.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[6px] transition-colors cursor-pointer"
                            title={`Delete ${cloth.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TABLE LIST VIEW */
          <div className="overflow-x-auto">
            <table className="azea-table" suppressHydrationWarning>
              <thead>
                <tr>
                  <th className="pl-6">Garment</th>
                  <th>Category Tag</th>
                  <th>Service Master</th>
                  <th>Regular Price</th>
                  <th>Express Price</th>
                  <th>TAT</th>
                  <th className="text-center font-bold">Status</th>
                  <th className="text-right pr-6">Edit</th>
                </tr>
              </thead>
              <tbody>
                {priceMatrix.map((item) => (
                  <tr key={item.id}>
                    <td className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <GarmentImage
                          name={item.clothName}
                          icon={item.clothIcon}
                          categoryTag={item.categoryTag}
                          size="sm"
                        />
                        <span className="font-bold text-[var(--heading-color)]">{item.clothName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] px-2 py-0.5 rounded font-semibold text-[10px] border border-[var(--border-color)]">
                        {item.categoryTag}
                      </span>
                    </td>
                    <td>
                      <ServiceMasterBadge name={item.serviceName} size="sm" />
                    </td>
                    <td className="font-extrabold text-[var(--primary)]">₹{item.price}</td>
                    <td className="font-bold text-amber-600">₹{item.expressPrice || Math.round(item.price * 1.5)}</td>
                    <td>{item.turnaroundHours}h</td>
                    <td className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isAvailable !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {item.isAvailable !== false ? 'Available' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-right pr-6">
                      <button
                        onClick={() => {
                          const cloth = clothTypes.find((c) => c.id === item.clothTypeId);
                          const srv = serviceMasters.find((s) => s.id === item.serviceId);
                          if (cloth && srv) openCellInspector(cloth, srv);
                        }}
                        className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CELL INSPECTOR MODAL */}
      {inspectCell && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <GarmentImage
                  name={inspectCell.cloth.name}
                  icon={inspectCell.cloth.icon}
                  categoryTag={inspectCell.cloth.categoryTag}
                  imageUrl={inspectCell.cloth.imageUrl}
                  size="lg"
                />
                <div>
                  <h3 className="font-bold text-sm text-[var(--heading-color)]">
                    {inspectCell.cloth.name} × {inspectCell.service.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">Cell Pricing & Service Inspector</p>
                </div>
              </div>
              <button onClick={() => setInspectCell(null)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCell} className="space-y-4">
              {/* Service Availability Toggle */}
              <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)]">
                <div>
                  <div className="font-bold text-[var(--heading-color)]">Service Available for Garment</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">
                    If disabled, this service displays as &quot;—&quot; and hidden in checkout.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={cellForm.isAvailable}
                  onChange={(e) => setCellForm({ ...cellForm, isAvailable: e.target.checked })}
                  className="w-4 h-4 accent-[#16A34A]"
                />
              </div>

              {cellForm.isAvailable && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[var(--heading-color)] block mb-1">Regular Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={cellForm.price}
                        onChange={(e) => setCellForm({ ...cellForm, price: parseFloat(e.target.value) || 0 })}
                        className="admin-input w-full font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[var(--heading-color)] block mb-1">Express Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={cellForm.expressPrice}
                        onChange={(e) => setCellForm({ ...cellForm, expressPrice: parseFloat(e.target.value) || 0 })}
                        className="admin-input w-full font-bold text-sm text-amber-600 dark:text-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[var(--heading-color)] block mb-1">Pricing Unit</label>
                      <select
                        value={cellForm.pricingUnit}
                        onChange={(e) => setCellForm({ ...cellForm, pricingUnit: e.target.value as PricingUnit })}
                        className="admin-input w-full font-bold text-xs"
                      >
                        <option value="PER_PIECE">Per Piece (₹/pc)</option>
                        <option value="PER_SET">Per Set (₹/set)</option>
                        <option value="PER_KG">Per KG (₹/kg)</option>
                        <option value="PER_SQ_FT">Per Sq Ft (₹/sq ft)</option>
                        <option value="PER_PANEL">Per Panel (₹/panel)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[var(--heading-color)] block mb-1">Regular TAT (Hours)</label>
                      <input
                        type="number"
                        value={cellForm.turnaroundHours}
                        onChange={(e) => setCellForm({ ...cellForm, turnaroundHours: parseInt(e.target.value) || 24 })}
                        className="admin-input w-full font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">Special Handling Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Hydrocarbon solvent dry clean only"
                      value={cellForm.specialNotes}
                      onChange={(e) => setCellForm({ ...cellForm, specialNotes: e.target.value })}
                      className="admin-input w-full"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setInspectCell(null)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Cell Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)]">
                  {editingCategory ? 'Edit Category Tab' : 'Add New Category Tab'}
                </h3>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  Create a new apparel tab (e.g. Winter Wear, Ethnic).
                </p>
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Category Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Wear, Traditional & Festive"
                  value={categoryForm.label}
                  onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="admin-input w-full text-center text-base font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Tag Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. WINTER_WEAR"
                    value={categoryForm.tag}
                    onChange={(e) => setCategoryForm({ ...categoryForm, tag: e.target.value })}
                    className="admin-input w-full font-mono font-bold uppercase text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingCategory ? 'Update Category' : 'Save Category Tab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLOTH MODAL */}
      {showClothModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)]">
                  {editingCloth ? `Edit Garment: ${editingCloth.name}` : 'Add New Garment / Cloth Type'}
                </h3>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  {editingCloth ? 'Update apparel properties, imagery, and catalog settings.' : 'Define apparel details for 2D matrix seeding.'}
                </p>
              </div>
              <button onClick={() => setShowClothModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCloth} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Garment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Kurta, Denim Jacket"
                    value={clothForm.name}
                    onChange={(e) => setClothForm({ ...clothForm, name: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    required
                    value={clothForm.icon}
                    onChange={(e) => setClothForm({ ...clothForm, icon: e.target.value })}
                    className="admin-input w-full text-center text-base font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Category Segment</label>
                  <select
                    value={clothForm.categoryTag}
                    onChange={(e) => setClothForm({ ...clothForm, categoryTag: e.target.value as ClothCategoryTag })}
                    className="admin-input w-full font-bold"
                  >
                    {categories
                      .filter((c) => c.tag !== 'ALL')
                      .map((c) => (
                        <option key={c.tag} value={c.tag}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Default Unit</label>
                  <select
                    value={clothForm.defaultUnit}
                    onChange={(e) => setClothForm({ ...clothForm, defaultUnit: e.target.value as PricingUnit })}
                    className="admin-input w-full font-bold"
                  >
                    <option value="PER_PIECE">Per Piece (₹/pc)</option>
                    <option value="PER_SET">Per Set (₹/set)</option>
                    <option value="PER_KG">Per KG (₹/kg)</option>
                    <option value="PER_SQ_FT">Per Sq Ft (₹/sq ft)</option>
                    <option value="PER_PANEL">Per Panel (₹/panel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">S3 Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/garments/..."
                  value={clothForm.imageUrl}
                  onChange={(e) => setClothForm({ ...clothForm, imageUrl: e.target.value })}
                  className="admin-input w-full text-[11px] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Description / Handling Info</label>
                <input
                  type="text"
                  placeholder="e.g. Dry clean recommended"
                  value={clothForm.description}
                  onChange={(e) => setClothForm({ ...clothForm, description: e.target.value })}
                  className="admin-input w-full"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="clothIsActive"
                  checked={clothForm.isActive}
                  onChange={(e) => setClothForm({ ...clothForm, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="clothIsActive" className="text-xs font-semibold text-[var(--heading-color)] cursor-pointer">
                  Active in Catalog & Customer Booking
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowClothModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingCloth ? 'Save Changes' : 'Add to Catalog Matrix'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
