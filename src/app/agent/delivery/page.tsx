'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Truck, MapPin, Phone, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AgentDeliveryPage() {
  const { orders, advanceOrderStatus, showToast } = useApp();
  const [enteredOtp, setEnteredOtp] = useState<{ [orderId: string]: string }>({});

  const assignedDeliveries = orders.filter((o) => ['PACKED', 'DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.currentStatus));

  const handleVerifyDelivery = (orderId: string, expectedOtp: string) => {
    const inputCode = enteredOtp[orderId] || '';
    if (inputCode.trim() !== expectedOtp.trim()) {
      showToast(`Invalid OTP for #${orderId}. Please ask the customer for their 4-digit delivery code.`, 'error');
      return;
    }

    advanceOrderStatus(orderId, 'DELIVERED', 'Delivered & verified with customer OTP by Suresh Patil');
    showToast(`Order #${orderId} delivered and verified! Payment completed.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center p-4">
      {/* Mobile Top Bar */}
      <div className="max-w-md w-full bg-[#0B3B36] text-white p-4 rounded-3xl shadow-xl mb-4 flex items-center justify-between">
        <Link href="/admin" className="p-2 hover:bg-white/10 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Delivery Rider App</span>
          <h2 className="text-sm font-extrabold font-poppins">Suresh Patil</h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center font-bold text-xs text-white">
          SP
        </div>
      </div>

      <div className="max-w-md w-full space-y-4">
        <div className="flex justify-between items-center px-2 text-xs font-bold text-[var(--text-primary)]">
          <span>Assigned Doorstep Deliveries</span>
          <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            {assignedDeliveries.length} Active Drops
          </span>
        </div>

        {assignedDeliveries.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-3xl p-8 text-center text-xs text-[var(--text-secondary)] shadow-sm border border-[var(--border-color)]">
            ✓ All doorstep drops completed for today!
          </div>
        ) : (
          assignedDeliveries.map((ord) => (
            <div key={ord.id} className="bg-[var(--bg-card)] rounded-3xl p-5 shadow-sm border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="font-extrabold text-sm text-teal-700 dark:text-teal-300">Order #{ord.id}</span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                  Collect: ₹{ord.paymentStatus === 'PAID' ? '0 (Paid Online)' : ord.totalAmount}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-[var(--heading-color)] text-sm">{ord.customerName}</div>
                <div className="text-[var(--text-secondary)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                  <span>{ord.address.street}, {ord.address.city}</span>
                </div>
                <div className="text-[var(--text-secondary)] mt-1">
                  Items: {ord.items.map((i) => `${i.serviceName} (${i.quantity} ${i.unit})`).join(', ')}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${ord.customerPhone}`}
                  className="flex-1 py-2 bg-[var(--bg-secondary-card)] hover:bg-[var(--primary-very-light)] text-[var(--text-primary)] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                  <span>Call Customer</span>
                </a>
              </div>

              {/* Delivery OTP Confirmation Section */}
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-amber-950 dark:text-amber-100">
                  <span>Enter Customer Delivery OTP:</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">(Hint: {ord.deliveryOtp})</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp[ord.id] || ''}
                    onChange={(e) => setEnteredOtp({ ...enteredOtp, [ord.id]: e.target.value })}
                    placeholder="4-digit OTP"
                    className="flex-1 px-3 py-2 bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] rounded-xl border border-[var(--input-border)] font-mono font-bold text-center tracking-widest text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                  <button
                    onClick={() => handleVerifyDelivery(ord.id, ord.deliveryOtp)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Confirm Drop
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
