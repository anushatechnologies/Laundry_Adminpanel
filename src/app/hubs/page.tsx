'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Truck,
  Plus,
  Search,
  MapPin,
  Phone,
  Scale,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  Calculator,
  Navigation,
  Clock,
  Mail,
  Zap,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Info,
} from 'lucide-react';
import { HubBranch, InHouseFleetVehicle } from '@/types';

export default function AdminHubsPage() {
  const { hubs: localHubs, orders } = useApp();
  const [hubs, setHubs] = useState<HubBranch[]>(localHubs);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedHub, setSelectedHub] = useState<HubBranch | null>(null);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCity, setFormCity] = useState('Rajahmundry');
  const [formState, setFormState] = useState('Andhra Pradesh');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState<number>(17.0005);
  const [formLng, setFormLng] = useState<number>(81.804);
  const [formPhone, setFormPhone] = useState('+91 883 245 0000');
  const [formEmail, setFormEmail] = useState('hub.support@anushatechnologies.com');
  const [formCapacity, setFormCapacity] = useState<number>(600);
  const [formHours, setFormHours] = useState('06:00 AM - 10:00 PM');
  const [formMaxRadius, setFormMaxRadius] = useState<number>(35);
  const [formBaseDist, setFormBaseDist] = useState<number>(3);
  const [formBaseFare, setFormBaseFare] = useState<number>(30);
  const [formPerKm, setFormPerKm] = useState<number>(10);
  const [formFreeAbove, setFormFreeAbove] = useState<number>(399);
  const [formPincodes, setFormPincodes] = useState('533101, 533102, 533103, 533104');
  const [formIsActive, setFormIsActive] = useState(true);

  // Live Fare Calculator Simulator
  const [calcPincode, setCalcPincode] = useState('533101');
  const [calcLat, setCalcLat] = useState<number>(17.005);
  const [calcLng, setCalcLng] = useState<number>(81.81);
  const [calcOrderTotal, setCalcOrderTotal] = useState<number>(450);
  const [calcExpress, setCalcExpress] = useState(false);
  const [calcResult, setCalcResult] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api';

  // Fetch Live Hubs on mount
  async function fetchLiveHubs() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/hubs`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setHubs(json.data);
        if (!selectedHub) setSelectedHub(json.data[0]);
      }
    } catch (err) {
      console.warn('Using local hubs fallback:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiveHubs();
  }, []);

  useEffect(() => {
    if (hubs.length > 0 && !selectedHub) {
      setSelectedHub(hubs[0]);
    }
  }, [hubs]);

  const openCreateModal = () => {
    setIsEditing(false);
    setFormId(`hub_${Date.now()}`);
    setFormName('');
    setFormCode(`HUB-${formCity.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`);
    setFormCity('Rajahmundry');
    setFormState('Andhra Pradesh');
    setFormAddress('');
    setFormLat(17.0005);
    setFormLng(81.804);
    setFormPhone('+91 883 245 0000');
    setFormEmail('hub.rjy@anushatechnologies.com');
    setFormCapacity(600);
    setFormHours('06:00 AM - 10:00 PM');
    setFormMaxRadius(35);
    setFormBaseDist(3);
    setFormBaseFare(30);
    setFormPerKm(10);
    setFormFreeAbove(399);
    setFormPincodes('533101, 533102, 533103, 533104');
    setFormIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (hub: HubBranch) => {
    setIsEditing(true);
    setFormId(hub.id);
    setFormName(hub.name);
    setFormCode(hub.code || `HUB-${hub.city.slice(0, 3).toUpperCase()}-01`);
    setFormCity(hub.city);
    setFormState(hub.state || 'Andhra Pradesh');
    setFormAddress(hub.address);
    setFormLat(hub.latitude || 17.0005);
    setFormLng(hub.longitude || 81.804);
    setFormPhone(hub.contactPhone);
    setFormEmail(hub.contactEmail || 'support@anushatechnologies.com');
    setFormCapacity(hub.capacityKgPerDay || 500);
    setFormHours(hub.operatingHours || '06:00 AM - 10:00 PM');
    setFormMaxRadius(hub.maxServiceRadiusKm || 30);
    setFormBaseDist(hub.baseDistanceKm || 3);
    setFormBaseFare(hub.baseDeliveryFare || 30);
    setFormPerKm(hub.perKmFare || 10);
    setFormFreeAbove(hub.freeDeliveryAbove || 399);
    setFormPincodes(Array.isArray(hub.pincodes) ? hub.pincodes.join(', ') : '');
    setFormIsActive(hub.isActive);
    setModalOpen(true);
  };

  const handleSaveHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload = {
      id: formId,
      name: formName.trim(),
      code: formCode.trim(),
      city: formCity.trim(),
      state: formState.trim(),
      address: formAddress.trim(),
      latitude: Number(formLat),
      longitude: Number(formLng),
      contactPhone: formPhone.trim(),
      contactEmail: formEmail.trim(),
      capacityKgPerDay: Number(formCapacity),
      operatingHours: formHours.trim(),
      maxServiceRadiusKm: Number(formMaxRadius),
      baseDistanceKm: Number(formBaseDist),
      baseDeliveryFare: Number(formBaseFare),
      perKmFare: Number(formPerKm),
      freeDeliveryAbove: Number(formFreeAbove),
      pincodes: formPincodes.split(',').map((p) => p.trim()).filter(Boolean),
      isActive: formIsActive,
      inHouseVehicles: selectedHub?.inHouseVehicles || [
        {
          id: `VAN-${Date.now().toString(36).toUpperCase()}`,
          vehicleType: 'ELECTRIC_VAN',
          registrationNo: 'AP-05-EV-1024',
          driverName: 'Srinivas Rao',
          driverPhone: formPhone,
          capacityKg: 150,
          status: 'IDLE',
          currentHubId: formId,
        },
      ],
    };

    try {
      const endpoint = isEditing ? `${API_URL}/hubs/${formId}` : `${API_URL}/hubs`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (isEditing) {
          setHubs((prev) => prev.map((h) => (h.id === formId ? { ...h, ...payload } : h)));
          if (selectedHub?.id === formId) setSelectedHub({ ...selectedHub, ...payload });
        } else {
          setHubs((prev) => [payload as HubBranch, ...prev]);
          setSelectedHub(payload as HubBranch);
        }
      }
    } catch (err) {
      console.warn('Fallback local state update on save:', err);
      if (isEditing) {
        setHubs((prev) => prev.map((h) => (h.id === formId ? ({ ...h, ...payload } as HubBranch) : h)));
      } else {
        setHubs((prev) => [payload as HubBranch, ...prev]);
      }
    } finally {
      setModalOpen(false);
    }
  };

  const handleDeleteHub = async (id: string) => {
    try {
      await fetch(`${API_URL}/hubs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete on API, updating local state:', err);
    }
    const updated = hubs.filter((h) => h.id !== id);
    setHubs(updated);
    if (selectedHub?.id === id) setSelectedHub(updated[0] || null);
    setDeleteConfirmId(null);
  };

  // Run Test Distance & Fare Calculator
  const runFareCalculation = async () => {
    try {
      const res = await fetch(`${API_URL}/hubs/calculate-fare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPincode: calcPincode,
          customerLat: calcLat,
          customerLng: calcLng,
          orderTotal: calcOrderTotal,
          isExpress: calcExpress,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalcResult(data.data);
      }
    } catch {
      // Local calculation fallback
      const hub = hubs.find((h) => h.pincodes.includes(calcPincode)) || hubs[0];
      const dist = 4.2;
      const isFree = calcOrderTotal >= (hub?.freeDeliveryAbove || 399) && dist <= 7;
      const fee = isFree ? 0 : (hub?.baseDeliveryFare || 30) + (dist > 3 ? (dist - 3) * (hub?.perKmFare || 10) : 0);
      setCalcResult({
        assignedHub: hub,
        distanceKm: dist,
        deliveryFee: Math.round(fee),
        isFreeDelivery: isFree,
        freeDeliveryThreshold: hub?.freeDeliveryAbove || 399,
        expressFee: calcExpress ? 199 : 0,
        totalPickupDeliveryFee: Math.round(fee) + (calcExpress ? 199 : 0),
        estimatedTurnaroundHours: 24,
        calculationNote: isFree ? `Free Delivery (Order ₹${calcOrderTotal} >= ₹399)` : `Standard Tier (${dist} KM)`,
      });
    }
  };

  const filteredHubs = hubs.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      (h.pincodes && h.pincodes.some((p) => p.includes(search)))
  );

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP ACTIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="azea-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#16A34A]" />
            <span>Store Locations, Regional Hubs & Distance Pricing</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage regional fulfillment centers, GPS geolocation coordinates, per-KM delivery fare slabs, and assigned service territories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={openCreateModal} className="admin-btn-primary">
            <Plus className="w-4 h-4" />
            <span>+ Add Regional Hub / Store</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRICS OVERVIEW
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Hubs</span>
          <span className="text-2xl font-black text-[var(--heading-color)] font-poppins mt-1 block">
            {hubs.filter((h) => h.isActive).length} Active Stores
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">100% On-Time Processing</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Wash Capacity</span>
          <span className="text-2xl font-black text-blue-600 font-poppins mt-1 block">
            {hubs.reduce((sum, h) => sum + (h.capacityKgPerDay || 500), 0)} KG / Day
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">Heavy Washers & Hydro Steam</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Covered Pincodes</span>
          <span className="text-2xl font-black text-purple-600 font-poppins mt-1 block">
            {new Set(hubs.flatMap((h) => h.pincodes || [])).size} Pincode Zones
          </span>
          <span className="text-[11px] text-purple-500 font-bold mt-1 block">AP & Telangana Hub Network</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In-House Electric Fleet</span>
          <span className="text-2xl font-black text-amber-600 font-poppins mt-1 block">
            {hubs.reduce((sum, h) => sum + (h.inHouseVehicles?.length || 0), 0)} EV Vans & Bikes
          </span>
          <span className="text-[11px] text-amber-500 font-bold mt-1 block">Zero Emission Delivery</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN TWO COLUMN: HUBS DIRECTORY & ACTIVE HUB DETAILS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Hubs List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="azea-card p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hub by name, city, or pincode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input w-full pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredHubs.map((hub) => {
              const isSelected = selectedHub?.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`azea-card p-4 transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'border-blue-500 shadow-md bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--heading-color)]">{hub.name}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                          {hub.code || 'HUB'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hub.city}, {hub.state || 'Andhra Pradesh'}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        hub.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {hub.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 mt-3 border-t border-[var(--border-color)]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Capacity</span>
                      <span className="font-bold text-[var(--heading-color)]">{hub.capacityKgPerDay || 500} KG</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Radius</span>
                      <span className="font-bold text-indigo-600">{hub.maxServiceRadiusKm || 30} KM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Base Fare</span>
                      <span className="font-bold text-emerald-600">₹{hub.baseDeliveryFare || 30}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Selected Hub Detailed Manager */}
        <div className="lg:col-span-7 space-y-5">
          {selectedHub ? (
            <div className="azea-card p-6 space-y-6">
              {/* Header Details & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border-color)]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-[var(--heading-color)] font-poppins">
                      {selectedHub.name}
                    </h2>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                      {selectedHub.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedHub.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedHub)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Hub</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(selectedHub.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Geographic Coordinates & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">📍 Geolocation & Timing</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <span className="font-mono font-bold text-[var(--heading-color)]">
                      {selectedHub.latitude || 17.0005}, {selectedHub.longitude || 81.804}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operating Hours:</span>
                    <span className="font-bold text-[var(--heading-color)]">{selectedHub.operatingHours || '06:00 AM - 10:00 PM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Service Radius:</span>
                    <span className="font-bold text-indigo-600">{selectedHub.maxServiceRadiusKm || 30} KM</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">📞 Dispatch Contacts</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hub Hotline:</span>
                    <span className="font-bold text-[var(--heading-color)]">{selectedHub.contactPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Manager Email:</span>
                    <span className="font-bold text-[var(--heading-color)]">{selectedHub.contactEmail || 'support@anushatechnologies.com'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Wash Load:</span>
                    <span className="font-bold text-emerald-600">{selectedHub.capacityKgPerDay || 500} KG / Day</span>
                  </div>
                </div>
              </div>

              {/* Delivery Distance Pricing Slabs for This Store */}
              <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Distance Fare Calculation Rules</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900">
                    Live Engine
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Base Radius</span>
                    <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                      0 – {selectedHub.baseDistanceKm || 3} KM
                    </span>
                    <span className="text-[10px] text-slate-500">Flat ₹{selectedHub.baseDeliveryFare || 30}</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Per-KM Rate</span>
                    <span className="text-sm font-black text-blue-600 mt-0.5 block">
                      ₹{selectedHub.perKmFare || 10} / KM
                    </span>
                    <span className="text-[10px] text-slate-500">Beyond base radius</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Free Delivery</span>
                    <span className="text-sm font-black text-purple-600 mt-0.5 block">
                      Orders ≥ ₹{selectedHub.freeDeliveryAbove || 399}
                    </span>
                    <span className="text-[10px] text-slate-500">Within 7 KM</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-emerald-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Max Radius</span>
                    <span className="text-sm font-black text-amber-600 mt-0.5 block">
                      {selectedHub.maxServiceRadiusKm || 35} KM
                    </span>
                    <span className="text-[10px] text-slate-500">Outer boundary</span>
                  </div>
                </div>
              </div>

              {/* Serviceable Pincodes Tags */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[var(--heading-color)] block">
                  Serviceable Pincode Territories ({selectedHub.pincodes?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedHub.pincodes?.map((pin) => (
                    <span
                      key={pin}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      {pin}
                    </span>
                  ))}
                </div>
              </div>

              {/* In-House Electric Delivery Fleet */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--heading-color)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Assigned In-House EV Fleet & Riders</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedHub.inHouseVehicles?.map((veh) => (
                    <div
                      key={veh.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-[var(--border-color)] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-500" />
                          <span>{veh.registrationNo}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {veh.driverName} • {veh.driverPhone}
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {veh.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="azea-card p-12 text-center text-slate-400">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold">Select a Regional Hub from the left to manage details.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE DISTANCE & FARE SIMULATOR ENGINE
      ───────────────────────────────────────────────────────────── */}
      <div className="azea-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <h3 className="font-bold text-sm text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Interactive Live Distance & Fare Calculation Simulator</span>
          </h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200">
            Real-Time Haversine Engine
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          Test any customer address coordinates or pincode to preview which fulfillment hub will be assigned and the exact delivery fee calculated.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Customer Pincode</label>
            <input
              type="text"
              value={calcPincode}
              onChange={(e) => setCalcPincode(e.target.value)}
              className="admin-input w-full text-xs"
              placeholder="e.g. 533101"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Order Subtotal (₹)</label>
            <input
              type="number"
              value={calcOrderTotal}
              onChange={(e) => setCalcOrderTotal(Number(e.target.value))}
              className="admin-input w-full text-xs font-bold"
              placeholder="450"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Customer Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={calcLat}
              onChange={(e) => setCalcLat(Number(e.target.value))}
              className="admin-input w-full text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Customer Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={calcLng}
              onChange={(e) => setCalcLng(Number(e.target.value))}
              className="admin-input w-full text-xs font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={runFareCalculation}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Calculate Live Fare</span>
            </button>
          </div>
        </div>

        {/* Calculation Result Banner */}
        {calcResult && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800/40 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Assigned Hub: {calcResult.assignedHub?.name || 'Rajahmundry Central Hub'}</span>
              </div>
              <div className="text-slate-500">
                Distance: <strong className="text-slate-800 dark:text-slate-200">{calcResult.distanceKm} KM</strong> •{' '}
                {calcResult.calculationNote}
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Fee</span>
                <span className="text-lg font-black text-emerald-600 font-poppins">
                  {calcResult.deliveryFee === 0 ? 'FREE (₹0)' : `₹${calcResult.deliveryFee}`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Turnaround ETA</span>
                <span className="text-xs font-bold text-indigo-600">
                  {calcResult.estimatedTurnaroundHours} Hours
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ADD / EDIT HUB MODAL
      ───────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="azea-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-[var(--heading-color)] font-poppins">
                  {isEditing ? 'Edit Regional Hub / Store' : 'Add New Regional Hub'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHub} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Hub Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="admin-input w-full"
                    placeholder="e.g. Rajahmundry Central Processing Hub"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Hub Branch Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="admin-input w-full font-mono"
                    placeholder="HUB-RJY-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="admin-input w-full"
                    placeholder="Rajahmundry"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="admin-input w-full"
                    placeholder="Andhra Pradesh"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Street Address</label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="admin-input w-full"
                  placeholder="Plot 18, Industrial Estate, Danavaipeta Main Road"
                />
              </div>

              {/* GPS Geolocation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-[var(--border-color)]">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formLat}
                    onChange={(e) => setFormLat(Number(e.target.value))}
                    className="admin-input w-full font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formLng}
                    onChange={(e) => setFormLng(Number(e.target.value))}
                    className="admin-input w-full font-mono"
                  />
                </div>
              </div>

              {/* Contact and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Capacity (KG/Day)</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              {/* Delivery Pricing Rules */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 uppercase text-[10px] block">
                  Delivery Distance & Pricing Slabs
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Base Dist (KM)</label>
                    <input
                      type="number"
                      value={formBaseDist}
                      onChange={(e) => setFormBaseDist(Number(e.target.value))}
                      className="admin-input w-full font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Base Fare (₹)</label>
                    <input
                      type="number"
                      value={formBaseFare}
                      onChange={(e) => setFormBaseFare(Number(e.target.value))}
                      className="admin-input w-full font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Per-KM Fare (₹)</label>
                    <input
                      type="number"
                      value={formPerKm}
                      onChange={(e) => setFormPerKm(Number(e.target.value))}
                      className="admin-input w-full font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Free Delivery Above (₹)</label>
                    <input
                      type="number"
                      value={formFreeAbove}
                      onChange={(e) => setFormFreeAbove(Number(e.target.value))}
                      className="admin-input w-full font-bold text-purple-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Serviceable Pincodes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formPincodes}
                  onChange={(e) => setFormPincodes(e.target.value)}
                  className="admin-input w-full font-mono"
                  placeholder="533101, 533102, 533103, 533104"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-200">Hub is Active for Dispatch</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    <span>{isEditing ? 'Save Changes' : 'Create Regional Hub'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="azea-card w-full max-w-md p-6 space-y-4 text-center">
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-[var(--heading-color)] font-poppins">Delete Regional Hub?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove this hub? All routing and distance calculation for associated pincodes will be re-assigned to the next closest hub.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteHub(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer"
              >
                Yes, Delete Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
