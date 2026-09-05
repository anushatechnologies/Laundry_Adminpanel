'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, Save, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';

export default function AdminPricingEnginePage() {
  const { pricingSettings, updatePricingSettings, showToast } = useApp();

  const [settingsForm, setSettingsForm] = useState({
    taxPercentage: pricingSettings?.taxPercentage ?? 5,
    isGstEnabled: pricingSettings?.isGstEnabled ?? true,
    minOrderValue: pricingSettings?.minOrderValue || 299,
    freeDeliveryThreshold: pricingSettings?.freeDeliveryThreshold || 499,
    standardDeliveryFee: pricingSettings?.standardDeliveryFee || 30,
    expressDeliveryFee: pricingSettings?.expressDeliveryFee || 80,
  });

  useEffect(() => {
    if (pricingSettings) {
      setSettingsForm({
        taxPercentage: pricingSettings.taxPercentage ?? 5,
        isGstEnabled: pricingSettings.isGstEnabled !== false,
        minOrderValue: pricingSettings.minOrderValue || 299,
        freeDeliveryThreshold: pricingSettings.freeDeliveryThreshold || 499,
        standardDeliveryFee: pricingSettings.standardDeliveryFee || 30,
        expressDeliveryFee: pricingSettings.expressDeliveryFee || 80,
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
                settingsForm.isGstEnabled
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                !settingsForm.isGstEnabled ? 'border-amber-300 opacity-60' : 'border-[var(--border-color)]'
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
