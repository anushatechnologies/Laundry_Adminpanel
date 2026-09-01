'use client';

import React from 'react';
import { ClothType, ServiceMaster, ServicePriceItem, PricingUnit } from '@/types';
import { X, Check } from 'lucide-react';

interface CellInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloth: ClothType;
  service: ServiceMaster;
  item: ServicePriceItem;
  onSave: (updatedItem: ServicePriceItem) => void;
}

export const CellInspectorModal: React.FC<CellInspectorModalProps> = ({
  isOpen,
  onClose,
  cloth,
  service,
  item,
  onSave,
}) => {
  const [form, setForm] = React.useState({
    isAvailable: item.isAvailable !== false && item.price > 0,
    price: item.price || 0,
    expressPrice: item.expressPrice || Math.round((item.price || 50) * 1.5),
    pricingUnit: item.pricingUnit || cloth.defaultUnit || 'PER_PIECE',
    turnaroundHours: item.turnaroundHours || service.turnaroundHours || 24,
    expressTurnaroundHours: item.expressTurnaroundHours || 12,
    minQuantity: item.minQuantity || 1,
    specialNotes: item.specialNotes || '',
  });

  React.useEffect(() => {
    setForm({
      isAvailable: item.isAvailable !== false && item.price > 0,
      price: item.price || 0,
      expressPrice: item.expressPrice || Math.round((item.price || 50) * 1.5),
      pricingUnit: item.pricingUnit || cloth.defaultUnit || 'PER_PIECE',
      turnaroundHours: item.turnaroundHours || service.turnaroundHours || 24,
      expressTurnaroundHours: item.expressTurnaroundHours || 12,
      minQuantity: item.minQuantity || 1,
      specialNotes: item.specialNotes || '',
    });
  }, [item, cloth, service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: ServicePriceItem = {
      ...item,
      price: form.isAvailable ? form.price : 0,
      expressPrice: form.isAvailable ? form.expressPrice : 0,
      pricingUnit: form.pricingUnit as PricingUnit,
      turnaroundHours: form.turnaroundHours,
      expressTurnaroundHours: form.expressTurnaroundHours,
      minQuantity: form.minQuantity,
      isAvailable: form.isAvailable,
      specialNotes: form.specialNotes,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary-card)]">
          <div>
            <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
              <span>{cloth.icon}</span>
              <span>{cloth.name}</span>
              <span className="text-[var(--text-secondary)] font-normal">×</span>
              <span>{service.icon}</span>
              <span>{service.name}</span>
            </h3>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
              Service Price Rule & Availability Configuration
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Availability Toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-bold text-[var(--heading-color)]">Service Availability</span>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              {form.isAvailable
                ? 'Customers can book this service for this garment.'
                : 'Service is disabled for this garment (e.g. water wash on pure silk).'}
            </p>
          </div>

          {form.isAvailable && (
            <>
              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Regular Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value) || 0;
                      setForm({ ...form, price: p, expressPrice: Math.round(p * 1.5) });
                    }}
                    className="admin-input w-full font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Express Rate (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.expressPrice}
                    onChange={(e) => setForm({ ...form, expressPrice: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>

              {/* Turnaround times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Regular Turnaround (Hrs)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.turnaroundHours}
                    onChange={(e) => setForm({ ...form, turnaroundHours: parseInt(e.target.value) || 24 })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Express Turnaround (Hrs)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.expressTurnaroundHours}
                    onChange={(e) => setForm({ ...form, expressTurnaroundHours: parseInt(e.target.value) || 12 })}
                    className="admin-input w-full"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Special Handling Notes</label>
                <input
                  type="text"
                  value={form.specialNotes}
                  onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
                  placeholder="e.g. Mild detergent, low heat iron only"
                  className="admin-input w-full"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              <Check className="w-3.5 h-3.5" />
              <span>Save Price Rule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
