'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  PackageCheck,
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Edit2,
  Box,
  Wrench,
  Settings,
  X,
  CheckCircle2,
  Calendar,
  DollarSign,
  Tag,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { ConsumableInventory, PackagingInventoryItem, FacilityMachineItem, MaintenanceLogEntry } from '@/types';

function InventoryContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams ? searchParams.get('tab') : null;
  const initialTab =
    rawTab === 'packaging'
      ? 'packaging'
      : rawTab === 'machines'
      ? 'machines'
      : rawTab === 'maintenance'
      ? 'maintenance'
      : 'consumables';

  const { inventory, updateInventoryStock, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'consumables' | 'packaging' | 'machines' | 'maintenance'>(initialTab);

  useEffect(() => {
    if (rawTab === 'packaging') setActiveTab('packaging');
    else if (rawTab === 'machines') setActiveTab('machines');
    else if (rawTab === 'maintenance') setActiveTab('maintenance');
    else if (rawTab === 'consumables') setActiveTab('consumables');
  }, [rawTab]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Dynamic Local Inventory State for Consumables with Delete/Add Support
  const [consumableItems, setConsumableItems] = useState<ConsumableInventory[]>([]);

  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setConsumableItems(inventory);
    } else {
      setConsumableItems([
        {
          id: 'inv-1',
          itemName: 'Eco-Bio Enzyme Liquid Detergent',
          category: 'DETERGENT',
          currentStock: 180,
          unit: 'LITERS',
          minThreshold: 50,
          unitCost: 140,
          status: 'IN_STOCK',
          location: 'Hub A - Shelf D1',
          lastRestockedAt: '2026-08-20',
        },
        {
          id: 'inv-2',
          itemName: 'Continuous Ozone Sanitizing Fluid',
          category: 'CHEMICAL',
          currentStock: 35,
          unit: 'LITERS',
          minThreshold: 40,
          unitCost: 320,
          status: 'LOW_STOCK',
          location: 'Hub A - Chemical Vault',
          lastRestockedAt: '2026-08-15',
        },
        {
          id: 'inv-3',
          itemName: 'Fabric Softener (Lavender Fresh)',
          category: 'SOFTENER',
          currentStock: 240,
          unit: 'LITERS',
          minThreshold: 60,
          unitCost: 95,
          status: 'IN_STOCK',
          location: 'Hub A - Shelf D2',
          lastRestockedAt: '2026-08-22',
        },
        {
          id: 'inv-4',
          itemName: 'Stain Remover & Spotting Solution',
          category: 'CHEMICAL',
          currentStock: 12,
          unit: 'LITERS',
          minThreshold: 20,
          unitCost: 450,
          status: 'LOW_STOCK',
          location: 'Hub B - Spotting Bench',
          lastRestockedAt: '2026-08-10',
        },
      ]);
    }
  }, [inventory]);

  // Packaging Inventory State
  const [packagingItems, setPackagingItems] = useState<PackagingInventoryItem[]>([
    {
      id: 'pkg-1',
      itemName: 'Clear Suit & Saree Garment Covers (100u)',
      type: 'GARMENT_BAG',
      currentQuantity: 850,
      minQuantity: 200,
      packSize: 100,
      costPerPack: 450,
      status: 'IN_STOCK',
      supplierName: 'PolyPack Industries',
    },
    {
      id: 'pkg-2',
      itemName: 'Heavy-Duty Waterproof Laundry Bags (50 KG)',
      type: 'LAUNDRY_BAG',
      currentQuantity: 120,
      minQuantity: 150,
      packSize: 50,
      costPerPack: 1200,
      status: 'LOW_STOCK',
      supplierName: 'EcoBags South',
    },
    {
      id: 'pkg-3',
      itemName: 'Thermal Barcode Hanger Tags (Roll of 1000)',
      type: 'TAG',
      currentQuantity: 14,
      minQuantity: 5,
      packSize: 1000,
      costPerPack: 650,
      status: 'IN_STOCK',
      supplierName: 'BarcodeTech India',
    },
    {
      id: 'pkg-4',
      itemName: 'Bio-Degradable Shirt Hanger Covers',
      type: 'HANGER_COVER',
      currentQuantity: 450,
      minQuantity: 100,
      packSize: 200,
      costPerPack: 350,
      status: 'IN_STOCK',
      supplierName: 'GreenPack Solutions',
    },
  ]);

  // Machines Inventory State
  const [facilityMachines, setFacilityMachines] = useState<FacilityMachineItem[]>([
    {
      id: 'mach-1',
      machineCode: 'WM-001',
      name: 'Industrial Ozone Continuous Washer #1',
      type: 'WASHER',
      capacityKg: 25,
      status: 'RUNNING',
      nextServiceDate: '2026-09-01',
      totalCyclesRun: 1420,
      lastServicedAt: '2026-06-01',
    },
    {
      id: 'mach-2',
      machineCode: 'WM-002',
      name: 'Industrial Ozone Continuous Washer #2',
      type: 'WASHER',
      capacityKg: 25,
      status: 'AVAILABLE',
      nextServiceDate: '2026-09-10',
      totalCyclesRun: 1180,
      lastServicedAt: '2026-06-10',
    },
    {
      id: 'mach-3',
      machineCode: 'DR-001',
      name: 'Heavy Duty Gas Tumble Dryer (30 KG)',
      type: 'DRYER',
      capacityKg: 30,
      status: 'RUNNING',
      nextServiceDate: '2026-09-05',
      totalCyclesRun: 1890,
      lastServicedAt: '2026-06-05',
    },
    {
      id: 'mach-4',
      machineCode: 'SI-001',
      name: 'Vacuum Steam Press Table #1',
      type: 'STEAM_PRESS',
      capacityKg: 15,
      status: 'RUNNING',
      nextServiceDate: '2026-09-12',
      totalCyclesRun: 2400,
      lastServicedAt: '2026-06-12',
    },
    {
      id: 'mach-5',
      machineCode: 'SC-001',
      name: 'Laser & RFID Garment Tag Scanner',
      type: 'BARCODE_SCANNER',
      capacityKg: 0,
      status: 'AVAILABLE',
      nextServiceDate: '2026-10-01',
      totalCyclesRun: 8900,
      lastServicedAt: '2026-07-01',
    },
  ]);

  // Maintenance Logs State
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogEntry[]>([
    {
      id: 'maint-1',
      machineId: 'mach-1',
      machineCode: 'WM-001',
      serviceType: 'PREVENTATIVE',
      description: 'Replaced water inlet valves, recalibrated ozone generator injection pressure',
      technicianName: 'Suresh Kumar (Apex Machinery)',
      cost: 4500,
      performedAt: '2026-06-01',
      nextDueDate: '2026-09-01',
    },
    {
      id: 'maint-2',
      machineId: 'mach-3',
      machineCode: 'DR-001',
      serviceType: 'FILTER_CLEAN',
      description: 'Cleaned lint exhaust duct, tested burner spark ignition system',
      technicianName: 'Internal Maintenance Team',
      cost: 800,
      performedAt: '2026-06-05',
      nextDueDate: '2026-09-05',
    },
  ]);

  // Modal Control States
  const [showAddConsumableModal, setShowAddConsumableModal] = useState(false);
  const [showAddPackagingModal, setShowAddPackagingModal] = useState(false);
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);

  // Restock Modal for Consumables
  const [restockModalItem, setRestockModalItem] = useState<ConsumableInventory | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [restockReason, setRestockReason] = useState<string>('Supplier Delivery Batch #2026-AUG');

  // Form Data States for Add Modals
  const [consumableForm, setConsumableForm] = useState({
    itemName: '',
    category: 'DETERGENT' as const,
    currentStock: 100,
    unit: 'LITERS' as const,
    minThreshold: 30,
    unitCost: 150,
    location: 'Hub A - Main Bay',
  });

  const [packagingForm, setPackagingForm] = useState({
    itemName: '',
    type: 'GARMENT_BAG' as const,
    currentQuantity: 500,
    minQuantity: 100,
    packSize: 100,
    costPerPack: 400,
    supplierName: 'PolyPack Supplies',
  });

  const [machineForm, setMachineForm] = useState({
    machineCode: '',
    name: '',
    type: 'WASHER' as const,
    capacityKg: 25,
    nextServiceDate: '2026-09-30',
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    machineCode: 'WM-001',
    serviceType: 'PREVENTATIVE' as const,
    description: '',
    technicianName: '',
    cost: 1500,
    performedAt: new Date().toISOString().split('T')[0],
    nextDueDate: '2026-10-01',
  });

  // Handle Add Consumable Item
  const handleAddConsumable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumableForm.itemName.trim()) {
      showToast('Item name is required', 'error');
      return;
    }

    const newItem: ConsumableInventory = {
      id: `inv-${Date.now()}`,
      itemName: consumableForm.itemName.trim(),
      category: consumableForm.category,
      currentStock: Number(consumableForm.currentStock) || 0,
      unit: consumableForm.unit,
      minThreshold: Number(consumableForm.minThreshold) || 20,
      unitCost: Number(consumableForm.unitCost) || 0,
      status: consumableForm.currentStock <= consumableForm.minThreshold ? 'LOW_STOCK' : 'IN_STOCK',
      location: consumableForm.location,
      lastRestockedAt: new Date().toISOString().split('T')[0],
    };

    setConsumableItems((prev) => [newItem, ...prev]);
    showToast(`Added new consumable item "${newItem.itemName}"!`, 'success');
    setShowAddConsumableModal(false);
  };

  // Handle Delete Consumable Item
  const handleDeleteConsumable = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      setConsumableItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Deleted "${name}" from inventory.`, 'info');
    }
  };

  // Handle Add Packaging Item
  const handleAddPackaging = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packagingForm.itemName.trim()) {
      showToast('Item name is required', 'error');
      return;
    }

    const newItem: PackagingInventoryItem = {
      id: `pkg-${Date.now()}`,
      itemName: packagingForm.itemName.trim(),
      type: packagingForm.type,
      currentQuantity: Number(packagingForm.currentQuantity) || 0,
      minQuantity: Number(packagingForm.minQuantity) || 50,
      packSize: Number(packagingForm.packSize) || 100,
      costPerPack: Number(packagingForm.costPerPack) || 0,
      status: packagingForm.currentQuantity <= packagingForm.minQuantity ? 'LOW_STOCK' : 'IN_STOCK',
      supplierName: packagingForm.supplierName || 'Standard Supplier',
    };

    setPackagingItems((prev) => [newItem, ...prev]);
    showToast(`Added packaging item "${newItem.itemName}"!`, 'success');
    setShowAddPackagingModal(false);
  };

  // Handle Delete Packaging Item
  const handleDeletePackaging = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete packaging item "${name}"?`)) {
      setPackagingItems((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted packaging item "${name}".`, 'info');
    }
  };

  // Handle Add Machine
  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineForm.name.trim() || !machineForm.machineCode.trim()) {
      showToast('Machine name and code are required', 'error');
      return;
    }

    const newMachine: FacilityMachineItem = {
      id: `mach-${Date.now()}`,
      machineCode: machineForm.machineCode.trim().toUpperCase(),
      name: machineForm.name.trim(),
      type: machineForm.type,
      capacityKg: Number(machineForm.capacityKg) || 20,
      status: 'AVAILABLE',
      nextServiceDate: machineForm.nextServiceDate,
      totalCyclesRun: 0,
      lastServicedAt: new Date().toISOString().split('T')[0],
    };

    setFacilityMachines((prev) => [...prev, newMachine]);
    showToast(`Added machine "${newMachine.machineCode} - ${newMachine.name}"!`, 'success');
    setShowAddMachineModal(false);
  };

  // Handle Delete Machine
  const handleDeleteMachine = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete facility machine "${code}"?`)) {
      setFacilityMachines((prev) => prev.filter((m) => m.id !== id));
      showToast(`Deleted machine "${code}".`, 'info');
    }
  };

  // Handle Add Maintenance Log
  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.description.trim() || !maintenanceForm.technicianName.trim()) {
      showToast('Service description and technician name are required', 'error');
      return;
    }

    const newLog: MaintenanceLogEntry = {
      id: `maint-${Date.now()}`,
      machineId: `mach-select`,
      machineCode: maintenanceForm.machineCode,
      serviceType: maintenanceForm.serviceType,
      description: maintenanceForm.description.trim(),
      technicianName: maintenanceForm.technicianName.trim(),
      cost: Number(maintenanceForm.cost) || 0,
      performedAt: maintenanceForm.performedAt,
      nextDueDate: maintenanceForm.nextDueDate,
    };

    setMaintenanceLogs((prev) => [newLog, ...prev]);
    showToast(`Logged maintenance record for ${newLog.machineCode}!`, 'success');
    setShowAddMaintenanceModal(false);
  };

  // Handle Delete Maintenance Log
  const handleDeleteMaintenance = (id: string) => {
    if (confirm(`Are you sure you want to delete this maintenance record?`)) {
      setMaintenanceLogs((prev) => prev.filter((l) => l.id !== id));
      showToast(`Deleted maintenance record.`, 'info');
    }
  };

  // Filtered lists
  const filteredConsumables = consumableItems.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = consumableItems.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;

  const openRestock = (item: ConsumableInventory) => {
    setRestockModalItem(item);
    setNewStockValue(item.currentStock + 50);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem) return;

    setConsumableItems((prev) =>
      prev.map((i) => {
        if (i.id === restockModalItem.id) {
          const nextStock = newStockValue;
          return {
            ...i,
            currentStock: nextStock,
            status: nextStock <= i.minThreshold ? 'LOW_STOCK' : 'IN_STOCK',
            lastRestockedAt: new Date().toISOString().split('T')[0],
          };
        }
        return i;
      })
    );

    showToast(`Restocked ${restockModalItem.itemName} to ${newStockValue} ${restockModalItem.unit}!`, 'success');
    setRestockModalItem(null);
  };

  const toggleMachineStatus = (machId: string) => {
    setFacilityMachines((prev) =>
      prev.map((m) => {
        if (m.id === machId) {
          const nextStatus: FacilityMachineItem['status'] =
            m.status === 'RUNNING' ? 'AVAILABLE' : m.status === 'AVAILABLE' ? 'RUNNING' : 'AVAILABLE';
          showToast(`Machine ${m.machineCode} status changed to ${nextStatus}`, 'info');
          return { ...m, status: nextStatus, totalCyclesRun: m.totalCyclesRun + (nextStatus === 'RUNNING' ? 1 : 0) };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="azea-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/30 border border-[var(--border-color)]">
        <div>
          <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
            Facility Operations & Asset Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2.5">
            <Box className="w-7 h-7 text-[#0D7A73]" />
            <span>Facility Inventory, Packaging & Machinery</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
            Real-time management of eco-detergents, sanitizers, garment packaging covers, facility machines, and preventative maintenance logs.
          </p>
        </div>

        {/* Global Action Header Button based on Active Tab */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab === 'consumables' && (
            <button onClick={() => setShowAddConsumableModal(true)} className="admin-btn-primary">
              <Plus className="w-4 h-4" />
              <span>+ Add Consumable Item</span>
            </button>
          )}

          {activeTab === 'packaging' && (
            <button onClick={() => setShowAddPackagingModal(true)} className="admin-btn-primary">
              <Plus className="w-4 h-4" />
              <span>+ Add Packaging Material</span>
            </button>
          )}

          {activeTab === 'machines' && (
            <button onClick={() => setShowAddMachineModal(true)} className="admin-btn-primary">
              <Plus className="w-4 h-4" />
              <span>+ Add Facility Machine</span>
            </button>
          )}

          {activeTab === 'maintenance' && (
            <button onClick={() => setShowAddMaintenanceModal(true)} className="admin-btn-primary">
              <Plus className="w-4 h-4" />
              <span>+ Log Maintenance Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="azea-card p-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-900 text-white">
        <button
          onClick={() => setActiveTab('consumables')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeTab === 'consumables'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>🧴 Detergents & Chemicals ({consumableItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packaging')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeTab === 'packaging'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>📦 Packaging & Tags ({packagingItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('machines')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeTab === 'machines'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>🧺 Facility Machinery ({facilityMachines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeTab === 'maintenance'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>🔧 Maintenance Log ({maintenanceLogs.length})</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Consumables</span>
          <span className="text-2xl font-black text-[var(--heading-color)] font-poppins mt-1 block">{consumableItems.length} Items</span>
          <span className="text-[11px] text-emerald-600 font-bold">5 Active Categories</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Low Stock Alerts</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-poppins mt-1 block">{lowStockCount} Items</span>
          <span className="text-[11px] text-rose-600 font-bold">Requires Purchase Order</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Inventory Asset Value</span>
          <span className="text-2xl font-black text-[var(--heading-color)] font-poppins mt-1 block">
            ₹{consumableItems.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">Cost basis valuation</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Machine Telemetry</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-poppins mt-1 block">
            {facilityMachines.filter((m) => m.status === 'RUNNING').length} / {facilityMachines.length} RUNNING
          </span>
          <span className="text-[11px] text-amber-600 font-bold">Ozone cycles active</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: CONSUMABLES (DETERGENTS & CHEMICALS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'consumables' && (
        <div className="space-y-4">
          <div className="azea-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-bold text-[var(--heading-color)] shrink-0">Category Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-input font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="DETERGENT">Detergents</option>
                <option value="SOFTENER">Softeners</option>
                <option value="CHEMICAL">Ozone & Chemicals</option>
                <option value="PACKAGING">Packaging</option>
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search detergent or chemical..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input w-full pl-9"
              />
            </div>
          </div>

          <div className="azea-card p-6 space-y-4">
            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Item Name</th>
                    <th>Category</th>
                    <th>Current Stock Level</th>
                    <th>Reorder Threshold</th>
                    <th>Unit Cost (₹)</th>
                    <th>Storage Location</th>
                    <th>Status</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsumables.map((item) => (
                    <tr key={item.id}>
                      <td className="pl-4 font-bold text-[var(--heading-color)]">{item.itemName}</td>
                      <td>
                        <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="font-black text-emerald-600">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="text-[var(--text-secondary)] font-semibold">{item.minThreshold} {item.unit}</td>
                      <td className="font-bold text-[var(--heading-color)]">₹{item.unitCost}</td>
                      <td className="text-[var(--text-secondary)]">{item.location}</td>
                      <td>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            item.status === 'IN_STOCK'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openRestock(item)}
                            className="px-3 py-1 bg-[#0D7A73] hover:bg-[#095C57] text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                          >
                            + Restock
                          </button>
                          <button
                            onClick={() => handleDeleteConsumable(item.id, item.itemName)}
                            className="p-1.5 border border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: PACKAGING MATERIALS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'packaging' && (
        <div className="space-y-4">
          <div className="azea-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-extrabold text-base text-[var(--heading-color)] font-poppins flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600" />
                  <span>Garment Packaging & Thermal Tag Inventory</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">Track clear garment covers, laundry bags, thermal barcode hanger tags, and hangers.</p>
              </div>

              <button onClick={() => setShowAddPackagingModal(true)} className="admin-btn-primary">
                <Plus className="w-4 h-4" />
                <span>+ Add Packaging Item</span>
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Packaging Item Name</th>
                    <th>Packaging Type</th>
                    <th>Current Quantity</th>
                    <th>Min Reorder Threshold</th>
                    <th>Pack Size</th>
                    <th>Cost per Pack</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packagingItems.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="pl-4 font-bold text-[var(--heading-color)]">{pkg.itemName}</td>
                      <td>
                        <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                          {pkg.type}
                        </span>
                      </td>
                      <td className="font-black text-blue-600">{pkg.currentQuantity} units</td>
                      <td className="text-[var(--text-secondary)]">{pkg.minQuantity} units</td>
                      <td className="font-semibold">{pkg.packSize} u/pack</td>
                      <td className="font-bold text-[var(--heading-color)]">₹{pkg.costPerPack}</td>
                      <td className="text-[var(--text-secondary)]">{pkg.supplierName}</td>
                      <td>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            pkg.status === 'IN_STOCK'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <button
                          onClick={() => handleDeletePackaging(pkg.id, pkg.itemName)}
                          className="p-1.5 border border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer"
                          title="Delete Packaging Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: FACILITY MACHINERY & TELEMETRY
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'machines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilityMachines.map((mach) => (
              <div key={mach.id} className="azea-card p-6 space-y-4 relative border border-[var(--border-color)] hover:shadow-lg transition-all">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {mach.machineCode}
                    </span>
                    <h3 className="font-extrabold text-sm text-[var(--heading-color)] mt-1">{mach.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        mach.status === 'RUNNING'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse'
                          : mach.status === 'AVAILABLE'
                          ? 'bg-blue-50 text-blue-800 border border-blue-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}
                    >
                      ● {mach.status}
                    </span>
                    <button
                      onClick={() => handleDeleteMachine(mach.id, mach.machineCode)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Machine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Washing Drum Capacity:</span>
                    <span className="font-bold text-[var(--heading-color)]">{mach.capacityKg} KG Load</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Total Cycles Run:</span>
                    <span className="font-black text-indigo-600">{mach.totalCyclesRun.toLocaleString()} Cycles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Next Preventative Service:</span>
                    <span className="font-bold text-amber-600">{mach.nextServiceDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex gap-2">
                  <button
                    onClick={() => toggleMachineStatus(mach.id)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    {mach.status === 'RUNNING' ? 'Complete Load' : 'Run New Load'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: MAINTENANCE LOG
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="azea-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-extrabold text-base text-[var(--heading-color)] font-poppins flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-purple-600" />
                  <span>Facility Machine Service & Repair History</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">Audit logs of technician visits, part replacements, and preventative filter cleaning.</p>
              </div>

              <button onClick={() => setShowAddMaintenanceModal(true)} className="admin-btn-primary">
                <Plus className="w-4 h-4" />
                <span>+ Log Maintenance Record</span>
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Machine Code</th>
                    <th>Service Type</th>
                    <th>Service Description</th>
                    <th>Technician / Vendor</th>
                    <th>Cost (₹)</th>
                    <th>Date Performed</th>
                    <th>Next Service Due</th>
                    <th className="text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="pl-4 font-black text-indigo-600">{log.machineCode}</td>
                      <td>
                        <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                          {log.serviceType}
                        </span>
                      </td>
                      <td className="font-medium text-[var(--heading-color)] max-w-xs">{log.description}</td>
                      <td className="text-[var(--text-secondary)] font-semibold">{log.technicianName}</td>
                      <td className="font-bold text-emerald-600">₹{log.cost}</td>
                      <td className="text-[var(--text-secondary)]">{log.performedAt}</td>
                      <td className="font-bold text-amber-600">{log.nextDueDate}</td>
                      <td className="text-right pr-4">
                        <button
                          onClick={() => handleDeleteMaintenance(log.id)}
                          className="p-1.5 border border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: ADD CONSUMABLE ITEM
      ───────────────────────────────────────────────────────────── */}
      {showAddConsumableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Add New Detergent / Chemical Consumable</span>
              </h3>
              <button onClick={() => setShowAddConsumableModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConsumable} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eco Bio Enzyme Liquid Detergent"
                  value={consumableForm.itemName}
                  onChange={(e) => setConsumableForm({ ...consumableForm, itemName: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Category</label>
                  <select
                    value={consumableForm.category}
                    onChange={(e) => setConsumableForm({ ...consumableForm, category: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="DETERGENT">Detergent</option>
                    <option value="SOFTENER">Softener</option>
                    <option value="CHEMICAL">Chemical / Ozone</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="MACHINE_PARTS">Machine Parts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Unit</label>
                  <select
                    value={consumableForm.unit}
                    onChange={(e) => setConsumableForm({ ...consumableForm, unit: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="LITERS">LITERS</option>
                    <option value="KG">KG</option>
                    <option value="UNITS">UNITS</option>
                    <option value="PACKS">PACKS</option>
                    <option value="ROLLS">ROLLS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Current Stock</label>
                  <input
                    type="number"
                    required
                    value={consumableForm.currentStock}
                    onChange={(e) => setConsumableForm({ ...consumableForm, currentStock: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    required
                    value={consumableForm.minThreshold}
                    onChange={(e) => setConsumableForm({ ...consumableForm, minThreshold: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={consumableForm.unitCost}
                    onChange={(e) => setConsumableForm({ ...consumableForm, unitCost: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Storage Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hub A - Shelf D1"
                  value={consumableForm.location}
                  onChange={(e) => setConsumableForm({ ...consumableForm, location: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddConsumableModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Consumable Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: ADD PACKAGING ITEM
      ───────────────────────────────────────────────────────────── */}
      {showAddPackagingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <span>Add Garment Packaging Item</span>
              </h3>
              <button onClick={() => setShowAddPackagingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPackaging} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Packaging Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clear Suit & Saree Garment Covers (100u)"
                  value={packagingForm.itemName}
                  onChange={(e) => setPackagingForm({ ...packagingForm, itemName: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Type</label>
                  <select
                    value={packagingForm.type}
                    onChange={(e) => setPackagingForm({ ...packagingForm, type: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="GARMENT_BAG">Garment Suit Bag</option>
                    <option value="LAUNDRY_BAG">Heavy Duty Laundry Bag</option>
                    <option value="TAG">Thermal Barcode Tag</option>
                    <option value="HANGER_COVER">Hanger Cover</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={packagingForm.supplierName}
                    onChange={(e) => setPackagingForm({ ...packagingForm, supplierName: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={packagingForm.currentQuantity}
                    onChange={(e) => setPackagingForm({ ...packagingForm, currentQuantity: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Pack Size</label>
                  <input
                    type="number"
                    required
                    value={packagingForm.packSize}
                    onChange={(e) => setPackagingForm({ ...packagingForm, packSize: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Cost / Pack (₹)</label>
                  <input
                    type="number"
                    required
                    value={packagingForm.costPerPack}
                    onChange={(e) => setPackagingForm({ ...packagingForm, costPerPack: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddPackagingModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Packaging Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: ADD FACILITY MACHINE
      ───────────────────────────────────────────────────────────── */}
      {showAddMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Add Facility Washing Drum / Dryer Machine</span>
              </h3>
              <button onClick={() => setShowAddMachineModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Machine Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WM-003"
                    value={machineForm.machineCode}
                    onChange={(e) => setMachineForm({ ...machineForm, machineCode: e.target.value })}
                    className="admin-input w-full font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Type</label>
                  <select
                    value={machineForm.type}
                    onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="WASHER">Industrial Ozone Washer</option>
                    <option value="DRYER">Heavy Duty Dryer</option>
                    <option value="STEAM_PRESS">Vacuum Steam Press</option>
                    <option value="BARCODE_SCANNER">RFID Tag Scanner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Machine Description Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Ozone Continuous Washer #3 (30 KG)"
                  value={machineForm.name}
                  onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Capacity (KG)</label>
                  <input
                    type="number"
                    required
                    value={machineForm.capacityKg}
                    onChange={(e) => setMachineForm({ ...machineForm, capacityKg: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Next Service Date</label>
                  <input
                    type="date"
                    required
                    value={machineForm.nextServiceDate}
                    onChange={(e) => setMachineForm({ ...machineForm, nextServiceDate: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddMachineModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: ADD MAINTENANCE LOG
      ───────────────────────────────────────────────────────────── */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                <span>Log Preventative Maintenance Record</span>
              </h3>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Target Machine Code</label>
                  <select
                    value={maintenanceForm.machineCode}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, machineCode: e.target.value })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    {facilityMachines.map((m) => (
                      <option key={m.id} value={m.machineCode}>
                        {m.machineCode} ({m.name.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Service Type</label>
                  <select
                    value={maintenanceForm.serviceType}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, serviceType: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="PREVENTATIVE">Preventative Service</option>
                    <option value="REPAIR">Part Repair</option>
                    <option value="CALIBRATION">Ozone Calibration</option>
                    <option value="FILTER_CLEAN">Filter Clean</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Service Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Replaced water inlet valves, recalibrated ozone generator pressure"
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  className="admin-input w-full font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Technician / Vendor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Machinery Team"
                    value={maintenanceForm.technicianName}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, technicianName: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Service Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddMaintenanceModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Consumable Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">
                Restock {restockModalItem.itemName}
              </h3>
              <button onClick={() => setRestockModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">New Stock Level ({restockModalItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-bold text-emerald-600 text-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Restock Reason / PO Reference</label>
                <input
                  type="text"
                  required
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setRestockModalItem(null)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Stock Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading facility inventory...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
