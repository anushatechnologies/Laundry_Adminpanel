'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  FileSpreadsheet,
  Scale,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { useApp } from '@/context/AppContext';

type ReportTab = 'sales' | 'orders' | 'customers' | 'analytics';
type DateRange = 'all' | '7d' | '30d' | 'month';
type CsvCell = string | number | null | undefined;

const reportTabs: Array<{
  id: ReportTab;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'sales', label: 'Sales Reports', shortLabel: 'Sales', description: 'Revenue, collections and order value', icon: DollarSign },
  { id: 'orders', label: 'Order Reports', shortLabel: 'Orders', description: 'Order volume, status and fulfilment', icon: FileSpreadsheet },
  { id: 'customers', label: 'Customer Reports', shortLabel: 'Customers', description: 'Customer value and repeat activity', icon: Users },
  { id: 'analytics', label: 'Operations Analytics', shortLabel: 'Operations', description: 'Workload and fulfilment performance', icon: BarChart3 },
];

const completedStatuses: OrderStatus[] = ['DELIVERED', 'COMPLETED'];
const inProgressStatuses: OrderStatus[] = [
  'PICKUP_ASSIGNED',
  'PICKED_UP',
  'RECEIVED_AT_FACILITY',
  'WEIGHED_VERIFIED',
  'WASHING',
  'DRYING',
  'IRONING',
  'QUALITY_CHECK',
  'PACKED',
  'DELIVERY_ASSIGNED',
  'OUT_FOR_DELIVERY',
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function getReportTab(value: string | null): ReportTab {
  return value === 'orders' || value === 'customers' || value === 'analytics' ? value : 'sales';
}

function getDate(value?: string) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function getTimestamp(value?: string) {
  return getDate(value)?.getTime() ?? 0;
}

function formatDate(value?: string) {
  const date = getDate(value);
  return date ? dateFormatter.format(date) : '—';
}

function formatStatus(status: OrderStatus) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderWeight(order: Order) {
  if (typeof order.actualWeightKg === 'number') return order.actualWeightKg;
  if (typeof order.estimatedWeightKg === 'number') return order.estimatedWeightKg;

  return order.items.reduce((total, item) => {
    if (typeof item.actualWeightKg === 'number') return total + item.actualWeightKg;
    if (typeof item.estimatedWeightKg === 'number') return total + item.estimatedWeightKg;
    return item.pricingModel === 'PER_KG' ? total + item.quantity : total;
  }, 0);
}

function getProcessingHours(order: Order) {
  const start = getDate(order.createdAt);
  const completion = [...(order.statusHistory ?? [])]
    .reverse()
    .find((entry) => completedStatuses.includes(entry.status));
  const end = getDate(completion?.timestamp);

  if (!start || !end || end <= start) return null;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function escapeCsvValue(value: CsvCell) {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: CsvCell[][]) {
  const content = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = 'blue',
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone?: 'blue' | 'emerald' | 'amber' | 'violet';
}) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    violet: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
  };

  return (
    <article className="azea-card azea-card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-[var(--heading-color)]">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${toneClasses[tone]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-xs font-medium text-[var(--text-secondary)]">{detail}</p>
    </article>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="azea-card grid min-h-56 place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-sm font-bold text-[var(--heading-color)]">{title}</h2>
        <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--text-secondary)]">{detail}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const tone = completedStatuses.includes(status)
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
    : status === 'CANCELLED'
      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20'
      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20';

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${tone}`}>{formatStatus(status)}</span>;
}

function ReportsContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, showToast } = useApp();
  const [range, setRange] = useState<DateRange>('all');
  const activeTab = getReportTab(searchParams.get('tab'));

  const rangeLabel: Record<DateRange, string> = {
    all: 'All time',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    month: 'This month',
  };

  const filteredOrders = useMemo(() => {
    if (range === 'all') return orders;

    const now = new Date();
    const start = new Date(now);
    if (range === '7d') start.setDate(now.getDate() - 7);
    if (range === '30d') start.setDate(now.getDate() - 30);
    if (range === 'month') start.setDate(1);
    start.setHours(0, 0, 0, 0);

    return orders.filter((order) => {
      const createdAt = getDate(order.createdAt);
      return createdAt ? createdAt >= start : false;
    });
  }, [orders, range]);

  const sortedOrders = useMemo(
    () => [...filteredOrders].sort((first, second) => getTimestamp(second.createdAt) - getTimestamp(first.createdAt)),
    [filteredOrders]
  );

  const financials = useMemo(() => {
    const eligibleOrders = filteredOrders.filter((order) => order.currentStatus !== 'CANCELLED');
    const grossRevenue = eligibleOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const paidRevenue = eligibleOrders
      .filter((order) => order.paymentStatus === 'PAID')
      .reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const discount = eligibleOrders.reduce((total, order) => total + Number(order.discountAmount || 0), 0);

    return {
      eligibleOrders,
      grossRevenue,
      paidRevenue,
      discount,
      averageOrder: eligibleOrders.length ? grossRevenue / eligibleOrders.length : 0,
    };
  }, [filteredOrders]);

  const orderMetrics = useMemo(() => {
    const completed = filteredOrders.filter((order) => completedStatuses.includes(order.currentStatus));
    const active = filteredOrders.filter((order) => inProgressStatuses.includes(order.currentStatus));
    const cancelled = filteredOrders.filter((order) => order.currentStatus === 'CANCELLED');
    const verified = filteredOrders.filter((order) => order.isWeighed || typeof order.actualWeightKg === 'number');

    return {
      completed,
      active,
      cancelled,
      verified,
      completionRate: filteredOrders.length ? (completed.length / filteredOrders.length) * 100 : 0,
    };
  }, [filteredOrders]);

  const customers = useMemo(() => {
    const customerMap = new Map<string, { key: string; name: string; contact: string; orders: Order[]; total: number; lastOrder: Order }>();

    filteredOrders.forEach((order) => {
      const key = order.customerId || order.customerEmail || order.customerPhone || order.id;
      const contact = order.customerEmail || order.customerPhone || 'No contact details';
      const existing = customerMap.get(key);

      if (existing) {
        existing.orders.push(order);
        existing.total += Number(order.totalAmount || 0);
        if (getTimestamp(order.createdAt) > getTimestamp(existing.lastOrder.createdAt)) existing.lastOrder = order;
      } else {
        customerMap.set(key, {
          key,
          name: order.customerName || 'Unnamed customer',
          contact,
          orders: [order],
          total: Number(order.totalAmount || 0),
          lastOrder: order,
        });
      }
    });

    return [...customerMap.values()].sort((first, second) => second.total - first.total);
  }, [filteredOrders]);

  const operationMetrics = useMemo(() => {
    const statuses = new Map<OrderStatus, number>();
    filteredOrders.forEach((order) => statuses.set(order.currentStatus, (statuses.get(order.currentStatus) ?? 0) + 1));
    const statusRows = [...statuses.entries()]
      .map(([status, count]) => ({ status, count, share: filteredOrders.length ? (count / filteredOrders.length) * 100 : 0 }))
      .sort((first, second) => second.count - first.count);
    const completedHours = filteredOrders
      .map(getProcessingHours)
      .filter((hours): hours is number => hours !== null);
    const totalWeight = filteredOrders.reduce((total, order) => total + getOrderWeight(order), 0);

    return {
      statusRows,
      totalWeight,
      averageProcessingHours: completedHours.length
        ? completedHours.reduce((total, hours) => total + hours, 0) / completedHours.length
        : null,
    };
  }, [filteredOrders]);

  const setActiveTab = (nextTab: ReportTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === 'sales') params.delete('tab');
    else params.set('tab', nextTab);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleExport = () => {
    const dateStamp = new Date().toISOString().slice(0, 10);
    const filenamePrefix = `laundry-${activeTab}-report-${dateStamp}`;

    if (activeTab === 'sales') {
      downloadCsv(
        `${filenamePrefix}.csv`,
        ['Order ID', 'Customer', 'Placed on', 'Order value', 'Discount', 'Payment method', 'Payment status', 'Order status'],
        sortedOrders.map((order) => [
          order.id,
          order.customerName,
          formatDate(order.createdAt),
          order.totalAmount,
          order.discountAmount,
          order.paymentMethod,
          order.paymentStatus,
          formatStatus(order.currentStatus),
        ])
      );
    } else if (activeTab === 'orders') {
      downloadCsv(
        `${filenamePrefix}.csv`,
        ['Order ID', 'Customer', 'Placed on', 'Items', 'Estimated weight (kg)', 'Actual weight (kg)', 'Pickup slot', 'Current status', 'Payment status'],
        sortedOrders.map((order) => [
          order.id,
          order.customerName,
          formatDate(order.createdAt),
          order.items.length,
          order.estimatedWeightKg,
          order.actualWeightKg,
          `${order.pickupSlot?.date ?? ''} ${order.pickupSlot?.slot ?? ''}`.trim(),
          formatStatus(order.currentStatus),
          order.paymentStatus,
        ])
      );
    } else if (activeTab === 'customers') {
      downloadCsv(
        `${filenamePrefix}.csv`,
        ['Customer', 'Contact', 'Orders', 'Lifetime order value', 'Last order', 'Last order status'],
        customers.map((customer) => [
          customer.name,
          customer.contact,
          customer.orders.length,
          customer.total,
          formatDate(customer.lastOrder.createdAt),
          formatStatus(customer.lastOrder.currentStatus),
        ])
      );
    } else {
      downloadCsv(
        `${filenamePrefix}.csv`,
        ['Workflow status', 'Orders', 'Share of filtered orders', 'Estimated workload (kg)'],
        operationMetrics.statusRows.map((row) => [
          formatStatus(row.status),
          row.count,
          `${row.share.toFixed(1)}%`,
          filteredOrders
            .filter((order) => order.currentStatus === row.status)
            .reduce((total, order) => total + getOrderWeight(order), 0)
            .toFixed(2),
        ])
      );
    }

    showToast(`${reportTabs.find((tab) => tab.id === activeTab)?.label ?? 'Report'} downloaded as CSV.`, 'success');
  };

  const reportMeta = reportTabs.find((tab) => tab.id === activeTab) ?? reportTabs[0];

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-100">
              <BarChart3 className="h-3.5 w-3.5" />
              Live operations intelligence
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Reports that stay tied to your orders</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Review the {rangeLabel[range].toLowerCase()} activity, spot delivery bottlenecks, and export the exact data shown below.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="report-range">Reporting period</label>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-semibold text-slate-200">
              <CalendarDays className="h-4 w-4 text-blue-200" />
              <select
                id="report-range"
                value={range}
                onChange={(event) => setRange(event.target.value as DateRange)}
                className="h-10 min-w-32 cursor-pointer bg-transparent text-xs font-bold text-white outline-none"
              >
                <option className="text-slate-900" value="all">All time</option>
                <option className="text-slate-900" value="7d">Last 7 days</option>
                <option className="text-slate-900" value="30d">Last 30 days</option>
                <option className="text-slate-900" value="month">This month</option>
              </select>
            </span>
            <button type="button" onClick={handleExport} className="admin-btn-primary bg-white text-slate-900 shadow-none hover:bg-blue-50 hover:text-slate-900">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="azea-card p-2 sm:p-2.5" aria-label="Report type">
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4" role="tablist" aria-label="Report type">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`report-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`report-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3 py-3 text-left transition-all sm:px-4 ${
                  selected
                    ? 'bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white shadow-lg shadow-blue-900/20'
                    : 'text-[var(--text-secondary)] hover:bg-slate-50 hover:text-[var(--heading-color)] dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-black">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </span>
                <span className={`mt-1 hidden text-[10px] font-medium leading-4 lg:block ${selected ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
                  {tab.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id={`report-panel-${activeTab}`} role="tabpanel" aria-labelledby={`report-tab-${activeTab}`} className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#2563EB]">{rangeLabel[range]}</p>
            <h2 className="mt-1 text-xl font-black text-[var(--heading-color)]">{reportMeta.label}</h2>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} included
          </p>
        </div>

        {activeTab === 'sales' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Gross order value" value={currencyFormatter.format(financials.grossRevenue)} detail="Excludes cancelled orders" icon={<TrendingUp className="h-5 w-5" />} tone="emerald" />
              <MetricCard label="Paid collections" value={currencyFormatter.format(financials.paidRevenue)} detail="Orders confirmed as paid" icon={<CheckCircle2 className="h-5 w-5" />} tone="blue" />
              <MetricCard label="Average order value" value={currencyFormatter.format(financials.averageOrder)} detail={`Across ${financials.eligibleOrders.length} active orders`} icon={<ShoppingBag className="h-5 w-5" />} tone="violet" />
              <MetricCard label="Discounts granted" value={currencyFormatter.format(financials.discount)} detail="Promotions applied to active orders" icon={<ArrowUpRight className="h-5 w-5" />} tone="amber" />
            </div>

            {sortedOrders.length ? (
              <div className="azea-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] px-5 py-4">
                  <div>
                    <h3 className="text-sm font-black text-[var(--heading-color)]">Revenue by order</h3>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Newest orders first. Download the complete result with the export button.</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Live data</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="azea-table min-w-[760px]">
                    <thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Value</th><th>Payment</th><th>Fulfilment</th></tr></thead>
                    <tbody>
                      {sortedOrders.slice(0, 12).map((order) => (
                        <tr key={order.id}>
                          <td className="font-black text-[var(--heading-color)]">{order.id}</td>
                          <td><p className="font-bold text-[var(--heading-color)]">{order.customerName || 'Unnamed customer'}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{order.customerPhone || order.customerEmail || 'No contact'}</p></td>
                          <td className="font-medium text-[var(--text-secondary)]">{formatDate(order.createdAt)}</td>
                          <td><p className="font-black text-emerald-700 dark:text-emerald-300">{currencyFormatter.format(Number(order.totalAmount || 0))}</p>{order.discountAmount > 0 && <p className="mt-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">{currencyFormatter.format(order.discountAmount)} discount</p>}</td>
                          <td><p className="font-bold text-[var(--heading-color)]">{order.paymentMethod.replace(/_/g, ' ')}</p><p className={`mt-0.5 text-[10px] font-black ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</p></td>
                          <td><StatusPill status={order.currentStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <EmptyState title="No sales in this period" detail="Try another reporting period or wait for orders to arrive from the operations console." />}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Orders received" value={String(filteredOrders.length)} detail={`${orderMetrics.active.length} currently in progress`} icon={<FileSpreadsheet className="h-5 w-5" />} tone="blue" />
              <MetricCard label="Active backlog" value={String(orderMetrics.active.length)} detail="Pickup, facility and delivery stages" icon={<Clock3 className="h-5 w-5" />} tone="amber" />
              <MetricCard label="Completed" value={String(orderMetrics.completed.length)} detail={`${orderMetrics.completionRate.toFixed(1)}% completion rate`} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
              <MetricCard label="Weight verified" value={`${orderMetrics.verified.length}/${filteredOrders.length}`} detail="Orders with a captured actual weight" icon={<Scale className="h-5 w-5" />} tone="violet" />
            </div>

            {sortedOrders.length ? (
              <div className="azea-card overflow-hidden">
                <div className="border-b border-[var(--border-color)] px-5 py-4"><h3 className="text-sm font-black text-[var(--heading-color)]">Order fulfilment register</h3><p className="mt-0.5 text-xs text-[var(--text-secondary)]">Track the current stage, pickup promise and payment state for every included order.</p></div>
                <div className="overflow-x-auto">
                  <table className="azea-table min-w-[860px]">
                    <thead><tr><th>Order</th><th>Customer</th><th>Items / weight</th><th>Pickup</th><th>Status</th><th>Payment</th></tr></thead>
                    <tbody>
                      {sortedOrders.slice(0, 14).map((order) => (
                        <tr key={order.id}>
                          <td><p className="font-black text-[var(--heading-color)]">{order.id}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{formatDate(order.createdAt)}</p></td>
                          <td><p className="font-bold text-[var(--heading-color)]">{order.customerName || 'Unnamed customer'}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{order.customerPhone || order.customerEmail || 'No contact'}</p></td>
                          <td><p className="font-bold text-[var(--heading-color)]">{order.items.length} item{order.items.length === 1 ? '' : 's'}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{getOrderWeight(order).toFixed(1)} kg estimated</p></td>
                          <td><p className="font-bold text-[var(--heading-color)]">{order.pickupSlot?.slot || 'Not scheduled'}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{order.pickupSlot?.date || '—'}</p></td>
                          <td><StatusPill status={order.currentStatus} /></td>
                          <td><p className="font-bold text-[var(--heading-color)]">{currencyFormatter.format(Number(order.totalAmount || 0))}</p><p className={`mt-0.5 text-[10px] font-black ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</p></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <EmptyState title="No orders in this period" detail="The order register will populate as soon as your secured backend sends active orders to the admin console." />}
          </>
        )}

        {activeTab === 'customers' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Active customers" value={String(customers.length)} detail="Unique customers with orders in this period" icon={<Users className="h-5 w-5" />} tone="blue" />
              <MetricCard label="Repeat customers" value={String(customers.filter((customer) => customer.orders.length > 1).length)} detail={`${customers.length ? ((customers.filter((customer) => customer.orders.length > 1).length / customers.length) * 100).toFixed(1) : '0.0'}% of active customers`} icon={<TrendingUp className="h-5 w-5" />} tone="emerald" />
              <MetricCard label="Average customer value" value={currencyFormatter.format(customers.length ? customers.reduce((total, customer) => total + customer.total, 0) / customers.length : 0)} detail="Order value for this reporting period" icon={<DollarSign className="h-5 w-5" />} tone="violet" />
              <MetricCard label="Returning order share" value={`${filteredOrders.length ? ((filteredOrders.filter((order) => (customers.find((customer) => customer.key === (order.customerId || order.customerEmail || order.customerPhone || order.id))?.orders.length ?? 0) > 1).length / filteredOrders.length) * 100).toFixed(1) : '0.0'}%`} detail="Orders from customers with more than one booking" icon={<ArrowUpRight className="h-5 w-5" />} tone="amber" />
            </div>

            {customers.length ? (
              <div className="azea-card overflow-hidden">
                <div className="border-b border-[var(--border-color)] px-5 py-4"><h3 className="text-sm font-black text-[var(--heading-color)]">Customer value overview</h3><p className="mt-0.5 text-xs text-[var(--text-secondary)]">Sorted by total order value in the selected period.</p></div>
                <div className="overflow-x-auto">
                  <table className="azea-table min-w-[750px]">
                    <thead><tr><th>Customer</th><th>Orders</th><th>Order value</th><th>Last order</th><th>Latest status</th></tr></thead>
                    <tbody>
                      {customers.slice(0, 14).map((customer) => (
                        <tr key={customer.key}>
                          <td><p className="font-black text-[var(--heading-color)]">{customer.name}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{customer.contact}</p></td>
                          <td><span className="inline-grid min-w-7 place-items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{customer.orders.length}</span></td>
                          <td className="font-black text-emerald-700 dark:text-emerald-300">{currencyFormatter.format(customer.total)}</td>
                          <td><p className="font-bold text-[var(--heading-color)]">{formatDate(customer.lastOrder.createdAt)}</p><p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{customer.lastOrder.id}</p></td>
                          <td><StatusPill status={customer.lastOrder.currentStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <EmptyState title="No customer activity in this period" detail="Customer insights will appear once orders are available in the selected reporting window." />}
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Estimated workload" value={`${operationMetrics.totalWeight.toFixed(1)} kg`} detail="Actual weight is used when it has been verified" icon={<Scale className="h-5 w-5" />} tone="blue" />
              <MetricCard label="Facility queue" value={String(orderMetrics.active.length)} detail="Orders currently moving through fulfilment" icon={<Activity className="h-5 w-5" />} tone="amber" />
              <MetricCard label="Completion rate" value={`${orderMetrics.completionRate.toFixed(1)}%`} detail={`${orderMetrics.completed.length} completed or delivered orders`} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
              <MetricCard label="Average turnaround" value={operationMetrics.averageProcessingHours === null ? '—' : `${operationMetrics.averageProcessingHours.toFixed(1)} hrs`} detail={operationMetrics.averageProcessingHours === null ? 'Available after completed orders have timestamps' : 'From order creation to a completed status'} icon={<Clock3 className="h-5 w-5" />} tone="violet" />
            </div>

            {operationMetrics.statusRows.length ? (
              <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="azea-card p-5">
                  <div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-black text-[var(--heading-color)]">Workflow distribution</h3><p className="mt-0.5 text-xs text-[var(--text-secondary)]">Order volume grouped by the current workflow stage.</p></div><BarChart3 className="h-5 w-5 text-[#2563EB]" /></div>
                  <div className="mt-6 space-y-4">
                    {operationMetrics.statusRows.map((row) => (
                      <div key={row.status}>
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="font-bold text-[var(--heading-color)]">{formatStatus(row.status)}</span><span className="font-black text-[var(--text-secondary)]">{row.count} · {row.share.toFixed(1)}%</span></div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" style={{ width: `${Math.max(row.share, 3)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="azea-card p-5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><AlertCircle className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-sm font-black text-[var(--heading-color)]">Queue signal</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {orderMetrics.active.length
                      ? `${orderMetrics.active.length} order${orderMetrics.active.length === 1 ? ' is' : 's are'} in pickup, processing, quality check, packing or delivery. Prioritise the oldest records first from the Orders workspace.`
                      : 'No active orders are waiting in the operational workflow for this reporting period.'}
                  </p>
                  <div className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary-card)] p-3"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">Cancelled orders</p><p className="mt-1 text-xl font-black text-rose-600">{orderMetrics.cancelled.length}</p></div>
                </aside>
              </div>
            ) : <EmptyState title="No operational data in this period" detail="Choose a wider range to review fulfilment workload and workflow distribution." />}
          </>
        )}
      </section>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-medium text-[var(--text-secondary)]">Loading reports…</div>}>
      <ReportsContent />
    </Suspense>
  );
}
