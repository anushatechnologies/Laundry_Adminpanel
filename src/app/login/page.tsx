'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, ArrowRight, Crown, LayoutDashboard, FlaskConical } from 'lucide-react';

type Role = 'SUPER_ADMIN' | 'HUB_MANAGER' | 'QC_LEAD';

const ROLES: { id: Role; label: string; sub: string; icon: React.ReactNode; redirect: string; grad: string; glow: string }[] = [
  {
    id: 'SUPER_ADMIN',
    label: 'Super Admin',
    sub: 'Full access · All hubs',
    icon: <Crown className="w-4 h-4" />,
    redirect: '/',
    grad: 'from-amber-500 via-orange-500 to-red-500',
    glow: '0 0 24px rgba(251,146,60,0.4)',
  },
  {
    id: 'HUB_MANAGER',
    label: 'Hub Manager',
    sub: 'Orders · Pickups · Delivery',
    icon: <LayoutDashboard className="w-4 h-4" />,
    redirect: '/orders',
    grad: 'from-sky-500 via-blue-500 to-indigo-600',
    glow: '0 0 24px rgba(56,189,248,0.4)',
  },
  {
    id: 'QC_LEAD',
    label: 'QC Lead',
    sub: 'Processing · Quality Check',
    icon: <FlaskConical className="w-4 h-4" />,
    redirect: '/processing',
    grad: 'from-violet-500 via-purple-500 to-fuchsia-600',
    glow: '0 0 24px rgba(167,139,250,0.4)',
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [role, setRole]         = useState<Role>('SUPER_ADMIN');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [ready, setReady]       = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const active = ROLES.find((r) => r.id === role)!;

  useEffect(() => {
    fetch('/api/session', { cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (d.authenticated) router.replace('/');
        else setReady(true);
      })
      .catch(() => setReady(true));
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.authenticated) throw new Error(data.message || 'Invalid email or password.');
      // persist role for dashboard filtering
      localStorage.setItem('adminRole', role);
      localStorage.setItem('adminEmail', email.trim());
      router.replace(active.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* ── Background photo ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/laundry-bg.jpg"
          alt="LaundryFresh facility"
          fill priority quality={95}
          className="object-cover object-center"
          style={{ filter: 'brightness(0.4) saturate(1.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </div>

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-sky-600/10 blur-[180px]" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-violet-700/10 blur-[180px]" />
      </div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full mx-4" style={{ maxWidth: 440 }}>

        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-1"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)' }}
          >
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
              <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="3" fill="white" fillOpacity="0.9" />
              <path d="M16 4 A12 12 0 0 1 28 16" stroke="white" strokeWidth="2" strokeLinecap="round"
                className="origin-center animate-spin" style={{ animationDuration: '3s' }} />
            </svg>
          </div>
          <h1 className="text-[28px] font-black text-white tracking-tight">LaundryFresh Admin</h1>
          <p className="text-xs text-white/35 tracking-widest uppercase font-semibold">Operations Console · Anusha Technologies</p>
        </div>

        {/* Glass Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10,15,28,0.80)',
            backdropFilter: 'blur(48px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >

          {/* ── Role Selector ── */}
          <div className="p-5 pb-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Choose a starting workspace</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id); setError(''); }}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden"
                    style={{
                      background: isActive ? undefined : 'rgba(255,255,255,0.04)',
                      border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive ? r.glow : 'none',
                      transform: isActive ? 'scale(1.04)' : 'scale(1)',
                    }}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${r.grad} opacity-20`} />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-white/40'} transition-colors`}>
                      {r.icon}
                    </span>
                    <span className={`relative z-10 text-[10px] font-black leading-tight text-center ${isActive ? 'text-white' : 'text-white/35'} transition-colors`}>
                      {r.label.split(' ')[0]}<br />
                      <span className="font-semibold">{r.label.split(' ')[1]}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Workspace caption: permissions remain controlled by the server session. */}
            <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${active.grad} animate-pulse`} />
              <p className="text-[11px] text-white/50 font-semibold">{active.sub} · Server-verified access</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 mx-5 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* ── Form ── */}
          <div className="px-5 pb-5">
            {!ready ? (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
                <p className="text-xs text-white/25">Checking session…</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3.5" noValidate>

                {/* Email */}
                <div>
                  <label htmlFor="adm-email" className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/35 mb-1.5">
                    Work email (audit context)
                  </label>
                  <input
                    id="adm-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourcompany.com"
                    className="w-full h-12 rounded-xl px-4 text-sm text-white placeholder:text-white/20 outline-none font-medium transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: email ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.09)',
                      boxShadow: email ? '0 0 0 3px rgba(255,255,255,0.04)' : 'none',
                    }}
                    onFocus={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.3)'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
                    onBlur={(e) => { e.target.style.border = email ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.09)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="adm-password" className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/35 mb-1.5">
                    Password
                  </label>
                  <div
                    className="flex items-center rounded-xl px-4 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: password ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.09)',
                    }}
                  >
                    <input
                      id="adm-password"
                      type={showPwd ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none font-mono tracking-widest"
                    />
                    <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-white/25 hover:text-white/60 transition-colors cursor-pointer shrink-0">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                    ⚠ {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className={`w-full h-12 flex items-center justify-center gap-2.5 rounded-xl font-black text-sm text-white mt-1 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group bg-gradient-to-r ${active.grad}`}
                  style={{ boxShadow: loading || !email || !password ? 'none' : active.glow }}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                  ) : (
                    <>{active.icon} Sign in as {active.label} <ArrowRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-white/18 mt-5 font-mono tracking-widest uppercase">
          256-bit encrypted · Anusha Technologies © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
