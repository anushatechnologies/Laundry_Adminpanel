'use client';

import React, { useState } from 'react';
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
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HubBranch, InHouseFleetVehicle } from '@/types';

export default function AdminHubsPage() {
  const { hubs, createHub, updateHub, orders } = useApp();
  const [search, setSearch] = useState('');
  const [selectedHub, setSelectedHub] = useState<HubBranch | null>(hubs[0] || null);

  // New Hub Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('Rajahmundry');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('+91 883 245 0000');
  const [newCapacity, setNewCapacity] = useState<number>(400);
  const [newPincodes, setNewPincodes] = useState('533101, 533102');

  const filteredHubs = hubs.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.pincodes.some((p) => p.includes(search))
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createHub({
      name: newName.trim(),
      city: newCity,
      address: newAddress.trim(),
      contactPhone: newPhone.trim(),
      capacityKgPerDay: newCapacity,
      pincodes: newPincodes.split(',').map((p) => p.trim()).filter(Boolean),
      inHouseVehicles: [
        {
          id: `VAN-${Date.now().toString(36).toUpperCase()}`,
          vehicleType: 'ELECTRIC_VAN',
          registrationNo: 'AP-05-EV-0001',
          driverName: 'Assigned In-House Driver',
          driverPhone: newPhone,
          capacityKg: 100,
          status: 'IDLE',
          currentHubId: 'NEW',
        },
      ],
      isActive: true,
    });

    setCreateModalOpen(false);
    setNewName('');
    setNewAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#16A34A]" />
            <span>Multi-Hub & Regional Branch Network</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage regional fulfillment hubs, in-house vehicle fleets, assigned pincode territories, and daily processing capacity.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="admin-btn-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Regional Hub</span>
        </button>
      </div>

      {/* Search and Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Operational Hubs</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">{hubs.length}</span>
          <span className="text-[11px] text-[#16A34A] font-bold">100% Active</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Daily Capacity</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">
            {hubs.reduce((sum, h) => sum + h.capacityKgPerDay, 0)} KG
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">Across all facilities</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">In-House Fleet Vans</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">
            {hubs.reduce((sum, h) => sum + (h.inHouseVehicles?.length || 0), 0)}
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Company-owned vehicles</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Pincode Coverage</span>
          <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 block">
            {Array.from(new Set(hubs.flatMap((h) => h.pincodes))).length}
          </span>
          <span className="text-[11px] text-[#16A34A] font-bold">Serviced Areas</span>
        </div>
      </div>

      {/* Main Grid: Hub Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => {
          const isSelected = selectedHub?.id === hub.id;

          return (
            <div
              key={hub.id}
              onClick={() => setSelectedHub(hub)}
              className={`azea-card p-6 cursor-pointer flex flex-col justify-between space-y-4 border transition-all ${
                isSelected
                  ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-md'
                  : 'hover:border-slate-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                    {hub.id}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">{hub.city}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[var(--heading-color)]">{hub.name}</h3>
                  <div className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </div>
                </div>

                <div className="p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Capacity:</span>
                    <strong className="text-[var(--heading-color)]">{hub.capacityKgPerDay} KG / Day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Active Orders:</span>
                    <strong className="text-[#16A34A]">{hub.activeOrdersCount} loads</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Helpline:</span>
                    <strong className="text-[var(--heading-color)]">{hub.contactPhone}</strong>
                  </div>
                </div>

                {/* In-House Fleet Roster for this Hub */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                    In-House Fleet ({hub.inHouseVehicles?.length || 0} Vehicles)
                  </span>
                  <div className="space-y-1">
                    {hub.inHouseVehicles?.map((v) => (
                      <div
                        key={v.id}
                        className="p-2 bg-[var(--bg-secondary-card)] rounded-[8px] border border-[var(--border-color)] flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <div className="font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                            <Truck className="w-3 h-3 text-[#16A34A]" />
                            <span>{v.registrationNo}</span>
                            <span className="text-[9px] text-[var(--text-secondary)]">({v.vehicleType.replace('_', ' ')})</span>
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)]">{v.driverName} • {v.driverPhone}</div>
                        </div>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                            v.status === 'ON_ROUTE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Pincodes */}
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                    Territory Pincodes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hub.pincodes.map((pin) => (
                      <span key={pin} className="px-2 py-0.5 bg-[var(--bg-secondary-card)] text-[var(--heading-color)] border border-[var(--border-color)] text-[10px] font-mono rounded">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateHub(hub.id, { isActive: !hub.isActive });
                  }}
                  className="admin-btn-secondary w-full"
                >
                  {hub.isActive ? 'Active Status' : 'Inactive'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hub Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[var(--bg-card)] rounded-[14px] max-w-md w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-sm text-[var(--heading-color)]">Add New Regional Fulfillment Hub</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Hub Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajahmundry East Hub"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="admin-input w-full font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Daily KG Capacity</label>
                  <input
                    type="number"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value) || 0)}
                    className="admin-input w-full font-mono font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Full facility address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="admin-input w-full"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Serviced Pincodes (Comma separated)</label>
                <input
                  type="text"
                  placeholder="533001, 533002, 533003"
                  value={newPincodes}
                  onChange={(e) => setNewPincodes(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn-primary"
              >
                Create Hub
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
