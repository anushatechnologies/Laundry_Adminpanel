'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/common/Badge';
import {
  Package,
  IndianRupee,
  Users,
  Clock,
  TrendingUp,
  ShoppingBag,
  Truck,
  Wrench,
  CheckCircle2,
  Sparkles,
  Building2,
  Eye,
  Inbox,
} from 'lucide-react';

type AdminRole = 'SUPER_ADMIN' | 'HUB_MANAGER' | 'QC_LEAD';

const ROLE_META: Record<AdminRole, { label: string; badge: string; color: string; bg: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', badge: '👑 Super Admin', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
  HUB_MANAGER: { label: 'Hub Manager', badge: '🏬 Hub Manager', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800' },
  QC_LEAD:     { label: 'QC Lead',     badge: '🔬 QC Lead',     color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800' },
};

export default function AdminDashboardPage() {
  const { orders } = useApp();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('7d');
  const [chartFilter, setChartFilter] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [isMounted, setIsMounted] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>('SUPER_ADMIN');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const r = (localStorage.getItem('adminRole') as AdminRole) || 'SUPER_ADMIN';
    const e = localStorage.getItem('adminEmail') || '';
    setAdminRole(r);
    setAdminEmail(e);
  }, []);

  const todayStr = isMounted
    ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '27 August 2026';

  // 1. KPI Calculations driven 100% by real orders
  const totalOrdersCount = orders.length;
  const totalRevenueAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCustomersCount = new Set(orders.map((o) => o.customerId || o.customerPhone)).size;
  const pendingProcessingCount = orders.filter(
    (o) => o.currentStatus !== 'DELIVERED' && o.currentStatus !== 'CANCELLED' && o.currentStatus !== 'COMPLETED'
  ).length;

  // 2. Operations Live Pipeline
  const countByStatus = (statuses: string[]) =>
    orders.filter((o) => statuses.includes(o.currentStatus)).length;

  const newOrdersCount = countByStatus(['ORDER_PLACED']);
  const pickupTodayCount = countByStatus(['PICKUP_ASSIGNED', 'PICKED_UP']);
  const atHubCount = countByStatus(['RECEIVED_AT_FACILITY', 'WEIGHED_VERIFIED']);
  const washingCount = countByStatus(['WASHING', 'DRYING']);
  const ironingCount = countByStatus(['IRONING']);
  const qcCount = countByStatus(['QUALITY_CHECK']);
  const packedCount = countByStatus(['PACKED']);
  const outForDeliveryCount = countByStatus(['DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY']);

  const pipelineData = [
    { label: 'NEW ORDERS', count: newOrdersCount, icon: ShoppingBag, color: 'text-blue-500', progress: totalOrdersCount ? (newOrdersCount / totalOrdersCount) * 100 : 0 },
    { label: 'PICKUP TODAY', count: pickupTodayCount, icon: Truck, color: 'text-purple-500', progress: totalOrdersCount ? (pickupTodayCount / totalOrdersCount) * 100 : 0 },
    { label: 'AT HUB', count: atHubCount, icon: Building2, color: 'text-sky-500', progress: totalOrdersCount ? (atHubCount / totalOrdersCount) * 100 : 0 },
    { label: 'WASHING', count: washingCount, icon: Wrench, color: 'text-amber-500', progress: totalOrdersCount ? (washingCount / totalOrdersCount) * 100 : 0 },
    { label: 'IRONING', count: ironingCount, icon: Sparkles, color: 'text-orange-500', progress: totalOrdersCount ? (ironingCount / totalOrdersCount) * 100 : 0 },
    { label: 'QC', count: qcCount, icon: CheckCircle2, color: 'text-yellow-500', progress: totalOrdersCount ? (qcCount / totalOrdersCount) * 100 : 0 },
    { label: 'PACKED', count: packedCount, icon: Package, color: 'text-emerald-500', progress: totalOrdersCount ? (packedCount / totalOrdersCount) * 100 : 0 },
    { label: 'OUT FOR DELIVERY', count: outForDeliveryCount, icon: Truck, color: 'text-indigo-500', progress: totalOrdersCount ? (outForDeliveryCount / totalOrdersCount) * 100 : 0 },
  ];

  // 3. Status Breakdown for Donut Chart
  const deliveredCount = countByStatus(['DELIVERED', 'COMPLETED']);
  const processingCount = countByStatus(['RECEIVED_AT_FACILITY', 'WEIGHED_VERIFIED', 'WASHING', 'DRYING', 'IRONING', 'QUALITY_CHECK', 'PACKED']);
  const newCount = countByStatus(['ORDER_PLACED', 'PICKUP_ASSIGNED', 'PICKED_UP']);
  const cancelledCount = countByStatus(['CANCELLED']);

  const deliveredPct = totalOrdersCount ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0;
  const processingPct = totalOrdersCount ? Math.round((processingCount / totalOrdersCount) * 100) : 0;
  const newPct = totalOrdersCount ? Math.round((newCount / totalOrdersCount) * 100) : 0;
  const cancelledPct = totalOrdersCount ? Math.round((cancelledCount / totalOrdersCount) * 100) : 0;

  // 4. Top Services Performance Aggregation
  const serviceStatsMap: Record<string, { orders: number; revenue: number; color: string }> = {};
  const defaultColors = ['#16A34A', '#2563EB', '#7C3AED', '#F59E0B', '#06B6D4', '#EC4899'];

  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const name = item.serviceName || 'Wash & Fold';
      if (!serviceStatsMap[name]) {
        const colorIdx = Object.keys(serviceStatsMap).length % defaultColors.length;
        serviceStatsMap[name] = { orders: 0, revenue: 0, color: defaultColors[colorIdx] };
      }
      serviceStatsMap[name].orders += 1;
      serviceStatsMap[name].revenue += item.subtotal || 0;
    });
  });

  const topServicesList = Object.entries(serviceStatsMap)
    .map(([name, stat]) => ({
      name,
      orders: stat.orders,
      revenue: stat.revenue,
      percent: totalOrdersCount ? Math.round((stat.orders / totalOrdersCount) * 100) : 0,
      color: stat.color,
    }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
              Good Morning 👋
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black border ${ROLE_META[adminRole].bg} ${ROLE_META[adminRole].color}`}>
              {ROLE_META[adminRole].badge}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {adminEmail && <span className="font-mono mr-2 opacity-60">{adminEmail}</span>}•{' '}
            <strong className="text-[var(--heading-color)]">{todayStr}</strong>
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center bg-[var(--bg-secondary-card)] border border-[var(--border-color)] p-1 rounded-[10px] text-xs font-semibold">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-[8px] transition-all ${
              dateRange === 'today'
                ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1.5 rounded-[8px] transition-all ${
              dateRange === '7d'
                ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1.5 rounded-[8px] transition-all ${
              dateRange === '30d'
                ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="azea-card azea-card-hover p-5 h-[130px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-[44px] h-[44px] rounded-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
              {totalOrdersCount.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#16A34A] bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="azea-card azea-card-hover p-5 h-[130px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-[44px] h-[44px] rounded-[10px] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
              ₹{totalRevenueAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/80 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Real-time
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="azea-card azea-card-hover p-5 h-[130px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Customers
            </span>
            <div className="w-[44px] h-[44px] rounded-[10px] bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
              {totalCustomersCount.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/80 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-0.5">
              Unique
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="azea-card azea-card-hover p-5 h-[130px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Pending Processing
            </span>
            <div className="w-[44px] h-[44px] rounded-[10px] bg-amber-50 dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-poppins">
              {pendingProcessingCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-0.5">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Operations Pipeline Cards Strip */}
      <div className="azea-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-[var(--heading-color)] uppercase tracking-wider flex items-center gap-2">
            <span>Operations Live Pipeline</span>
            <span className="text-[10px] bg-[var(--primary-light)] text-[var(--primary-hover)] px-2 py-0.5 rounded-full font-bold">
              8 Active Stages
            </span>
          </h3>
          <Link href="/orders" className="text-xs font-semibold text-[var(--primary)] hover:underline">
            View All Lifecycle →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {pipelineData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-3 rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-secondary-card)] hover:border-[var(--primary)] transition-all flex flex-col justify-between h-[100px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] truncate">
                    {item.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="text-xl font-extrabold text-[var(--heading-color)] my-1">
                  {item.count}
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--primary)] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.progress)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analytics Grid: Revenue Line Chart (Left 8) + Order Status Donut Chart (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Orders Chart */}
        <div className="lg:col-span-8 azea-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                Revenue Overview
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
                  ₹{totalRevenueAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-[#16A34A]">Live Total</span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center bg-[var(--bg-secondary-card)] border border-[var(--border-color)] p-1 rounded-[8px] text-xs font-semibold">
              {(['7D', '30D', '90D', '1Y'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${
                    chartFilter === filter
                      ? 'bg-[var(--primary)] text-white font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Clean SVG Area/Line Chart Visualizer */}
          <div className="h-[260px] w-full pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="currentColor" strokeOpacity="0.08" />

              <polygon
                points="0,170 50,150 100,120 150,135 200,90 250,105 300,60 350,75 400,35 450,45 500,20 500,190 0,190"
                fill="url(#greenGradient)"
              />
              <polyline
                points="0,170 50,150 100,120 150,135 200,90 250,105 300,60 350,75 400,35 450,45 500,20"
                fill="none"
                stroke="#16A34A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {[
                [0, 170], [50, 150], [100, 120], [150, 135], [200, 90],
                [250, 105], [300, 60], [350, 75], [400, 35], [450, 45], [500, 20]
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.5" />
              ))}
            </svg>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] pt-2 font-semibold border-t border-[var(--border-color)]">
              <span>01 Aug</span>
              <span>05 Aug</span>
              <span>10 Aug</span>
              <span>15 Aug</span>
              <span>20 Aug</span>
              <span>25 Aug</span>
            </div>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="lg:col-span-4 azea-card p-6 space-y-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-[var(--border-color)] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--heading-color)] uppercase tracking-wider">
              Order Status Breakdown
            </h3>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold">{totalOrdersCount} Total</span>
          </div>

          {/* SVG Donut Chart */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeOpacity="0.1" strokeWidth="14" fill="transparent" />
              <circle cx="50" cy="50" r="38" stroke="#16A34A" strokeWidth="14" strokeDasharray={`${deliveredPct * 2.38} 238`} fill="transparent" />
              <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="14" strokeDasharray={`${processingPct * 2.38} 238`} strokeDashoffset={`-${deliveredPct * 2.38}`} fill="transparent" />
              <circle cx="50" cy="50" r="38" stroke="#3B82F6" strokeWidth="14" strokeDasharray={`${newPct * 2.38} 238`} strokeDashoffset={`-${(deliveredPct + processingPct) * 2.38}`} fill="transparent" />
              <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="14" strokeDasharray={`${cancelledPct * 2.38} 238`} strokeDashoffset={`-${(deliveredPct + processingPct + newPct) * 2.38}`} fill="transparent" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[var(--heading-color)] font-poppins">{totalOrdersCount}</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Total Orders</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              <span className="text-[var(--text-secondary)] font-medium">Delivered: {deliveredCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[var(--text-secondary)] font-medium">Processing: {processingCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span className="text-[var(--text-secondary)] font-medium">New: {newCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-[var(--text-secondary)] font-medium">Cancelled: {cancelledCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column: Top Services (Col 5) & Recent Orders Table (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Services Performance */}
        <div className="lg:col-span-4 azea-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-xs text-[var(--heading-color)] uppercase tracking-wider">
              Top Services Performance
            </h3>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold">Real Data</span>
          </div>

          {topServicesList.length > 0 ? (
            <div className="space-y-3.5 text-xs">
              {topServicesList.map((srv) => (
                <div key={srv.name} className="space-y-1">
                  <div className="flex justify-between font-semibold text-[var(--heading-color)]">
                    <span>{srv.name}</span>
                    <span>{srv.orders} orders (₹{srv.revenue.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, srv.percent * 2)}%`, backgroundColor: srv.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[var(--text-secondary)] space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-semibold">No service performance data yet.</p>
              <p className="text-[10px]">As customers place orders, top services will appear here dynamically.</p>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-8 azea-card overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--heading-color)] uppercase tracking-wider">
              Recent Laundry Orders
            </h3>
            <Link
              href="/orders"
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>View All Orders →</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            {orders.length > 0 ? (
              <table className="azea-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Pickup</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.id}>
                      <td className="font-bold text-[var(--heading-color)]">
                        #{o.id}
                      </td>
                      <td>
                        <span className="font-semibold text-[var(--heading-color)] block">{o.customerName}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">{o.customerPhone}</span>
                      </td>
                      <td>{o.items?.length || 0} Items</td>
                      <td className="font-medium">{o.items?.[0]?.serviceName || 'Wash & Fold'}</td>
                      <td className="font-bold text-[var(--heading-color)]">₹{o.totalAmount}</td>
                      <td className="text-[11px] text-[var(--text-secondary)]">{o.pickupSlot?.slot || 'Today'}</td>
                      <td>
                        <Badge status={o.currentStatus} />
                      </td>
                      <td>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/orders?selected=${o.id}`}
                          className="px-2.5 py-1 bg-[var(--bg-secondary-card)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--heading-color)] border border-[var(--border-color)] rounded-[6px] font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-[var(--text-secondary)] space-y-2">
                <Inbox className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-[var(--heading-color)]">No Laundry Orders Found</p>
                <p className="text-xs">When customers book services on the web portal, orders will stream here automatically.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
