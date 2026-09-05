'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

interface Purchase {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  planName: string;
  status: string;
  isActive: boolean;
  paymentStatus: string;
  paymentId?: string;
  amount: number;
  startDate: string;
  endDate: string;
  usedKg: number;
  remainingKg: number;
  includedKg: number;
}

export function PurchasedSubscriptions() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setPurchases(await adminApi<Purchase[]>('/subscriptions/purchases')); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load purchases.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = purchases.filter((purchase) =>
    (status === 'ALL' || purchase.status === status) &&
    [purchase.customerName, purchase.customerPhone, purchase.customerId, purchase.planName, purchase.paymentId]
      .some((value) => value?.toLowerCase().includes(search.trim().toLowerCase())));
  const date = (value: string) => Number.isFinite(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : 'Unavailable';

  return <section className="azea-card p-6 space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold">Purchased Customer Subscriptions</h2>
        <p className="text-sm text-[var(--text-secondary)]">{loading ? 'Loading purchases...' : `${purchases.length} purchases | ${purchases.filter((item) => item.isActive).length} active`}</p>
      </div>
      <button className="px-4 py-2 rounded-lg border" disabled={loading} onClick={() => void load()}>Refresh purchases</button>
    </div>
    <div className="flex flex-wrap gap-3">
      <input aria-label="Search purchased subscriptions" className="border rounded-lg px-3 py-2 flex-1 min-w-48 bg-transparent"
        placeholder="Customer name, phone, ID, plan or payment ID" value={search} onChange={(event) => setSearch(event.target.value)} />
      <select aria-label="Subscription status" className="border rounded-lg px-3 py-2 bg-transparent" value={status} onChange={(event) => setStatus(event.target.value)}>
        {['ALL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PAYMENT_PENDING', 'PENDING', 'SCHEDULED'].map((value) => <option key={value} value={value}>{value.replace(/_/g, ' ')}</option>)}
      </select>
    </div>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!error && !loading && filtered.length === 0 && <p>No purchased subscriptions match this view.</p>}
    {!error && <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead><tr className="border-b">{['Customer', 'Purchased plan', 'Status', 'Payment', 'Validity', 'KG allowance'].map((label) => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody>{filtered.map((purchase) => <tr key={purchase.id} className="border-b align-top">
          <td className="p-3"><strong>{purchase.customerName}</strong><div>{purchase.customerPhone}</div><div className="text-xs text-[var(--text-secondary)]">{purchase.customerId}</div></td>
          <td className="p-3"><strong>{purchase.planName}</strong><div className="text-xs text-[var(--text-secondary)]">{purchase.id}</div></td>
          <td className={`p-3 font-semibold ${purchase.isActive ? 'text-green-600' : ''}`}>{purchase.status.replace(/_/g, ' ')}</td>
          <td className="p-3"><div>INR {purchase.amount.toFixed(2)} | {purchase.paymentStatus}</div><div className="text-xs">{purchase.paymentId || 'No payment reference'}</div></td>
          <td className="p-3 whitespace-nowrap">{date(purchase.startDate)}<br />to {date(purchase.endDate)}</td>
          <td className="p-3">{purchase.remainingKg} / {purchase.includedKg} KG remaining<br />{purchase.usedKg} KG used</td>
        </tr>)}</tbody>
      </table>
    </div>}
  </section>;
}
