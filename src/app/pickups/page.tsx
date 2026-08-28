'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Truck, MapPin, CheckCircle, Phone, Clock, UserCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AdminPickupsPage() {
  const { orders, advanceOrderStatus, showToast } = useApp();

  const pickupOrders = orders.filter((o) =>
    ['ORDER_PLACED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'RECEIVED_AT_FACILITY'].includes(o.currentStatus)
  );

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
            Monitor pickup agent allocations, time slots, and OTP verification logs.
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
                <div className="text-[var(--text-primary)] mt-2">{ord.address.street}, {ord.address.city}</div>
              </div>

              <div className="mt-3 p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] text-xs space-y-1">
                <div className="text-[var(--heading-color)] font-bold">Slot: {ord.pickupSlot.date} ({ord.pickupSlot.slot})</div>
                <div className="text-[var(--primary)] font-semibold">
                  Pickup OTP: <strong className="font-mono">{ord.pickupOtp || 'Not generated'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <div className="text-[var(--text-secondary)]">
                Agent: <strong className="text-[var(--heading-color)]">{ord.assignedPickupAgent?.name || 'Awaiting assignment'}</strong>
              </div>

              {ord.currentStatus === 'PICKUP_ASSIGNED' || ord.currentStatus === 'ORDER_PLACED' ? (
                <button
                  onClick={() => handleConfirmPickup(ord.id)}
                  className="admin-btn-primary h-8 px-3 text-xs"
                >
                  Verify Pickup (OTP)
                </button>
              ) : (
                <span className="text-[#16A34A] font-bold">✓ Collected</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
