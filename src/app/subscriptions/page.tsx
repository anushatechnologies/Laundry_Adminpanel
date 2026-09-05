'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  Users,
  Check,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Calendar,
  Zap,
  TrendingUp,
  Search,
  CheckCircle2,
  Shield,
  X,
  Scale,
  Award,
  Crown,
  DollarSign,
  Coins,
  Wallet,
  Gift,
  Star,
  RefreshCw,
} from 'lucide-react';
import { SubscriptionPlan } from '@/types';
import { PurchasedSubscriptions } from './PurchasedSubscriptions';

function SubscriptionsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'loyalty' ? 'loyalty' : searchParams?.get('tab') === 'purchases' ? 'purchases' : 'plans';

  const { subscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'plans' | 'loyalty' | 'purchases'>(initialTab);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'loyalty' || tab === 'purchases' || tab === 'plans') setActiveTab(tab);
  }, [searchParams]);

  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState<'ALL' | '1M' | '3M' | '6M' | '12M'>('ALL');

  // Modal States for Plans
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form State for Plans
  const [formData, setFormData] = useState<{
    name: string;
    durationMonths: number;
    price: number;
    originalPrice?: number;
    validityDays: number;
    includedKg: number;
    freePickupDelivery: boolean;
    priorityService: boolean;
    maxFamilyMembers: number;
    features: string[];
    popular: boolean;
    isActive: boolean;
  }>({
    name: '',
    durationMonths: 1,
    price: 999,
    originalPrice: 1299,
    validityDays: 30,
    includedKg: 20,
    freePickupDelivery: true,
    priorityService: false,
    maxFamilyMembers: 1,
    features: [
      '20 KG Wash & Fold / Wash & Iron per month',
      'Free Doorstep Pickup & Delivery',
      'Turnaround in 36 Hours',
      'Rollover unused KG (up to 5 KG)',
    ],
    popular: false,
    isActive: true,
  });

  const [featureInput, setFeatureInput] = useState('');

  // Customer Loyalty Ledger Data
  const [loyaltyLedger, setLoyaltyLedger] = useState([
    {
      id: 'usr-1',
      name: 'Rahul Verma',
      phone: '+91 98765 12345',
      tier: 'GOLD',
      points: 850,
      walletBalance: 1250,
      totalOrders: 14,
    },
    {
      id: 'usr-2',
      name: 'Meera Nambiar',
      phone: '+91 98450 99881',
      tier: 'PLATINUM',
      points: 2100,
      walletBalance: 3400,
      totalOrders: 28,
    },
    {
      id: 'usr-3',
      name: 'Arjun Kapoor',
      phone: '+91 98110 33445',
      tier: 'SILVER',
      points: 320,
      walletBalance: 150,
      totalOrders: 5,
    },
    {
      id: 'usr-4',
      name: 'Priya Sharma',
      phone: '+91 97120 44890',
      tier: 'VIP DIAMOND',
      points: 4800,
      walletBalance: 8200,
      totalOrders: 52,
    },
  ]);

  // Modal for Top Up Wallet / Award Points
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [rewardAmount, setRewardAmount] = useState<number>(100);
  const [rewardType, setRewardType] = useState<'POINTS' | 'WALLET'>('POINTS');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      durationMonths: 1,
      price: 999,
      originalPrice: 1299,
      validityDays: 30,
      includedKg: 20,
      freePickupDelivery: true,
      priorityService: false,
      maxFamilyMembers: 1,
      features: [
        '20 KG Wash & Fold / Wash & Iron per month',
        'Free Doorstep Pickup & Delivery',
        'Turnaround in 36 Hours',
      ],
      popular: false,
      isActive: true,
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      durationMonths: plan.durationMonths || 1,
      price: plan.price,
      originalPrice: plan.originalPrice || Math.round(plan.price * 1.3),
      validityDays: plan.validityDays || 30,
      includedKg: plan.includedKg,
      freePickupDelivery: Boolean(plan.freePickupDelivery),
      priorityService: Boolean(plan.priorityService),
      maxFamilyMembers: plan.maxFamilyMembers || 1,
      features: [...plan.features],
      popular: Boolean(plan.popular),
      isActive: Boolean(plan.isActive !== false),
    });
    setFeatureInput('');
    setShowModal(true);
  };

  const handleDuplicate = (plan: SubscriptionPlan) => {
    setEditingPlan(null);
    setFormData({
      name: `${plan.name} (Copy)`,
      durationMonths: plan.durationMonths || 1,
      price: plan.price,
      originalPrice: plan.originalPrice || Math.round(plan.price * 1.3),
      validityDays: plan.validityDays || 30,
      includedKg: plan.includedKg,
      freePickupDelivery: Boolean(plan.freePickupDelivery),
      priorityService: Boolean(plan.priorityService),
      maxFamilyMembers: plan.maxFamilyMembers || 1,
      features: [...plan.features],
      popular: false,
      isActive: true,
    });
    setFeatureInput('');
    setShowModal(true);
    showToast(`Cloned plan "${plan.name}". Adjust duration & pricing and save!`, 'info');
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const applyDurationPreset = (months: number) => {
    const days = months * 30;
    let name = `${months} Month Membership`;
    let kg = months * 20;
    let price = months * 999;
    let original = months * 1299;

    if (months === 1) {
      name = '1 Month Starter Care';
      kg = 20;
      price = 999;
      original = 1299;
    } else if (months === 3) {
      name = '3 Month Quarterly Saver';
      kg = 150;
      price = 4999;
      original = 6999;
    } else if (months === 6) {
      name = '6 Month Half-Year Pro';
      kg = 300;
      price = 8999;
      original = 11999;
    } else if (months === 12) {
      name = '12 Month Annual Ultimate Care';
      kg = 600;
      price = 14999;
      original = 23999;
    }

    setFormData((prev) => ({
      ...prev,
      name,
      durationMonths: months,
      validityDays: days,
      includedKg: kg,
      price,
      originalPrice: original,
    }));

    showToast(`Set preset for ${months} Month(s) duration!`, 'success');
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      showToast('Plan name and price are required.', 'error');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const payload: SubscriptionPlan = {
      id: editingPlan ? editingPlan.id : `sub-${Date.now()}`,
      name: formData.name.trim(),
      slug,
      durationMonths: Number(formData.durationMonths) || 1,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || undefined,
      validityDays: Number(formData.validityDays) || Number(formData.durationMonths) * 30,
      includedKg: Number(formData.includedKg) || 20,
      freePickupDelivery: Boolean(formData.freePickupDelivery),
      priorityService: Boolean(formData.priorityService),
      maxFamilyMembers: Number(formData.maxFamilyMembers) || 1,
      features: formData.features,
      popular: Boolean(formData.popular),
      isActive: Boolean(formData.isActive),
    };

    if (editingPlan) {
      updateSubscriptionPlan(editingPlan.id, payload);
      showToast(`Updated subscription plan "${payload.name}"!`, 'success');
    } else {
      addSubscriptionPlan(payload);
      showToast(`Created new subscription plan "${payload.name}"!`, 'success');
    }

    setShowModal(false);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete subscription plan "${name}"?`)) {
      deleteSubscriptionPlan(id);
      showToast(`Deleted plan "${name}".`, 'info');
    }
  };

  const handleToggleStatus = (plan: SubscriptionPlan) => {
    updateSubscriptionPlan(plan.id, { isActive: !plan.isActive });
    showToast(`Plan "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Disabled'}.`, 'info');
  };

  const handleApplyReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || rewardAmount <= 0) return;

    setLoyaltyLedger((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          if (rewardType === 'POINTS') {
            return { ...u, points: u.points + rewardAmount };
          } else {
            return { ...u, walletBalance: u.walletBalance + rewardAmount };
          }
        }
        return u;
      })
    );

    showToast(
      `Added ${rewardType === 'POINTS' ? `${rewardAmount} Loyalty Points` : `₹${rewardAmount} Wallet Cash`} to ${selectedUser.name}!`,
      'success'
    );
    setShowRewardModal(false);
  };

  // Filtered Plans List
  const filteredPlans = subscriptionPlans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDuration = true;
    const months = p.durationMonths || (p.validityDays ? Math.round(p.validityDays / 30) : 1);
    if (durationFilter === '1M') matchesDuration = months === 1;
    if (durationFilter === '3M') matchesDuration = months === 3;
    if (durationFilter === '6M') matchesDuration = months === 6;
    if (durationFilter === '12M') matchesDuration = months === 12;

    return matchesSearch && matchesDuration;
  });

  const totalMembers = loyaltyLedger.length * 320;
  const totalMonthlyKg = subscriptionPlans.reduce((sum, p) => sum + (p.includedKg || 20), 0);

  return (
    <div className="space-y-6">
      {/* Top Main Tab Switcher */}
      <div className="azea-card p-3 flex items-center gap-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>💳 Subscription Plans & Packages</span>
        </button>

        <button onClick={() => setActiveTab('purchases')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black ${activeTab === 'purchases' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'}`}>
          Purchased Subscriptions
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'loyalty'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>✨ Loyalty Rewards & Prepaid Wallet Engine</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: SUBSCRIPTION PLANS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'purchases' && <PurchasedSubscriptions />}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="azea-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 relative overflow-hidden border border-[var(--border-color)]">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Recurring Membership & Subscriptions
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Multi-Month Durations
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2.5">
                <CreditCard className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                <span>Subscription Plans & Member Allowances</span>
              </h1>

              <p className="text-xs text-[var(--text-secondary)] font-medium max-w-2xl">
                Configure 1-Month, 3-Month (Quarterly), 6-Month, and 12-Month (Annual) recurring laundry packages with monthly KG allowances.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
              <button onClick={openCreateModal} className="admin-btn-primary">
                <Plus className="w-4 h-4" />
                <span>Create Subscription Plan</span>
              </button>
            </div>
          </div>

          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" suppressHydrationWarning>
            <div className="azea-card p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Active Subscription Plans</span>
                <CreditCard className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <span className="text-3xl font-black text-[var(--heading-color)] font-poppins mt-2 block">
                {isMounted ? subscriptionPlans.length : 0}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Configured packages</span>
            </div>

            <div className="azea-card p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active Subscribers</span>
                <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-poppins mt-2 block">
                {isMounted ? totalMembers.toLocaleString() : 0}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Recurring monthly members</span>
            </div>

            <div className="azea-card p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Monthly Allowance Pool</span>
                <Scale className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-poppins mt-2 block">
                {isMounted ? totalMonthlyKg : 0} KG / Mo
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Total monthly capacity</span>
            </div>

            <div className="azea-card p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Estimated Monthly Revenue</span>
                <DollarSign className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              </div>
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-poppins mt-2 block">
                ₹3,45,000
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">Predictable MRR</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="azea-card p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
              {(['ALL', '1M', '3M', '6M', '12M'] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDurationFilter(dur)}
                  className={`px-3.5 py-1.5 rounded-[10px] text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    durationFilter === dur
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  <span>
                    {dur === 'ALL'
                      ? 'ALL DURATIONS'
                      : dur === '1M'
                      ? '1 MONTH'
                      : dur === '3M'
                      ? '3 MONTHS (QUARTERLY)'
                      : dur === '6M'
                      ? '6 MONTHS'
                      : '12 MONTHS (ANNUAL)'}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search plan name or benefit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input w-full pl-9"
              />
            </div>
          </div>

          {/* Plans Overview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
            {!isMounted ? (
              <div className="col-span-full azea-card p-12 text-center text-[var(--text-secondary)] font-medium">
                Loading subscription plans...
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="col-span-full azea-card p-12 text-center text-[var(--text-secondary)] font-medium space-y-3">
                <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="font-extrabold text-sm text-[var(--heading-color)]">No subscription plans match your active filter</div>
                <p className="text-xs">Click &quot;+ Create Subscription Plan&quot; above to add a new package.</p>
              </div>
            ) : (
              filteredPlans.map((plan) => {
                const months = plan.durationMonths || (plan.validityDays ? Math.round(plan.validityDays / 30) : 1);
                const isInactive = plan.isActive === false;

                return (
                  <div
                    key={plan.id}
                    className={`azea-card p-6 space-y-4 flex flex-col justify-between transition-all border relative ${
                      plan.popular
                        ? 'border-indigo-500/80 shadow-lg ring-1 ring-indigo-500/30'
                        : isInactive
                        ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-500/5'
                        : 'border-[var(--border-color)] hover:border-indigo-500/40 hover:shadow-xl'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)] mb-3">
                        <h3 className="font-black text-base text-[var(--heading-color)] font-poppins">{plan.name}</h3>
                        <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 shrink-0">
                          {months} {months === 1 ? 'Month' : 'Months'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-poppins">₹{plan.price.toLocaleString()}</span>
                        {plan.originalPrice && plan.originalPrice > plan.price && (
                          <span className="text-sm font-semibold text-slate-400 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-xs text-[var(--text-secondary)] font-medium">
                          / {months === 1 ? 'month' : `${months} months`}
                        </span>
                      </div>

                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Includes {plan.includedKg} KG Allowance</span>
                      </div>

                      {/* Features List */}
                      <ul className="mt-4 space-y-2 text-xs">
                        {plan.features.map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-[var(--text-primary)] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                          !isInactive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{!isInactive ? 'ACTIVE IN STORE' : 'DISABLED'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(plan)}
                          className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-[var(--heading-color)]"
                          title="Duplicate Plan"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(plan)}
                          className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-[var(--heading-color)]"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:text-rose-600 hover:border-rose-300 cursor-pointer text-slate-600 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:border-rose-800"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: LOYALTY REWARDS & PREPAID WALLET ENGINE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {/* Loyalty & Wallet Header Banner */}
          <div className="azea-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Customer Loyalty & Prepaid Cash Wallet
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2.5">
                <Coins className="w-7 h-7 text-amber-500" />
                <span>Loyalty Rewards & Wallet Ledgers</span>
              </h1>

              <p className="text-xs text-[var(--text-secondary)] font-medium max-w-2xl">
                Manage points earning rates, conversion rules, prepaid wallet bonus slabs, and grant manual loyalty points or wallet credits to customers.
              </p>
            </div>
          </div>

          {/* Loyalty Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="azea-card p-5 border-l-4 border-l-amber-500">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Total Loyalty Points Issued</span>
              <span className="text-3xl font-black text-[var(--heading-color)] font-poppins mt-1 block">45,200 Pts</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">≈ ₹4,520 Cash Value</span>
            </div>

            <div className="azea-card p-5 border-l-4 border-l-emerald-500">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Prepaid Wallet Pool</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-poppins mt-1 block">₹1,84,500</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Total Customer Cash Balance</span>
            </div>

            <div className="azea-card p-5 border-l-4 border-l-indigo-500">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Points Earning Rate</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-poppins mt-1 block">1 Pt / ₹10 Spent</span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Standard Order Earn Rate</span>
            </div>

            <div className="azea-card p-5 border-l-4 border-l-purple-500">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Redemption Conversion</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-poppins mt-1 block">10 Pts = ₹1 INR</span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Checkout Discount Rate</span>
            </div>
          </div>

          {/* Tier Multipliers Grid */}
          <div className="azea-card p-6 space-y-4">
            <h3 className="font-extrabold text-base text-[var(--heading-color)] font-poppins flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Membership Tier Point Multipliers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary-card)] space-y-2">
                <div className="font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>🥈 Silver Member</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">0-500 Pts</span>
                </div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">1.0x Points</div>
                <p className="text-[10px] text-[var(--text-secondary)]">Standard earning rate (1 Pt / ₹10)</p>
              </div>

              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 space-y-2">
                <div className="font-black text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <span>🥇 Gold Member</span>
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded">501-1,500 Pts</span>
                </div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">1.5x Points</div>
                <p className="text-[10px] text-[var(--text-secondary)]">+1 Free Express upgrade per month</p>
              </div>

              <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 space-y-2">
                <div className="font-black text-purple-800 dark:text-purple-300 flex items-center justify-between">
                  <span>💎 Platinum Member</span>
                  <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded">1,501-3,000 Pts</span>
                </div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">2.0x Points</div>
                <p className="text-[10px] text-[var(--text-secondary)]">+1 Free Blazer/Saree dry clean per month</p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
                <div className="font-black text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>👑 VIP Diamond</span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded">3,000+ Pts</span>
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">3.0x Points</div>
                <p className="text-[10px] text-[var(--text-secondary)]">Dedicated household laundry concierge</p>
              </div>
            </div>
          </div>

          {/* Customer Loyalty Accounts & Wallet Ledger Table */}
          <div className="azea-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[var(--heading-color)] font-poppins flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Customer Loyalty & Wallet Account Ledgers</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">Manage customer wallet cash and award manual bonus points.</p>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Customer Name</th>
                    <th>Phone</th>
                    <th>Membership Tier</th>
                    <th>Available Loyalty Points</th>
                    <th>Wallet Cash Balance</th>
                    <th>Orders Completed</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyLedger.map((usr) => (
                    <tr key={usr.id}>
                      <td className="pl-4 font-bold text-[var(--heading-color)]">{usr.name}</td>
                      <td className="text-[var(--text-secondary)]">{usr.phone}</td>
                      <td>
                        <span className="text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                          {usr.tier}
                        </span>
                      </td>
                      <td className="font-black text-amber-600 dark:text-amber-400">{usr.points} Pts</td>
                      <td className="font-black text-emerald-600 dark:text-emerald-400">₹{usr.walletBalance.toLocaleString()}</td>
                      <td className="font-semibold text-[var(--text-primary)]">{usr.totalOrders} Orders</td>
                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUser(usr);
                              setRewardType('POINTS');
                              setRewardAmount(100);
                              setShowRewardModal(true);
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-lg cursor-pointer dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/70"
                          >
                            + Grant Points
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(usr);
                              setRewardType('WALLET');
                              setRewardAmount(250);
                              setShowRewardModal(true);
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/70"
                          >
                            + Top Up Wallet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Subscription Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-2xl w-full p-6 border border-[var(--border-color)] text-xs animate-in fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--heading-color)] font-poppins">
                    {editingPlan ? `Edit Plan "${editingPlan.name}"` : 'Create Subscription Plan'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    Configure package name, duration months, price, and monthly KG allowance.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Duration Preset Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-[var(--border-color)] flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-[var(--heading-color)]">Quick Duration Presets:</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => applyDurationPreset(m)}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {m} {m === 1 ? 'Month' : 'Months'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Plan Package Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Family Saver Plan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Duration (Months)</label>
                  <select
                    value={formData.durationMonths}
                    onChange={(e) => {
                      const m = parseInt(e.target.value) || 1;
                      setFormData({
                        ...formData,
                        durationMonths: m,
                        validityDays: m * 30,
                      });
                    }}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value={1}>1 Month (30 Days)</option>
                    <option value={3}>3 Months (90 Days)</option>
                    <option value={6}>6 Months (180 Days)</option>
                    <option value={12}>12 Months (365 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 6999"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Included KG Allowance</label>
                  <input
                    type="number"
                    required
                    value={formData.includedKg}
                    onChange={(e) => setFormData({ ...formData, includedKg: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Max Family Members</label>
                  <input
                    type="number"
                    value={formData.maxFamilyMembers}
                    onChange={(e) => setFormData({ ...formData, maxFamilyMembers: parseInt(e.target.value) || 1 })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Benefits / Features List */}
              <div className="space-y-2">
                <label className="font-bold text-[var(--heading-color)] block">Plan Benefits & Features List</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Free priority doorstep pickup & delivery"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="admin-input flex-1"
                  />
                  <button type="button" onClick={handleAddFeature} className="admin-btn-secondary shrink-0">
                    Add Benefit
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)]">
                  {formData.features.length === 0 ? (
                    <p className="text-[11px] text-[var(--text-secondary)] italic">No features added yet.</p>
                  ) : (
                    formData.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-xs">
                        <span className="font-medium text-[var(--text-primary)]">{feat}</span>
                        <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary-card)] rounded-[12px] border border-[var(--border-color)]">
                <span className="font-bold text-[var(--heading-color)]">Flags & Options</span>
                <div className="flex flex-wrap items-center gap-4 font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>Highlight as Popular</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span>Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingPlan ? 'Update Plan' : 'Save Subscription Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Manual Reward Modal */}
      {showRewardModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs animate-in fade-in space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">
                {rewardType === 'POINTS' ? 'Grant Bonus Loyalty Points' : 'Top Up Customer Wallet'}
              </h3>
              <button onClick={() => setShowRewardModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyReward} className="space-y-4">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Customer Account</label>
                <div className="p-3 bg-[var(--bg-secondary-card)] rounded-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedUser.name} ({selectedUser.phone})
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">
                  {rewardType === 'POINTS' ? 'Points Amount to Grant' : 'Wallet Cash Amount (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(parseInt(e.target.value) || 0)}
                  className="admin-input w-full font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowRewardModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Apply Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading subscriptions and loyalty engine...</div>}>
      <SubscriptionsContent />
    </Suspense>
  );
}
