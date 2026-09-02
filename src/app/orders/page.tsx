'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/common/Badge';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Scale,
  Clock,
  ArrowRight,
  Sparkles,
  QrCode,
  FileText,
  AlertCircle,
  X,
  Plus,
  Tag,
  Shield,
  Printer,
  ChevronRight,
  Eye,
  Check,
  Building2,
  RotateCcw,
  CheckCircle2,
  Download,
  Phone,
  Mail,
  User,
  MapPin,
  MoreVertical,
} from 'lucide-react';
import { Order, OrderStatus, GarmentTagStatus, GarmentTagItem } from '@/types';

export default function AdminOrdersPage() {
  const {
    orders,
    advanceOrderStatus,
    submitWeightVerification,
    approvePriceAdjustment,
    updateGarmentTagStatus,
    addInternalNote,
    hubs,
    showToast,
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [hubFilter, setHubFilter] = useState<string>('ALL');

  // Modals
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [grossWeight, setGrossWeight] = useState<number>(8.1);
  const [tareWeight, setTareWeight] = useState<number>(1.9);
  const [ratePerKg, setRatePerKg] = useState<number>(60);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [newInternalNote, setNewInternalNote] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState<'ITEMS' | 'TAGS' | 'WEIGHT' | 'NOTES'>('TAGS');
  const customerBookingUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/book`;

  const exportOrders = () => {
    const header = ['Order ID', 'Customer', 'Phone', 'Status', 'Payment', 'Total', 'Created at'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customerName,
      order.customerPhone,
      order.currentStatus,
      order.paymentStatus,
      String(order.totalAmount),
      order.createdAt || '',
    ]);
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `laundry-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`${rows.length} orders exported to CSV.`, 'success');
  };

  const STATUS_STEPPER: { status: OrderStatus; label: string }[] = [
    { status: 'ORDER_PLACED', label: '1. Order Placed' },
    { status: 'PICKUP_ASSIGNED', label: '2. Pickup Assigned' },
    { status: 'PICKED_UP', label: '3. Picked Up (OTP)' },
    { status: 'RECEIVED_AT_FACILITY', label: '4. At Facility' },
    { status: 'WEIGHED_VERIFIED', label: '5. Weighed & Reconciled' },
    { status: 'WASHING', label: '6. Washing' },
    { status: 'DRYING', label: '7. Drying' },
    { status: 'IRONING', label: '8. Steam Ironing' },
    { status: 'QUALITY_CHECK', label: '9. Quality Check' },
    { status: 'PACKED', label: '10. Packed' },
    { status: 'DELIVERY_ASSIGNED', label: '11. Delivery Assigned' },
    { status: 'OUT_FOR_DELIVERY', label: '12. Out for Delivery' },
    { status: 'DELIVERED', label: '13. Delivered (OTP)' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.currentStatus === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesPayment = paymentFilter === 'ALL' || o.paymentStatus === paymentFilter;
    return matchesStatus && matchesSearch && matchesPayment;
  });

  const activeOrder = orders.find((o) => o.id === selectedOrder?.id) || selectedOrder || orders[0];

  const handleStepAdvance = (status: OrderStatus) => {
    if (!activeOrder) return;
    const updated = advanceOrderStatus(activeOrder.id, status);
    if (updated) setSelectedOrder(updated);
  };

  const handleSaveWeightVerification = () => {
    if (!activeOrder) return;
    submitWeightVerification(activeOrder.id, grossWeight, tareWeight, ratePerKg, 'Central Scale Station #1');
    setWeightModalOpen(false);
  };

  const handleAddNote = () => {
    if (!activeOrder || !newInternalNote.trim()) return;
    addInternalNote(activeOrder.id, 'Super Admin', 'Super Admin', newInternalNote.trim());
    setNewInternalNote('');
  };

  const calculateNet = () => Math.max(0, +(grossWeight - tareWeight).toFixed(2));
  const calculateDifference = () => {
    const net = calculateNet();
    const est = activeOrder?.estimatedWeightKg || 6.2;
    return +((net - est) * ratePerKg).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Header Buttons (Export, Filter, Create Order) */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins">
            Orders Lifecycle & Operational Console
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage pickup, facility processing, digital garment tagging, scale weighing, and delivery lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportOrders}
            className="admin-btn-secondary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setInvoiceModalOpen(true)}
            className="admin-btn-secondary"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Tax Invoice</span>
          </button>
          <a
            href={customerBookingUrl}
            className="admin-btn-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </a>
        </div>
      </div>

      {/* Filter Bar (Search + Status, Payment, Hub Filters) */}
      <div className="azea-card p-4 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        {/* Search */}
        <div className="flex items-center bg-[var(--input-bg)] border border-[var(--input-border)] px-3 py-1.5 rounded-[8px] text-xs gap-2 text-[var(--text-secondary)] w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-xs font-medium text-[var(--text-primary)]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input"
          >
            <option value="ALL">All Statuses</option>
            <option value="ORDER_PLACED">New Placed</option>
            <option value="WASHING">Washing</option>
            <option value="QUALITY_CHECK">QC Check</option>
            <option value="PACKED">Packed</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="admin-input"
          >
            <option value="ALL">All Payment</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Orders List (Col 5) + Enterprise Order Inspector (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--heading-color)] uppercase tracking-wider">
              Orders Queue ({filteredOrders.length})
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredOrders.map((o) => {
              const isSelected = activeOrder?.id === o.id;

              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`p-4 rounded-[12px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-slate-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[var(--heading-color)]">#{o.id}</span>
                      <Badge status={o.currentStatus} />
                    </div>
                    <span className="font-bold text-sm text-[var(--primary)]">₹{o.totalAmount}</span>
                  </div>

                  <div className="text-xs text-[var(--heading-color)] font-semibold">{o.customerName}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{o.customerPhone} • {o.address.city}</div>

                  <div className="mt-2.5 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-secondary)] font-medium">
                      {o.items.length} Items • Pickup: {o.pickupSlot?.slot || 'Today 10 AM'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Large Enterprise Order Inspector */}
        {activeOrder ? (
          <div className="lg:col-span-7 azea-card p-6 space-y-6">
            {/* Inspector Header: #LF10245 Processing ₹1,240 Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-color)] gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-[var(--heading-color)]">
                    #LF{activeOrder.id}
                  </h2>
                  <Badge status={activeOrder.currentStatus} />
                  <span className="text-xl font-black text-[var(--primary)] font-poppins">
                    ₹{activeOrder.totalAmount}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                  <span>Bag Tag: <strong className="text-[var(--heading-color)]">{activeOrder.bagTagCode || `BT-${activeOrder.id}`}</strong></span>
                  <span>•</span>
                  <span>Pickup OTP: <strong className="text-[var(--primary)]">{activeOrder.pickupOtp || 'Not generated'}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvoiceModalOpen(true)}
                  className="admin-btn-secondary"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <a
                  href={`tel:${activeOrder.customerPhone.replace(/[^+\d]/g, '')}`}
                  className="admin-btn-primary"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Customer</span>
                </a>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="p-4 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
                  Customer Details
                </div>
                <div className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{activeOrder.customerName}</span>
                </div>
                <div className="text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{activeOrder.customerPhone}</span>
                </div>
                <div className="text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{activeOrder.customerEmail || 'customer@example.com'}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">
                  Delivery Address
                </div>
                <div className="font-semibold text-[var(--heading-color)] flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>
                    {activeOrder.address.street}, {activeOrder.address.city} - {activeOrder.address.pincode}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                  Assigned Hub: <strong>{hubs[0]?.name || 'Koramangala Central Hub'}</strong>
                </div>
              </div>
            </div>

            {/* 13-Stage Operational Stepper */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--heading-color)] uppercase tracking-wider">
                  Lifecycle Status Progression
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">Click stage to advance</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_STEPPER.map((st) => {
                  const isCurrent = activeOrder.currentStatus === st.status;
                  const isPast = activeOrder.statusHistory.some((h) => h.status === st.status);

                  return (
                    <button
                      key={st.status}
                      onClick={() => handleStepAdvance(st.status)}
                      className={`p-2 rounded-[8px] text-[11px] font-bold text-left transition-all border flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                          : isPast
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{st.label}</span>
                      {isPast && <Check className="w-3 h-3 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Garment Item Horizontal Tracking Timeline (SH-10245-01) */}
            <div className="p-4 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[var(--heading-color)] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[var(--primary)]" />
                  <span>Garment Item Tracking Barcode Timeline</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
                  SH-{activeOrder.id}-01
                </span>
              </div>

              {/* Horizontal Timeline */}
              <div className="flex items-center justify-between text-[11px] font-bold pt-2 overflow-x-auto">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">✓</div>
                  <span className="text-emerald-700 dark:text-emerald-400">TAGGED</span>
                </div>
                <div className="h-0.5 flex-1 bg-[#16A34A] mx-1" />

                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">✓</div>
                  <span className="text-emerald-700 dark:text-emerald-400">WASHING</span>
                </div>
                <div className="h-0.5 flex-1 bg-[#16A34A] mx-1" />

                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">✓</div>
                  <span className="text-emerald-700 dark:text-emerald-400">DRYING</span>
                </div>
                <div className="h-0.5 flex-1 bg-[#16A34A] mx-1" />

                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">●</div>
                  <span className="text-amber-600">IRONING</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-300 dark:bg-slate-700 mx-1" />

                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs">○</div>
                  <span className="text-slate-400">QC</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-300 dark:bg-slate-700 mx-1" />

                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs">○</div>
                  <span className="text-slate-400">PACKED</span>
                </div>
              </div>
            </div>

            {/* Weight Verification Box Specs */}
            <div className="p-4 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <div className="font-bold text-xs text-[var(--heading-color)] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#16A34A]" />
                  <span>Weight Verification Record</span>
                </div>
                <button
                  onClick={() => setWeightModalOpen(true)}
                  className="text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  Edit Scale Weight
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-[var(--bg-card)] rounded-[8px] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-bold">Estimated</span>
                  <span className="text-sm font-bold text-[var(--heading-color)]">6.2 KG</span>
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] rounded-[8px] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-bold">Gross</span>
                  <span className="text-sm font-bold text-[var(--heading-color)]">8.1 KG</span>
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] rounded-[8px] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-bold">Tare</span>
                  <span className="text-sm font-bold text-[var(--heading-color)]">1.9 KG</span>
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] rounded-[8px] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block font-bold">Net</span>
                  <span className="text-sm font-bold text-[#16A34A]">6.2 KG</span>
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-[8px] border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase block font-bold">Price Diff</span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">₹0</span>
                </div>
              </div>
            </div>

            {/* Order Items Table (Garment, Service, Qty, Estimated Price, Actual Price, Status) */}
            <div className="space-y-2">
              <div className="font-bold text-xs text-[var(--heading-color)] uppercase tracking-wider">
                Order Items ({activeOrder.items.length})
              </div>

              <div className="overflow-x-auto border border-[var(--border-color)] rounded-[10px]">
                <table className="azea-table">
                  <thead>
                    <tr>
                      <th>Garment</th>
                      <th>Service</th>
                      <th>Qty</th>
                      <th>Estimated Price</th>
                      <th>Actual Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-[var(--heading-color)]">{item.serviceName}</td>
                        <td>{item.categoryName || 'Wash & Fold'}</td>
                        <td className="font-bold">{item.quantity} {item.unit}</td>
                        <td>₹{item.unitPrice}</td>
                        <td className="font-bold text-[var(--heading-color)]">₹{item.subtotal}</td>
                        <td>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 azea-card p-12 text-center text-xs text-[var(--text-secondary)]">
            Select an order from the queue to view enterprise details.
          </div>
        )}
      </div>

      {/* Weight Modal */}
      {weightModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[14px] max-w-md w-full p-6 shadow-2xl border border-[var(--border-color)] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-sm text-[var(--heading-color)]">Scale Weighing & Reconciliation</h3>
              <button onClick={() => setWeightModalOpen(false)} className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary-card)] hover:text-[var(--heading-color)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Gross Weight on Scale (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Tare / Empty Bag (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-mono font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-[8px] border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <div className="flex justify-between font-bold text-emerald-900 dark:text-emerald-300">
                  <span>Net Verified Weight:</span>
                  <span>{calculateNet()} KG</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Price Adjustment:</span>
                  <span>₹{calculateDifference()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setWeightModalOpen(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveWeightVerification} className="admin-btn-primary">
                Save Scale Weight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {invoiceModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-[14px] max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#16A34A] text-white flex items-center justify-center font-bold">🧺</div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">TAX INVOICE</h3>
                  <span className="text-[11px] text-slate-500">LaundryFresh Private Limited</span>
                </div>
              </div>
              <button onClick={() => setInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <div>
                  <strong>Billed To:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})
                </div>
                <div>
                  <strong>Invoice No:</strong> INV-{activeOrder.id}
                </div>
              </div>
              <div>
                <strong>Address:</strong> {activeOrder.address.street}, {activeOrder.address.city}
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="p-2 border border-slate-200">Item</th>
                  <th className="p-2 border border-slate-200">Qty</th>
                  <th className="p-2 border border-slate-200 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeOrder.items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 border border-slate-200">{it.serviceName}</td>
                    <td className="p-2 border border-slate-200">{it.quantity} {it.unit}</td>
                    <td className="p-2 border border-slate-200 text-right font-bold">₹{it.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2 font-bold text-sm border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="text-[#16A34A]">₹{activeOrder.totalAmount}</span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => window.print()} className="admin-btn-secondary">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button onClick={() => setInvoiceModalOpen(false)} className="admin-btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
