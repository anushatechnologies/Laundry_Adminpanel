'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  FileCheck,
  X,
  Plus,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DisputeReport, DisputeStatus, DisputeType } from '@/types';

export default function AdminDisputesPage() {
  const { disputes, updateDisputeStatus, createDispute, orders } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<DisputeReport | null>(disputes[0] || null);

  // Resolution modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<DisputeStatus>('RESOLVED_CREDIT');
  const [compensationAmount, setCompensationAmount] = useState<number>(150);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // New dispute modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newOrderId, setNewOrderId] = useState(orders[0]?.id || 'LAU10245');
  const [newItemName, setNewItemName] = useState('Formal Shirt (Blue Stripe)');
  const [newIssueType, setNewIssueType] = useState<DisputeType>('DAMAGED_GARMENT');
  const [newDescription, setNewDescription] = useState('');

  const filteredDisputes = disputes.filter((d) => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.orderId.toLowerCase().includes(search.toLowerCase()) ||
      d.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.itemName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openCount = disputes.filter((d) => ['OPEN', 'INVESTIGATING'].includes(d.status)).length;
  const resolvedCount = disputes.filter((d) => ['RESOLVED_REFUND', 'RESOLVED_CREDIT'].includes(d.status)).length;
  const totalCompensated = disputes.reduce((sum, d) => sum + (d.compensationAmount || 0), 0);

  const handleResolve = () => {
    if (!selectedDispute) return;
    updateDisputeStatus(selectedDispute.id, resolutionStatus, resolutionNotes, compensationAmount);
    setResolveModalOpen(false);
    setSelectedDispute(disputes.find((d) => d.id === selectedDispute.id) || null);
  };

  const handleCreateNewDispute = () => {
    if (!newDescription.trim()) return;
    createDispute({
      orderId: newOrderId,
      itemName: newItemName,
      issueType: newIssueType,
      description: newDescription.trim(),
      reportedBy: 'Customer Support Desk',
    });
    setNewModalOpen(false);
    setNewDescription('');
  };

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-extrabold rounded-full border border-rose-200 dark:border-rose-800">
            Open
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-extrabold rounded-full border border-amber-200 dark:border-amber-800">
            Investigating
          </span>
        );
      case 'STAFF_VERIFIED':
        return (
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-extrabold rounded-full border border-blue-200 dark:border-blue-800">
            Staff Verified
          </span>
        );
      case 'RESOLVED_CREDIT':
      case 'RESOLVED_REFUND':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800">
            Resolved ({status.replace('RESOLVED_', '')})
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-extrabold rounded-full border border-slate-200 dark:border-slate-700">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="azea-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#1E40AF] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Quality Assurance & Customer Claims
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2 mt-1">
            <ShieldAlert className="w-6 h-6 text-[#1E40AF] dark:text-blue-400" />
            <span>Garment Claims & Dispute Resolution</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
            Audit customer complaints, review evidence photos, track garment tag history, and issue wallet store credits or refunds.
          </p>
        </div>

        <button onClick={() => setNewModalOpen(true)} className="admin-btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span>Log Dispute Ticket</span>
        </button>
      </div>

      {/* 4 Summary Metric Cards with Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Claims */}
        <div className="azea-card p-5 relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Claims</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--heading-color)] font-poppins">{disputes.length}</span>
            <span className="text-[11px] font-bold text-slate-500">All-Time</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-medium">Customer logged issues</p>
        </div>

        {/* Under Investigation */}
        <div className="azea-card p-5 relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Under Investigation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-poppins">{openCount}</span>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-medium">Awaiting hub decision</p>
        </div>

        {/* Resolved Claims */}
        <div className="azea-card p-5 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider">Resolved Claims</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[#059669]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#059669] dark:text-emerald-400 font-poppins">{resolvedCount}</span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Settled
            </span>
          </div>
          <p className="text-[11px] text-[#059669] dark:text-emerald-400 mt-1 font-medium">Closed & compensated</p>
        </div>

        {/* Total Compensated */}
        <div className="azea-card p-5 relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Total Compensated</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-poppins">₹{totalCompensated}</span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Wallet / Bank
            </span>
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Direct wallet credits</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="azea-card p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
          {['ALL', 'OPEN', 'INVESTIGATING', 'STAFF_VERIFIED', 'RESOLVED_CREDIT', 'RESOLVED_REFUND', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--heading-color)]'
              }`}
            >
              {st === 'ALL' ? 'ALL CLAIMS' : st.replace('RESOLVED_', '').replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claim ID, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input w-full pl-9"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Claims List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {filteredDisputes.length === 0 ? (
              <div className="azea-card p-8 text-center text-xs text-[var(--text-secondary)] font-medium">
                No claim tickets found for active filter.
              </div>
            ) : (
              filteredDisputes.map((d) => {
                const isSelected = selectedDispute?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDispute(d)}
                    className={`p-4 rounded-[14px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-card)] border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-slate-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-xs text-[var(--heading-color)]">
                        #{d.id} • Order #{d.orderId}
                      </span>
                      {getStatusBadge(d.status)}
                    </div>
                    <div className="font-bold text-xs text-[var(--heading-color)]">{d.itemName}</div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-1 font-normal">{d.description}</p>
                    <div className="mt-3 pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-medium">
                      <span>
                        Reported by: <strong className="text-[var(--heading-color)] font-bold">{d.reportedBy}</strong>
                      </span>
                      <span>{d.reportedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Claim Inspection Panel */}
        {selectedDispute ? (
          <div className="lg:col-span-7 azea-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[var(--heading-color)] font-poppins">
                    Claim #{selectedDispute.id}
                  </h2>
                  {getStatusBadge(selectedDispute.status)}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
                  Order ID: <strong className="text-[var(--heading-color)]">#{selectedDispute.orderId}</strong> • Issue:{' '}
                  <strong className="text-rose-600 dark:text-rose-400 font-bold">{selectedDispute.issueType.replace('_', ' ')}</strong>
                </div>
              </div>

              {['OPEN', 'INVESTIGATING', 'STAFF_VERIFIED'].includes(selectedDispute.status) && (
                <button
                  onClick={() => {
                    setResolutionNotes(selectedDispute.resolutionNotes || '');
                    setCompensationAmount(selectedDispute.compensationAmount || 150);
                    setResolveModalOpen(true);
                  }}
                  className="admin-btn-primary shrink-0"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Resolve & Settle Claim</span>
                </button>
              )}
            </div>

            {/* Claim Details Card */}
            <div className="p-5 bg-[var(--bg-secondary-card)] rounded-[14px] border border-[var(--border-color)] space-y-4 text-xs">
              <div>
                <span className="text-[var(--text-secondary)] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Affected Garment / Item:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[var(--heading-color)]">{selectedDispute.itemName}</span>
                  {selectedDispute.itemTagId && (
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold rounded">
                      Tag: {selectedDispute.itemTagId}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[var(--text-secondary)] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Customer Claim Description:
                </span>
                <p className="text-[var(--text-primary)] bg-[var(--bg-card)] p-3.5 rounded-[10px] border border-[var(--border-color)] font-medium leading-relaxed">
                  {selectedDispute.description}
                </p>
              </div>

              {selectedDispute.resolutionNotes && (
                <div className="pt-2 border-t border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                    Investigation / Settlement Notes:
                  </span>
                  <p className="text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-[10px] border border-emerald-200 dark:border-emerald-800 font-medium">
                    {selectedDispute.resolutionNotes}
                  </p>
                </div>
              )}

              {selectedDispute.compensationAmount && (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-[10px] border border-emerald-200 dark:border-emerald-800">
                  <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                    Compensation Credited to Customer:
                  </span>
                  <span className="font-black text-base text-[var(--primary)] font-mono">₹{selectedDispute.compensationAmount}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 azea-card p-12 text-center text-xs text-[var(--text-secondary)] font-medium">
            Select a claim from the left panel to review details and issue settlements.
          </div>
        )}
      </div>

      {/* Settle Claim Modal */}
      {resolveModalOpen && selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[16px] max-w-md w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">
                Settle & Resolve Claim #{selectedDispute.id}
              </h3>
              <button onClick={() => setResolveModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Decision Outcome</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as DisputeStatus)}
                  className="admin-input w-full font-bold"
                >
                  <option value="RESOLVED_CREDIT">Approve Customer Wallet Store Credit</option>
                  <option value="RESOLVED_REFUND">Approve Bank / Payment Gateway Refund</option>
                  <option value="STAFF_VERIFIED">Mark as Staff Verified (Under Inspection)</option>
                  <option value="REJECTED">Reject Claim (No Fault Found)</option>
                </select>
              </div>

              {['RESOLVED_CREDIT', 'RESOLVED_REFUND'].includes(resolutionStatus) && (
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Compensation Amount (₹)</label>
                  <input
                    type="number"
                    value={compensationAmount}
                    onChange={(e) => setCompensationAmount(parseFloat(e.target.value) || 0)}
                    className="admin-input w-full font-mono font-bold text-sm"
                  />
                  <span className="text-[10px] text-[#059669] font-bold block mt-1">
                    ✓ Amount will immediately credit to customer wallet balance.
                  </span>
                </div>
              )}

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Resolution Explanation Notes</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Approved courtesy ₹150 wallet compensation after garment inspection."
                  className="admin-input w-full h-auto p-3"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-[var(--border-color)]">
              <button onClick={() => setResolveModalOpen(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleResolve} className="admin-btn-primary">
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Dispute Ticket Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[16px] max-w-md w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">Log New Dispute Ticket</h3>
              <button onClick={() => setNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Order ID</label>
                <select
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="admin-input w-full font-bold"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} - {o.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Garment / Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Issue Category</label>
                <select
                  value={newIssueType}
                  onChange={(e) => setNewIssueType(e.target.value as DisputeType)}
                  className="admin-input w-full font-bold"
                >
                  <option value="DAMAGED_GARMENT">Damaged Garment (Tear / Button / Seam)</option>
                  <option value="MISSING_ITEM">Missing Item from Laundry Bag</option>
                  <option value="COLOR_BLEED">Color Bleed / Stain Spread</option>
                  <option value="DELAY">Severe Processing Delay</option>
                  <option value="BILLING_DISPUTE">Weight or Billing Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Complaint Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe customer claim and inspection details..."
                  className="admin-input w-full h-auto p-3"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-[var(--border-color)]">
              <button onClick={() => setNewModalOpen(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateNewDispute} className="admin-btn-primary">
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
