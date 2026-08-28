'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Users,
  ShieldCheck,
  Truck,
  Wrench,
  Star,
  Plus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Wallet,
  Sparkles,
  CreditCard,
  Crown,
  Search,
  Building2,
  TrendingUp,
  Package,
  Layers,
  Edit2,
  RefreshCw,
  Key,
  Lock,
  Shield,
  Check,
  Trash2,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'HUB_MANAGER' | 'QUALITY_INSPECTOR' | 'PICKUP_AGENT' | 'DELIVERY_AGENT';
  assignedFacility: string;
  permissions: string[];
  isActive: boolean;
  ordersProcessed?: number;
}

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  pincode: string;
  customerType: 'VIP_DIAMOND' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'CORPORATE' | 'REGULAR';
  planName: string;
  totalKgAllowance: number;
  usedKgThisMonth: number;
  freePickupsLeft: number;
  renewalDate: string;
  autoRenew: boolean;
  walletBalance: number;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
}

function StaffAndAdminManagementContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams ? searchParams.get('tab') : null;
  const initialTab =
    rawTab === 'customers'
      ? 'CUSTOMERS'
      : rawTab === 'cod'
      ? 'COD'
      : rawTab === 'staff'
      ? 'STAFF'
      : 'RBAC';

  const { codRecords, reconcileRiderCOD, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'RBAC' | 'CUSTOMERS' | 'STAFF' | 'COD'>(initialTab);

  useEffect(() => {
    if (rawTab === 'customers') setActiveTab('CUSTOMERS');
    else if (rawTab === 'cod') setActiveTab('COD');
    else if (rawTab === 'staff') setActiveTab('STAFF');
    else if (rawTab === 'rbac' || !rawTab) setActiveTab('RBAC');
  }, [rawTab]);

  // Master Admin & Staff State with Super Admin Credentials (venkat@anushatechnologies.com)
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: 'stf-super-01',
      name: 'Venkat (Master Super Admin)',
      email: 'venkat@anushatechnologies.com',
      password: 'Venkat@9948',
      phone: '+91 99480 00000',
      role: 'SUPER_ADMIN',
      assignedFacility: 'Master HQ — Rajahmundry Central Hub',
      permissions: ['ORDERS', 'PRICING', 'INVENTORY', 'STAFF', 'REPORTS', 'COUPONS', 'SETTINGS', 'AUDIT'],
      isActive: true,
      ordersProcessed: 1420,
    },
    {
      id: 'stf-2',
      name: 'Priya Sharma (Hub Manager)',
      email: 'priya.ops@laundryfresh.com',
      password: 'Pass@123',
      phone: '+91 98765 43211',
      role: 'HUB_MANAGER',
      assignedFacility: 'Kakinada Express Store',
      permissions: ['ORDERS', 'INVENTORY', 'REPORTS'],
      isActive: true,
      ordersProcessed: 890,
    },
    {
      id: 'stf-3',
      name: 'Arun M. (QC Lead)',
      email: 'arun.wash@laundryfresh.com',
      password: 'Pass@123',
      phone: '+91 98765 43212',
      role: 'QUALITY_INSPECTOR',
      assignedFacility: 'Rajahmundry Central Hub',
      permissions: ['ORDERS', 'INVENTORY'],
      isActive: true,
      ordersProcessed: 482,
    },
    {
      id: 'stf-4',
      name: 'Vikram Singh (Fleet Agent)',
      email: 'vikram.rider@laundryfresh.com',
      password: 'Pass@123',
      phone: '+91 98450 11223',
      role: 'PICKUP_AGENT',
      assignedFacility: 'Rajahmundry Central Hub',
      permissions: ['ORDERS'],
      isActive: true,
      ordersProcessed: 320,
    },
  ]);

  // Customers State (Live Synchronized with Backend & Database)
  const [customers, setCustomers] = useState<CustomerRecord[]>([
    {
      id: 'cust-101',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 98765 43210',
      pincode: '533101',
      customerType: 'VIP_DIAMOND',
      planName: 'VIP Unlimited Diamond Executive Plan',
      totalKgAllowance: 150,
      usedKgThisMonth: 42.5,
      freePickupsLeft: 8,
      renewalDate: '2026-09-15',
      autoRenew: true,
      walletBalance: 2450,
      loyaltyPoints: 1850,
      totalOrders: 34,
      totalSpent: 28400,
    },
    {
      id: 'cust-102',
      name: 'Priya Sharma',
      email: 'priya.sharma@yahoo.com',
      phone: '+91 98123 45678',
      pincode: '533103',
      customerType: 'GOLD',
      planName: 'Gold Essential Wash Plan',
      totalKgAllowance: 50,
      usedKgThisMonth: 18.5,
      freePickupsLeft: 4,
      renewalDate: '2026-09-10',
      autoRenew: true,
      walletBalance: 850,
      loyaltyPoints: 620,
      totalOrders: 14,
      totalSpent: 9200,
    },
  ]);

  useEffect(() => {
    async function fetchLiveCustomers() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api';
        const res = await fetch(`${apiUrl}/customers`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const liveRecords: CustomerRecord[] = json.data.map((c: any) => ({
            id: c.id || `cust_${Date.now()}`,
            name: c.name || 'Customer',
            email: c.email || 'No email provided',
            phone: c.phone ? (c.phone.startsWith('+91') ? c.phone : `+91 ${c.phone}`) : '+91 98765 43210',
            pincode: c.pincode || '500072',
            customerType: (c.totalOrders > 10 ? 'VIP_DIAMOND' : c.totalOrders > 3 ? 'GOLD' : 'REGULAR') as CustomerRecord['customerType'],
            planName: c.planName || (c.totalOrders > 5 ? 'Gold Wash Regular' : 'Pay As You Go'),
            totalKgAllowance: c.totalKgAllowance || 50,
            usedKgThisMonth: c.usedKgThisMonth || 0,
            freePickupsLeft: c.freePickupsLeft || 2,
            renewalDate: c.renewalDate || '2026-09-30',
            autoRenew: Boolean(c.autoRenew),
            walletBalance: c.walletBalance || 0,
            loyaltyPoints: c.loyaltyPoints || (c.totalOrders ? c.totalOrders * 50 : 100),
            totalOrders: c.totalOrders || 0,
            totalSpent: c.totalSpent || 0,
          }));
          setCustomers(liveRecords);
        }
      } catch (err) {
        console.warn('Failed to load live customers from backend:', err);
      }
    }
    fetchLiveCustomers();
  }, []);

  const [staffSearch, setStaffSearch] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

  // Form State for Add / Edit Admin Staff
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: 'Pass@123',
    phone: '+91 ',
    role: 'HUB_MANAGER' as StaffUser['role'],
    assignedFacility: 'Rajahmundry Central Hub',
    permissions: ['ORDERS', 'INVENTORY', 'REPORTS'],
  });

  // Rider COD Modal
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('stf-4');
  const [depositedAmount, setDepositedAmount] = useState<number>(1850);
  const [depositNotes, setDepositNotes] = useState('');

  const handleSettle = () => {
    reconcileRiderCOD(selectedRiderId, depositedAmount, depositNotes);
    setDepositModalOpen(false);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim() || !staffForm.email.trim()) {
      showToast('Staff name and email are required', 'error');
      return;
    }

    if (editingStaff) {
      setStaffUsers((prev) =>
        prev.map((s) => {
          if (s.id === editingStaff.id) {
            return {
              ...s,
              name: staffForm.name.trim(),
              email: staffForm.email.trim(),
              password: staffForm.password || s.password,
              phone: staffForm.phone,
              role: staffForm.role,
              assignedFacility: staffForm.assignedFacility,
              permissions: staffForm.permissions,
            };
          }
          return s;
        })
      );
      showToast(`Updated permissions & credentials for "${staffForm.name}"!`, 'success');
    } else {
      const newStaff: StaffUser = {
        id: `stf-${Date.now()}`,
        name: staffForm.name.trim(),
        email: staffForm.email.trim(),
        password: staffForm.password || 'Pass@123',
        phone: staffForm.phone,
        role: staffForm.role,
        assignedFacility: staffForm.assignedFacility,
        permissions: staffForm.permissions,
        isActive: true,
        ordersProcessed: 0,
      };
      setStaffUsers((prev) => [...prev, newStaff]);
      showToast(`Created new admin/staff account for "${newStaff.name}"!`, 'success');
    }

    setShowAddStaffModal(false);
    setEditingStaff(null);
  };

  const handleToggleStaffStatus = (id: string, name: string) => {
    setStaffUsers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = !s.isActive;
          showToast(`${name} access ${nextStatus ? 'Activated' : 'Revoked'}`, 'info');
          return { ...s, isActive: nextStatus };
        }
        return s;
      })
    );
  };

  const filteredStaff = staffUsers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.assignedFacility.toLowerCase().includes(staffSearch.toLowerCase());
    return matchesSearch;
  });

  const togglePermission = (perm: string) => {
    setStaffForm((prev) => {
      const exists = prev.permissions.includes(perm);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Master Credentials Banner */}
      <div className="azea-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center gap-1.5 mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Master Super Admin Privilege Level
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-poppins text-white flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              <span>Super Admin RBAC & Shop Access Control</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-medium max-w-2xl">
              Logged in as Master Super Admin. Full permission to create admin logins, assign shop branches, manage staff roles, and configure module access.
            </p>
          </div>

          {/* Super Admin Credentials Spotlight */}
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 text-xs shrink-0 space-y-1 backdrop-blur-xs">
            <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Super Admin Master Credentials</span>
            </div>
            <div className="text-[11px] text-slate-200">
              Email: <span className="font-bold text-white">venkat@anushatechnologies.com</span>
            </div>
            <div className="text-[11px] text-slate-200">
              Password: <span className="font-bold font-mono text-amber-300">Venkat@9948</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tab Switches */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 mt-6 relative z-10">
          <button
            onClick={() => setActiveTab('RBAC')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RBAC'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>🔐 Admin RBAC Directory ({staffUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CUSTOMERS'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 Customer Subscriptions ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'STAFF'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>👔 Operations Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('COD')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'COD'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>💵 Rider COD Cash Desk</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: ADMIN & STAFF RBAC DIRECTORY
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'RBAC' && (
        <div className="space-y-6">
          <div className="azea-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search admin name, email, or facility..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="admin-input w-full pl-9"
              />
            </div>

            <button
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({
                  name: '',
                  email: '',
                  password: 'Pass@123',
                  phone: '+91 ',
                  role: 'HUB_MANAGER',
                  assignedFacility: 'Rajahmundry Central Hub',
                  permissions: ['ORDERS', 'INVENTORY', 'REPORTS'],
                });
                setShowAddStaffModal(true);
              }}
              className="admin-btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Admin / Staff Account</span>
            </button>
          </div>

          <div className="azea-card p-6 space-y-4">
            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Admin / Staff Member</th>
                    <th>Assigned Role</th>
                    <th>Assigned Shop / Hub Branch</th>
                    <th>Module Access Permissions</th>
                    <th>Login Credentials</th>
                    <th>Status</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((stf) => (
                    <tr key={stf.id}>
                      <td className="pl-4">
                        <div className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-1.5">
                          {stf.role === 'SUPER_ADMIN' && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                          <span>{stf.name}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono">{stf.email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{stf.phone}</div>
                      </td>

                      <td>
                        {stf.role === 'SUPER_ADMIN' && (
                          <span className="text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-purple-600 text-white px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1">
                            👑 Master Super Admin
                          </span>
                        )}
                        {stf.role === 'HUB_MANAGER' && (
                          <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-blue-600" />
                            Hub Manager
                          </span>
                        )}
                        {stf.role === 'QUALITY_INSPECTOR' && (
                          <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            QC Inspector
                          </span>
                        )}
                        {stf.role === 'PICKUP_AGENT' && (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Truck className="w-3 h-3 text-emerald-600" />
                            Pickup Agent
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="font-bold text-[var(--heading-color)] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{stf.assignedFacility}</span>
                        </span>
                      </td>

                      <td className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {stf.permissions?.map((perm) => (
                            <span key={perm} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800 inline-block">
                          🔑 {stf.password || '********'}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            stf.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {stf.isActive ? 'ACTIVE' : 'REVOKED'}
                        </span>
                      </td>

                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingStaff(stf);
                              setStaffForm({
                                name: stf.name,
                                email: stf.email,
                                password: stf.password || 'Pass@123',
                                phone: stf.phone,
                                role: stf.role,
                                assignedFacility: stf.assignedFacility,
                                permissions: stf.permissions || ['ORDERS', 'INVENTORY'],
                              });
                              setShowAddStaffModal(true);
                            }}
                            className="p-1.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-slate-600 cursor-pointer"
                            title="Edit Permissions & Assigned Shop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {stf.role !== 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleToggleStaffStatus(stf.id, stf.name)}
                              className={`p-1.5 border rounded-lg text-xs font-bold cursor-pointer ${
                                stf.isActive
                                  ? 'border-rose-200 hover:bg-rose-50 text-rose-600'
                                  : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'
                              }`}
                              title={stf.isActive ? 'Revoke Access' : 'Enable Access'}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: CUSTOMERS DIRECTORY
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-4">
          <div className="azea-card p-6 space-y-4">
            <div className="overflow-x-auto text-xs">
              <table className="azea-table">
                <thead>
                  <tr>
                    <th className="pl-4">Customer Name</th>
                    <th>Email & Phone</th>
                    <th>Plan Tier</th>
                    <th>Monthly KG Meter</th>
                    <th>Wallet Balance</th>
                    <th className="text-right pr-4">LTV Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="pl-4 font-bold text-[var(--heading-color)]">{c.name}</td>
                      <td>{c.email} • {c.phone}</td>
                      <td>
                        <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                          {c.customerType}
                        </span>
                      </td>
                      <td>{c.usedKgThisMonth} / {c.totalKgAllowance} KG</td>
                      <td className="font-bold text-emerald-600">₹{c.walletBalance}</td>
                      <td className="text-right pr-4 font-black">₹{c.totalSpent.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: OPERATIONS ROSTER
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'STAFF' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staffUsers.map((member) => (
            <div key={member.id} className="azea-card p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-3">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                    {member.role.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <h3 className="font-bold text-base text-[var(--heading-color)]">{member.name}</h3>
                <div className="text-xs text-[var(--text-secondary)] space-y-0.5 mt-1">
                  <div>{member.phone}</div>
                  <div>{member.email}</div>
                </div>

                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 border border-[var(--border-color)]">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Assigned Hub Branch:</span>
                    <span className="font-bold text-indigo-600">{member.assignedFacility}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: RIDER COD DESK
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'COD' && (
        <div className="azea-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)] text-xs">
            <h3 className="font-extrabold text-sm text-[var(--heading-color)]">Rider Cash On Delivery Settlement Ledger</h3>
            <button onClick={() => setDepositModalOpen(true)} className="admin-btn-primary">
              + Record Rider Settlement
            </button>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="azea-table">
              <thead>
                <tr>
                  <th className="pl-4">Rider</th>
                  <th>Date</th>
                  <th>Collected</th>
                  <th>Deposited</th>
                  <th className="text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {codRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="pl-4 font-bold">{r.riderName}</td>
                    <td>{r.date}</td>
                    <td className="font-bold text-emerald-600">₹{r.totalCollected}</td>
                    <td>₹{r.depositedAmount}</td>
                    <td className="text-right pr-4 font-bold text-emerald-600">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT ADMIN & STAFF ACCOUNT
      ───────────────────────────────────────────────────────────── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-lg w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>{editingStaff ? `Edit Permissions: ${editingStaff.name}` : 'Create New Admin / Staff User'}</span>
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venkat / Manager Name"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Email Address (Login ID)</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. venkat@anushatechnologies.com"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Password Credentials</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venkat@9948"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="admin-input w-full font-bold font-mono text-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Assign Role Privilege</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">👑 Master Super Admin</option>
                    <option value="HUB_MANAGER">🏬 Hub Branch Manager</option>
                    <option value="QUALITY_INSPECTOR">🔬 Quality Inspector</option>
                    <option value="PICKUP_AGENT">🚚 Pickup Dispatcher</option>
                    <option value="DELIVERY_AGENT">📦 Delivery Agent</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Assign Hub / Shop Branch</label>
                  <select
                    value={staffForm.assignedFacility}
                    onChange={(e) => setStaffForm({ ...staffForm, assignedFacility: e.target.value })}
                    className="admin-input w-full font-bold cursor-pointer"
                  >
                    <option value="Rajahmundry Central Hub">Rajahmundry Central Hub</option>
                    <option value="Kakinada Express Store">Kakinada Express Store</option>
                    <option value="Visakhapatnam Hub Branch">Visakhapatnam Hub Branch</option>
                    <option value="Master HQ — Rajahmundry Central Hub">Master HQ — Rajahmundry Central Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Module Access Permissions</label>
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-[var(--border-color)]">
                  {['ORDERS', 'PRICING', 'INVENTORY', 'STAFF', 'REPORTS', 'COUPONS', 'SETTINGS', 'AUDIT'].map((perm) => (
                    <label key={perm} className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold">
                      <input
                        type="checkbox"
                        checked={staffForm.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Admin Account & Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rider Cash Settlement Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-md w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)]">Rider Cash Settlement Desk</h3>
              <button onClick={() => setDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Select Rider</label>
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  className="admin-input w-full font-bold"
                >
                  <option value="stf-4">Vikram Singh (Rider #1)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Deposited Amount (₹)</label>
                <input
                  type="number"
                  value={depositedAmount}
                  onChange={(e) => setDepositedAmount(parseFloat(e.target.value) || 0)}
                  className="admin-input w-full font-bold text-emerald-600 text-lg"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
                <button onClick={() => setDepositModalOpen(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSettle} className="admin-btn-primary">
                  Settle Cash Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading RBAC directory & staff roster...</div>}>
      <StaffAndAdminManagementContent />
    </Suspense>
  );
}
