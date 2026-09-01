'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowUpRight,
  RefreshCw,
  ImageIcon,
  Layers,
  ShoppingBag,
  ExternalLink,
  Percent,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import {
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  toggleAdminBanner,
  deleteAdminBanner,
  adminApi,
} from '@/lib/api';
import { Banner } from '@/types';

const PRESET_IMAGES = [
  {
    label: 'Luxury Laundry & Dry Clean',
    url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Silk Saree & Bridal Spa',
    url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Bulk Everyday Laundry',
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Express 24-Hour Delivery',
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Men Premium Suits & Blazers',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Home Curtains & Comforters',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'FILE' | 'URL'>('FILE');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('SPECIAL OFFER');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [actionType, setActionType] = useState<'BOOK' | 'CATEGORY' | 'SERVICE' | 'OFFER' | 'URL'>('BOOK');
  const [actionTarget, setActionTarget] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getAdminBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('SPECIAL OFFER');
    setImageUrl(PRESET_IMAGES[0].url);
    setCouponCode('');
    setDiscountPercent(0);
    setActionType('BOOK');
    setActionTarget('');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setSelectedFileName(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setBadgeText(banner.badgeText || 'SPECIAL OFFER');
    setImageUrl(banner.imageUrl);
    setCouponCode(banner.couponCode || '');
    setDiscountPercent(banner.discountPercent || 0);
    setActionType(banner.actionType || 'BOOK');
    setActionTarget(banner.actionTarget || '');
    setDisplayOrder(banner.displayOrder || 1);
    setIsActive(banner.isActive);
    setSelectedFileName(null);
    setIsModalOpen(true);
  };

  const compressImageFile = (file: File, maxWidth = 1400, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setUploadingS3(true);
      try {
        const compressedDataUrl = await compressImageFile(file);
        setImageUrl(compressedDataUrl);

        const res = await fetch('/api/upload-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: compressedDataUrl, fileName: `banner-${Date.now()}-${file.name}` }),
        });
        const uploadData = await res.json();
        if (uploadData.success && uploadData.data?.s3Url) {
          setImageUrl(uploadData.data.s3Url);
        }
      } catch {
        // keep preview
      } finally {
        setUploadingS3(false);
      }
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Title and Image URL are required.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Banner> = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        badgeText: badgeText.trim(),
        imageUrl: imageUrl.trim(),
        couponCode: couponCode.trim().toUpperCase(),
        discountPercent: Number(discountPercent) || 0,
        actionType,
        actionTarget: actionTarget.trim(),
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      if (editingBanner) {
        await updateAdminBanner(editingBanner.id, payload);
      } else {
        await createAdminBanner(payload);
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      alert(err.message || 'Could not save banner.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAdminBanner(id);
      fetchBanners();
    } catch (err: any) {
      alert(err.message || 'Could not toggle banner.');
    }
  };

  const handleDelete = async (id: string, bannerTitle: string) => {
    if (!confirm(`Are you sure you want to delete the banner "${bannerTitle}"?`)) return;
    try {
      await deleteAdminBanner(id);
      fetchBanners();
    } catch (err: any) {
      alert(err.message || 'Could not delete banner.');
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Promotional & Marketing Banners
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Control the luxury hero carousel displayed across Customer Mobile App & Web App.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Banner
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Total Banners
          </p>
          <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{banners.length}</p>
        </div>
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Active on Customer Apps
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            With Coupon Codes
          </p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {banners.filter((b) => b.couponCode).length}
          </p>
        </div>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[var(--text-secondary)] font-medium">Loading promotional banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-[var(--bg-card)] p-12 text-center rounded-2xl border border-[var(--border-color)]">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No Banners Configured</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Create your first hero promotion banner to showcase offers and express services on customer apps.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple-700"
          >
            Create Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden bg-[var(--bg-card)] ${
                banner.isActive
                  ? 'border-[var(--border-color)] hover:border-purple-500/50 shadow-sm hover:shadow-md'
                  : 'border-slate-800/40 opacity-70'
              }`}
            >
              {/* Visual Banner Preview Card */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Top Badge & Order Tag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-md">
                    {banner.badgeText || 'SPECIAL OFFER'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white/90 border border-white/10">
                    Order #{banner.displayOrder}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-black leading-tight drop-shadow-md">{banner.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                </div>
              </div>

              {/* Card Meta & Control Footer */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {banner.couponCode && (
                    <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 border border-amber-500/20">
                      <Tag className="w-3 h-3" />
                      {banner.couponCode}
                      {banner.discountPercent ? ` (${banner.discountPercent}% OFF)` : ''}
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-md bg-slate-500/10 text-slate-400 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    Action: {banner.actionType} {banner.actionTarget ? `(${banner.actionTarget})` : ''}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(banner.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        banner.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Inactive
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-500/10 transition-all"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id, banner.title)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-500/10 transition-all"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] w-full max-w-xl rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-hover)]">
              <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                {editingBanner ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[var(--text-primary)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">
                  Banner Main Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50% Flat Discount on First Order"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">
                  Subtitle / Promo Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Ozone Sanitization & Doorstep Pickup across Hyderabad"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FIRST ORDER SPECIAL"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-bold"
                  />
                </div>
              </div>

              {/* Image Input Options: Upload to S3 vs URL vs Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[var(--text-primary)]">
                    Banner Photo (AWS S3 Cloud / URL) *
                  </label>
                  <div className="flex bg-[var(--bg-hover)] p-0.5 rounded-lg border border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('FILE')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        imageInputMode === 'FILE'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Upload className="w-3 h-3" /> Upload Device Image to S3
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('URL')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        imageInputMode === 'URL'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" /> Direct S3 / Image Link
                    </button>
                  </div>
                </div>

                {imageInputMode === 'FILE' ? (
                  <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center hover:border-purple-500/50 transition-colors bg-[var(--bg-page)]">
                    <input
                      type="file"
                      accept="image/*"
                      id="banner-file-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="banner-file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[var(--text-primary)] text-xs">
                        {uploadingS3 ? 'Uploading to AWS S3...' : selectedFileName ? `Uploaded: ${selectedFileName}` : 'Choose banner file to upload directly to S3'}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        PNG, JPG, WEBP up to 8MB • Automatically stored on AWS S3
                      </span>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/banners/..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-mono text-[11px]"
                  />
                )}

                {/* Preset Quick Selectors */}
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] mb-1">
                    Or select high-res photography preset:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all ${
                          imageUrl === preset.url
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coupon & Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Linked Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FIRST50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-bold"
                  />
                </div>
              </div>

              {/* Action Target */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Click Action Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e: any) => setActionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-semibold"
                  >
                    <option value="BOOK">Direct Booking Screen</option>
                    <option value="CATEGORY">Navigate to Category</option>
                    <option value="SERVICE">Navigate to Specific Service</option>
                    <option value="OFFER">Navigate to Offers Screen</option>
                    <option value="URL">External Web Link</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Target Slug / Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. bridal-wear or bulk-laundry"
                    value={actionTarget}
                    onChange={(e) => setActionTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="bannerActive" className="font-bold text-[var(--text-primary)] cursor-pointer">
                  Activate banner immediately on Customer Mobile & Web apps
                </label>
              </div>

              {/* Live Preview */}
              {imageUrl && (
                <div className="pt-2">
                  <p className="font-bold text-[var(--text-secondary)] mb-1 text-[11px]">Live Preview:</p>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-color)]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-600 text-white">
                      {badgeText || 'SPECIAL OFFER'}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="font-black text-xs">{title || 'Banner Title'}</p>
                      <p className="text-[10px] text-white/80 truncate">{subtitle || 'Banner Subtitle'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-bold hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingS3}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
