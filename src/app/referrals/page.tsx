'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

interface Settings {
  enabled: boolean; referrerReward: number; friendReward: number;
  minimumFirstOrder: number; minimumRedemptionOrder: number; rewardValidityDays: number; shareUrl: string;
}
interface Referral {
  id: string; status: string; reason?: string; referrerName: string; referrerPhone: string;
  friendName: string; friendPhone: string; orderId?: string; createdAt: string;
}
interface Reward {
  id: string; code: string; customerName: string; customerPhone: string; amount: number;
  status: string; referralStatus: string; orderId?: string; expiresAt: string;
}
interface Dashboard { settings: Settings | null; referrals: Referral[]; rewards: Reward[] }
const fields = [
  ['referrerReward', 'Inviter reward (INR)'], ['friendReward', 'Friend reward (INR, zero for none)'],
  ['minimumFirstOrder', 'Minimum first-order paid total (INR)'],
  ['minimumRedemptionOrder', 'Minimum item subtotal to redeem (INR)'],
  ['rewardValidityDays', 'Reward validity (days)'],
] as const;
type Field = typeof fields[number][0];

export default function ReferralsPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [values, setValues] = useState<Record<Field, string>>({ referrerReward: '', friendReward: '', minimumFirstOrder: '', minimumRedemptionOrder: '', rewardValidityDays: '' });
  const [shareUrl, setShareUrl] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await adminApi<Dashboard>('/referrals/admin');
      setData(result);
      if (result.settings) {
        setEnabled(result.settings.enabled);
        setShareUrl(result.settings.shareUrl);
        setValues(Object.fromEntries(fields.map(([key]) => [key, String(result.settings![key])])) as Record<Field, string>);
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load referral records.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const payload = { enabled, shareUrl, ...Object.fromEntries(fields.map(([key]) => [key, Number(values[key])])) };
      const settings = await adminApi<Settings>('/referrals/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
      setData(current => current ? { ...current, settings } : current);
      setNotice('Settings saved. Existing accepted invites keep their agreed reward terms.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save settings.'); }
    finally { setSaving(false); }
  };
  const matches = (values: (string | undefined)[]) => values.some(value => value?.toLowerCase().includes(search.trim().toLowerCase()));
  const referrals = data?.referrals.filter(item => (status === 'ALL' || item.status === status) && matches([item.referrerName, item.referrerPhone, item.friendName, item.friendPhone, item.orderId])) || [];
  const rewards = data?.rewards.filter(item => matches([item.customerName, item.customerPhone, item.code, item.orderId])) || [];
  return <main className="space-y-6">
    <header className="flex flex-wrap justify-between items-center gap-3">
      <div><h1 className="text-2xl font-bold">Refer & Earn</h1><p className="text-sm text-[var(--text-secondary)]">Configure the program and track actual referrals and reward coupons.</p></div>
      <button disabled={loading || saving} className="border rounded-lg px-4 py-2" onClick={() => void load()}>{loading ? 'Loading...' : 'Refresh and reconcile'}</button>
    </header>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {notice && <p role="status" className="text-green-600">{notice}</p>}
    {data && <>
      <form onSubmit={save} className="azea-card p-6 space-y-4">
        <h2 className="text-lg font-bold">Program settings</h2>
        {!data.settings && <p>No campaign configured. Enter your terms to enable referrals.</p>}
        <label className="flex items-center gap-3"><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />Accept new referrals</label>
        <div className="grid md:grid-cols-2 gap-4">{fields.map(([key, label]) => <label key={key} className="space-y-1">
          <span className="block text-sm">{label}</span><input required type="number" min={key === 'rewardValidityDays' ? 1 : 0}
            max={key === 'rewardValidityDays' ? 365 : key.includes('Reward') ? 10000 : 100000}
            step={key === 'rewardValidityDays' ? 1 : 0.01} value={values[key]} onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))}
            className="border rounded-lg p-2 w-full bg-transparent" />
        </label>)}</div>
        <label className="block space-y-1"><span className="text-sm">App download link (optional HTTPS URL)</span><input type="url" value={shareUrl} onChange={event => setShareUrl(event.target.value)} className="border rounded-lg p-2 w-full bg-transparent" /></label>
        <p className="text-sm text-[var(--text-secondary)]">Apply a code before the first order. The first non-cancelled order must be paid and delivered and meet the paid-total minimum. Rewards are single-use laundry discount coupons, never cash. Redemption minimum must exceed both reward amounts. Pausing prevents new referrals; accepted invites retain their terms.</p>
        <button disabled={saving || loading} className="rounded-lg px-5 py-2 bg-indigo-600 text-white">{saving ? 'Saving...' : 'Save program settings'}</button>
      </form>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="azea-card p-4">Accepted invites<strong className="block text-2xl">{data.referrals.length}</strong></div>
        <div className="azea-card p-4">Qualified referrals<strong className="block text-2xl">{data.referrals.filter(item => item.status === 'QUALIFIED').length}</strong></div>
        <div className="azea-card p-4">Available reward value<strong className="block text-2xl">INR {data.rewards.filter(item => item.status === 'AVAILABLE').reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></div>
      </div>
      <div className="flex flex-wrap gap-3"><input aria-label="Search referral records" placeholder="Search customer, phone, order or reward code" className="border rounded-lg p-3 flex-1 bg-transparent" value={search} onChange={event => setSearch(event.target.value)} />
        <select aria-label="Referral status" className="border rounded-lg p-3 bg-transparent" value={status} onChange={event => setStatus(event.target.value)}>{['ALL', 'PENDING', 'QUALIFIED', 'INELIGIBLE', 'REVERSED'].map(value => <option key={value}>{value}</option>)}</select></div>
      <section className="azea-card p-5 overflow-x-auto"><h2 className="font-bold mb-4">Referral history</h2>
        {!referrals.length && <p>No referral records match this view.</p>}
        <table className="w-full text-sm text-left"><thead><tr>{['Inviter', 'Friend', 'Status', 'Qualifying order', 'Accepted'].map(value => <th className="p-3" key={value}>{value}</th>)}</tr></thead><tbody>
          {referrals.map(item => <tr key={item.id} className="border-t"><td className="p-3">{item.referrerName}<br />{item.referrerPhone}</td><td className="p-3">{item.friendName}<br />{item.friendPhone}</td><td className="p-3">{item.status}<br />{item.reason}</td><td className="p-3">{item.orderId || 'Not qualified yet'}</td><td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}
        </tbody></table>
      </section>
      <section className="azea-card p-5 overflow-x-auto"><h2 className="font-bold mb-4">Reward ledger</h2>
        <p className="text-sm mb-3">Refunded or cancelled qualifying orders void unused rewards. Rewards already redeemed remain visible for review.</p>
        {!rewards.length && <p>No reward records match this view.</p>}
        <table className="w-full text-sm text-left"><thead><tr>{['Customer', 'Coupon', 'Value', 'Status', 'Used on order', 'Expires'].map(value => <th className="p-3" key={value}>{value}</th>)}</tr></thead><tbody>
          {rewards.map(item => <tr key={item.id} className="border-t"><td className="p-3">{item.customerName}<br />{item.customerPhone}</td><td className="p-3">{item.code}</td><td className="p-3">INR {item.amount.toFixed(2)}</td><td className="p-3">{item.status}{item.referralStatus === 'REVERSED' && <strong className="block text-red-600">Qualifying referral reversed</strong>}</td><td className="p-3">{item.orderId || '-'}</td><td className="p-3">{new Date(item.expiresAt).toLocaleDateString()}</td></tr>)}
        </tbody></table>
      </section>
    </>}
  </main>;
}
