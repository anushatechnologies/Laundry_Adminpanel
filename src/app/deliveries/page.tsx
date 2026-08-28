'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Truck, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AdminDeliveriesPage() {
  const { orders, advanceOrderStatus, showToast } = useApp();

  const deliveryOrders = orders.filter((o) =>
    ['PACKED', 'DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.currentStatus)
  );

  const handleConfirmDelivery = (orderId: string) => {
    advanceOrderStatus(orderId, 'DELIVERED', 'Delivered & confirmed by delivery rider with customer OTP');
    showToast(`Order #${orderId} marked as Delivered!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#16A34A]" />
            <span>Doorstep Delivery Dispatch & Route Optimization</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Track out-for-delivery vans, delivery agent slots, and customer drop OTP handovers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deliveryOrders.map((ord) => (
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
                <div className="text-[var(--heading-color)] font-bold">Delivery Slot: {ord.deliverySlot?.slot || '04:00 PM - 06:00 PM'}</div>
                <div className="text-[var(--primary)] font-semibold">
                  Customer Delivery OTP: <strong className="font-mono">{ord.deliveryOtp || 'Not generated'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <div className="text-[var(--text-secondary)]">
                Rider: <strong className="text-[var(--heading-color)]">{ord.assignedDeliveryAgent?.name || 'Suresh Patil'}</strong>
              </div>

              {ord.currentStatus === 'OUT_FOR_DELIVERY' || ord.currentStatus === 'DELIVERY_ASSIGNED' ? (
                <button
                  onClick={() => handleConfirmDelivery(ord.id)}
                  className="admin-btn-primary h-8 px-3 text-xs"
                >
                  Verify Delivery (OTP)
                </button>
              ) : (
                <span className="text-[#16A34A] font-bold">✓ Delivered</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
