'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, Save } from 'lucide-react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';

export default function AdminPricingEnginePage() {
  const { pricingSettings, updatePricingSettings, showToast } = useApp();

  const [settingsForm, setSettingsForm] = useState({
    taxPercentage: pricingSettings?.taxPercentage || 5,
    minOrderValue: pricingSettings?.minOrderValue || 299,
    freeDeliveryThreshold: pricingSettings?.freeDeliveryThreshold || 499,
    standardDeliveryFee: pricingSettings?.standardDeliveryFee || 30,
    expressDeliveryFee: pricingSettings?.expressDeliveryFee || 80,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingSettings(settingsForm);
    showToast('Financial rules & delivery fees saved live!', 'success');
  };

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              GST Tax (%)
            </label>
            <input
              type="number"
              value={settingsForm.taxPercentage}
              onChange={(e) => setSettingsForm({ ...settingsForm, taxPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Min Order (₹)
            </label>
            <input
              type="number"
              value={settingsForm.minOrderValue}
              onChange={(e) => setSettingsForm({ ...settingsForm, minOrderValue: Number(e.target.value) })}
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
              onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
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
              onChange={(e) => setSettingsForm({ ...settingsForm, standardDeliveryFee: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Express Delivery (₹)
            </label>
            <input
              type="number"
              value={settingsForm.expressDeliveryFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, expressDeliveryFee: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--heading-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>

      {/* Unified Garments & Services Catalog Component */}
      <UnifiedCatalogManager />
    </div>
  );
}
