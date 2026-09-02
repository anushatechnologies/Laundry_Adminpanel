'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Mail,
  MessageSquare,
  Save,
  CheckCircle2,
  Send,
  RefreshCw,
  Server,
  Zap,
  Power,
  RotateCcw,
  Edit3,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { NotificationTemplate } from '@/types';

interface EmailTemplateMeta {
  id: string;
  name: string;
  category: string;
  event: string;
  description: string;
  isActive: boolean;
  subject: string;
  rawSubject?: string;
  headline?: string;
  subheadline?: string;
  customMessage?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: string;
  ctaText?: string;
  footerNote?: string;
  senderName?: string;
  senderEmail?: string;
  supportPhone?: string;
  supportEmail?: string;
  icon?: string;
  html: string;
  text?: string;
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

  // Email Templates State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateMeta[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string>('EMAIL-PICKUP-SCHEDULED');
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isResettingTemplate, setIsResettingTemplate] = useState(false);

  // Email Editor Form State for Selected Template
  const [editSubject, setEditSubject] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editSubheadline, setEditSubheadline] = useState('');
  const [editCustomMessage, setEditCustomMessage] = useState('');
  const [editCtaText, setEditCtaText] = useState('');
  const [editFooterNote, setEditFooterNote] = useState('');
  const [editSenderName, setEditSenderName] = useState('LaundryFresh Notifications');
  const [editSenderEmail, setEditSenderEmail] = useState('notifications@laundryfresh.in');
  const [editSupportPhone, setEditSupportPhone] = useState('+91 40 4567 8901');
  const [editSupportEmail, setEditSupportEmail] = useState('support@anushatechnologies.com');
  const [editIsActive, setEditIsActive] = useState(true);

  // Live Test Email State
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
          const current = json.data.find((t: EmailTemplateMeta) => t.id === selectedEmailId) || json.data[0];
          if (current) {
            setSelectedEmailId(current.id);
            syncEditorFields(current);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching email templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const syncEditorFields = (t: EmailTemplateMeta) => {
    setEditSubject(t.rawSubject || t.subject || '');
    setEditHeadline(t.headline || '');
    setEditSubheadline(t.subheadline || '');
    setEditCustomMessage(t.customMessage || '');
    setEditCtaText(t.ctaText || 'View Details →');
    setEditFooterNote(t.footerNote || '');
    setEditSenderName(t.senderName || 'LaundryFresh Notifications');
    setEditSenderEmail(t.senderEmail || 'notifications@laundryfresh.in');
    setEditSupportPhone(t.supportPhone || '+91 40 4567 8901');
    setEditSupportEmail(t.supportEmail || 'support@anushatechnologies.com');
    setEditIsActive(Boolean(t.isActive));
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

  const handleSelectEmailTemplate = (template: EmailTemplateMeta) => {
    setSelectedEmailId(template.id);
    syncEditorFields(template);
    setTestStatusMessage(null);
  };

  // One-click quick toggle Active/Inactive on card or switch
  const handleToggleTemplateActive = async (templateId: string, currentStatus: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = !currentStatus;

    // Optimistic UI update
    setEmailTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, isActive: newStatus } : t))
    );
    if (selectedEmailId === templateId) {
      setEditIsActive(newStatus);
    }

    try {
      const res = await fetch(`/api/backend/notifications/templates/${templateId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEmailTemplates((prev) =>
          prev.map((t) => (t.id === templateId ? { ...t, ...json.data } : t))
        );
        showToast(
          `Template ${newStatus ? 'Activated' : 'Deactivated'} — ${newStatus ? 'Emails will be sent' : 'Email trigger paused'}`,
          newStatus ? 'success' : 'info'
        );
      }
    } catch (err) {
      console.error('Failed to toggle template active:', err);
    }
  };

  // Save changes to email template
  const handleSaveEmailTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmailId) return;

    setIsSavingTemplate(true);
    try {
      const payload = {
        subject: editSubject.trim(),
        headline: editHeadline.trim(),
        subheadline: editSubheadline.trim(),
        customMessage: editCustomMessage.trim(),
        ctaText: editCtaText.trim(),
        footerNote: editFooterNote.trim(),
        senderName: editSenderName.trim(),
        senderEmail: editSenderEmail.trim(),
        supportPhone: editSupportPhone.trim(),
        supportEmail: editSupportEmail.trim(),
        isActive: editIsActive,
      };

      const res = await fetch(`/api/backend/notifications/templates/${selectedEmailId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEmailTemplates((prev) =>
          prev.map((t) => (t.id === selectedEmailId ? { ...t, ...json.data } : t))
        );
        showToast('Email template data saved and updated end-to-end!', 'success');
      } else {
        showToast(json.message || 'Failed to save template', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error saving template', 'error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Reset email template to defaults
  const handleResetEmailTemplate = async () => {
    if (!selectedEmailId) return;
    if (!confirm('Are you sure you want to reset this template to factory default settings?')) return;

    setIsResettingTemplate(true);
    try {
      const res = await fetch(`/api/backend/notifications/templates/${selectedEmailId}/reset`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEmailTemplates((prev) =>
          prev.map((t) => (t.id === selectedEmailId ? { ...t, ...json.data } : t))
        );
        syncEditorFields(json.data);
        showToast('Template reset to factory default settings!', 'success');
      }
    } catch (err) {
      showToast('Error resetting template', 'error');
    } finally {
      setIsResettingTemplate(false);
    }
  };

  // Insert placeholder helper for Email
  const handleInsertEmailPlaceholder = (tag: string) => {
    setEditSubject((prev) => `${prev} {{${tag}}}`);
  };

  // WhatsApp helpers
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

    try {
      const res = await fetch('/api/backend/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress.trim(),
          templateId: selectedEmailId,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTestStatusMessage({
          type: 'success',
          text: `✓ Test email dispatched to ${testEmailAddress} with active customized template data!`,
        });
        showToast(`Test email dispatched to ${testEmailAddress}!`, 'success');
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

  const currentEmailTemplate = emailTemplates.find((t) => t.id === selectedEmailId) || emailTemplates[0];

  const availablePlaceholders = [
    { label: 'Order ID', tag: 'orderId' },
    { label: 'Customer Name', tag: 'customerName' },
    { label: 'Pickup Date', tag: 'pickupDate' },
    { label: 'Pickup Slot', tag: 'pickupTimeSlot' },
    { label: 'Delivery Date', tag: 'deliveryDate' },
    { label: 'Delivery Slot', tag: 'deliveryTimeSlot' },
    { label: 'Total Amount', tag: 'totalAmount' },
    { label: 'Driver Name', tag: 'driverName' },
    { label: 'Delivery OTP', tag: 'deliveryOtp' },
  ];

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
            Manage lifecycle emails (Pickup, Washing, Out for Delivery, Invoices), customize template content, and toggle Active/Deactivated triggers end-to-end.
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
              <span>Email Templates & Active Controls</span>
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
            {/* Left Column (4 Cols): Template Selector List & Active Toggles */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Lifecycle Templates ({emailTemplates.length || 7})
                </h3>
                <span className="text-[10px] text-slate-400">Click card to edit</span>
              </div>

              <div className="space-y-2.5">
                {emailTemplates.map((template) => {
                  const isSelected = selectedEmailId === template.id;
                  const icon = template.icon || '🧺';

                  return (
                    <div
                      key={template.id}
                      onClick={() => handleSelectEmailTemplate(template)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-slate-200/80 dark:border-slate-700/80">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[var(--heading-color)] truncate">
                              {template.name}
                            </span>
                            {/* One-click Active/Inactive Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleTemplateActive(template.id, template.isActive, e)}
                              title={template.isActive ? 'Click to Deactivate email sending' : 'Click to Activate email sending'}
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs hover:scale-105 active:scale-95 ${
                                template.isActive
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 dark:hover:border-rose-800'
                                  : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 dark:hover:border-emerald-800'
                              }`}
                            >
                              {template.isActive ? '● Active' : '○ Disabled'}
                            </button>
                          </div>

                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                            {template.description}
                          </p>

                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {template.event}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Editing
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  Dispatch the selected template (<strong>{currentEmailTemplate?.name || 'Pickup Scheduled'}</strong>) to your email to verify real delivery.
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
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {testStatusMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (8 Cols): Template Customizer & Live Visual Preview */}
            <div className="lg:col-span-8 space-y-6">
              {/* Template Editor Form */}
              <form onSubmit={handleSaveEmailTemplate} className="azea-card p-6 space-y-5">
                {/* Top Banner: Active / Inactive Status Switch */}
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    editIsActive
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                        editIsActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {currentEmailTemplate?.icon || '🧺'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm text-[var(--heading-color)]">
                          {currentEmailTemplate?.name}
                        </h2>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            editIsActive
                              ? 'bg-emerald-200/80 text-emerald-900 font-bold dark:bg-emerald-900/70 dark:text-emerald-200'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {editIsActive ? 'ACTIVE & SENDING' : 'PAUSED / INACTIVE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {editIsActive
                          ? 'This lifecycle email is active and will be automatically dispatched to customers upon trigger.'
                          : 'This email trigger is disabled. No automated emails will be sent for this event.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditIsActive((prev) => !prev)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                      editIsActive
                        ? 'bg-emerald-600 hover:bg-rose-600 text-white'
                        : 'bg-slate-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{editIsActive ? 'Active — Click to Pause' : 'Disabled — Click to Activate'}</span>
                  </button>
                </div>

                {/* Email Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-xs text-[var(--heading-color)]">
                      Email Subject Line *
                    </label>
                    <span className="text-[11px] text-slate-400">Supports dynamic placeholders</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    placeholder="e.g. 🧺 Pickup Scheduled! - Order #{{orderId}} Confirmed"
                    className="admin-input w-full font-bold text-xs sm:text-sm"
                  />

                  {/* Placeholder Chips Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Insert:</span>
                    {availablePlaceholders.map((p) => (
                      <button
                        key={p.tag}
                        type="button"
                        onClick={() => handleInsertEmailPlaceholder(p.tag)}
                        className="px-2 py-0.5 bg-[var(--bg-secondary-card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-[var(--border-color)] hover:border-emerald-500 text-[10px] font-mono font-bold rounded text-[var(--heading-color)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{`{{${p.tag}}}`}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Headline & Greeting Subheadline Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-xs text-[var(--heading-color)] block mb-1">
                      Email Header Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={editHeadline}
                      onChange={(e) => setEditHeadline(e.target.value)}
                      placeholder="e.g. Pickup Scheduled!"
                      className="admin-input w-full text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-xs text-[var(--heading-color)] block mb-1">
                      Greeting &amp; Sub-headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={editSubheadline}
                      onChange={(e) => setEditSubheadline(e.target.value)}
                      placeholder="e.g. Hello {{customerName}}, our valet driver is assigned..."
                      className="admin-input w-full text-xs"
                    />
                  </div>
                </div>

                {/* Custom Instructions / Announcement Message Box */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-xs text-[var(--heading-color)]">
                      Custom Instructions / Service Notes (Optional)
                    </label>
                    <span className="text-[11px] text-slate-400">Highlighted box inside email</span>
                  </div>
                  <textarea
                    rows={2}
                    value={editCustomMessage}
                    onChange={(e) => setEditCustomMessage(e.target.value)}
                    placeholder="e.g. Please ensure your garments are ready in a bag for the pickup valet."
                    className="admin-input w-full text-xs leading-relaxed"
                  />
                </div>

                {/* Sender & Support Information Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-[var(--border-color)]">
                  <div>
                    <label className="font-bold text-[11px] text-[var(--text-secondary)] block mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={editSenderName}
                      onChange={(e) => setEditSenderName(e.target.value)}
                      placeholder="LaundryFresh Notifications"
                      className="admin-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-[var(--text-secondary)] block mb-1">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      value={editSenderEmail}
                      onChange={(e) => setEditSenderEmail(e.target.value)}
                      placeholder="notifications@laundryfresh.in"
                      className="admin-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-[var(--text-secondary)] block mb-1">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={editSupportPhone}
                      onChange={(e) => setEditSupportPhone(e.target.value)}
                      placeholder="+91 40 4567 8901"
                      className="admin-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-[var(--text-secondary)] block mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={editSupportEmail}
                      onChange={(e) => setEditSupportEmail(e.target.value)}
                      placeholder="support@anushatechnologies.com"
                      className="admin-input w-full text-xs"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetEmailTemplate}
                    disabled={isResettingTemplate}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSavingTemplate}
                      className="admin-btn-primary px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      {isSavingTemplate ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Template &amp; Apply End-to-End</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Interactive Email Preview */}
              <div className="azea-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--heading-color)] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>Live Rendered Email Preview</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {currentEmailTemplate?.name}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      Formatted for Gmail, Apple Mail, Outlook &amp; Mobile devices.
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
                    <div className="bg-white dark:bg-slate-950 px-3 py-1 rounded-md text-[11px] font-mono text-slate-600 dark:text-slate-300 flex-1 truncate border border-slate-200 dark:border-slate-800">
                      From: {editSenderName || 'LaundryFresh'} &lt;{editSenderEmail || 'notifications@laundryfresh.in'}&gt; | Subject: {editSubject || currentEmailTemplate?.subject}
                    </div>
                  </div>

                  {/* Deactivated Warning Banner if Inactive */}
                  {!editIsActive && (
                    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>NOTIFICATION IS CURRENTLY DEACTIVATED — Automated emails will NOT be sent to customers for this lifecycle step.</span>
                    </div>
                  )}

                  {/* Rendered HTML Canvas */}
                  <div className="p-4 sm:p-6 overflow-y-auto max-h-[600px] flex justify-center bg-slate-50 dark:bg-slate-950">
                    {currentEmailTemplate?.html ? (
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
                      className="px-2 py-1 bg-[var(--bg-card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-[var(--border-color)] hover:border-[#16A34A] text-[var(--heading-color)] text-[11px] font-mono font-bold rounded-[6px] transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
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
                <button type="submit" className="admin-btn-primary w-full cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>Save Notification Template</span>
                </button>
              </div>
            </form>
          </div>

          {/* WhatsApp Mobile Simulator Screen */}
          <div className="space-y-4">
            <div className="bg-[#0F172A] rounded-[28px] p-4 shadow-2xl border-4 border-slate-800 text-slate-200 relative">
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
                  {templateBody}
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
