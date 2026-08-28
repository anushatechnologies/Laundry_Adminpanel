'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  Navigation,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { DistanceDeliveryConfig, DistanceTier } from '@/types';

export default function AdminDeliverySettingsPage() {
  const { distanceConfig, updateDistanceConfig, hubs } = useApp();

  const [baseDistanceKm, setBaseDistanceKm] = useState<number>(distanceConfig.baseDistanceKm);
  const [baseFee, setBaseFee] = useState<number>(distanceConfig.baseFee);
  const [perKmRateAfterBase, setPerKmRateAfterBase] = useState<number>(distanceConfig.perKmRateAfterBase);
  const [freeDeliveryOrderValue, setFreeDeliveryOrderValue] = useState<number>(distanceConfig.freeDeliveryOrderValue);
  const [maxRadius, setMaxRadius] = useState<number>(distanceConfig.maxServiceRadiusKm);
  const [tiers, setTiers] = useState<DistanceTier[]>([...distanceConfig.distanceTiers]);

  // Test Distance Calculator state
  const [testKm, setTestKm] = useState<number>(5.5);
  const [testSubtotal, setTestSubtotal] = useState<number>(350);
  const [testExpress, setTestExpress] = useState<boolean>(false);

  const handleTierChange = (index: number, field: keyof DistanceTier, value: number) => {
    const next = [...tiers];
    next[index] = { ...next[index], [field]: value };
    setTiers(next);
  };

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? lastTier.maxKm : 0;
    setTiers([...tiers, { minKm: newMin, maxKm: newMin + 5, fee: (lastTier?.fee || 0) + 40 }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDistanceConfig({
      baseDistanceKm,
      baseFee,
      perKmRateAfterBase,
      freeDeliveryOrderValue,
      maxServiceRadiusKm: maxRadius,
      distanceTiers: tiers,
    });
  };

  // Test calculation
  const calculateFee = (km: number, subtotal: number, isExpress: boolean) => {
    if (subtotal >= freeDeliveryOrderValue && km <= 7) {
      return { fee: 0, reason: `Free Delivery (Order subtotal ₹${subtotal} >= ₹${freeDeliveryOrderValue})` };
    }
    const matched = tiers.find((t) => km >= t.minKm && km < t.maxKm);
    let fee = 0;
    let reason = '';
    if (matched) {
      fee = matched.fee;
      reason = `Matched Distance Tier: ${matched.minKm}–${matched.maxKm} KM (₹${matched.fee})`;
    } else if (km >= 20) {
      const extraKm = km - 20;
      fee = 150 + extraKm * perKmRateAfterBase;
      reason = `Outstation > 20 KM: Base ₹150 + ${extraKm} KM × ₹${perKmRateAfterBase}`;
    } else {
      fee = baseFee;
      reason = `Base Radius 0–${baseDistanceKm} KM`;
    }

    if (isExpress) {
      fee = Math.round(fee * 1.5);
      reason += ' [Express Priority +50%]';
    }

    return { fee, reason };
  };

  const testResult = calculateFee(testKm, testSubtotal, testExpress);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#16A34A]" />
            <span>In-House Fleet & Distance-Based Delivery Engine</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Deliveries are performed strictly by company-owned vehicles and salaried drivers. Delivery charges are calculated dynamically based on distance (in KM) from the assigned hub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Own Fleet Exclusive</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distance Tiers & Config Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Main Thresholds Card */}
          <div className="azea-card p-6 space-y-4">
            <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#16A34A]" />
              <span>Core Distance & Delivery Thresholds</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Base Free Distance (KM)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={baseDistanceKm}
                  onChange={(e) => setBaseDistanceKm(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Local perimeter</p>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Free Delivery Min Order (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={freeDeliveryOrderValue}
                  onChange={(e) => setFreeDeliveryOrderValue(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Orders &gt; this get Free Delivery</p>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Max Service Radius (KM)</label>
                <input
                  type="number"
                  min="5"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(parseFloat(e.target.value) || 25)}
                  className="admin-input w-full font-mono font-bold"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Farthest service radius</p>
              </div>
            </div>
          </div>

          {/* Distance Tiers Matrix */}
          <div className="azea-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#16A34A]" />
                  <span>Distance Pricing Tiers (Per Kilometer Windows)</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  System matches customer GPS distance from assigned hub and charges this rate at checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={addTier}
                className="admin-btn-secondary h-8 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] flex items-center gap-3 text-xs"
                >
                  <span className="font-mono font-black text-[var(--text-secondary)] text-sm w-6">#{idx + 1}</span>

                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] block">Min Distance (KM)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.minKm}
                        onChange={(e) => handleTierChange(idx, 'minKm', parseFloat(e.target.value) || 0)}
                        className="admin-input h-8 text-xs font-mono font-bold w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] block">Max Distance (KM)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.maxKm}
                        onChange={(e) => handleTierChange(idx, 'maxKm', parseFloat(e.target.value) || 0)}
                        className="admin-input h-8 text-xs font-mono font-bold w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] block">Delivery Charge (₹)</label>
                      <input
                        type="number"
                        value={tier.fee}
                        onChange={(e) => handleTierChange(idx, 'fee', parseFloat(e.target.value) || 0)}
                        className="admin-input h-8 text-xs font-mono font-bold text-[#16A34A] w-full"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="admin-btn-primary w-full"
              >
                <Save className="w-4 h-4" />
                <span>Save Distance Engine Configuration</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Distance Fee Calculator Simulator */}
        <div className="space-y-6">
          <div className="azea-card p-6 space-y-4">
            <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#16A34A]" />
              <span>Checkout Distance Simulator</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Simulate what a customer will be charged at checkout based on distance and cart value.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Customer Distance from Hub (KM)</label>
                <input
                  type="number"
                  step="0.1"
                  value={testKm}
                  onChange={(e) => setTestKm(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Order Subtotal (₹)</label>
                <input
                  type="number"
                  value={testSubtotal}
                  onChange={(e) => setTestSubtotal(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="testExpress"
                  checked={testExpress}
                  onChange={(e) => setTestExpress(e.target.checked)}
                  className="w-4 h-4 rounded text-[#16A34A]"
                />
                <label htmlFor="testExpress" className="font-bold text-xs text-[var(--heading-color)] cursor-pointer">
                  Express Delivery (1.5× Multiplier)
                </label>
              </div>

              {/* Simulation Result */}
              <div className="p-4 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[#16A34A]/40 space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-secondary)] font-bold">Calculated Delivery Fee:</span>
                  <span className="text-xl font-black text-[#16A34A] font-poppins">
                    {testResult.fee === 0 ? 'FREE' : `₹${testResult.fee}`}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-card)] p-2.5 rounded-[8px] border border-[var(--border-color)]">
                  <strong className="text-[var(--heading-color)]">Rule:</strong> {testResult.reason}
                </div>
              </div>
            </div>
          </div>

          {/* In-House Fleet Roster Summary */}
          <div className="bg-[#0F172A] text-white p-5 rounded-[14px] shadow-soft space-y-3 border border-slate-800">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#16A34A]" />
              <h4 className="font-bold text-sm">In-House Fleet Advantage</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every parcel is transported in temperature-controlled laundry containers using company-owned Electric Vans and Cargo Scooters. Drivers carry digital scales for doorstep weight verification.
            </p>
            <div className="pt-2 text-[11px] text-[#16A34A] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Chain-of-Custody Tracking Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
