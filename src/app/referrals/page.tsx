'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Gift,
  Search,
  RefreshCw,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Settings,
  Share2,
} from 'lucide-react';
import { getAdminReferrals, updateAdminReferralSettings } from '@/lib/api';

interface ReferralSettings {
  enabled: boolean;
  referrerReward: number;
  friendReward: number;
  minimumFirstOrder: number;
  minimumRedemptionOrder: number;
  rewardValidityDays: number;
  shareUrl: string;
}

interface ReferralRecord {
  id: string;
  code: string;
  status: string;
  reason?: string;
  referrerName: string;
  referrerPhone: string;
  friendName: string;
  friendPhone: string;
  orderId?: string;
  createdAt: string;
}

interface ReferralAdminDashboard {
  settings: ReferralSettings | null;
  referrals: ReferralRecord[];
  rewards: any[];
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Form state
  const [enabled, setEnabled] = useState(true);
  const [referrerReward, setReferrerReward] = useState('50');
  const [friendReward, setFriendReward] = useState('25');
  const [minimumFirstOrder, setMinimumFirstOrder] = useState('0');
  const [shareUrl, setShareUrl] = useState('');

  // Table filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAdminReferrals();
      setData(result);
      if (result.settings) {
        setEnabled(result.settings.enabled);
        setReferrerReward(String(result.settings.referrerReward ?? 50));
        setFriendReward(String(result.settings.friendReward ?? 25));
        setMinimumFirstOrder(String(result.settings.minimumFirstOrder ?? 0));
        setShareUrl(result.settings.shareUrl || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load referral records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const rReward = parseFloat(referrerReward);
    const fReward = parseFloat(friendReward);
    const minOrder = parseFloat(minimumFirstOrder);

    if (isNaN(rReward) || rReward < 0 || isNaN(fReward) || fReward < 0) {
      setError('Please provide valid positive reward amounts.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        enabled,
        referrerReward: rReward,
        friendReward: fReward,
        minimumFirstOrder: isNaN(minOrder) ? 0 : minOrder,
        minimumRedemptionOrder: 0,
        rewardValidityDays: 365,
        shareUrl: shareUrl.trim(),
      };

      const updated = await updateAdminReferralSettings(payload);
      setData((curr) => (curr ? { ...curr, settings: updated } : curr));
      setNotice('Referral program pricing saved! New registrations will receive these reward amounts.');
      setTimeout(() => setNotice(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const matches = (values: (string | undefined)[]) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return values.some((v) => v?.toLowerCase().includes(term));
  };

  const filteredReferrals = (data?.referrals || []).filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return matches([r.referrerName, r.referrerPhone, r.friendName, r.friendPhone, r.code]);
  });

  const totalReferrals = data?.referrals?.length || 0;
  const qualifiedReferrals = (data?.referrals || []).filter((r) => r.status === 'QUALIFIED').length;
  const totalPaidOut = qualifiedReferrals * (Number(referrerReward) || 50);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Refer & Earn Command Center
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Configure referral reward prices, track all invited friends, and monitor wallet credits.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadData()}
            disabled={loading || saving}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/wallets"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>View Customer Wallets</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL INVITES COMPLETED</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalReferrals}</div>
          <div className="text-[11px] text-slate-400 mt-1">Friends joined via referral codes</div>
        </div>

        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>QUALIFIED WALLET REWARDS</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{qualifiedReferrals}</div>
          <div className="text-[11px] text-slate-400 mt-1">Directly credited to wallets</div>
        </div>

        <div className="azea-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL REFERRAL CASH DISTRIBUTED</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{totalPaidOut.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Customer wallet balances awarded</div>
        </div>
      </div>

      {/* PROGRAM PRICING & CONFIGURATION CARD */}
      <form onSubmit={handleSaveSettings} className="azea-card p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-white">Referral Pricing & Reward Terms</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-xs font-bold text-slate-200">
              {enabled ? 'Program Active' : 'Program Paused'}
            </span>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Referrer Reward (₹) <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                max="5000"
                step="1"
                required
                value={referrerReward}
                onChange={(e) => setReferrerReward(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Credited directly to inviter's wallet.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Friend Welcome Cash (₹) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                max="5000"
                step="1"
                required
                value={friendReward}
                onChange={(e) => setFriendReward(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Given to new user upon registering with code.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Minimum First Order (₹) <span className="text-slate-400">(0 = On Registration)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                max="10000"
                step="1"
                value={minimumFirstOrder}
                onChange={(e) => setMinimumFirstOrder(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Threshold required if reward is order-triggered.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            App Share Link (included in WhatsApp / SMS share messages)
          </label>
          <div className="relative">
            <Share2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              placeholder="https://laundryfresh.in/app"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving || loading}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? 'Saving Pricing...' : 'Save Referral Pricing & Rules'}
          </button>
        </div>
      </form>

      {/* ALL REFERRALS TRACKING SECTION */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Referral Audit & History ({filteredReferrals.length})</span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search referrer, friend, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="REVERSED">REVERSED</option>
            </select>
          </div>
        </div>

        <div className="azea-card rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Referrer (Inviter)</th>
                  <th className="px-4 py-3">Code Used</th>
                  <th className="px-4 py-3">Invited Friend</th>
                  <th className="px-4 py-3">Reward Granted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {loading && !data ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                      Loading referral records...
                    </td>
                  </tr>
                ) : filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No referral records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{r.referrerName || 'Customer'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{r.referrerPhone}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px]">
                          {r.code}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{r.friendName || 'New Friend'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{r.friendPhone}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-emerald-400 font-bold">
                          +₹{referrerReward} (Inviter)
                        </span>
                        <div className="text-[10px] text-slate-400">+₹{friendReward} (Friend)</div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'QUALIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
