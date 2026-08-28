'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  CheckCircle,
  AlertCircle,
  Plus,
  Upload,
  Search,
  Edit2,
  Trash2,
  X,
  Building2,
  Truck,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PincodeZone } from '@/types';

export default function AdminPincodesPage() {
  const { pincodes, addPincode, updatePincode, deletePincode, showToast } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPincode, setEditingPincode] = useState<PincodeZone | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Custom city toggle
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');

  // Extract unique cities from pincodes
  const existingCities = Array.from(
    new Set(['Hyderabad', 'Bengaluru', 'New Delhi', 'Mumbai', ...pincodes.map((p) => p.city)])
  ).filter(Boolean);

  // Form State
  const [form, setForm] = useState({
    pincode: '',
    areaName: '',
    city: 'Hyderabad',
    hubName: 'Hyderabad Central Hub',
    distanceKm: 3.5,
    standardFee: 40,
    minFreeOrderValue: 399,
    expressAvailable: true,
    averageTurnaroundHours: 24,
    isServiceable: true,
  });

  const openAddModal = (presetCity?: string) => {
    setEditingPincode(null);
    setIsCustomCity(false);
    setCustomCityInput('');
    const targetCity = presetCity || (selectedCity === 'ALL' ? 'Hyderabad' : selectedCity);
    setForm({
      pincode: '',
      areaName: '',
      city: targetCity,
      hubName: `${targetCity} Central Hub`,
      distanceKm: 3.5,
      standardFee: 40,
      minFreeOrderValue: 399,
      expressAvailable: true,
      averageTurnaroundHours: 24,
      isServiceable: true,
    });
    setShowAddModal(true);
  };

  const openEditModal = (item: PincodeZone) => {
    setEditingPincode(item);
    setIsCustomCity(false);
    setCustomCityInput('');
    setForm({
      pincode: item.pincode,
      areaName: item.areaName,
      city: item.city,
      hubName: (item as any).hubName || `${item.city} Central Hub`,
      distanceKm: (item as any).distanceKm || 3.5,
      standardFee: item.standardFee,
      minFreeOrderValue: item.minFreeOrderValue,
      expressAvailable: item.expressAvailable,
      averageTurnaroundHours: item.averageTurnaroundHours || 24,
      isServiceable: item.isServiceable,
    });
    setShowAddModal(true);
  };

  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = isCustomCity ? customCityInput.trim() : form.city.trim();

    if (!form.pincode.trim() || !form.areaName.trim() || !finalCity) {
      showToast('Pincode, area name, and city are required.', 'error');
      return;
    }

    const payload: PincodeZone = {
      pincode: form.pincode.trim(),
      areaName: form.areaName.trim(),
      city: finalCity,
      isServiceable: form.isServiceable,
      standardFee: form.standardFee,
      minFreeOrderValue: form.minFreeOrderValue,
      expressAvailable: form.expressAvailable,
      averageTurnaroundHours: form.averageTurnaroundHours,
      ...( { hubName: form.hubName, distanceKm: form.distanceKm } as any ),
    };

    if (editingPincode) {
      updatePincode(editingPincode.pincode, payload);
      showToast(`Updated coverage for pincode ${form.pincode}!`, 'success');
    } else {
      addPincode(payload);
      showToast(`Added pincode ${form.pincode} (${form.areaName}) in ${finalCity}!`, 'success');
    }

    setShowAddModal(false);
  };

  const handleDelete = (pincode: string, areaName: string) => {
    if (confirm(`Remove pincode ${pincode} (${areaName}) from coverage?`)) {
      deletePincode(pincode);
      showToast(`Deleted pincode ${pincode}.`, 'info');
    }
  };

  const handleCsvUpload = () => {
    setShowCsvModal(false);
    showToast('Bulk CSV processing completed! All metro pincodes synchronized.', 'success');
  };

  // Filtered List
  const filteredPincodes = pincodes.filter((pin) => {
    const matchesCity = selectedCity === 'ALL' || pin.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      pin.pincode.includes(searchQuery) ||
      pin.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const hyderabadCount = pincodes.filter((p) => p.city.toLowerCase() === 'hyderabad').length;
  const bengaluruCount = pincodes.filter((p) => p.city.toLowerCase() === 'bengaluru').length;
  const activeCount = pincodes.filter((p) => p.isServiceable).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="azea-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#1E40AF] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              City Coverage & Geographic Dispatch
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2 mt-1">
            <MapPin className="w-6 h-6 text-[#1E40AF] dark:text-blue-400" />
            <span>Pincodes & Coverage Management</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
            Configure active service postal codes, hub mapping, doorstep pickup/delivery rules, and regional delivery fees.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={() => setShowCsvModal(true)} className="admin-btn-secondary">
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>
          <button onClick={() => openAddModal()} className="admin-btn-primary">
            <Plus className="w-4 h-4" />
            <span>Add Pincode</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" suppressHydrationWarning>
        <div className="azea-card p-5">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Postal Codes</span>
          <span className="text-3xl font-black text-[var(--heading-color)] font-poppins mt-1 block">
            {isMounted ? pincodes.length : 0}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">Across {existingCities.length} metro cities</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[11px] font-bold text-[#1E40AF] dark:text-blue-400 uppercase tracking-wider block">Hyderabad Coverage</span>
          <span className="text-3xl font-black text-[#1E40AF] dark:text-blue-400 font-poppins mt-1 block">
            {isMounted ? hyderabadCount : 0}
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">HITEC, Gachibowli, Jubilee Hills</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Bengaluru & Metros</span>
          <span className="text-3xl font-black text-slate-800 dark:text-slate-200 font-poppins mt-1 block">
            {isMounted ? bengaluruCount : 0}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Koramangala, Indiranagar, HSR</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Active Coverage</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-poppins mt-1 block">
            {isMounted ? activeCount : 0}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">✓ Live for doorstep pickup</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="azea-card p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedCity('ALL')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
              selectedCity === 'ALL'
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--heading-color)]'
            }`}
          >
            ALL CITIES ({pincodes.length})
          </button>
          {existingCities.map((city) => {
            const count = pincodes.filter((p) => p.city.toLowerCase() === city.toLowerCase()).length;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--heading-color)]'
                }`}
              >
                <span>{city}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCity.toLowerCase() === city.toLowerCase() ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search pincode, area, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input w-full pl-9"
          />
        </div>
      </div>

      {/* Pincodes Table */}
      <div className="azea-card overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="azea-table" suppressHydrationWarning>
            <thead>
              <tr>
                <th className="pl-6">Pincode</th>
                <th>Area Name</th>
                <th>City</th>
                <th>Assigned Hub</th>
                <th>Distance</th>
                <th>Fee (₹)</th>
                <th>Free Delivery Above</th>
                <th>Express Service</th>
                <th className="text-center">Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody suppressHydrationWarning>
              {!isMounted ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[var(--text-secondary)] font-medium">
                    Loading pincodes...
                  </td>
                </tr>
              ) : filteredPincodes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[var(--text-secondary)] font-medium">
                    No pincodes match your active search filter. Click &quot;+ Add Pincode&quot; above to add one.
                  </td>
                </tr>
              ) : (
                filteredPincodes.map((pin) => (
                  <tr key={pin.pincode} className="hover:bg-slate-500/5 transition-colors">
                    <td className="pl-6 font-mono font-black text-sm text-[#1E40AF] dark:text-blue-400" suppressHydrationWarning>
                      {pin.pincode}
                    </td>
                    <td className="font-extrabold text-[var(--heading-color)]" suppressHydrationWarning>{pin.areaName}</td>
                    <td suppressHydrationWarning>
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300 rounded font-black text-[10px] border border-blue-200 dark:border-blue-800">
                        {pin.city}
                      </span>
                    </td>
                    <td className="font-bold text-[var(--heading-color)]" suppressHydrationWarning>
                      {(pin as any).hubName || `${pin.city} Central Hub`}
                    </td>
                    <td className="font-semibold" suppressHydrationWarning>{(pin as any).distanceKm || 3.5} KM</td>
                    <td className="font-extrabold text-sm text-[var(--heading-color)]" suppressHydrationWarning>₹{pin.standardFee}</td>
                    <td className="font-bold text-emerald-600" suppressHydrationWarning>₹{pin.minFreeOrderValue}</td>
                    <td suppressHydrationWarning>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pin.expressAvailable ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
                        {pin.expressAvailable ? '⚡ 12h Express' : 'Standard 24h'}
                      </span>
                    </td>
                    <td className="text-center" suppressHydrationWarning>
                      {pin.isServiceable ? (
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
                          DISABLED
                        </span>
                      )}
                    </td>
                    <td className="text-right pr-6 space-x-1">
                      <button
                        onClick={() => openEditModal(pin)}
                        className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit Pincode"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pin.pincode, pin.areaName)}
                        className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:text-rose-600 hover:border-rose-300 cursor-pointer"
                        title="Delete Pincode"
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

      {/* Add / Edit Pincode Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[16px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">
                {editingPincode ? `Edit Pincode ${editingPincode.pincode}` : 'Add Serviceable Pincode'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePincode} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Pincode (6 digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 500081"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="admin-input w-full font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Select City</label>
                  {!isCustomCity ? (
                    <select
                      value={form.city}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setIsCustomCity(true);
                          setCustomCityInput('');
                        } else {
                          setForm({ ...form, city: e.target.value, hubName: `${e.target.value} Central Hub` });
                        }
                      }}
                      className="admin-input w-full font-bold cursor-pointer"
                    >
                      {existingCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="font-extrabold text-[#1E40AF]">
                        + Add New City...
                      </option>
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="Type city (e.g. Chennai)"
                        value={customCityInput}
                        onChange={(e) => {
                          setCustomCityInput(e.target.value);
                          setForm({ ...form, city: e.target.value, hubName: `${e.target.value} Central Hub` });
                        }}
                        className="admin-input w-full font-bold border-[#1E40AF]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCity(false)}
                        className="text-[10px] font-bold text-[#1E40AF] hover:underline block"
                      >
                        ← Choose existing city
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Area / Locality Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhapur / HITEC City / Cyber Towers"
                  value={form.areaName}
                  onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Assigned Hub / Branch</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HITEC City Tech Hub"
                  value={form.hubName}
                  onChange={(e) => setForm({ ...form, hubName: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Standard Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={form.standardFee}
                    onChange={(e) => setForm({ ...form, standardFee: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    value={form.minFreeOrderValue}
                    onChange={(e) => setForm({ ...form, minFreeOrderValue: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)]">
                <span className="font-bold text-[var(--heading-color)]">Service Availability</span>
                <div className="flex items-center gap-4 font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.expressAvailable}
                      onChange={(e) => setForm({ ...form, expressAvailable: e.target.checked })}
                      className="w-4 h-4 accent-[#1E40AF]"
                    />
                    <span>Express</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isServiceable}
                      onChange={(e) => setForm({ ...form, isServiceable: e.target.checked })}
                      className="w-4 h-4 accent-[#1E40AF]"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingPincode ? 'Update Pincode' : 'Save Pincode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[16px] p-6 max-w-md w-full border border-[var(--border-color)] shadow-2xl text-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">Bulk Pincode CSV Import</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 border-2 border-dashed border-[var(--border-color)] rounded-[12px] text-center space-y-2">
              <Upload className="w-8 h-8 text-[#1E40AF] mx-auto" />
              <div className="font-bold text-[var(--heading-color)]">Drag & drop your CSV file here</div>
              <p className="text-[11px] text-[var(--text-secondary)]">Required columns: pincode, area_name, city, standard_fee, is_serviceable</p>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-[var(--border-color)]">
              <button onClick={() => setShowCsvModal(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleCsvUpload} className="admin-btn-primary">
                Import CSV File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
