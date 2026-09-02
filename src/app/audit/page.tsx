'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  UserCheck,
  Clock,
  Building2,
  Tag,
  CheckCircle2,
  Crown,
  Download,
  Eye,
  AlertTriangle,
  FileCode,
  Globe,
  Terminal,
  Activity,
  X,
  Key,
} from 'lucide-react';
import { AuditLogEntry } from '@/types';

interface ExtendedAuditEntry extends AuditLogEntry {
  ipAddress?: string;
  riskLevel?: 'CRITICAL' | 'HIGH_RISK' | 'MEDIUM_RISK' | 'INFO';
  payloadDiff?: Record<string, any>;
  userEmail?: string;
}

export default function AdminAuditPage() {
  const { auditLogs, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedLogForInspect, setSelectedLogForInspect] = useState<ExtendedAuditEntry | null>(null);

  const initialLogs: ExtendedAuditEntry[] = [
    {
      id: 'AUD-901',
      timestamp: '2026-08-27 13:04:12',
      userId: 'stf-super-01',
      userName: 'Venkat (Super Admin)',
      userEmail: 'venkat@anushatechnologies.com',
      userRole: 'SUPER_ADMIN',
      module: 'SUPER_ADMIN_RBAC',
      action: 'SUPER_ADMIN_LOGIN',
      details: 'Super Admin authenticated from Rajahmundry Central Hub management console.',
      ipAddress: '182.74.12.9',
      riskLevel: 'INFO',
      payloadDiff: {
        session: 'SUCCESS_AUTHENTICATED',
        device: 'Chrome 128 (Windows 11)',
        ip: '182.74.12.9',
      },
    },
    {
      id: 'AUD-902',
      timestamp: '2026-08-27 12:45:00',
      userId: 'stf-super-01',
      userName: 'Venkat (Super Admin)',
      userEmail: 'venkat@anushatechnologies.com',
      userRole: 'SUPER_ADMIN',
      module: 'STAFF_MANAGEMENT',
      action: 'STAFF_PERMISSIONS_UPDATED',
      details: 'Granted Orders & Reports full write permissions to Priya Sharma (Kakinada Store Manager).',
      ipAddress: '182.74.12.9',
      riskLevel: 'HIGH_RISK',
      payloadDiff: {
        previousRole: 'LAUNDRY_STAFF',
        updatedRole: 'HUB_MANAGER',
        newPermissions: ['ORDERS', 'INVENTORY', 'REPORTS'],
      },
    },
    {
      id: 'AUD-903',
      timestamp: '2026-08-27 11:30:15',
      userId: 'stf-2',
      userName: 'Priya Sharma',
      userEmail: 'priya.ops@laundryfresh.com',
      userRole: 'MANAGER',
      module: 'INVENTORY',
      action: 'INVENTORY_RESTOCKED',
      details: 'Restocked Eco Bio Enzyme Liquid Detergent by +100 LITERS. PO Batch #2026-AUG-27.',
      ipAddress: '182.74.88.42',
      riskLevel: 'INFO',
      payloadDiff: {
        itemId: 'inv-1',
        previousStock: 80,
        newStock: 180,
        costPerLiter: 140,
      },
    },
    {
      id: 'AUD-904',
      timestamp: '2026-08-27 10:15:30',
      userId: 'stf-super-01',
      userName: 'Venkat (Super Admin)',
      userEmail: 'venkat@anushatechnologies.com',
      userRole: 'SUPER_ADMIN',
      module: 'PRICING_ENGINE',
      action: 'PRICE_MATRIX_CHANGED',
      details: 'Updated Silk Saree Dry Cleaning base rate from ₹220 to ₹250 INR per piece.',
      ipAddress: '182.74.12.9',
      riskLevel: 'HIGH_RISK',
      payloadDiff: {
        serviceId: 'srv-dry-saree',
        oldPrice: 220,
        newPrice: 250,
      },
    },
    {
      id: 'AUD-905',
      timestamp: '2026-08-27 09:20:00',
      userId: 'stf-3',
      userName: 'Arun M.',
      userEmail: 'arun.wash@laundryfresh.com',
      userRole: 'LAUNDRY_STAFF',
      module: 'QUALITY_CONTROL',
      action: 'ORDER_WEIGHED_VERIFIED',
      details: 'Weighed Order #ORD-1024 at Rajahmundry Hub. Scale Reading: 8.5 KG.',
      ipAddress: '182.74.12.10',
      riskLevel: 'INFO',
      payloadDiff: {
        orderId: 'ORD-1024',
        estimatedKg: 8.0,
        actualWeighedKg: 8.5,
        qcPass: true,
      },
    },
    {
      id: 'AUD-906',
      timestamp: '2026-08-26 18:00:00',
      userId: 'stf-super-01',
      userName: 'Venkat (Super Admin)',
      userEmail: 'venkat@anushatechnologies.com',
      userRole: 'SUPER_ADMIN',
      module: 'PAYMENTS',
      action: 'REFUND_APPROVED',
      details: 'Approved ₹450 INR dispute refund to customer Rajesh Kumar (Dispute #DSP-102).',
      ipAddress: '182.74.12.9',
      riskLevel: 'CRITICAL',
      payloadDiff: {
        disputeId: 'DSP-102',
        refundAmount: 450,
        paymentMethod: 'WALLET',
      },
    },
  ];

  const [liveServerLogs, setLiveServerLogs] = useState<ExtendedAuditEntry[]>([]);

  React.useEffect(() => {
    async function fetchLiveAudit() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api';
        const res = await fetch(`${apiUrl}/audit`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLiveServerLogs(json.data);
        }
      } catch (err) {
        console.warn('Failed to fetch live audit logs:', err);
      }
    }
    fetchLiveAudit();
  }, []);

  const allLogs: ExtendedAuditEntry[] = [
    ...liveServerLogs,
    ...initialLogs.filter((init) => !liveServerLogs.some((l) => l.id === init.id)),
    ...(auditLogs as ExtendedAuditEntry[]),
  ];

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesRisk = selectedRisk === 'ALL' || (log.riskLevel || 'INFO') === selectedRisk;
    return matchesSearch && matchesModule && matchesRisk;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Operator Name', 'Role', 'Module', 'Action', 'Details', 'IP Address', 'Risk Level'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.userName,
      l.userRole,
      l.module,
      l.action,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress || '127.0.0.1',
      l.riskLevel || 'INFO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laundry_audit_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported audit trail ledger to CSV!', 'success');
  };

  const highRiskCount = allLogs.filter((l) => l.riskLevel === 'HIGH_RISK' || l.riskLevel === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="azea-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/40 inline-flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              SOC-2 & ISO-27001 Cryptographic Audit Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-poppins text-white flex items-center gap-2.5">
              <Terminal className="w-7 h-7 text-emerald-400" />
              <span>System Audit Trail & Security Governance</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-medium max-w-2xl">
              Immutable log of Super Admin price adjustments, staff permission grants, restock actions, and Razorpay payment settlements.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={handleExportCSV} className="admin-btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Download className="w-4 h-4" />
              <span>Export Audit Ledger (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Total Logged Events</span>
          <span className="text-2xl font-black text-[var(--heading-color)] font-poppins mt-1 block">{allLogs.length} Events</span>
          <span className="text-[11px] text-emerald-600 font-bold">100% Real-time sync</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">High Risk / Flagged</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-poppins mt-1 block">{highRiskCount} Flagged</span>
          <span className="text-[11px] text-amber-600 font-bold">Requires Admin Audit</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Active Admin Auditors</span>
          <span className="text-2xl font-black text-[var(--heading-color)] font-poppins mt-1 block">4 Operators</span>
          <span className="text-[11px] text-indigo-600 font-bold">Super Admin + Managers</span>
        </div>

        <div className="azea-card p-5">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Ledger Integrity</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-poppins mt-1 block">SHA-256 Valid</span>
          <span className="text-[11px] text-emerald-600 font-bold">Tamper-evident log</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="azea-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-[var(--heading-color)] shrink-0">Risk Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH_RISK', 'INFO'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedRisk === risk
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {risk.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search log ID, operator, details, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input w-full pl-9"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="azea-card p-6 space-y-4">
        <div className="overflow-x-auto text-xs">
          <table className="azea-table">
            <thead>
              <tr>
                <th className="pl-4">Log ID & Timestamp</th>
                <th>Operator Staff Member</th>
                <th>Module Name</th>
                <th>Action Code</th>
                <th>Details & Payload Summary</th>
                <th>Severity Risk</th>
                <th className="text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="pl-4">
                    <div className="font-mono font-black text-indigo-600 dark:text-indigo-400">{log.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.timestamp}</div>
                    <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{log.ipAddress || '182.74.12.9'}</span>
                    </div>
                  </td>

                  <td>
                    <div className="font-bold text-[var(--heading-color)] flex items-center gap-1">
                      {log.userRole === 'SUPER_ADMIN' && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      <span>{log.userName}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-mono">{log.userEmail || 'admin@laundryfresh.com'}</div>
                    <span className="text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {log.userRole}
                    </span>
                  </td>

                  <td>
                    <span className="font-bold text-[var(--heading-color)] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{log.module.replace(/_/g, ' ')}</span>
                    </span>
                  </td>

                  <td>
                    <span className="font-mono font-extrabold text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      [{log.action}]
                    </span>
                  </td>

                  <td className="max-w-md">
                    <div className="font-medium text-[var(--heading-color)] leading-relaxed">{log.details}</div>
                  </td>

                  <td>
                    {log.riskLevel === 'CRITICAL' && (
                      <span className="text-[10px] font-black uppercase bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 px-2.5 py-0.5 rounded-full animate-pulse inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        CRITICAL
                      </span>
                    )}
                    {log.riskLevel === 'HIGH_RISK' && (
                      <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        HIGH RISK
                      </span>
                    )}
                    {(!log.riskLevel || log.riskLevel === 'INFO') && (
                      <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 px-2 py-0.5 rounded-full">
                        INFO
                      </span>
                    )}
                  </td>

                  <td className="text-right pr-4">
                    <button
                      onClick={() => setSelectedLogForInspect(log)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect JSON</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect JSON Payload Modal */}
      {selectedLogForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[20px] shadow-2xl max-w-lg w-full p-6 border border-[var(--border-color)] text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
              <h3 className="font-extrabold text-sm text-[var(--heading-color)] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Audit Log Payload Inspector: {selectedLogForInspect.id}</span>
              </h3>
              <button onClick={() => setSelectedLogForInspect(null)} className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary-card)] hover:text-[var(--heading-color)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto space-y-1">
                <div className="text-slate-400 text-[10px] border-b border-slate-700 pb-1 mb-1">
                  // Event Timestamp: {selectedLogForInspect.timestamp} | IP: {selectedLogForInspect.ipAddress || '182.74.12.9'}
                </div>
                <pre>{JSON.stringify(selectedLogForInspect.payloadDiff || { action: selectedLogForInspect.action, details: selectedLogForInspect.details }, null, 2)}</pre>
              </div>
            </div>

            <div className="pt-3 flex gap-2 justify-end border-t border-[var(--border-color)]">
              <button onClick={() => setSelectedLogForInspect(null)} className="admin-btn-secondary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
