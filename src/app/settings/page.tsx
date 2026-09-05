'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Cloud,
  CreditCard,
  DollarSign,
  KeyRound,
  MapPin,
  MessageSquare,
  Percent,
  Save,
  Settings,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getAdminSettings, updateAdminSettings } from '@/lib/api';

export default function AdminSettingsPage() {
  const { showToast } = useApp();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Operational & Financial Settings
  const [form, setForm] = useState({
    storeTimings: '7:00 AM – 10:00 PM',
    minOrderValue: 199,
    freeDeliveryThreshold: 299,
    standardDeliveryFee: 40,
    expressDeliveryFee: 99,
    taxPercentage: 18,
    isGstEnabled: true,
    whatsappNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    emailNotificationsEnabled: true,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const settings = await getAdminSettings();
        if (settings && active) {
          setForm({
            storeTimings: settings.storeTimings || '7:00 AM – 10:00 PM',
            minOrderValue: typeof settings.minOrderValue === 'number' ? settings.minOrderValue : 199,
            freeDeliveryThreshold: typeof settings.freeDeliveryThreshold === 'number' ? settings.freeDeliveryThreshold : 299,
            standardDeliveryFee: typeof settings.standardDeliveryFee === 'number' ? settings.standardDeliveryFee : 40,
            expressDeliveryFee: typeof settings.expressDeliveryFee === 'number' ? settings.expressDeliveryFee : 99,
            taxPercentage: typeof settings.taxPercentage === 'number' ? settings.taxPercentage : 18,
            isGstEnabled: settings.isGstEnabled !== false,
            whatsappNotificationsEnabled: settings.whatsappNotificationsEnabled !== false,
            smsNotificationsEnabled: settings.smsNotificationsEnabled !== false,
            emailNotificationsEnabled: settings.emailNotificationsEnabled !== false,
          });
        }
      } catch (err: any) {
        console.warn('Could not fetch admin settings:', err?.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateAdminSettings({
        storeTimings: form.storeTimings.trim(),
        minOrderValue: Number(form.minOrderValue) || 199,
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold) || 299,
        standardDeliveryFee: Number(form.standardDeliveryFee) || 40,
        expressDeliveryFee: Number(form.expressDeliveryFee) || 99,
        taxPercentage: Number(form.taxPercentage) || 0,
        isGstEnabled: form.isGstEnabled,
        whatsappNotificationsEnabled: form.whatsappNotificationsEnabled,
        smsNotificationsEnabled: form.smsNotificationsEnabled,
        emailNotificationsEnabled: form.emailNotificationsEnabled,
      });
      showToast('Operational rules and financial settings saved successfully to MySQL.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save operational settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const integrations = [
    {
      name: 'Fast2SMS Indian OTP Gateway',
      detail: 'Recharged wallet (Rs 150 balance, 600 SMS). Direct OTP & milestone SMS dispatch to Indian mobiles.',
      icon: MessageSquare,
      status: 'Connected & Active',
      statusColor: 'text-[#16A34A]',
    },
    {
      name: 'Razorpay Payment Gateway',
      detail: 'UPI, Debit/Credit Card, NetBanking & Wallets enabled via live server keys.',
      icon: CreditCard,
      status: 'Environment Managed',
      statusColor: 'text-[#16A34A]',
    },
    {
      name: 'Google Maps Geocoding',
      detail: 'Reverse geocoding and delivery distance lookup enabled via GOOGLE_MAPS_SERVER_KEY.',
      icon: MapPin,
      status: 'Active',
      statusColor: 'text-[#16A34A]',
    },
    {
      name: 'AWS S3 Cloud Media Storage',
      detail: 'High-speed cloud image delivery for garment photos and categories in ap-south-2 (anjanilaundry).',
      icon: Cloud,
      status: 'Active',
      statusColor: 'text-[#16A34A]',
    },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Hero Section */}
      <section className="azea-card overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#17312A] to-[#166534] text-white">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 grid place-items-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200 font-bold">Platform Control & Operations</p>
              <h1 className="mt-1 text-2xl font-bold font-poppins">Operational Settings & Revenue Rules</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200 leading-6">
                Configure store operating hours, free delivery thresholds, express turnaround surcharges, tax policies, and communication delivery channels.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Settings are securely persisted to the AWS RDS MySQL database.</span>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving || loading}
            className="admin-btn-primary inline-flex items-center justify-center gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </section>

      {/* 1. Operational Rules Card */}
      <section className="azea-card p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3 border-b border-[var(--border-color)] pb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 grid place-items-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[var(--heading-color)]">Operating Hours & Delivery Rules</h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Control doorstep pickup timings, delivery fees, and order minimums.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Store Operating Timings
            </label>
            <input
              type="text"
              value={form.storeTimings}
              onChange={(e) => setForm({ ...form, storeTimings: e.target.value })}
              placeholder="e.g. 7:00 AM – 10:00 PM"
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Visible on customer app support & slots.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Free Delivery Threshold (₹)
            </label>
            <input
              type="number"
              value={form.freeDeliveryThreshold}
              onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Orders above this amount get free delivery.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Standard Delivery Fee (₹)
            </label>
            <input
              type="number"
              value={form.standardDeliveryFee}
              onChange={(e) => setForm({ ...form, standardDeliveryFee: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Applied when order is below threshold.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Express 24h Surcharge (₹)
            </label>
            <input
              type="number"
              value={form.expressDeliveryFee}
              onChange={(e) => setForm({ ...form, expressDeliveryFee: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Added for express rush processing.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Minimum Order Value (₹)
            </label>
            <input
              type="number"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Minimum checkout amount.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-purple-600" />
              GST Tax Percentage (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={form.taxPercentage}
                onChange={(e) => setForm({ ...form, taxPercentage: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-transparent text-sm font-medium focus:border-emerald-500 focus:outline-none"
              />
              <label className="flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isGstEnabled}
                  onChange={(e) => setForm({ ...form, isGstEnabled: e.target.checked })}
                  className="h-4 w-4 accent-[#16A34A]"
                />
                Enabled
              </label>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Standard laundry GST is 18%.</p>
          </div>
        </div>
      </section>

      {/* 2. Notification Channels */}
      <section className="azea-card p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3 border-b border-[var(--border-color)] pb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 grid place-items-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[var(--heading-color)]">Customer Notification Channels</h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Toggle delivery notification pipelines for order milestones.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] p-4 cursor-pointer hover:border-emerald-300 transition-colors">
            <div>
              <span className="text-sm font-semibold text-[var(--heading-color)] block">WhatsApp Updates</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Milestone weigh bills & delivery links</span>
            </div>
            <input
              type="checkbox"
              checked={form.whatsappNotificationsEnabled}
              onChange={(e) => setForm({ ...form, whatsappNotificationsEnabled: e.target.checked })}
              className="h-4 w-4 accent-[#16A34A]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] p-4 cursor-pointer hover:border-emerald-300 transition-colors">
            <div>
              <span className="text-sm font-semibold text-[var(--heading-color)] block">SMS OTP & Alerts</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Fast2SMS Indian gateway delivery</span>
            </div>
            <input
              type="checkbox"
              checked={form.smsNotificationsEnabled}
              onChange={(e) => setForm({ ...form, smsNotificationsEnabled: e.target.checked })}
              className="h-4 w-4 accent-[#16A34A]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] p-4 cursor-pointer hover:border-emerald-300 transition-colors">
            <div>
              <span className="text-sm font-semibold text-[var(--heading-color)] block">Email Receipts</span>
              <span className="text-[11px] text-[var(--text-secondary)]">PDF tax invoices via SMTP Gmail</span>
            </div>
            <input
              type="checkbox"
              checked={form.emailNotificationsEnabled}
              onChange={(e) => setForm({ ...form, emailNotificationsEnabled: e.target.checked })}
              className="h-4 w-4 accent-[#16A34A]"
            />
          </label>
        </div>
      </section>

      {/* 3. Connected Integrations Status */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Live Integrated Cloud Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(({ name, detail, icon: Icon, status, statusColor }) => (
            <article key={name} className="azea-card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#16A34A] grid place-items-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[var(--heading-color)]">{name}</h3>
                  <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold ${statusColor}`}>
                    <CheckCircle2 className="w-3 h-3" /> {status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
