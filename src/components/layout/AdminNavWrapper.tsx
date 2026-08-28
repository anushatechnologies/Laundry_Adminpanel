'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTheme, AdminTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Layers,
  Sparkles,
  Tag,
  CreditCard,
  Users,
  MapPin,
  BarChart3,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  Wrench,
  DollarSign,
  ArrowUpRight,
  ChevronDown,
  Building2,
  Clock,
  PackageCheck,
  MessageSquare,
  ShieldAlert,
  Sun,
  Moon,
  Leaf,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  HelpCircle,
  LogOut,
  Shirt,
  Box,
  FileSpreadsheet,
  Scale,
} from 'lucide-react';

function SidebarNavItems({
  navGroups,
  collapsed,
  setSidebarOpen,
}: {
  navGroups: any[];
  collapsed: boolean;
  setSidebarOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') || '' : '';

  const checkIsActive = (itemHref: string) => {
    const [basePath, queryStr] = itemHref.split('?');
    if (pathname !== basePath) return false;
    if (!queryStr) return !currentTab;
    const itemTab = new URLSearchParams(queryStr).get('tab');
    return currentTab === itemTab;
  };

  return (
    <div className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
      {navGroups.map((grp) => (
        <div key={grp.group} className="space-y-1">
          {!collapsed && (
            <div className="px-2.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              {grp.group}
            </div>
          )}
          {grp.items.map((item: any) => {
            const isActive = checkIsActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 via-blue-600/15 to-transparent text-blue-400 font-extrabold border-l-3 border-blue-500 shadow-2xs'
                    : 'text-slate-400 font-medium hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white font-black'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export const AdminNavWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole, currentUser } = useApp();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [accessState, setAccessState] = useState<'checking' | 'granted' | 'denied'>('checking');

  const isLoginPage = pathname === '/login';
  const customerWebUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

  useEffect(() => {
    if (isLoginPage) {
      setAccessState('granted');
      return;
    }

    let active = true;
    fetch('/api/session', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.ok && payload.authenticated) setAccessState('granted');
        else {
          setAccessState('denied');
          router.replace('/login');
        }
      })
      .catch(() => {
        if (!active) return;
        setAccessState('denied');
        router.replace('/login');
      });

    return () => {
      active = false;
    };
  }, [isLoginPage, router]);

  const handleSignOut = async () => {
    await fetch('/api/session', { method: 'DELETE' }).catch(() => undefined);
    router.replace('/login');
  };

  // Grouped Navigation per Exact Specification with Unique Hrefs & Query Tabs
  const navGroups = [
    {
      group: 'MAIN',
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      group: 'OPERATIONS',
      items: [
        { name: 'Orders', href: '/orders', icon: ShoppingBag, badge: 'Live' },
        { name: 'Pickup Dispatch', href: '/pickups', icon: Truck },
        { name: 'Pickup Slots', href: '/slots', icon: Clock, badge: 'Capacity' },
        { name: 'Delivery Dispatch', href: '/deliveries', icon: Truck },
        { name: 'Regional Hubs', href: '/hubs', icon: Building2, badge: 'Stores' },
        { name: 'Processing Plant', href: '/processing', icon: Wrench, badge: 'Kanban' },
        { name: 'Quality Control', href: '/processing?tab=qc', icon: ShieldCheck, badge: '8-Pt' },
        { name: 'Disputes', href: '/disputes', icon: ShieldAlert, badge: 'Claims' },
      ],
    },
    {
      group: 'CATALOG & PRICING',
      items: [
        { name: 'Cloth Types', href: '/pricing?tab=cloths', icon: Shirt },
        { name: 'Services', href: '/services', icon: Layers },
        { name: 'Pricing Matrix', href: '/pricing', icon: DollarSign, badge: '2D Grid' },
        { name: 'Bulk / KG Pricing', href: '/pricing/bulk', icon: Scale, badge: 'Slabs' },
        { name: 'Pincodes & Coverage', href: '/pincodes', icon: MapPin },
        { name: 'Delivery Charges', href: '/delivery-settings', icon: Truck, badge: 'Distance' },
      ],
    },
    {
      group: 'MARKETING',
      items: [
        { name: 'Coupons & Offers', href: '/coupons', icon: Tag },
        { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
        { name: 'Loyalty & Wallet', href: '/subscriptions?tab=loyalty', icon: Sparkles },
      ],
    },
    {
      group: 'INVENTORY',
      items: [
        { name: 'Consumables', href: '/inventory', icon: PackageCheck, badge: 'Stock' },
        { name: 'Packaging', href: '/inventory?tab=packaging', icon: Box },
        { name: 'Machines', href: '/inventory?tab=machines', icon: Wrench },
        { name: 'Maintenance', href: '/inventory?tab=maintenance', icon: Settings },
      ],
    },
    {
      group: 'PEOPLE',
      items: [
        { name: 'Customers', href: '/staff?tab=customers', icon: Users },
        { name: 'Staff', href: '/staff', icon: UserCheck },
        { name: 'In-House Drivers', href: '/staff?tab=drivers', icon: Truck, badge: 'Fleet' },
      ],
    },
    {
      group: 'REPORTS',
      items: [
        { name: 'Sales Reports', href: '/reports', icon: BarChart3 },
        { name: 'Order Reports', href: '/reports?tab=orders', icon: FileSpreadsheet },
        { name: 'Customer Reports', href: '/reports?tab=customers', icon: Users },
        { name: 'Operations Analytics', href: '/reports?tab=analytics', icon: BarChart3, badge: 'BI' },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { name: 'Notifications', href: '/notifications', icon: MessageSquare },
        { name: 'Audit Logs', href: '/audit', icon: ShieldAlert },
        { name: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  if (isLoginPage) return <>{children}</>;

  if (accessState !== 'granted') {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg-page)] p-6 text-center">
        <div>
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-[#16A34A]" />
          <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">Securing your operations console…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar: 250px (expanded) or 72px (collapsed) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--bg-sidebar)] text-slate-300 flex flex-col justify-between transition-all duration-300 border-r border-slate-800 ${
          collapsed ? 'w-[72px]' : 'w-[250px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-[8px] bg-[#16A34A] flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                🧺
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="font-extrabold text-base text-white tracking-tight font-poppins">
                    Laundry<span className="text-[#16A34A]">Fresh</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block -mt-1 font-semibold uppercase tracking-wider">
                    DOORSTEP CLEAN & CARE
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse toggle desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-[6px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <Suspense fallback={<div className="flex-1 px-2.5 py-4" />}>
            <SidebarNavItems navGroups={navGroups} collapsed={collapsed} setSidebarOpen={setSidebarOpen} />
          </Suspense>

          {/* Bottom Footer Section */}
          <div className="p-2.5 border-t border-slate-800 bg-[#070B14] shrink-0 space-y-2">
            {!collapsed && (
              <a
                href={customerWebUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-[8px] transition-all"
              >
                <span>Website (Port 3000)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            )}

            <div className="flex items-center gap-2 px-1 py-1">
              <div className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center font-bold text-white text-[11px] shrink-0">
                SA
              </div>
              {!collapsed && (
                <div className="truncate flex-1">
                  <div className="font-bold text-white text-xs truncate">Super Administrator</div>
                  <div className="text-[10px] text-slate-400 truncate">LaundryFresh Operations</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-[250px]'
        }`}
      >
        {/* Top Header (64px) */}
        <header className="h-16 bg-[var(--bg-header)] border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-[var(--heading-color)] rounded-[8px] border border-[var(--border-color)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar (320px) */}
            <div className="hidden sm:flex items-center bg-[var(--input-bg)] border border-[var(--input-border)] px-3 py-1.5 rounded-[10px] text-xs gap-2 text-slate-600 dark:text-slate-300 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] w-72 lg:w-80 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, customers, garments..."
                className="bg-transparent focus:outline-none w-full text-xs font-medium text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Component (Light, Dark, Green) */}
            <div className="flex items-center bg-[var(--bg-secondary-card)] border border-[var(--border-color)] rounded-[8px] p-0.5">
              <button
                onClick={() => setTheme('light')}
                title="Light Theme"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  theme === 'light'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Dark Theme"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#22C55E] text-slate-950 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('green')}
                title="Laundry Green Brand Mode"
                className={`p-1.5 rounded-[6px] transition-colors ${
                  theme === 'green'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-[8px] bg-[var(--bg-secondary-card)] border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] flex items-center justify-center relative cursor-pointer transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#16A34A] absolute top-2 right-2 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-[var(--bg-card)] rounded-[14px] shadow-xl border border-[var(--border-color)] py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setNotificationsOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[var(--border-color)] flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--heading-color)]">Notifications</span>
                    <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-1.5 py-0.2 rounded">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--border-color)] text-xs">
                    <div className="p-3 hover:bg-[var(--bg-secondary-card)] transition-colors">
                      <div className="font-bold text-[var(--heading-color)]">🔔 New Order #LF10245</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">2 mins ago • Central Hub</div>
                    </div>
                    <div className="p-3 hover:bg-[var(--bg-secondary-card)] transition-colors">
                      <div className="font-bold text-amber-600">⚠️ Pickup Slot 80% Full</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">Slot 10:00 AM - 12:00 PM</div>
                    </div>
                    <div className="p-3 hover:bg-[var(--bg-secondary-card)] transition-colors">
                      <div className="font-bold text-[#16A34A]">💳 Payment Settled ₹640</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">UPI • Order #LF10245</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-[8px] hover:bg-[var(--bg-secondary-card)] border border-transparent hover:border-[var(--border-color)] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center font-bold text-white text-xs">
                  A
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="font-bold text-xs text-[var(--heading-color)]">Admin</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Super Administrator</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[var(--bg-card)] rounded-[12px] shadow-xl border border-[var(--border-color)] py-1.5 z-50 text-xs text-[var(--text-primary)]"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <div className="font-bold text-[var(--heading-color)]">{currentUser?.name || 'Admin'}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{currentUser?.email || 'admin@laundryfresh.in'}</div>
                  </div>
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-secondary-card)] font-medium">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>System Settings</span>
                  </Link>
                  <Link href="/audit" className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-secondary-card)] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audit Logs</span>
                  </Link>
                  <div className="border-t border-[var(--border-color)] my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Holder */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
