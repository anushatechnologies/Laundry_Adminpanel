'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  DollarSign,
  Save,
  Plus,
  Sparkles,
  Grid,
  List,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { ClothType, ServiceMaster, ServicePriceItem } from '@/types';
import { CatalogCategoryTabs } from '@/components/catalog/CatalogCategoryTabs';
import { CatalogSubcategoryBar } from '@/components/catalog/CatalogSubcategoryBar';
import { CatalogProductGrid } from '@/components/catalog/CatalogProductGrid';
import { CatalogProductTable } from '@/components/catalog/CatalogProductTable';
import { ClothEditModal } from '@/components/catalog/ClothEditModal';
import { CategorySubcategoryModal } from '@/components/catalog/CategorySubcategoryModal';
import { CellInspectorModal } from '@/components/catalog/CellInspectorModal';

export default function AdminPricingEnginePage() {
  const {
    clothTypes,
    serviceMasters,
    priceMatrix,
    pricingSettings,
    addClothType,
    updateClothType,
    deleteClothType,
    upsertPriceItem,
    updatePricingSettings,
    resetToMasterCatalog,
    showToast,
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('MENS');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals state
  const [showClothModal, setShowClothModal] = useState(false);
  const [showCategoryPhotosModal, setShowCategoryPhotosModal] = useState(false);
  const [editingCloth, setEditingCloth] = useState<ClothType | null>(null);
  const [inspectCell, setInspectCell] = useState<{
    cloth: ClothType;
    service: ServiceMaster;
    item: ServicePriceItem;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset subcategory filter when switching main category
  const handleSelectCategory = (catTag: string) => {
    setActiveCategory(catTag);
    setActiveSubcategory('ALL');
    setSearchQuery('');
  };

  // Financial Settings Form
  const [settingsForm, setSettingsForm] = useState({
    taxPercentage: pricingSettings?.taxPercentage || 5,
    minOrderValue: pricingSettings?.minOrderValue || 299,
    freeDeliveryThreshold: pricingSettings?.freeDeliveryThreshold || 499,
    standardDeliveryFee: pricingSettings?.standardDeliveryFee || 40,
    expressDeliveryFee: pricingSettings?.expressDeliveryFee || 150,
  });

  useEffect(() => {
    if (pricingSettings) {
      setSettingsForm({
        taxPercentage: pricingSettings.taxPercentage || 5,
        minOrderValue: pricingSettings.minOrderValue || 299,
        freeDeliveryThreshold: pricingSettings.freeDeliveryThreshold || 499,
        standardDeliveryFee: pricingSettings.standardDeliveryFee || 40,
        expressDeliveryFee: pricingSettings.expressDeliveryFee || 150,
      });
    }
  }, [pricingSettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingSettings(settingsForm);
    showToast('Global financial rules updated successfully!', 'success');
  };

  // Garments in active category (for extracting subcategories)
  const categoryGarments = useMemo(() => {
    if (activeCategory === 'ALL') return clothTypes;
    return clothTypes.filter((c) => c.categoryTag === activeCategory);
  }, [clothTypes, activeCategory]);

  // Distinct subcategories with item counts for active category
  const subcategoriesWithCounts = useMemo(() => {
    const countsMap: Record<string, number> = {};

    categoryGarments.forEach((c) => {
      const sub = c.subCategory?.trim() || 'General';
      countsMap[sub] = (countsMap[sub] || 0) + 1;
    });

    return Object.entries(countsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryGarments]);

  // All existing subcategories across catalog for autocomplete in add/edit modal
  const allSubcategories = useMemo(() => {
    const set = new Set<string>();
    clothTypes.forEach((c) => {
      if (c.subCategory) set.add(c.subCategory);
    });
    return Array.from(set).sort();
  }, [clothTypes]);

  // Filtered Garments (Category -> Subcategory -> Search)
  const filteredClothes = useMemo(() => {
    return categoryGarments.filter((cloth) => {
      // Subcategory filter
      if (activeSubcategory !== 'ALL') {
        const itemSub = cloth.subCategory?.trim() || 'General';
        if (itemSub !== activeSubcategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = cloth.name.toLowerCase().includes(q);
        const matchSub = cloth.subCategory?.toLowerCase().includes(q);
        const matchDesc = cloth.description?.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchDesc) return false;
      }

      return true;
    });
  }, [categoryGarments, activeSubcategory, searchQuery]);

  // Handlers
  const handleOpenAddCloth = () => {
    setEditingCloth(null);
    setShowClothModal(true);
  };

  const handleEditCloth = (cloth: ClothType) => {
    setEditingCloth(cloth);
    setShowClothModal(true);
  };

  const handleSaveCloth = (data: Partial<ClothType>) => {
    if (editingCloth) {
      updateClothType(editingCloth.id, data);
      showToast(`Updated "${data.name || editingCloth.name}" successfully!`, 'success');
    } else {
      const newId = `cloth-custom-${Date.now()}`;
      const newCloth: ClothType = {
        id: newId,
        name: data.name || 'New Garment',
        icon: data.icon || '👕',
        categoryTag: data.categoryTag || 'MENS',
        categoryLabel: data.categoryTag || 'General',
        subCategory: data.subCategory,
        defaultUnit: data.defaultUnit || 'PER_PIECE',
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: data.isActive !== false,
        sortOrder: clothTypes.length + 1,
      };

      addClothType(newCloth);
      showToast(`Added "${newCloth.name}" to catalog!`, 'success');
    }
  };

  const handleDeleteCloth = (clothId: string, clothName: string) => {
    if (confirm(`Are you sure you want to delete "${clothName}" from the catalog?`)) {
      deleteClothType(clothId);
      showToast(`Deleted "${clothName}" from catalog.`, 'success');
    }
  };

  const handleUpdateClothImage = (clothId: string, imageUrl: string) => {
    updateClothType(clothId, { imageUrl });
    showToast('Garment photo updated and saved via AWS S3!', 'success');
  };

  const handleToggleActive = (cloth: ClothType) => {
    const updatedStatus = cloth.isActive === false;
    updateClothType(cloth.id, { isActive: updatedStatus });
    showToast(
      `${cloth.name} is now ${updatedStatus ? 'Visible' : 'Hidden'} in customer app.`,
      'success'
    );
  };

  const handleOpenPriceInspector = (cloth: ClothType, service: ServiceMaster) => {
    const existing = priceMatrix.find(
      (p) => p.clothTypeId === cloth.id && p.serviceId === service.id
    );

    const price = existing ? existing.price : 50;
    const item: ServicePriceItem = existing || {
      id: `pr-${cloth.id}-${service.id}`,
      clothTypeId: cloth.id,
      clothName: cloth.name,
      clothIcon: cloth.icon,
      categoryTag: cloth.categoryTag,
      serviceId: service.id,
      serviceName: service.name,
      price,
      expressPrice: Math.round(price * 1.5),
      pricingUnit: cloth.defaultUnit || 'PER_PIECE',
      turnaroundHours: service.turnaroundHours || 24,
      expressTurnaroundHours: 12,
      isActive: true,
      isAvailable: true,
    };

    setInspectCell({ cloth, service, item });
  };

  const handleSavePriceRule = (updatedItem: ServicePriceItem) => {
    upsertPriceItem(updatedItem);
    showToast(
      `Updated price rule for ${updatedItem.clothName} - ${updatedItem.serviceName}!`,
      'success'
    );
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[var(--heading-color)] tracking-tight">
              Catalog & Pricing Engine
            </h1>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              {clothTypes.length} Total Items
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your complete garment catalog, subcategories, S3 image URLs, and 3-service rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Cards vs 2D Matrix Table */}
          <div className="bg-[var(--bg-secondary-card)] border border-[var(--border-color)] p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
              title="Visual Product Cards View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
              title="2D Rate Matrix Table"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Master Reset Button */}
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  'Reload complete 548-item master catalog from the backend? This updates local browser storage with all fresh items and rates.'
                )
              ) {
                resetToMasterCatalog();
              }
            }}
            className="admin-btn-secondary"
            title="Reload full 548-garment master matrix"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Reload Catalog</span>
          </button>

          {/* Category & Subcategory Photos Button */}
          <button
            type="button"
            onClick={() => setShowCategoryPhotosModal(true)}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Upload and manage photos for Categories & Subcategories"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Category & Subcategory Photos</span>
          </button>

          {/* Add Garment Button */}
          <button type="button" onClick={handleOpenAddCloth} className="admin-btn-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Global Financial Rules Surcharge Card */}
      <div className="azea-card p-4 text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-xs text-[var(--heading-color)]">
              Global Checkout Rules & Delivery Fees
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">
            Applied live on customer cart checkout
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="font-semibold text-[var(--heading-color)] block mb-1">GST Tax (%)</label>
              <input
                type="number"
                value={settingsForm.taxPercentage}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, taxPercentage: parseFloat(e.target.value) || 0 })
                }
                className="admin-input w-full font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-[var(--heading-color)] block mb-1">Min Order (₹)</label>
              <input
                type="number"
                value={settingsForm.minOrderValue}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, minOrderValue: parseFloat(e.target.value) || 0 })
                }
                className="admin-input w-full font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-[var(--heading-color)] block mb-1">Free Delivery Above (₹)</label>
              <input
                type="number"
                value={settingsForm.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="admin-input w-full font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-[var(--heading-color)] block mb-1">Standard Delivery (₹)</label>
              <input
                type="number"
                value={settingsForm.standardDeliveryFee}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    standardDeliveryFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="admin-input w-full font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-[var(--heading-color)] block mb-1">Express Delivery (₹)</label>
              <input
                type="number"
                value={settingsForm.expressDeliveryFee}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    expressDeliveryFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="admin-input w-full font-bold text-amber-600 dark:text-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="admin-btn-primary">
              <Save className="w-3.5 h-3.5" />
              <span>Save Financial Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Hierarchical Catalog Explorer */}
      <div className="azea-card overflow-hidden text-xs space-y-4 p-4">
        {/* Tier 1: Category Selector Tabs */}
        <div>
          <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
            1. Select Master Category
          </label>
          <CatalogCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            clothTypes={clothTypes}
          />
        </div>

        {/* Tier 2: Subcategory Rail & Search Toolbar */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
            2. Filter by Subcategory
          </label>
          <CatalogSubcategoryBar
            subcategories={subcategoriesWithCounts}
            activeSubcategory={activeSubcategory}
            onSelectSubcategory={setActiveSubcategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFilteredCount={filteredClothes.length}
          />
        </div>

        {/* Tier 3: Products / Garments Explorer (Grid Cards vs Table) */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          {viewMode === 'GRID' ? (
            <CatalogProductGrid
              clothes={filteredClothes}
              serviceMasters={serviceMasters}
              priceMatrix={priceMatrix}
              onEditCloth={handleEditCloth}
              onDeleteCloth={handleDeleteCloth}
              onOpenPriceInspector={handleOpenPriceInspector}
              onToggleActive={handleToggleActive}
              onUpdateClothImage={handleUpdateClothImage}
            />
          ) : (
            <CatalogProductTable
              clothes={filteredClothes}
              serviceMasters={serviceMasters}
              priceMatrix={priceMatrix}
              onEditCloth={handleEditCloth}
              onDeleteCloth={handleDeleteCloth}
              onOpenPriceInspector={handleOpenPriceInspector}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      </div>

      {/* Add / Edit Garment Modal */}
      <ClothEditModal
        isOpen={showClothModal}
        onClose={() => setShowClothModal(false)}
        onSave={handleSaveCloth}
        editingCloth={editingCloth}
        existingSubcategories={allSubcategories}
        defaultCategory={activeCategory}
      />

      {/* Price Rule Inspector Modal */}
      {inspectCell && (
        <CellInspectorModal
          isOpen={!!inspectCell}
          onClose={() => setInspectCell(null)}
          cloth={inspectCell.cloth}
          service={inspectCell.service}
          item={inspectCell.item}
          onSave={handleSavePriceRule}
        />
      )}
    </div>
  );
}
