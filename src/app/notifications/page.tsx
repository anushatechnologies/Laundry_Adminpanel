'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2,
  Sparkles,
  Send,
  HelpCircle,
  Copy,
  Layers,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { NotificationTemplate } from '@/types';

interface EmailTemplateMeta {
  id: string;
  name: string;
  category: string;
  event: string;
  subject: string;
  description: string;
  html: string;
}

export default function AdminNotificationsPage() {
  const { notificationTemplates, updateNotificationTemplate, showToast } = useApp();

  const [activeChannel, setActiveChannel] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');

  // WhatsApp State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    notificationTemplates[0]?.id || 'TMP-01'
  );
  const currentTemplate =
    notificationTemplates.find((t) => t.id === selectedTemplateId) ||
    notificationTemplates[0];

  const [title, setTitle] = useState<string>(currentTemplate?.title || '');
  const [templateBody, setTemplateBody] = useState<string>(currentTemplate?.templateBody || '');

  // Email State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateMeta[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string>('EMAIL-WASH-COMPLETED');
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testStatusMessage, setTestStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [smtpStatus, setSmtpStatus] = useState<{ isConnected: boolean; message: string; smtpHost?: string } | null>(null);

  // Fetch readymade email templates from backend
  const fetchEmailTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/backend/notifications/templates');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setEmailTemplates(json.data);
          if (!selectedEmailId && json.data.length > 0) {
            setSelectedEmailId(json.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching email templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Fetch SMTP status
  const fetchSmtpStatus = async () => {
    try {
      const res = await fetch('/api/backend/notifications/smtp-status');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSmtpStatus(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching SMTP status:', err);
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
    fetchSmtpStatus();
  }, []);

  const handleSelectTemplate = (t: NotificationTemplate) => {
    setSelectedTemplateId(t.id);
    setTitle(t.title);
    setTemplateBody(t.templateBody);
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    setTemplateBody((prev) => `${prev} {{${placeholder}}}`);
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    updateNotificationTemplate(currentTemplate.id, {
      title,
      templateBody,
    });
    showToast('WhatsApp template saved successfully!');
  };

  // Send Live Test Email
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      showToast('Please enter a recipient email address.', 'error');
      return;
    }

    setIsSendingTest(true);
    setTestStatusMessage(null);

    const activeTemplate = emailTemplates.find((t) => t.id === selectedEmailId);
    const eventType = activeTemplate?.event || 'WASH_COMPLETED';

    try {
      const res = await fetch('/api/backend/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress.trim(),
          templateType: eventType,
          orderData: {
            orderId: 'TEST-8829',
            customerName: 'Valued Customer',
            customerEmail: testEmailAddress.trim(),
            pickupDate: 'Today',
            pickupTimeSlot: '08:00 AM - 10:00 AM',
            deliveryDate: 'Tomorrow',
            deliveryTimeSlot: '04:00 PM - 06:00 PM',
            pickupAddress: 'HSR Layout Sector 4, Bangalore - 560102',
            totalAmount: 425,
            taxAmount: 40,
            deliveryFee: 0,
            paymentStatus: 'PAID',
            driverName: 'Vikram Singh (In-House Fleet)',
            deliveryOtp: '7392',
            trackingUrl: 'https://laundryfresh.in/track/TEST-8829',
          },
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTestStatusMessage({
          type: 'success',
          text: `✓ Test "${activeTemplate?.name || 'Notification'}" email dispatched to ${testEmailAddress}!`,
        });
        showToast(`Test email sent to ${testEmailAddress}!`, 'success');
      } else {
        setTestStatusMessage({
          type: 'error',
          text: json.message || 'Error dispatching email.',
        });
      }
    } catch (err: any) {
      setTestStatusMessage({
        type: 'error',
        text: err.message || 'Network error while contacting backend.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Mock variables for live WhatsApp preview
  const previewData: Record<string, string> = {
    customer_name: 'Rahul Verma',
    order_id: 'LAU10245',
    pickup_time: 'Today, 08:00 AM - 10:00 AM',
    driver_name: 'Vikram Singh (In-House Fleet)',
    driver_phone: '+91 98765 11001',
    distance_km: '3.8',
    estimated_kg: '5.0',
    actual_kg: '6.5',
    difference_amount: '90',
    delivery_otp: '4829',
    track_url: 'https://laundryfresh.in/track/LAU10245',
    approval_url: 'https://laundryfresh.in/track/LAU10245',
  };

  const renderSimulatedMessage = (rawText: string) => {
    let result = rawText;
    Object.keys(previewData).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, previewData[key]);
    });
    return result;
  };

  const currentEmailTemplate = emailTemplates.find((t) => t.id === selectedEmailId) || emailTemplates[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="azea-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-hover)] px-2.5 py-0.5 rounded-full border border-emerald-200">
            Customer Lifecycle & Transports
          </span>
          <h1 className="text-2xl font-bold text-[var(--heading-color)] font-poppins mt-1 flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#16A34A]" />
            <span>Automated Customer Notifications & Email Studio</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage automated lifecycle emails (Pickup scheduled, Wash Complete, Out for Delivery, Invoices) and WhatsApp Business updates.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-[var(--bg-secondary-card)] border border-[var(--border-color)] p-1 rounded-[10px] flex items-center gap-1">
            <button
              onClick={() => setActiveChannel('EMAIL')}
              className={`px-3.5 py-1.5 rounded-[8px] transition-all flex items-center gap-1.5 text-xs font-bold ${
                activeChannel === 'EMAIL'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Templates (Readymade)</span>
            </button>
            <button
              onClick={() => setActiveChannel('WHATSAPP')}
              className={`px-3.5 py-1.5 rounded-[8px] transition-all flex items-center gap-1.5 text-xs font-bold ${
                activeChannel === 'WHATSAPP'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--heading-color)]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp / SMS CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. EMAIL NOTIFICATION STUDIO */}
      {activeChannel === 'EMAIL' && (
        <div className="space-y-6">
          {/* SMTP & Server Status Banner */}
          <div className="azea-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/60 to-sky-50/60 dark:from-emerald-950/20 dark:to-sky-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--heading-color)] flex items-center gap-2">
                  <span>Nodemailer Transactional Engine</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                    Active & Ready
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  {smtpStatus?.message || 'Ready for automated pickup, wash completed & invoice mail dispatch.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  fetchEmailTemplates();
                  fetchSmtpStatus();
                  showToast('Refreshed email templates & SMTP status');
                }}
                className="admin-btn-secondary text-[11px] py-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Template Selector List */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] px-1">
                Readymade Lifecycle Templates ({emailTemplates.length || 7})
              </h3>

              <div className="space-y-2">
                {emailTemplates.map((template) => {
                  const isSelected = selectedEmailId === template.id;
                  let icon = '🧺';
                  if (template.id.includes('WASH-COMPLETED')) icon = '✨';
                  else if (template.id.includes('OUT-FOR-DELIVERY')) icon = '🚀';
                  else if (template.id.includes('ORDER-DELIVERED')) icon = '🎉';
                  else if (template.id.includes('WASH-IN-PROGRESS')) icon = '🫧';
                  else if (template.id.includes('PICKUP-COMPLETED')) icon = '🚚';
                  else if (template.id.includes('OTP')) icon = '🔐';

                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedEmailId(template.id);
                        setTestStatusMessage(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-slate-200/80 dark:border-slate-700/80">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-[var(--heading-color)] truncate">
                            {template.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                          {template.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {template.event}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Send Test Email Card */}
              <div className="azea-card p-5 text-xs space-y-3 bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 font-bold text-[var(--heading-color)] text-sm">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Send Live Test Email</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Dispatch the selected readymade template (<strong>{currentEmailTemplate?.name || 'Wash Complete'}</strong>) to your inbox to test rendering.
                </p>

                <form onSubmit={handleSendTestEmail} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter recipient email (e.g. you@gmail.com)"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="admin-input w-full font-medium text-xs"
                  />

                  <button
                    type="submit"
                    disabled={isSendingTest}
                    className="admin-btn-primary w-full py-2 flex items-center justify-center gap-2 text-xs"
                  >
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Send Test Email Now</span>
                      </>
                    )}
                  </button>
                </form>

                {testStatusMessage && (
                  <div
                    className={`p-3 rounded-lg text-[11px] font-semibold border ${
                      testStatusMessage.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200'
                    }`}
                  >
                    {testStatusMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Live Interactive Email Preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="azea-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
                      <span>{currentEmailTemplate?.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Subject: {currentEmailTemplate?.subject}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      Responsive HTML email formatted for Gmail, Apple Mail, Outlook & Mobile screens.
                    </p>
                  </div>
                </div>

                {/* Email Client Simulated Browser */}
                <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-900">
                  {/* Browser Address Bar */}
                  <div className="bg-slate-200 dark:bg-slate-800 px-4 py-2.5 flex items-center gap-3 border-b border-slate-300 dark:border-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    </div>
                    <div className="bg-white dark:bg-slate-950 px-3 py-1 rounded-md text-[11px] font-mono text-slate-500 flex-1 truncate border border-slate-200 dark:border-slate-800">
                      From: LaundryFresh Notifications &lt;notifications@laundryfresh.in&gt;
                    </div>
                  </div>

                  {/* Rendered HTML Canvas */}
                  <div className="p-4 sm:p-6 overflow-y-auto max-h-[600px] flex justify-center bg-slate-50 dark:bg-slate-950">
                    {currentEmailTemplate ? (
                      <div
                        className="w-full max-w-[600px] bg-white text-slate-800 shadow-md rounded-2xl overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: currentEmailTemplate.html }}
                      />
                    ) : (
                      <div className="p-8 text-center text-slate-400">Loading template preview...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHATSAPP & SMS CMS */}
      {activeChannel === 'WHATSAPP' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector & Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Tabs */}
            <div className="azea-card p-4 flex gap-2 overflow-x-auto">
              {notificationTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`px-4 py-2.5 rounded-[8px] text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedTemplateId === template.id
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-secondary-card)] text-[var(--text-secondary)] hover:text-[var(--heading-color)] border border-[var(--border-color)]'
                  }`}
                >
                  <span>{template.title}</span>
                  <span className="text-[10px] opacity-75">({template.eventName})</span>
                </button>
              ))}
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSaveWhatsApp} className="azea-card p-6 space-y-4">
              <div>
                <label className="font-bold text-xs text-[var(--heading-color)] block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input w-full font-bold"
                />
              </div>

              {/* Placeholders Toolbar */}
              <div>
                <label className="font-bold text-xs text-[var(--heading-color)] block mb-1">
                  Insert Dynamic Data Placeholders (Click to Add):
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-[var(--bg-secondary-card)] rounded-[10px] border border-[var(--border-color)]">
                  {currentTemplate?.placeholders.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleInsertPlaceholder(p)}
                      className="px-2 py-1 bg-[var(--bg-card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-[var(--border-color)] hover:border-[#16A34A] text-[var(--heading-color)] text-[11px] font-mono font-bold rounded-[6px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>{`{{${p}}}`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Body */}
              <div>
                <label className="font-bold text-xs text-[var(--heading-color)] block mb-1">
                  Message Body (WhatsApp Formatting: *bold*, _italic_)
                </label>
                <textarea
                  rows={8}
                  required
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="admin-input w-full h-auto p-3 font-mono leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="admin-btn-primary w-full">
                  <Save className="w-4 h-4" />
                  <span>Save Notification Template</span>
                </button>
              </div>
            </form>
          </div>

          {/* WhatsApp Mobile Simulator Screen */}
          <div className="space-y-4">
            <div className="bg-[#0F172A] rounded-[28px] p-4 shadow-2xl border-4 border-slate-800 text-slate-800 relative">
              {/* Phone Speaker & Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white p-3 rounded-t-[16px] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  🧺
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs leading-none">LaundryFresh Verified</div>
                  <div className="text-[10px] text-emerald-200">Official Business Account</div>
                </div>
              </div>

              {/* WhatsApp Chat Canvas */}
              <div className="bg-[#ECE5DD] p-3 rounded-b-[16px] min-h-[360px] flex flex-col justify-end space-y-2">
                <div className="bg-white p-3 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] shadow-xs text-xs text-[#0F172A] max-w-[90%] whitespace-pre-wrap leading-relaxed">
                  {renderSimulatedMessage(templateBody)}
                  <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">11:45 AM ✓✓</div>
                </div>
              </div>
            </div>

            <div className="azea-card p-4 text-xs space-y-2 text-[var(--text-secondary)]">
              <strong className="text-[var(--heading-color)] block">Auto-Trigger Rules:</strong>
              <p>• Triggered instantly via Webhook when staff marks status in Admin or Rider App.</p>
              <p>• Fallback to transactional SMS if WhatsApp delivery fails.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
