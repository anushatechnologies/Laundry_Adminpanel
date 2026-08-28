'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Truck, MapPin, Phone, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AgentPickupPage() {
  const { orders, advanceOrderStatus, showToast } = useApp();
  const [enteredOtp, setEnteredOtp] = useState<{ [orderId: string]: string }>({});

  const assignedPickups = orders.filter((o) => ['ORDER_PLACED', 'PICKUP_ASSIGNED'].includes(o.currentStatus));

  const handleVerifyPickup = (orderId: string, expectedOtp: string) => {
    const inputCode = enteredOtp[orderId] || '';
    if (inputCode.trim() !== expectedOtp.trim()) {
      showToast(`Invalid OTP for #${orderId}. Please ask the customer for their 4-digit pickup code.`, 'error');
      return;
    }

    advanceOrderStatus(orderId, 'PICKED_UP', 'Clothes collected & verified with customer OTP by Vikram Singh');
    showToast(`Order #${orderId} verified and picked up! Bag tag activated.`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Mobile Top Bar */}
      <div className="max-w-md w-full bg-[#0B3B36] text-white p-4 rounded-3xl shadow-xl mb-4 flex items-center justify-between">
        <Link href="/admin" className="p-2 hover:bg-white/10 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Pickup Agent App</span>
          <h2 className="text-sm font-extrabold font-poppins">Vikram Singh</h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center font-bold text-xs text-white">
          VS
        </div>
      </div>

      <div className="max-w-md w-full space-y-4">
        <div className="flex justify-between items-center px-2 text-xs font-bold text-gray-700">
          <span>Assigned Pickup Tasks</span>
          <span className="bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
            {assignedPickups.length} Pending
          </span>
        </div>

        {assignedPickups.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-gray-500 shadow-sm">
            ✓ All assigned doorstep pickups completed for today!
          </div>
        ) : (
          assignedPickups.map((ord) => (
            <div key={ord.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-extrabold text-sm text-[#0B3B36]">Order #{ord.id}</span>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {ord.bagTagCode}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-gray-900 text-sm">{ord.customerName}</div>
                <div className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{ord.address.street}, {ord.address.city}</span>
                </div>
                <div className="text-teal-800 font-semibold mt-1">
                  Slot: {ord.pickupSlot.slot}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${ord.customerPhone}`}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Call Customer</span>
                </a>
              </div>

              {/* OTP Confirmation Section */}
              <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-teal-950">
                  <span>Enter Customer OTP:</span>
                  <span className="text-[10px] text-teal-700 font-mono">(Hint: {ord.pickupOtp})</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp[ord.id] || ''}
                    onChange={(e) => setEnteredOtp({ ...enteredOtp, [ord.id]: e.target.value })}
                    placeholder="4-digit OTP"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-gray-300 font-mono font-bold text-center tracking-widest text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                  <button
                    onClick={() => handleVerifyPickup(ord.id, ord.pickupOtp)}
                    className="px-4 py-2 bg-[#0F766E] hover:bg-[#0B3B36] text-white font-bold rounded-xl shadow-xs"
                  >
                    Confirm
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
