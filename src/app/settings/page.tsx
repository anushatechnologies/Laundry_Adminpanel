'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, Cloud, CreditCard, KeyRound, MapPin, Save, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const integrations = [
  {
    name: 'Razorpay payments',
    detail: 'Enable by setting RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the API server.',
    icon: CreditCard,
  },
  {
    name: 'Google Maps lookup',
    detail: 'Enable server-side reverse geocoding with GOOGLE_MAPS_SERVER_KEY.',
    icon: MapPin,
  },
  {
    name: 'Media storage',
    detail: 'Configure AWS_REGION, AWS_S3_BUCKET_NAME, and server-side AWS credentials for S3.',
    icon: Cloud,
  },
  {
    name: 'Admin API access',
    detail: 'Set ADMIN_API_TOKEN on the backend and the admin server only. It is never exposed to browsers.',
    icon: KeyRound,
  },
];

export default function AdminSettingsPage() {
  const { showToast } = useApp();
  const [notifications, setNotifications] = useState({ whatsapp: true, sms: false, email: true });

  return (
    <div className="max-w-5xl space-y-6">
      <section className="azea-card overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#17312A] to-[#166534] text-white">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 grid place-items-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200 font-bold">Platform control</p>
              <h1 className="mt-1 text-2xl font-bold font-poppins">Configuration that keeps secrets private</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200 leading-6">
                Operational preferences belong in the console. Credentials belong in the deployment environment and are never rendered, stored, or edited in this browser.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Secrets are managed server-side with environment variables.</span>
          </div>
          <button
            type="button"
            onClick={() => showToast('No credentials are stored in the admin console. Update deployment environment variables, then restart the API.', 'info')}
            className="admin-btn-secondary inline-flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Integration setup guide
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(({ name, detail, icon: Icon }) => (
          <article key={name} className="azea-card p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#16A34A] grid place-items-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-[var(--heading-color)]">{name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-3 h-3" /> Environment managed
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="azea-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 grid place-items-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[var(--heading-color)]">Notification preferences</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">Choose which channels are enabled once a verified provider is configured.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            ['whatsapp', 'WhatsApp updates'],
            ['sms', 'SMS fallback'],
            ['email', 'Email receipts'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] p-4 cursor-pointer hover:border-emerald-300 transition-colors">
              <span className="text-sm font-semibold text-[var(--heading-color)]">{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(event) => setNotifications((current) => ({ ...current, [key]: event.target.checked }))}
                className="h-4 w-4 accent-[#16A34A]"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => showToast('Notification preferences saved for this console session. Connect a notification provider to persist delivery rules.', 'success')}
            className="admin-btn-primary inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save preferences
          </button>
        </div>
      </section>
    </div>
  );
}
