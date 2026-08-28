'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Tag,
  Plus,
  Check,
  X,
  Trash2,
  Edit2,
  Percent,
  Search,
  Sparkles,
  Gift,
  Copy,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  TrendingUp,
  Sliders,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, showToast } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'FIRST_ORDER' | 'PERCENTAGE'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    description: string;
    discountType: 'FLAT' | 'PERCENTAGE';
    discountValue: number;
    minOrderValue: number;
    maxDiscountCap?: number;
    firstOrderOnly: boolean;
    expiryDate: string;
    isActive: boolean;
  }>({
    code: '',
    title: '',
    description: '',
    discountType: 'FLAT',
    discountValue: 100,
    minOrderValue: 299,
    maxDiscountCap: 150,
    firstOrderOnly: false,
    expiryDate: '2026-12-31',
    isActive: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'FLAT',
      discountValue: 100,
      minOrderValue: 299,
      maxDiscountCap: 150,
      firstOrderOnly: false,
      expiryDate: '2026-12-31',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (cp: Coupon) => {
    setEditingCoupon(cp);
    setFormData({
      code: cp.code,
      title: cp.title,
      description: cp.description,
      discountType: cp.discountType,
      discountValue: cp.discountValue,
      minOrderValue: cp.minOrderValue,
      maxDiscountCap: cp.maxDiscountCap || 150,
      firstOrderOnly: Boolean(cp.firstOrderOnly),
      expiryDate: cp.expiryDate,
      isActive: Boolean(cp.isActive !== false),
    });
    setShowModal(true);
  };

  const handleDuplicate = (cp: Coupon) => {
    setEditingCoupon(null);
    setFormData({
      code: `${cp.code}-COPY`,
      title: `${cp.title} (Copy)`,
      description: cp.description,
      discountType: cp.discountType,
      discountValue: cp.discountValue,
      minOrderValue: cp.minOrderValue,
      maxDiscountCap: cp.maxDiscountCap || 150,
      firstOrderOnly: Boolean(cp.firstOrderOnly),
      expiryDate: cp.expiryDate,
      isActive: true,
    });
    setShowModal(true);
    showToast(`Cloned voucher ${cp.code}. Adjust details and save!`, 'info');
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['FRESH', 'CLEAN', 'LAUNDRY', 'SAVE', 'VIP', 'EXPRESS'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    const code = `${randomPrefix}${randomNum}`;
    setFormData((prev) => ({
      ...prev,
      code,
      title: prev.title || `${randomPrefix} Special Offer ₹${prev.discountValue} Off`,
      description: prev.description || `Get ${prev.discountType === 'FLAT' ? `₹${prev.discountValue}` : `${prev.discountValue}%`} off on orders above ₹${prev.minOrderValue}`,
    }));
    showToast(`Generated code ${code}!`, 'success');
  };

  const applyPreset = (preset: 'WELCOME' | 'WEEKEND' | 'EXPRESS' | 'FLASH') => {
    openCreateModal();
    if (preset === 'WELCOME') {
      setFormData({
        code: 'WELCOME100',
        title: 'Flat ₹100 Off First Laundry Order',
        description: 'Enjoy ₹100 flat savings on your first laundry pickup above ₹299.',
        discountType: 'FLAT',
        discountValue: 100,
        minOrderValue: 299,
        maxDiscountCap: 100,
        firstOrderOnly: true,
        expiryDate: '2026-12-31',
        isActive: true,
      });
    } else if (preset === 'WEEKEND') {
      setFormData({
        code: 'WEEKEND20',
        title: '20% Weekend Laundry Savings',
        description: 'Save 20% up to ₹150 on all wash, iron & dry cleaning orders.',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderValue: 399,
        maxDiscountCap: 150,
        firstOrderOnly: false,
        expiryDate: '2026-12-31',
        isActive: true,
      });
    } else if (preset === 'EXPRESS') {
      setFormData({
        code: 'EXPRESSFREE',
        title: 'Free Priority 12-Hour Express Delivery',
        description: 'Get express processing upgrade worth ₹80 waived on orders above ₹499.',
        discountType: 'FLAT',
        discountValue: 80,
        minOrderValue: 499,
        maxDiscountCap: 80,
        firstOrderOnly: false,
        expiryDate: '2026-12-31',
        isActive: true,
      });
    } else if (preset === 'FLASH') {
      setFormData({
        code: 'FLASH30',
        title: 'Flash Sale 30% Off Dry Cleaning & Spa',
        description: 'Limited 24-hour flash discount 30% off up to ₹200.',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        minOrderValue: 499,
        maxDiscountCap: 200,
        firstOrderOnly: false,
        expiryDate: '2026-09-30',
        isActive: true,
      });
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      showToast('Coupon code and title are required.', 'error');
      return;
    }

    const payload: Coupon = {
      id: editingCoupon ? editingCoupon.id : `cp-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue) || 0,
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxDiscountCap: formData.discountType === 'PERCENTAGE' ? Number(formData.maxDiscountCap) || 0 : undefined,
      firstOrderOnly: Boolean(formData.firstOrderOnly),
      expiryDate: formData.expiryDate || '2026-12-31',
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
      isActive: Boolean(formData.isActive),
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, payload);
      showToast(`Updated coupon ${payload.code}!`, 'success');
    } else {
      addCoupon(payload);
      showToast(`Created voucher ${payload.code}!`, 'success');
    }

    setShowModal(false);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete voucher code ${code}?`)) {
      deleteCoupon(id);
      showToast(`Deleted voucher ${code}.`, 'info');
    }
  };

  const handleToggleStatus = (cp: Coupon) => {
    updateCoupon(cp.id, { isActive: !cp.isActive });
    showToast(`Voucher ${cp.code} is now ${!cp.isActive ? 'Active in Checkout' : 'Disabled'}.`, 'info');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code "${code}" to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered List
  const filteredCoupons = coupons.filter((cp) => {
    const matchesSearch =
      cp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'ACTIVE') matchesTab = Boolean(cp.isActive);
    if (activeTab === 'INACTIVE') matchesTab = !cp.isActive;
    if (activeTab === 'FIRST_ORDER') matchesTab = Boolean(cp.firstOrderOnly);
    if (activeTab === 'PERCENTAGE') matchesTab = cp.discountType === 'PERCENTAGE';

    return matchesSearch && matchesTab;
  });

  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);
  const activeCount = coupons.filter((c) => c.isActive).length;
  const estimatedSavings = coupons.reduce((sum, c) => sum + (c.usageCount || 0) * (c.discountType === 'FLAT' ? c.discountValue : 85), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="azea-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white via-slate-50 to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 relative overflow-hidden border border-[var(--border-color)]">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-[#1E40AF] dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              Promotional Engine & Yield Optimization
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Checkout Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-[#1E40AF] dark:text-blue-400" />
            <span>Vouchers & Promotional Rule Engine</span>
          </h1>

          <p className="text-xs text-[var(--text-secondary)] font-medium max-w-2xl">
            Create high-converting discount vouchers, min-order thresholds, percentage caps, and first-order acquisition locks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800/80 p-1 rounded-xl border border-[var(--border-color)] shadow-xs">
            <button
              onClick={() => applyPreset('WELCOME')}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#1E40AF] hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-[8px] transition-all cursor-pointer flex items-center gap-1"
              title="Preset: Flat ₹100 Welcome Offer"
            >
              <Gift className="w-3 h-3 text-pink-500" />
              <span>Welcome100</span>
            </button>

            <button
              onClick={() => applyPreset('WEEKEND')}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#1E40AF] hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-[8px] transition-all cursor-pointer flex items-center gap-1"
              title="Preset: 20% Off Weekend Sale"
            >
              <Percent className="w-3 h-3 text-amber-500" />
              <span>Weekend20</span>
            </button>

            <button
              onClick={() => applyPreset('EXPRESS')}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#1E40AF] hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-[8px] transition-all cursor-pointer flex items-center gap-1"
              title="Preset: Free Express Upgrade"
            >
              <Zap className="w-3 h-3 text-blue-500" />
              <span>ExpressFree</span>
            </button>
          </div>

          <button onClick={openCreateModal} className="admin-btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create New Voucher</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" suppressHydrationWarning>
        <div className="azea-card p-5 relative overflow-hidden group hover:border-[#1E40AF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Configured Vouchers</span>
            <Tag className="w-5 h-5 text-slate-400 group-hover:text-[#1E40AF] transition-colors" />
          </div>
          <span className="text-3xl font-black text-[var(--heading-color)] font-poppins mt-2 block">
            {isMounted ? coupons.length : 0}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">Active promotional rules</span>
        </div>

        <div className="azea-card p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active in Checkout</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-poppins mt-2 block">
            {isMounted ? activeCount : 0}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">✓ Live for customer redemption</span>
        </div>

        <div className="azea-card p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Customer Redemptions</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-poppins mt-2 block">
            {isMounted ? totalRedemptions.toLocaleString() : 0}
          </span>
          <span className="text-[11px] text-blue-600 font-bold">Orders placed with coupon</span>
        </div>

        <div className="azea-card p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Est. Customer Savings</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-poppins mt-2 block">
            ₹{isMounted ? estimatedSavings.toLocaleString() : 0}
          </span>
          <span className="text-[11px] text-amber-600 font-bold">Promotional discount value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="azea-card p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
          {(['ALL', 'ACTIVE', 'INACTIVE', 'FIRST_ORDER', 'PERCENTAGE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--heading-color)]'
              }`}
            >
              <span>
                {tab === 'ALL'
                  ? 'ALL VOUCHERS'
                  : tab === 'ACTIVE'
                  ? 'ACTIVE'
                  : tab === 'INACTIVE'
                  ? 'DISABLED'
                  : tab === 'FIRST_ORDER'
                  ? '1ST ORDER DEALS'
                  : 'PERCENTAGE OFF'}
              </span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {tab === 'ALL'
                  ? coupons.length
                  : tab === 'ACTIVE'
                  ? coupons.filter((c) => c.isActive).length
                  : tab === 'INACTIVE'
                  ? coupons.filter((c) => !c.isActive).length
                  : tab === 'FIRST_ORDER'
                  ? coupons.filter((c) => c.firstOrderOnly).length
                  : coupons.filter((c) => c.discountType === 'PERCENTAGE').length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, promo title, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input w-full pl-9"
          />
        </div>
      </div>

      {/* Coupons Voucher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
        {!isMounted ? (
          <div className="col-span-full azea-card p-12 text-center text-[var(--text-secondary)] font-medium">
            Loading promotional vouchers...
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full azea-card p-12 text-center text-[var(--text-secondary)] font-medium space-y-3">
            <Tag className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-extrabold text-sm text-[var(--heading-color)]">No promotional vouchers match your filter</div>
            <p className="text-xs">Click &quot;+ Create New Voucher&quot; above to launch a new promo code.</p>
          </div>
        ) : (
          filteredCoupons.map((cp) => {
            const isExpired = new Date(cp.expiryDate) < new Date();
            return (
              <div
                key={cp.id}
                className={`azea-card p-0 overflow-hidden flex flex-col justify-between transition-all border relative group ${
                  cp.isActive && !isExpired
                    ? 'border-[var(--border-color)] hover:border-[#1E40AF]/50 hover:shadow-xl'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-500/5'
                }`}
              >
                {/* Decorative Scissors / Ticket Cutlines */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[var(--bg-main)] rounded-r-full border-r border-t border-b border-[var(--border-color)] z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[var(--bg-main)] rounded-l-full border-l border-t border-b border-[var(--border-color)] z-10" />

                {/* Top Section: Coupon Code & Discount Pill */}
                <div className="p-5 bg-gradient-to-br from-slate-50/90 to-blue-50/30 dark:from-slate-900/90 dark:to-slate-900/50 border-b border-dashed border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyCode(cp.code)}
                      className="font-mono font-black text-sm text-[#1E40AF] dark:text-blue-400 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-[10px] border border-blue-200 dark:border-blue-800 tracking-wider shadow-xs hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer group/btn"
                      title="Click to copy coupon code"
                    >
                      <span>{cp.code}</span>
                      <Copy className="w-3.5 h-3.5 text-blue-500 opacity-70 group-hover/btn:opacity-100" />
                    </button>

                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 shadow-xs shrink-0">
                      {cp.discountType === 'FLAT' ? `₹${cp.discountValue} FLAT OFF` : `${cp.discountValue}% OFF`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[var(--heading-color)] font-poppins line-clamp-1">{cp.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-2 font-medium">
                      {cp.description || `Get ${cp.discountType === 'FLAT' ? `₹${cp.discountValue}` : `${cp.discountValue}%`} discount on laundry orders above ₹${cp.minOrderValue}.`}
                    </p>
                  </div>
                </div>

                {/* Middle Rules Grid */}
                <div className="p-5 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--heading-color)]">Min Order:</span>
                      <span className="font-extrabold text-emerald-600">₹{cp.minOrderValue}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--heading-color)]">Redemptions:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{cp.usageCount || 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--heading-color)]">Audience:</span>
                      <span className="font-semibold">{cp.firstOrderOnly ? '1st Order Only' : 'All Customers'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--heading-color)]">Expires:</span>
                      <span className={`font-semibold ${isExpired ? 'text-rose-500 font-bold' : ''}`}>{cp.expiryDate}</span>
                    </div>
                  </div>

                  {cp.discountType === 'PERCENTAGE' && cp.maxDiscountCap && (
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-[6px] border border-amber-200 dark:border-amber-900">
                      ⚡ Max discount capped at ₹{cp.maxDiscountCap} per order
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 bg-[var(--bg-secondary-card)] border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStatus(cp)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                      cp.isActive && !isExpired
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cp.isActive && !isExpired ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>{cp.isActive && !isExpired ? 'ACTIVE IN CHECKOUT' : isExpired ? 'EXPIRED' : 'DISABLED'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(cp)}
                      className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-[var(--heading-color)]"
                      title="Duplicate Voucher"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(cp)}
                      className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-[var(--heading-color)]"
                      title="Edit Voucher Rules"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                      className="p-1.5 border border-[var(--border-color)] rounded-[6px] hover:text-rose-600 hover:border-rose-300 cursor-pointer text-slate-600 dark:text-slate-400"
                      title="Delete Voucher"
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

      {/* Add / Edit Coupon Modal with Live Ticket Preview */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-3xl w-full p-6 border border-[var(--border-color)] text-xs animate-in fade-in space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-[#1E40AF]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--heading-color)] font-poppins">
                    {editingCoupon ? `Edit Voucher ${editingCoupon.code}` : 'Create Promotional Voucher'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    Configure discount rules, threshold restrictions, and expiry dates.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Form */}
              <form onSubmit={handleSaveCoupon} className="lg:col-span-7 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--heading-color)] block">Voucher Code (Uppercase)</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[11px] font-bold text-[#1E40AF] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generate AI Code</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME100"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="admin-input w-full font-mono font-black uppercase text-sm tracking-wider text-[#1E40AF] dark:text-blue-400"
                />

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Promo Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat ₹100 Off First Laundry Order"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-input w-full font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Offer Description</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Enjoy ₹100 flat savings on your first laundry pickup above ₹299."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-input w-full text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      className="admin-input w-full font-bold cursor-pointer"
                    >
                      <option value="FLAT">Flat Amount (₹)</option>
                      <option value="PERCENTAGE">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">
                      {formData.discountType === 'FLAT' ? 'Discount Amount (₹)' : 'Discount Rate (%)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="admin-input w-full font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">Min. Order Threshold (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) || 0 })}
                      className="admin-input w-full font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">
                      {formData.discountType === 'PERCENTAGE' ? 'Max Discount Cap (₹)' : 'Expiry Date'}
                    </label>
                    {formData.discountType === 'PERCENTAGE' ? (
                      <input
                        type="number"
                        placeholder="e.g. 150"
                        value={formData.maxDiscountCap || ''}
                        onChange={(e) => setFormData({ ...formData, maxDiscountCap: parseFloat(e.target.value) || 0 })}
                        className="admin-input w-full font-bold"
                      />
                    ) : (
                      <input
                        type="date"
                        required
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="admin-input w-full font-bold"
                      />
                    )}
                  </div>
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="font-bold text-[var(--heading-color)] block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="admin-input w-full font-bold"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary-card)] rounded-[12px] border border-[var(--border-color)]">
                  <span className="font-bold text-[var(--heading-color)]">Rules & Availability</span>
                  <div className="flex items-center gap-4 font-bold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.firstOrderOnly}
                        onChange={(e) => setFormData({ ...formData, firstOrderOnly: e.target.checked })}
                        className="w-4 h-4 accent-[#1E40AF]"
                      />
                      <span>1st Order Only</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 accent-[#1E40AF]"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                  <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingCoupon ? 'Update Voucher' : 'Save Voucher'}
                  </button>
                </div>
              </form>

              {/* Right Live Voucher Preview */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-[16px] border border-[var(--border-color)]">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                  Live Customer Checkout Preview
                </span>

                <div className="azea-card p-0 overflow-hidden border border-[#1E40AF]/30 shadow-xl bg-white dark:bg-slate-800">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-blue-950/50 border-b border-dashed border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#1E40AF] dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-[6px] border border-blue-200 dark:border-blue-800">
                        {formData.code || 'CODE'}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {formData.discountType === 'FLAT' ? `₹${formData.discountValue} FLAT OFF` : `${formData.discountValue}% OFF`}
                      </span>
                    </div>

                    <h5 className="font-extrabold text-xs text-[var(--heading-color)]">{formData.title || 'Voucher Title'}</h5>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {formData.description || `Get ${formData.discountType === 'FLAT' ? `₹${formData.discountValue}` : `${formData.discountValue}%`} discount on orders above ₹${formData.minOrderValue}.`}
                    </p>
                  </div>

                  <div className="p-4 text-[11px] space-y-1.5 text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Minimum Order:</span>
                      <strong className="text-[var(--heading-color)]">₹{formData.minOrderValue}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Audience:</span>
                      <strong className="text-[var(--heading-color)]">{formData.firstOrderOnly ? '1st Order Only' : 'All Customers'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <strong className="text-[var(--heading-color)]">{formData.expiryDate}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center italic">
                  This is how the coupon ticket will render when customers enter the code on web checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

