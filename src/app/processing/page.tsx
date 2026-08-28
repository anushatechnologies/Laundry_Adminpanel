'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { INITIAL_BATCHES } from '@/lib/db';
import {
  Wrench,
  Sparkles,
  QrCode,
  CheckCircle2,
  Clock,
  Play,
  Check,
  Search,
  Scale,
  Plus,
  Cpu,
  Activity,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { LaundryMachine } from '@/types';

export default function LaundryProcessingHubPage() {
  const { orders, advanceOrderStatus, showToast, machines, updateMachineStatus } = useApp();
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [scannedBagCode, setScannedBagCode] = useState('');

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedBagCode.trim()) return;

    const orderId = scannedBagCode.replace('BAG-', '').trim().toUpperCase();
    const order = orders.find((o) => o.id.toUpperCase() === orderId || o.bagTagCode.toUpperCase() === scannedBagCode.toUpperCase());

    if (order) {
      showToast(`Bag ${scannedBagCode} scanned for Order #${order.id}!`, 'success');
      advanceOrderStatus(order.id, 'WASHING', 'Scanned at facility washing station');
      setScannedBagCode('');
    } else {
      showToast(`Tag ${scannedBagCode} not found in active order registry.`, 'error');
    }
  };

  const handleCompleteBatch = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, completedAt: 'Just Now' } : b))
    );
    showToast(`Batch ${batchId} marked completed & moved to next station.`, 'success');
  };

  // Live Capacity Calculations
  const totalWashCapacity = machines.filter((m) => m.type === 'WASHER').reduce((sum, m) => sum + m.capacityKg, 0);
  const currentWashLoad = machines.filter((m) => m.type === 'WASHER').reduce((sum, m) => sum + m.currentLoadKg, 0);

  const totalDryCapacity = machines.filter((m) => m.type === 'DRYER').reduce((sum, m) => sum + m.capacityKg, 0);
  const currentDryLoad = machines.filter((m) => m.type === 'DRYER').reduce((sum, m) => sum + m.currentLoadKg, 0);

  const totalIronCapacity = machines.filter((m) => m.type === 'STEAM_PRESS').reduce((sum, m) => sum + m.capacityKg, 0);
  const currentIronLoad = machines.filter((m) => m.type === 'STEAM_PRESS').reduce((sum, m) => sum + m.currentLoadKg, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#16A34A]" />
            <span>Facility Processing Hub & Machine Management</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Real-time machine load allocation, daily washing capacity, RFID garment scanning, and batch tracking.
          </p>
        </div>
      </div>

      {/* 3 Live Capacity Utilization Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="azea-card p-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[var(--heading-color)] uppercase">Washing Drum Capacity</span>
            <span className="font-bold text-[var(--primary)]">
              {currentWashLoad} / {totalWashCapacity} KG ({Math.round((currentWashLoad / totalWashCapacity) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#16A34A] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((currentWashLoad / totalWashCapacity) * 100))}%` }}
            />
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Ozone sanitized continuous wash cycles</div>
        </div>

        <div className="azea-card p-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[var(--heading-color)] uppercase">Gas Dryer Capacity</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {currentDryLoad} / {totalDryCapacity} KG ({Math.round((currentDryLoad / totalDryCapacity) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((currentDryLoad / totalDryCapacity) * 100))}%` }}
            />
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Low-heat tumble & moisture control</div>
        </div>

        <div className="azea-card p-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[var(--heading-color)] uppercase">Steam Press Tables</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {currentIronLoad} / {totalIronCapacity} KG ({Math.round((currentIronLoad / totalIronCapacity) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((currentIronLoad / totalIronCapacity) * 100))}%` }}
            />
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Vacuum table & 3D dummy formers</div>
        </div>
      </div>

      {/* Barcode / Bag Tag Quick Scanner Box */}
      <div className="bg-[#0F172A] text-white rounded-[14px] p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
              <QrCode className="w-4 h-4" />
              <span>Laser Scanner & RFID Tag Simulator</span>
            </div>
            <h3 className="text-base font-bold font-poppins">Scan Garment Tag or Laundry Bag</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Simulate barcode scan for rapid processing (e.g. <code>BAG-LAU10245</code> or <code>BC-SH-10245-01</code>).
            </p>
          </div>

          <form onSubmit={handleScanBarcode} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={scannedBagCode}
              onChange={(e) => setScannedBagCode(e.target.value)}
              placeholder="e.g. BAG-LAU10245"
              className="px-4 py-2 rounded-[8px] bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-xs font-mono font-bold focus:outline-none focus:border-[#16A34A] w-full sm:w-60"
            />
            <button
              type="submit"
              className="admin-btn-primary"
            >
              Scan & Log
            </button>
          </form>
        </div>
      </div>

      {/* Machines Status Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--heading-color)] uppercase tracking-wider">
            Facility Machine Inventory & Telemetry ({machines.length} Units)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {machines.map((m) => (
            <div key={m.id} className="azea-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[var(--heading-color)]">{m.id}</span>
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    m.status === 'RUNNING'
                      ? 'bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300'
                      : m.status === 'AVAILABLE'
                      ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : m.status === 'MAINTENANCE'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-xs text-[var(--heading-color)] line-clamp-1">{m.name}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Capacity: {m.capacityKg} KG</div>
              </div>

              <div className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)] flex justify-between">
                <span>Next Service:</span>
                <strong className="text-[var(--heading-color)]">{m.nextServiceDate}</strong>
              </div>

              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => updateMachineStatus(m.id, 'RUNNING', m.capacityKg * 0.8)}
                  className="admin-btn-secondary flex-1 h-7 text-[10px] px-1"
                >
                  Run Load
                </button>
                <button
                  onClick={() => updateMachineStatus(m.id, m.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE')}
                  className="admin-btn-secondary h-7 text-[10px] px-2"
                >
                  Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Batches Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--heading-color)] uppercase tracking-wider">
            Active Processing Batches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="azea-card p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--heading-color)] font-mono">{batch.id}</span>
                  <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                    {batch.stage}
                  </span>
                </div>

                <div className="text-xs font-bold text-[var(--heading-color)]">{batch.machineId}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Orders: {batch.orderIds.join(', ')} • Weight: <strong>{batch.totalWeightKg} KG</strong>
                </div>
                <div className="text-[10px] text-[var(--text-secondary)]">Operator: {batch.operatorName} • Started: {batch.startedAt}</div>
              </div>

              <button
                onClick={() => handleCompleteBatch(batch.id)}
                className="admin-btn-primary w-full"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Advance to Next Stage</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
