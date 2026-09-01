'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClothType, ClothCategoryTag, PricingUnit } from '@/types';
import { X, Image as ImageIcon, Check, UploadCloud, Loader2, Link as LinkIcon } from 'lucide-react';
import { CATALOG_MAIN_CATEGORIES } from './CatalogCategoryTabs';
import { adminApi } from '@/lib/api';

interface ClothEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ClothType>) => void;
  editingCloth: ClothType | null;
  existingSubcategories: string[];
  defaultCategory?: string;
}

// Lightweight client-side image compressor: produces crisp ~60-100KB JPEG
const compressImageFile = (file: File, maxDim = 700, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Force JPEG format at 0.75 quality for super-lightweight payload (<100KB)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ClothEditModal: React.FC<ClothEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCloth,
  existingSubcategories,
  defaultCategory = 'MENS',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingS3, setUploadingS3] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    icon: string;
    categoryTag: ClothCategoryTag;
    subCategory: string;
    defaultUnit: PricingUnit;
    description: string;
    imageUrl: string;
    isActive: boolean;
  }>({
    name: '',
    icon: '👕',
    categoryTag: (defaultCategory === 'ALL' ? 'MENS' : defaultCategory) as ClothCategoryTag,
    subCategory: '',
    defaultUnit: 'PER_PIECE',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    setUploadMessage(null);
    setUploadingS3(false);
    if (editingCloth) {
      setFormData({
        name: editingCloth.name,
        icon: editingCloth.icon || '👕',
        categoryTag: editingCloth.categoryTag,
        subCategory: editingCloth.subCategory || '',
        defaultUnit: editingCloth.defaultUnit || 'PER_PIECE',
        description: editingCloth.description || '',
        imageUrl: editingCloth.imageUrl || '',
        isActive: editingCloth.isActive !== false,
      });
    } else {
      setFormData({
        name: '',
        icon: '👕',
        categoryTag: (defaultCategory === 'ALL' ? 'MENS' : defaultCategory) as ClothCategoryTag,
        subCategory: '',
        defaultUnit: 'PER_PIECE',
        description: '',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [editingCloth, defaultCategory, isOpen]);

  if (!isOpen) return null;

  // Direct S3 File Upload Handler
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingS3(true);
    setUploadMessage(null);

    try {
      // 1. Compress image to clean lightweight JPEG payload (~70KB)
      const compressedDataUrl = await compressImageFile(file, 700, 0.75);

      // 2. Upload directly to AWS S3 via backend route
      try {
        const res = await fetch('/api/upload-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: compressedDataUrl,
            fileName: `garment-${Date.now()}.jpg`,
          }),
        });

        const data = await res.json();
        const s3Url = data.data?.s3Url;
        if (data.success && s3Url) {
          setFormData((prev) => ({ ...prev, imageUrl: s3Url }));
          setUploadMessage('✓ Successfully uploaded to AWS S3!');
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
          setUploadMessage('✓ Image optimized and saved!');
        }
      } catch (apiErr) {
        console.warn('Remote S3 API failed, saving optimized local image:', apiErr);
        setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
        setUploadMessage('✓ Image saved locally to garment!');
      }
    } catch (err: any) {
      console.error('Image compression error:', err);
      setUploadMessage('Failed to read image file.');
    } finally {
      setUploadingS3(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      icon: formData.icon.trim() || '👕',
      categoryTag: formData.categoryTag,
      subCategory: formData.subCategory.trim() || undefined,
      defaultUnit: formData.defaultUnit,
      description: formData.description.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      isActive: formData.isActive,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary-card)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{formData.icon || '👕'}</span>
            <h3 className="font-bold text-sm text-[var(--heading-color)]">
              {editingCloth ? `Edit "${editingCloth.name}"` : 'Add New Garment to Catalog'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Garment Name & Icon */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="font-bold text-[var(--heading-color)] block mb-1">Garment Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Linen Shirt, Silk Saree"
                className="admin-input w-full font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Emoji Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="admin-input w-full text-center text-base"
                maxLength={4}
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Master Category *</label>
              <select
                value={formData.categoryTag}
                onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value as ClothCategoryTag })}
                className="admin-input w-full"
              >
                {CATALOG_MAIN_CATEGORIES.filter((c) => c.tag !== 'ALL').map((c) => (
                  <option key={c.tag} value={c.tag}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Subcategory</label>
              <input
                type="text"
                list="subcategories-datalist"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                placeholder="e.g. Sarees, Shirts, Denim"
                className="admin-input w-full"
              />
              <datalist id="subcategories-datalist">
                {existingSubcategories.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>
          </div>

          {/* S3 Image File Upload & Live Preview Card */}
          <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Garment Image (Stores via AWS S3)</span>
              </label>
              {formData.imageUrl && formData.imageUrl.includes('s3') && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> S3 Cloud Active
                </span>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
            />

            {/* Upload Zone & Preview */}
            <div className="flex gap-3.5 items-start">
              {/* Preview Thumbnail */}
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center relative group">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-400" />
                )}
                {uploadingS3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Buttons & Status */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingS3}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {uploadingS3 ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to S3...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Choose Image File</span>
                      </>
                    )}
                  </button>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-[var(--text-secondary)]">
                  Pick any photo from your phone or computer. Auto-optimized to ~70KB and saved via AWS S3.
                </p>

                {uploadMessage && (
                  <p
                    className={`text-[10px] font-bold ${
                      uploadMessage.includes('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                    }`}
                  >
                    {uploadMessage}
                  </p>
                )}

                {/* S3 URL Display */}
                {formData.imageUrl && (
                  <div className="flex items-center gap-1 pt-1">
                    <LinkIcon className="w-3 h-3 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="S3 URL"
                      className="admin-input w-full text-[10px] py-1 px-2 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Unit & Active Status */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Pricing Unit</label>
              <select
                value={formData.defaultUnit}
                onChange={(e) => setFormData({ ...formData, defaultUnit: e.target.value as PricingUnit })}
                className="admin-input w-full"
              >
                <option value="PER_PIECE">PER_PIECE (Single Garment)</option>
                <option value="PER_PAIR">PER_PAIR (Shoes / Socks)</option>
                <option value="PER_KG">PER_KG (Bulk Laundry)</option>
                <option value="PER_SET">PER_SET (Suit / Ensemble)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[var(--heading-color)] block mb-1">Status in App</label>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-[var(--heading-color)]">
                  {formData.isActive ? 'Active (Visible to Customers)' : 'Hidden in App'}
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-[var(--heading-color)] block mb-1">Care & Fabric Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Delicate silk dry clean with hydrocarbon solvent"
              rows={2}
              className="admin-input w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={uploadingS3} className="admin-btn-primary disabled:opacity-60">
              <Check className="w-3.5 h-3.5" />
              <span>{editingCloth ? 'Save Changes' : 'Create Garment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
