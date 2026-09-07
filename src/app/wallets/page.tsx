'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CreditCard,
  Search,
  RefreshCw,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  ShieldCheck,
  Filter,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { getAdminWallets, adjustAdminWallet } from '@/lib/api';

interface CustomerWallet {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  balance: number;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface WalletTx {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  createdAt: string;
}

interface WalletOverviewData {
  stats: {
    totalWallets: number;
    totalBalance: number;
    totalCredited: number;
    totalDebited: number;
    totalTopups: number;
    totalReferralBonuses: number;
  };
  wallets: CustomerWallet[];
  transactions: WalletTx[];
}

export default function WalletsPage() {
  const [data, setData] = useState<WalletOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'WALLETS' | 'TRANSACTIONS'>('WALLETS');
  const [txFilter, setTxFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT' | 'TOPUP' | 'REFERRAL'>('ALL');

  // Adjustment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState('100');
  const [adjustReason, setAdjustReason] = useState('Customer support adjustment');
  const [savingAdjust, setSavingAdjust] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminWallets();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load wallet overview:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleOpenAdjust = (customerId?: string) => {
    if (customerId) setSelectedCustomerId(customerId);
    else if (data?.wallets[0]) setSelectedCustomerId(data.wallets[0].customerId);
    setAdjustAmount('100');
    setAdjustReason('Customer support adjustment');
    setAdjustType('CREDIT');
    setModalMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(adjustAmount);
    if (isNaN(num) || num <= 0) {
      setModalMessage({ type: 'error', text: 'Enter a valid positive adjustment amount.' });
      return;
    }
    if (!selectedCustomerId) {
      setModalMessage({ type: 'error', text: 'Please select a customer.' });
      return;
    }

    setSavingAdjust(true);
    setModalMessage(null);
    try {
      await adjustAdminWallet({
        customerId: selectedCustomerId,
        amount: num,
        type: adjustType,
        reason: adjustReason.trim(),
      });
      setModalMessage({
        type: 'success',
        text: `Successfully ${adjustType === 'CREDIT' ? 'credited' : 'debited'} ₹${num.toFixed(2)}!`,
      });
      await loadData();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setModalMessage({ type: 'error', text: err?.message || 'Failed to adjust wallet.' });
    } finally {
      setSavingAdjust(false);
    }
  };

  const filteredWallets = (data?.wallets || []).filter((w) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      w.customerName.toLowerCase().includes(term) ||
      w.customerPhone.toLowerCase().includes(term) ||
      (w.customerEmail && w.customerEmail.toLowerCase().includes(term))
    );
  });

  const filteredTransactions = (data?.transactions || []).filter((tx) => {
    if (txFilter === 'CREDIT' && tx.type !== 'CREDIT') return false;
    if (txFilter === 'DEBIT' && tx.type !== 'DEBIT') return false;
    if (txFilter === 'TOPUP' && tx.category !== 'TOPUP_RAZORPAY') return false;
    if (txFilter === 'REFERRAL' && !['REFERRAL_REWARD', 'WELCOME_BONUS'].includes(tx.category)) return false;

    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      tx.customerName.toLowerCase().includes(term) ||
      tx.customerPhone.toLowerCase().includes(term) ||
      (tx.description && tx.description.toLowerCase().includes(term)) ||
      (tx.referenceId && tx.referenceId.toLowerCase().includes(term))
    );
  });

  const stats = data?.stats || {
    totalWallets: 0,
    totalBalance: 0,
    totalCredited: 0,
    totalDebited: 0,
    totalTopups: 0,
    totalReferralBonuses: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Customer Wallets & Ledger
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Track customer balances, Razorpay top-ups, referral bonuses, and order payments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadData()}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleOpenAdjust()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adjust Customer Balance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL WALLETS</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalWallets}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active customer accounts</div>
        </div>

        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL OUTSTANDING</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{stats.totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total customer wallet holdings</div>
        </div>

        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>RAZORPAY TOP-UPS</span>
            <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{stats.totalTopups.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Paid directly via UPI/Cards</div>
        </div>

        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>REFERRAL BONUSES</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{stats.totalReferralBonuses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">₹100 & ₹50 referral credits</div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('WALLETS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'WALLETS'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Wallets ({data?.wallets.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'TRANSACTIONS'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Transaction Ledger ({data?.transactions.length ?? 0})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={activeTab === 'WALLETS' ? 'Search by name, phone, email...' : 'Search transactions...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: CUSTOMER WALLETS TABLE */}
      {activeTab === 'WALLETS' && (
        <div className="azea-card rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-right">Current Balance</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {loading && !data ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                      Loading customer wallets...
                    </td>
                  </tr>
                ) : filteredWallets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No customer wallets found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredWallets.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{w.customerName}</div>
                        {w.customerEmail && (
                          <div className="text-[11px] text-slate-400">{w.customerEmail}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">
                        {w.customerPhone}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-black text-sm ${w.balance > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          ₹{w.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        {new Date(w.updatedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenAdjust(w.customerId)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TRANSACTION LEDGER */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="space-y-3">
          {/* Sub-filters for transactions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'CREDIT', 'DEBIT', 'TOPUP', 'REFERRAL'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTxFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  txFilter === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {f === 'ALL'
                  ? 'All Transactions'
                  : f === 'CREDIT'
                  ? 'Credits (+)'
                  : f === 'DEBIT'
                  ? 'Debits (-)'
                  : f === 'TOPUP'
                  ? 'Razorpay Top-ups'
                  : 'Referrals & Bonuses'}
              </button>
            ))}
          </div>

          <div className="azea-card rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Balance After</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                  {loading && !data ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                        Loading transaction history...
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                        No transactions found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isCredit = tx.type === 'CREDIT';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-white">{tx.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{tx.customerPhone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                tx.category === 'REFERRAL_REWARD' || tx.category === 'WELCOME_BONUS'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : tx.category === 'TOPUP_RAZORPAY'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : tx.category === 'ORDER_PAYMENT'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              {tx.category === 'REFERRAL_REWARD' ? 'Referral Bonus' : tx.category === 'WELCOME_BONUS' ? 'Welcome Bonus' : tx.category === 'TOPUP_RAZORPAY' ? 'Razorpay Topup' : tx.category === 'ORDER_PAYMENT' ? 'Order Checkout' : tx.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-black">
                            <span className={isCredit ? 'text-emerald-400' : 'text-red-400'}>
                              {isCredit ? '+' : '-'}₹{tx.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 font-mono text-[11px]">
                            ₹{tx.balanceAfter.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px] max-w-xs truncate" title={tx.description}>
                            {tx.description}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="azea-card w-full max-w-md p-6 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Adjust Customer Wallet</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  modalMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {modalMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{modalMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  {(data?.wallets || []).map((w) => (
                    <option key={w.customerId} value={w.customerId}>
                      {w.customerName} ({w.customerPhone}) — Balance: ₹{w.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustType('CREDIT')}
                  className={`py-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    adjustType === 'CREDIT'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Credit (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustType('DEBIT')}
                  className={`py-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    adjustType === 'DEBIT'
                      ? 'bg-red-600 text-white border-red-500 shadow-xs'
                      : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span>Debit (-)</span>
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="10000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Goodwill credit, refund correction, dispute bonus"
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdjust}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {savingAdjust ? 'Applying...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
