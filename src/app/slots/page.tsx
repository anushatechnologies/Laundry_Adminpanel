'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Plus,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Edit2,
  Sliders,
  Scale,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';
import { adminApi, getAdminSlots } from '@/lib/api';

interface SlotData {
  id: string;
  hubId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  bookedOrders: number;
  maxKg: number;
  bookedKg: number;
  isAvailable: boolean;
}

export default function AdminSlotsPage() {
  const { showToast } = useApp();
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit & Add Modal State
  const [editingSlot, setEditingSlot] = useState<SlotData | null>(null);
  const [editDate, setEditDate] = useState(new Date().toISOString().slice(0, 10));
  const [editHubId, setEditHubId] = useState('HUB-RJY-01');
  const [editStartTime, setEditStartTime] = useState('08:00 AM');
  const [editEndTime, setEditEndTime] = useState('10:00 AM');
  const [editMaxOrders, setEditMaxOrders] = useState<number>(15);
  const [editMaxKg, setEditMaxKg] = useState<number>(80);
  const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newHubId, setNewHubId] = useState('HUB-RJY-01');
  const [newStartTime, setNewStartTime] = useState('08:00 AM');
  const [newEndTime, setNewEndTime] = useState('10:00 AM');
  const [newMaxOrders, setNewMaxOrders] = useState(15);
  const [newMaxKg, setNewMaxKg] = useState(80);

  // Load slots on mount from Express Backend
  useEffect(() => {
    async function loadSlots() {
      setIsLoading(true);
      try {
        const data = await getAdminSlots();
        if (Array.isArray(data)) setSlots(data);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not load time slots.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadSlots();
  }, []);

  const openEdit = (slot: SlotData) => {
    setEditingSlot(slot);
    setEditDate(slot.date);
    setEditHubId(slot.hubId);
    setEditStartTime(slot.startTime);
    setEditEndTime(slot.endTime);
    setEditMaxOrders(slot.maxOrders);
    setEditMaxKg(slot.maxKg);
    setEditIsAvailable(slot.isAvailable);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    try {
      const updated = await adminApi<SlotData>(`/slots/${encodeURIComponent(editingSlot.id)}`, {
        method: 'PUT',
        body: JSON.stringify({ date: editDate, hubId: editHubId, startTime: editStartTime, endTime: editEndTime, maxOrders: editMaxOrders, maxKg: editMaxKg, isAvailable: editIsAvailable }),
      });
      setSlots((prev) =>
        prev.map((s) => (s.id === editingSlot.id ? { ...s, ...updated } : s))
      );
      showToast(`Slot ${editingSlot.startTime} - ${editingSlot.endTime} updated!`, 'success');
      setEditingSlot(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update the slot.', 'error');
    }
  };

  const handleDeleteSlot = async (slot: SlotData) => {
    if (!window.confirm(`Delete the ${slot.startTime} - ${slot.endTime} pickup window on ${slot.date}?`)) return;
    try {
      await adminApi(`/slots/${encodeURIComponent(slot.id)}`, { method: 'DELETE' });
      setSlots((prev) => prev.filter((item) => item.id !== slot.id));
      showToast(`Pickup window ${slot.startTime} - ${slot.endTime} deleted.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not delete the slot.', 'error');
    }
  };

  const handleToggleSlot = async (slot: SlotData) => {
    const newStatus = !slot.isAvailable;
    try {
      const updated = await adminApi<SlotData>(`/slots/${encodeURIComponent(slot.id)}`, {
        method: 'PUT',
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, ...updated } : s)));
      showToast(
        updated.isAvailable ? `Slot ${slot.startTime} enabled!` : newStatus ? 'Slot is still locked because capacity is full.' : `Slot ${slot.startTime} disabled.`,
        updated.isAvailable ? 'success' : 'info'
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update the slot.', 'error');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await adminApi<SlotData>('/slots', {
        method: 'POST',
        body: JSON.stringify({
          date: newDate,
          hubId: newHubId,
          startTime: newStartTime,
          endTime: newEndTime,
          maxOrders: newMaxOrders,
          maxKg: newMaxKg,
        }),
      });
      setSlots((prev) => [...prev, created]);
      showToast(`Created slot ${newStartTime} - ${newEndTime}`, 'success');
      setShowAddModal(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not create the slot.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            <span>Pickup & Delivery Slot Capacity Engine</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Configure time windows with strict Max Orders and Max KG limits. Customers select available slots during checkout.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="admin-btn-primary self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Window</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Configured Slots</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">{slots.length} Windows</span>
          <span className="text-[11px] text-emerald-600 font-bold">Managed by Admin & Express Backend</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Booked Orders</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">
            {slots.reduce((sum, s) => sum + s.bookedOrders, 0)} / {slots.reduce((sum, s) => sum + s.maxOrders, 0)}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">Orders queued today</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Weight Load</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">
            {slots.reduce((sum, s) => sum + s.bookedKg, 0)} / {slots.reduce((sum, s) => sum + s.maxKg, 0)} KG
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">Facility utilization</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Slots Status</span>
          <span className="text-2xl font-bold text-amber-600 font-poppins mt-1 block">
            {slots.filter((s) => !s.isAvailable).length} Disabled / Locked
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            {slots.filter((s) => s.isAvailable).length} Active for Checkout
          </span>
        </div>
      </div>

      {/* Slots Table */}
      <div className="azea-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary-card)]">
          <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Time Slots Schedule & Limits</span>
          </h3>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
        </div>

        <div className="overflow-x-auto">
          <table className="azea-table">
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Date / Hub</th>
                <th>Time Window</th>
                <th>Order Capacity</th>
                <th>Weight Capacity (KG)</th>
                <th>Load Meter</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => {
                const orderPercent = Math.min(100, Math.round((slot.bookedOrders / slot.maxOrders) * 100));
                const kgPercent = Math.min(100, Math.round((slot.bookedKg / slot.maxKg) * 100));
                const isFull = !slot.isAvailable || orderPercent >= 100 || kgPercent >= 100;

                return (
                  <tr key={slot.id}>
                    <td className="font-mono font-bold text-[var(--heading-color)]">{slot.id}</td>
                    <td>
                      <div className="font-bold text-[var(--heading-color)]">{slot.date}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{slot.hubId}</div>
                    </td>
                    <td className="font-bold text-[var(--heading-color)]">
                      {slot.startTime} – {slot.endTime}
                    </td>
                    <td className="font-medium">
                      <strong className="text-[var(--heading-color)]">{slot.bookedOrders}</strong> / {slot.maxOrders} orders
                    </td>
                    <td className="font-medium">
                      <strong className="text-[var(--heading-color)]">{slot.bookedKg}</strong> / {slot.maxKg} KG
                    </td>
                    <td>
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[9px] text-[var(--text-secondary)] font-bold">
                          <span>{orderPercent}% Orders</span>
                          <span>{kgPercent}% KG</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full ${
                              isFull ? 'bg-red-500' : orderPercent > 70 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${orderPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      {isFull ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>LOCKED / FULL</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>AVAILABLE ({slot.maxOrders - slot.bookedOrders} left)</span>
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSlot(slot)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            slot.isAvailable
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {slot.isAvailable ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          <span>{slot.isAvailable ? 'Disable' : 'Enable'}</span>
                        </button>
                        <button
                          onClick={() => openEdit(slot)}
                          className="admin-btn-secondary h-8 px-2.5 text-[11px] cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-emerald-600" />
                          <span>Limits</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot)}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Slot Limits Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[var(--bg-card)] rounded-[14px] max-w-sm w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)]">Edit Pickup Window</h3>
                <p className="text-xs text-slate-500">
                  {editingSlot.startTime} – {editingSlot.endTime} ({editingSlot.id})
                </p>
              </div>
              <button type="button" onClick={() => setEditingSlot(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Pickup Date</label>
                  <input type="date" required value={editDate} onChange={(e) => setEditDate(e.target.value)} className="admin-input w-full font-bold" />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Hub ID</label>
                  <input type="text" required value={editHubId} onChange={(e) => setEditHubId(e.target.value)} className="admin-input w-full font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Start Time</label>
                  <input type="text" required value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} className="admin-input w-full font-bold" placeholder="08:00 AM" />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">End Time</label>
                  <input type="text" required value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} className="admin-input w-full font-bold" placeholder="10:00 AM" />
                </div>
              </div>
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Max Orders Allowed</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editMaxOrders}
                  onChange={(e) => setEditMaxOrders(parseInt(e.target.value) || 1)}
                  className="admin-input w-full font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Max KG Weight Capacity</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={editMaxKg}
                  onChange={(e) => setEditMaxKg(parseInt(e.target.value) || 5)}
                  className="admin-input w-full font-bold text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-slot-avail"
                  checked={editIsAvailable}
                  onChange={(e) => setEditIsAvailable(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <label htmlFor="edit-slot-avail" className="font-bold text-[var(--heading-color)] cursor-pointer">
                  Slot Available for Customer Checkout
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]">
              <button type="button" onClick={() => setEditingSlot(null)} className="admin-btn-secondary cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary cursor-pointer">
                Save Window
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Time Window Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSlot}
            className="bg-[var(--bg-card)] rounded-[14px] max-w-sm w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-sm text-[var(--heading-color)]">Create New Time Slot</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Pickup Date</label>
                  <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className="admin-input w-full font-bold" />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Hub ID</label>
                  <input type="text" required value={newHubId} onChange={(e) => setNewHubId(e.target.value)} className="admin-input w-full font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:00 AM"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="admin-input w-full font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Max Orders Allowed</label>
                <input
                  type="number"
                  required
                  value={newMaxOrders}
                  onChange={(e) => setNewMaxOrders(parseInt(e.target.value) || 15)}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Max KG Weight Capacity</label>
                <input
                  type="number"
                  required
                  value={newMaxKg}
                  onChange={(e) => setNewMaxKg(parseInt(e.target.value) || 80)}
                  className="admin-input w-full font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]">
              <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn-secondary cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary cursor-pointer">
                Create Time Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
