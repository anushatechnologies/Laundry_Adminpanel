'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  DollarSign,
  Save,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';
import { SubcategoriesManager } from '@/components/catalog/SubcategoriesManager';
import { CatalogProductTable } from '@/components/catalog/CatalogProductTable';
import { ClothType, ServiceMaster } from '@/types';

function PricingPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || '';

  // If navigating via legacy query parameters, render the dedicated view cleanly
  if (tab === 'subcategories' || tab === 'subcategory') {
    return <SubcategoriesManager />;
  }
  if (tab === 'categories') {
    return <UnifiedCatalogManager lockedMode="CATEGORIES" hideModeTabs />;
  }
  if (tab === 'cloths' || tab === 'products') {
    return <UnifiedCatalogManager lockedMode="GARMENTS" hideModeTabs />;
  }
  if (tab === 'services') {
    return <UnifiedCatalogManager lockedMode="SERVICES" hideModeTabs />;
  }

  // Otherwise, render the dedicated 2D Pricing Matrix & Global Financial Rules
  return <PricingMatrixView />;
}

function PricingMatrixView() {
  const {
    pricingSettings,
    updatePricingSettings,
    clothTypes,
    serviceMasters,
    priceMatrix,
    updateClothType,
    deleteClothType,
    upsertPriceItem,
    showToast,
  } = useApp();

  const [settingsForm, setSettingsForm] = useState({
    taxPercentage: pricingSettings?.taxPercentage ?? 5,
    isGstEnabled: pricingSettings?.isGstEnabled ?? true,
    minOrderValue: pricingSettings?.minOrderValue || 299,
    freeDeliveryThreshold: pricingSettings?.freeDeliveryThreshold || 499,
    standardDeliveryFee: pricingSettings?.standardDeliveryFee || 30,
    expressDeliveryFee: pricingSettings?.expressDeliveryFee || 80,
    sameDayDeliveryFee: pricingSettings?.sameDayDeliveryFee || 160,
  });

  // Search & Category filters for 2D Pricing Matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Price Inspector Modal State
  const [inspectorTarget, setInspectorTarget] = useState<{
    cloth: ClothType;
    service: ServiceMaster;
  } | null>(null);
  const [inspectorPrice, setInspectorPrice] = useState<number>(50);
  const [inspectorExpressPrice, setInspectorExpressPrice] = useState<number>(80);
  const [inspectorIsAvailable, setInspectorIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (pricingSettings) {
      setSettingsForm({
        taxPercentage: pricingSettings.taxPercentage ?? 5,
        isGstEnabled: pricingSettings.isGstEnabled !== false,
        minOrderValue: pricingSettings.minOrderValue || 299,
        freeDeliveryThreshold: pricingSettings.freeDeliveryThreshold || 499,
        standardDeliveryFee: pricingSettings.standardDeliveryFee || 30,
        expressDeliveryFee: pricingSettings.expressDeliveryFee || 80,
        sameDayDeliveryFee:
          pricingSettings.sameDayDeliveryFee ||
          (pricingSettings.expressDeliveryFee ? pricingSettings.expressDeliveryFee * 2 : 160),
      });
    }
  }, [pricingSettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingSettings(settingsForm);
    showToast(
      settingsForm.isGstEnabled
        ? `Saved! GST Active at ${settingsForm.taxPercentage}%.`
        : 'Saved! GST Temporarily Turned OFF (0% applied).',
      'success'
    );
  };

  const handleOpenPriceInspector = (cloth: ClothType, service: ServiceMaster) => {
    const existing = priceMatrix.find(
      (p) => p.clothTypeId === cloth.id && p.serviceId === service.id
    );
    setInspectorTarget({ cloth, service });
    setInspectorPrice(existing?.price ?? 50);
    setInspectorExpressPrice(existing?.expressPrice ?? (existing?.price ? existing.price * 1.5 : 80));
    setInspectorIsAvailable(existing?.isAvailable !== false && (existing?.price ?? 50) > 0);
  };

  const handleSavePriceInspector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorTarget) return;

    const cloth = inspectorTarget.cloth;
    const service = inspectorTarget.service;
    const existing = priceMatrix.find(
      (p) => p.clothTypeId === cloth.id && p.serviceId === service.id
    );

    upsertPriceItem({
      id: existing?.id || `sp_${cloth.id}_${service.id}`,
      clothTypeId: cloth.id,
      clothName: cloth.name,
      clothIcon: cloth.icon,
      categoryTag: cloth.categoryTag,
      serviceId: service.id,
      serviceName: service.name,
      price: inspectorIsAvailable ? Number(inspectorPrice) : 0,
      expressPrice: inspectorIsAvailable ? Number(inspectorExpressPrice) : 0,
      pricingUnit: existing?.pricingUnit || 'PER_PIECE',
      turnaroundHours: existing?.turnaroundHours || service.turnaroundHours || 24,
      isAvailable: inspectorIsAvailable,
      isActive: inspectorIsAvailable,
    });

    showToast(`Updated price for ${inspectorTarget.cloth.name} (${inspectorTarget.service.name})`, 'success');
    setInspectorTarget(null);
  };

  const handleToggleActive = (cloth: ClothType) => {
    updateClothType(cloth.id, { isActive: !cloth.isActive });
    showToast(`${cloth.name} is now ${!cloth.isActive ? 'Active' : 'Hidden'}`, 'info');
  };

  const handleDeleteCloth = (clothId: string, clothName: string) => {
    if (confirm(`Are you sure you want to remove "${clothName}" from the catalog?`)) {
      deleteClothType(clothId);
      showToast(`Removed "${clothName}"`, 'info');
    }
  };

  // Filtered Garments for Matrix Grid
  const filteredClothes = useMemo(() => {
    return clothTypes.filter((cloth) => {
      const matchesSearch =
        !searchQuery ||
        cloth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cloth.subCategory && cloth.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        activeCategory === 'ALL' ||
        cloth.categoryTag === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [clothTypes, searchQuery, activeCategory]);

  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    clothTypes.forEach((c) => {
      if (c.categoryTag) set.add(c.categoryTag);
    });
    return Array.from(set);
  }, [clothTypes]);

  return (
    <div className="space-y-6">
      {/* Global Financial Rules Bar */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--heading-color)]">
                Global Financial Rules & Delivery Fees
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Configured rates apply automatically across checkout and customer cart calculations
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Financial Rules</span>
          </button>
        </div>

        {/* GST Toggle Control Banner */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl mb-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            settingsForm.isGstEnabled
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                settingsForm.isGstEnabled ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              %
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[var(--heading-color)]">
                  GST Tax Status (Temporary Toggle)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                    settingsForm.isGstEnabled
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {settingsForm.isGstEnabled ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active ({settingsForm.taxPercentage}%)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      <span>Temporarily OFF (0% Tax)</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {settingsForm.isGstEnabled
                  ? `Customers will be charged ${settingsForm.taxPercentage}% GST on checkout. Click toggle to turn OFF.`
                  : 'GST is temporarily turned OFF. ₹0 GST will be charged to customers at checkout. Click toggle to turn ON.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSettingsForm((prev) => ({ ...prev, isGstEnabled: !prev.isGstEnabled }))
            }
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ${
              settingsForm.isGstEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {settingsForm.isGstEnabled ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Turn GST OFF (0%)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Turn GST ON ({settingsForm.taxPercentage}%)</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              GST Tax Rate (%){!settingsForm.isGstEnabled && ' (Currently Waived)'}
            </label>
            <input
              type="number"
              value={settingsForm.taxPercentage}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, taxPercentage: Number(e.target.value) })
              }
              className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !settingsForm.isGstEnabled
                  ? 'border-amber-300 opacity-60'
                  : 'border-[var(--border-color)]'
              }`}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Min Order (₹)
            </label>
            <input
              type="number"
              value={settingsForm.minOrderValue}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, minOrderValue: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Free Delivery Above (₹)
            </label>
            <input
              type="number"
              value={settingsForm.freeDeliveryThreshold}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Standard Delivery (₹)
            </label>
            <input
              type="number"
              value={settingsForm.standardDeliveryFee}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, standardDeliveryFee: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Express 24h Fee (₹)
            </label>
            <input
              type="number"
              value={settingsForm.expressDeliveryFee}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, expressDeliveryFee: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Same-Day 12h Fee (₹)
            </label>
            <input
              type="number"
              value={settingsForm.sameDayDeliveryFee}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, sameDayDeliveryFee: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>
            ⚡ <strong>Customer Speed Choices:</strong> Normal (48h) is free above ₹
            {settingsForm.freeDeliveryThreshold} (or ₹{settingsForm.standardDeliveryFee}). Express 24h
            (+₹{settingsForm.expressDeliveryFee}) and Same-Day 12h (+₹
            {settingsForm.sameDayDeliveryFee}) are applied transparently at checkout.
          </span>
        </div>
      </form>

      {/* 2D Pricing Matrix Table Component */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[var(--heading-color)]">
                2D Pricing Matrix
              </h2>
              <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-300">
                {clothTypes.length} Garments × {serviceMasters.length} Services
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Click any pricing cell to view or modify standard rates and express turnaround charges for any garment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search garments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--heading-color)] w-60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
            }`}
          >
            All Categories ({clothTypes.length})
          </button>
          {uniqueCategories.map((catTag) => {
            const count = clothTypes.filter((c) => c.categoryTag === catTag).length;
            return (
              <button
                key={catTag}
                type="button"
                onClick={() => setActiveCategory(catTag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === catTag
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                }`}
              >
                <span>{catTag}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === catTag
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2D Table Grid */}
        <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs">
          <CatalogProductTable
            clothes={filteredClothes}
            serviceMasters={serviceMasters}
            priceMatrix={priceMatrix}
            onEditCloth={(cloth) => {
              // Open edit
              window.location.href = `/products?tab=cloths&edit=${cloth.id}`;
            }}
            onDeleteCloth={handleDeleteCloth}
            onOpenPriceInspector={handleOpenPriceInspector}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {/* Quick Price Inspector Modal */}
      {inspectorTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  {inspectorTarget.cloth.icon || '👔'}
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--heading-color)]">
                    {inspectorTarget.cloth.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                    <span>{inspectorTarget.service.icon}</span>
                    <span>{inspectorTarget.service.name}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectorTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--heading-color)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePriceInspector} className="p-5 space-y-4 text-xs">
              {/* Service Availability Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--border-color)]">
                <div>
                  <span className="font-bold text-[var(--heading-color)] block">
                    Service Available for this Garment
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    When disabled, customers cannot book this service for {inspectorTarget.cloth.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectorIsAvailable(!inspectorIsAvailable)}
                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                    inspectorIsAvailable
                      ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60'
                      : 'text-slate-400 bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {inspectorIsAvailable ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>

              {inspectorIsAvailable && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--heading-color)] mb-1">
                      Standard Rate (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={inspectorPrice}
                      onChange={(e) => setInspectorPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 text-[var(--heading-color)] font-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--heading-color)] mb-1">
                      Express Rate (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={inspectorExpressPrice}
                      onChange={(e) => setInspectorExpressPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 text-[var(--heading-color)] font-black text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectorTarget(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--heading-color)] font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPricingEnginePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[var(--text-secondary)]">
          Loading Pricing Engine...
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  );
}
