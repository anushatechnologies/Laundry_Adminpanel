'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Scale,
  Plus,
  Save,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sliders,
  DollarSign,
  Clock,
  Zap,
} from 'lucide-react';
import { BulkPricingItem, BulkLaundryType } from '@/types';

const LAUNDRY_TYPES: { type: BulkLaundryType; label: string; icon: string }[] = [
  { type: 'MIXED_LAUNDRY', label: 'Mixed Laundry', icon: '🧺' },
  { type: 'FAMILY_LAUNDRY', label: 'Family Laundry', icon: '👨‍👩‍👧‍👦' },
  { type: 'STUDENT_LAUNDRY', label: 'Student Laundry', icon: '🎓' },
  { type: 'HOSTEL_LAUNDRY', label: 'Hostel Laundry', icon: '🏫' },
  { type: 'PG_LAUNDRY', label: 'PG Laundry', icon: '🏢' },
  { type: 'CORPORATE_LAUNDRY', label: 'Corporate Laundry', icon: '💼' },
];

export default function AdminBulkPricingPage() {
  const {
    serviceMasters,
    bulkPricing,
    addBulkPrice,
    updateBulkPrice,
    deleteBulkPrice,
    updateBulkSlab,
    showToast,
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-m-wash-fold');
  const [selectedLaundryType, setSelectedLaundryType] = useState<BulkLaundryType | 'ALL'>('MIXED_LAUNDRY');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Quick Slab Editor State for selected service & laundry type
  const [quickSlab, setQuickSlab] = useState<{ weightKg: number; regularPrice: number; expressPrice: number }[]>([
    { weightKg: 1, regularPrice: 80, expressPrice: 160 },
    { weightKg: 2, regularPrice: 150, expressPrice: 300 },
    { weightKg: 3, regularPrice: 210, expressPrice: 420 },
    { weightKg: 4, regularPrice: 260, expressPrice: 520 },
    { weightKg: 5, regularPrice: 300, expressPrice: 600 },
  ]);

  // Sync Quick Slab Editor state when service or laundry type changes
  useEffect(() => {
    const existing = bulkPricing.filter(
      (b) => b.serviceId === selectedServiceId && b.laundryType === selectedLaundryType
    );

    if (existing.length > 0) {
      const sorted = [...existing]
        .sort((a, b) => a.weightKg - b.weightKg)
        .map((b) => ({
          weightKg: b.weightKg,
          regularPrice: b.regularPrice,
          expressPrice: b.expressPrice,
        }));
      setQuickSlab(sorted);
    } else {
      setQuickSlab([
        { weightKg: 1, regularPrice: 80, expressPrice: 160 },
        { weightKg: 2, regularPrice: 150, expressPrice: 300 },
        { weightKg: 3, regularPrice: 210, expressPrice: 420 },
        { weightKg: 4, regularPrice: 260, expressPrice: 520 },
        { weightKg: 5, regularPrice: 300, expressPrice: 600 },
      ]);
    }
  }, [selectedServiceId, selectedLaundryType, bulkPricing]);

  // Save Quick Slab Editor Handler
  const handleSaveSlab = (e: React.FormEvent) => {
    e.preventDefault();
    const type = selectedLaundryType === 'ALL' ? 'MIXED_LAUNDRY' : selectedLaundryType;
    updateBulkSlab(selectedServiceId, type, quickSlab);
    const serviceName = serviceMasters.find((s) => s.id === selectedServiceId)?.name || 'Selected Service';
    showToast(`Saved complete bulk pricing slab for ${serviceName}!`, 'success');
  };

  // Single Item Add/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BulkPricingItem | null>(null);
  const [itemForm, setItemForm] = useState({
    laundryType: 'MIXED_LAUNDRY' as BulkLaundryType,
    serviceId: 'srv-m-wash-fold',
    weightKg: 1,
    regularPrice: 80,
    expressPrice: 160,
    regularTatHours: 48,
    expressTatHours: 12,
    minQuantity: 1,
    maxQuantity: 10,
    isActive: true,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setItemForm({
      laundryType: selectedLaundryType === 'ALL' ? 'MIXED_LAUNDRY' : selectedLaundryType,
      serviceId: selectedServiceId,
      weightKg: 1,
      regularPrice: 80,
      expressPrice: 160,
      regularTatHours: 48,
      expressTatHours: 12,
      minQuantity: 1,
      maxQuantity: 10,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: BulkPricingItem) => {
    setEditingItem(item);
    setItemForm({
      laundryType: item.laundryType,
      serviceId: item.serviceId,
      weightKg: item.weightKg,
      regularPrice: item.regularPrice,
      expressPrice: item.expressPrice,
      regularTatHours: item.regularTatHours,
      expressTatHours: item.expressTatHours,
      minQuantity: item.minQuantity || 1,
      maxQuantity: item.maxQuantity || 10,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleSaveSingleItem = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceName = serviceMasters.find((s) => s.id === itemForm.serviceId)?.name || 'Bulk Service';

    if (editingItem) {
      updateBulkPrice(editingItem.id, {
        laundryType: itemForm.laundryType,
        serviceId: itemForm.serviceId,
        serviceName,
        weightKg: itemForm.weightKg,
        regularPrice: itemForm.regularPrice,
        expressPrice: itemForm.expressPrice,
        regularTatHours: itemForm.regularTatHours,
        expressTatHours: itemForm.expressTatHours,
        minQuantity: itemForm.minQuantity,
        maxQuantity: itemForm.maxQuantity,
        isActive: itemForm.isActive,
      });
      showToast(`Updated bulk price for ${itemForm.weightKg} KG!`, 'success');
    } else {
      const newItem: BulkPricingItem = {
        id: `bp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        laundryType: itemForm.laundryType,
        serviceId: itemForm.serviceId,
        serviceName,
        weightKg: itemForm.weightKg,
        regularPrice: itemForm.regularPrice,
        expressPrice: itemForm.expressPrice,
        regularTatHours: itemForm.regularTatHours,
        expressTatHours: itemForm.expressTatHours,
        minQuantity: itemForm.minQuantity,
        maxQuantity: itemForm.maxQuantity,
        isActive: itemForm.isActive,
      };
      addBulkPrice(newItem);
      showToast(`Added ${itemForm.weightKg} KG slab to catalog!`, 'success');
    }
    setShowModal(false);
  };

  const handleDeleteItem = (id: string, weightKg: number, serviceName: string) => {
    if (confirm(`Delete ${weightKg} KG bulk price slab for ${serviceName}?`)) {
      deleteBulkPrice(id);
      showToast(`Deleted ${weightKg} KG price slab.`, 'info');
    }
  };

  // Filtered Bulk Pricing List
  const filteredBulkItems = bulkPricing.filter((b) => {
    const matchesService = selectedServiceId === 'ALL' || b.serviceId === selectedServiceId;
    const matchesType = selectedLaundryType === 'ALL' || b.laundryType === selectedLaundryType;
    const matchesSearch = b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-hover)] px-2.5 py-0.5 rounded-full border border-emerald-200">
            Dedicated Bulk & KG Slab Pricing Engine
          </span>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1">
            Bulk / KG Weight Slab Pricing
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Configure tiered weight discount slabs (1 KG, 2 KG, 3 KG, 4 KG, 5 KG, 10 KG) per service without flat linear multiplication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={openAddModal} className="admin-btn-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Weight Slab</span>
          </button>
        </div>
      </div>

      {/* QUICK BULK SLAB EDITOR CARD */}
      <div className="azea-card p-5 text-xs space-y-4" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--heading-color)]">Quick Slab Rate Editor</h3>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="text-[10px] text-[var(--text-secondary)] font-bold block mb-0.5">Laundry Type</label>
              <select
                value={selectedLaundryType}
                onChange={(e) => setSelectedLaundryType(e.target.value as BulkLaundryType)}
                className="admin-input font-bold text-xs py-1"
              >
                {LAUNDRY_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-secondary)] font-bold block mb-0.5">Select Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="admin-input font-bold text-xs py-1"
              >
                {serviceMasters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSlab} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {quickSlab.map((slab, index) => (
              <div
                key={slab.weightKg}
                className="p-3 bg-[var(--bg-secondary-card)] border border-[var(--border-color)] rounded-[10px] space-y-2"
              >
                <div className="flex items-center justify-between font-extrabold text-xs text-[var(--heading-color)]">
                  <span>{slab.weightKg} KG</span>
                  <span className="text-[10px] text-[var(--primary)] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
                    Slab #{index + 1}
                  </span>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] block mb-0.5">Regular (₹)</label>
                  <input
                    type="number"
                    required
                    value={slab.regularPrice}
                    onChange={(e) => {
                      const updated = [...quickSlab];
                      updated[index].regularPrice = parseFloat(e.target.value) || 0;
                      setQuickSlab(updated);
                    }}
                    className="admin-input w-full font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] block mb-0.5">Express (₹)</label>
                  <input
                    type="number"
                    required
                    value={slab.expressPrice}
                    onChange={(e) => {
                      const updated = [...quickSlab];
                      updated[index].expressPrice = parseFloat(e.target.value) || 0;
                      setQuickSlab(updated);
                    }}
                    className="admin-input w-full font-bold text-xs text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
            <div className="text-[11px] text-[var(--text-secondary)]">
              Editing complete slab for <span className="font-bold text-[var(--heading-color)]">{selectedLaundryType}</span> ×{' '}
              <span className="font-bold text-[var(--primary)]">
                {serviceMasters.find((s) => s.id === selectedServiceId)?.name}
              </span>
            </div>

            <button type="submit" className="admin-btn-primary">
              <Save className="w-3.5 h-3.5" />
              <span>Save Slab Pricing</span>
            </button>
          </div>
        </form>
      </div>

      {/* FULL BULK SLABS TABLE */}
      <div className="azea-card overflow-hidden text-xs">
        <div className="p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by service name..."
              className="admin-input w-full pl-9"
            />
          </div>

          <div className="text-[11px] text-[var(--text-secondary)] font-medium" suppressHydrationWarning>
            Total Configured Slabs: <span className="font-bold text-[var(--heading-color)]">{isMounted ? filteredBulkItems.length : 0}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="azea-table" suppressHydrationWarning>
            <thead>
              <tr>
                <th className="pl-6">Weight Slab</th>
                <th>Laundry Segment</th>
                <th>Service Name</th>
                <th>Regular Price</th>
                <th>Express Price</th>
                <th>Regular TAT</th>
                <th>Express TAT</th>
                <th className="text-center">Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBulkItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[var(--text-secondary)]">
                    No bulk weight slabs configured for active filters. Click &quot;+ Add Weight Slab&quot; above to create one.
                  </td>
                </tr>
              ) : (
                filteredBulkItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="pl-6 font-extrabold text-xs text-[var(--heading-color)]">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>{item.weightKg} KG</span>
                      </div>
                    </td>
                    <td>
                      <span className="bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] px-2 py-0.5 rounded font-bold text-[10px] border border-[var(--border-color)]">
                        {item.laundryType}
                      </span>
                    </td>
                    <td className="font-bold text-[var(--heading-color)]">{item.serviceName}</td>
                    <td className="font-extrabold text-[var(--primary)] text-sm">₹{item.regularPrice}</td>
                    <td className="font-bold text-amber-600 text-sm">₹{item.expressPrice}</td>
                    <td>{item.regularTatHours}h</td>
                    <td>{item.expressTatHours}h</td>
                    <td className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {item.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-right pr-6 space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Slab"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.weightKg, item.serviceName)}
                        className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:text-rose-600"
                        title="Delete Slab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE ITEM ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)]">
                  {editingItem ? `Edit ${editingItem.weightKg} KG Price Slab` : 'Add New Bulk Weight Slab'}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">Configure dedicated bulk pricing rule.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-[var(--heading-color)] hover:bg-[var(--bg-secondary-card)] rounded-lg font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSingleItem} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Laundry Segment</label>
                <select
                  value={itemForm.laundryType}
                  onChange={(e) => setItemForm({ ...itemForm, laundryType: e.target.value as BulkLaundryType })}
                  className="admin-input w-full font-bold"
                >
                  {LAUNDRY_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Service Master</label>
                <select
                  value={itemForm.serviceId}
                  onChange={(e) => setItemForm({ ...itemForm, serviceId: e.target.value })}
                  className="admin-input w-full font-bold"
                >
                  {serviceMasters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={itemForm.weightKg}
                    onChange={(e) => setItemForm({ ...itemForm, weightKg: parseFloat(e.target.value) || 1 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Regular (₹)</label>
                  <input
                    type="number"
                    required
                    value={itemForm.regularPrice}
                    onChange={(e) => setItemForm({ ...itemForm, regularPrice: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Express (₹)</label>
                  <input
                    type="number"
                    required
                    value={itemForm.expressPrice}
                    onChange={(e) => setItemForm({ ...itemForm, expressPrice: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-sm text-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Regular TAT (Hours)</label>
                  <input
                    type="number"
                    value={itemForm.regularTatHours}
                    onChange={(e) => setItemForm({ ...itemForm, regularTatHours: parseInt(e.target.value) || 48 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Express TAT (Hours)</label>
                  <input
                    type="number"
                    value={itemForm.expressTatHours}
                    onChange={(e) => setItemForm({ ...itemForm, expressTatHours: parseInt(e.target.value) || 12 })}
                    className="admin-input w-full font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)]">
                <span className="font-bold text-[var(--heading-color)]">Slab Status</span>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={itemForm.isActive}
                    onChange={(e) => setItemForm({ ...itemForm, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#16A34A]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingItem ? 'Update Slab' : 'Save Slab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
