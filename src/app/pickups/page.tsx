'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Truck, MapPin, CheckCircle, Phone, Clock, UserCheck, X } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { Order } from '@/types';

export default function AdminPickupsPage() {
  const { orders, advanceOrderStatus, assignPickupPartner, showToast } = useApp();

  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [pilotName, setPilotName] = useState('');
  const [pilotPhone, setPilotPhone] = useState('');
  const [pilotVehicle, setPilotVehicle] = useState('Hero Splendor (AP05 BK 8921)');

  const pickupOrders = orders.filter((o) =>
    ['ORDER_PLACED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'RECEIVED_AT_FACILITY'].includes(o.currentStatus)
  );

  const handleOpenAssignModal = (ord: Order) => {
    setAssigningOrder(ord);
    setPilotName(ord.assignedPickupAgent?.name || '');
    setPilotPhone(ord.assignedPickupAgent?.phone || '');
    setPilotVehicle((ord.assignedPickupAgent as any)?.vehicle || 'Hero Splendor (AP05 BK 8921)');
  };

  const handleSavePilotAssignment = () => {
    if (!assigningOrder) return;
    if (!pilotName.trim() || !pilotPhone.trim()) {
      showToast('Please provide both pilot name and phone number.', 'error');
      return;
    }

    assignPickupPartner(assigningOrder.id, {
      name: pilotName.trim(),
      phone: pilotPhone.trim(),
      vehicle: pilotVehicle.trim(),
    });

    setAssigningOrder(null);
  };

  const handleConfirmPickup = (orderId: string) => {
    advanceOrderStatus(orderId, 'PICKED_UP', 'Confirmed by pickup partner with customer OTP');
    showToast(`Order #${orderId} marked as Picked Up!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#16A34A]" />
            <span>Doorstep Pickup Dispatch & Route Schedule</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Real operations control: allocate live pickup pilots, track OTP verification, and manage doorstep collections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pickupOrders.map((ord) => (
          <div
            key={ord.id}
            className="azea-card p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-2">
                <span className="font-bold text-sm text-[var(--heading-color)]">#{ord.id}</span>
                <Badge status={ord.currentStatus} size="sm" />
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-[var(--heading-color)]">{ord.customerName}</div>
                <div className="text-[var(--text-secondary)]">{ord.customerPhone}</div>
                <div className="text-[var(--text-primary)] mt-2 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{ord.address.street}, {ord.address.city} - {ord.address.pincode}</span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] text-xs space-y-1.5">
                <div className="text-[var(--heading-color)] font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Slot: {ord.pickupSlot.date} ({ord.pickupSlot.slot})</span>
                </div>
                <div className="text-[var(--primary)] font-semibold">
                  Pickup OTP: <strong className="font-mono">{ord.pickupOtp || 'Not generated'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Assigned Pilot:</span>
                {ord.assignedPickupAgent ? (
                  <span className="font-bold text-[#16A34A] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    {ord.assignedPickupAgent.name}
                  </span>
                ) : (
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Awaiting Assignment
                  </span>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => handleOpenAssignModal(ord)}
                  className="admin-btn-secondary h-8 px-2.5 text-xs font-semibold"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  {ord.assignedPickupAgent ? 'Reassign' : 'Assign Pilot'}
                </button>

                {ord.currentStatus === 'PICKUP_ASSIGNED' || ord.currentStatus === 'ORDER_PLACED' ? (
                  <button
                    onClick={() => handleConfirmPickup(ord.id)}
                    className="admin-btn-primary h-8 px-3 text-xs"
                  >
                    Verify Pickup (OTP)
                  </button>
                ) : (
                  <span className="text-[#16A34A] font-bold text-xs py-1.5 px-2">✓ Collected</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Pickup Pilot Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] max-w-md w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#16A34A]" />
                  <span>Assign Doorstep Pickup Pilot</span>
                </h3>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Order #{assigningOrder.id} • {assigningOrder.customerName}
                </span>
              </div>
              <button
                onClick={() => setAssigningOrder(null)}
                className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary-card)] hover:text-[var(--heading-color)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--bg-secondary-card)] rounded-[8px] space-y-1">
                <div className="text-[var(--text-secondary)]">
                  Pickup Slot: <strong className="text-[var(--heading-color)]">{assigningOrder.pickupSlot.date} ({assigningOrder.pickupSlot.slot})</strong>
                </div>
                <div className="text-[var(--text-secondary)]">
                  Address: <span className="text-[var(--heading-color)]">{assigningOrder.address.street}, {assigningOrder.address.city}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Pilot Name *</label>
                <input
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="admin-input w-full"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Pilot Mobile Phone *</label>
                <input
                  value={pilotPhone}
                  onChange={(e) => setPilotPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  inputMode="tel"
                  className="admin-input w-full"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Vehicle Description</label>
                <input
                  value={pilotVehicle}
                  onChange={(e) => setPilotVehicle(e.target.value)}
                  placeholder="e.g. Hero Splendor (AP05 BK 8921)"
                  className="admin-input w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]">
              <button onClick={() => setAssigningOrder(null)} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSavePilotAssignment} className="admin-btn-primary">
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Assign & Notify Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
