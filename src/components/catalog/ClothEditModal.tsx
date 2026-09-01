'use client';

import React, { useState, useEffect } from 'react';
import { ClothType, ClothCategoryTag, PricingUnit } from '@/types';
import { X, Image as ImageIcon, Sparkles, Check, UploadCloud } from 'lucide-react';
import { CATALOG_MAIN_CATEGORIES } from './CatalogCategoryTabs';

interface ClothEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ClothType>) => void;
  editingCloth: ClothType | null;
  existingSubcategories: string[];
  defaultCategory?: string;
}

export const ClothEditModal: React.FC<ClothEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCloth,
  existingSubcategories,
  defaultCategory = 'MENS',
}) => {
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
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-colors"
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

          {/* S3 Image URL & Live Preview */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                <span>AWS S3 Garment Image URL</span>
              </label>
              {formData.imageUrl && formData.imageUrl.includes('s3') && (
                <span className="text-[10px] text-emerald-600 font-bold">✓ S3 Link Active</span>
              )}
            </div>

            <div className="flex gap-3 items-center">
              {/* Image Thumbnail Preview */}
              <div className="w-16 h-16 rounded-lg border border-[var(--border-color)] overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Input for S3 URL */}
              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/garments/..."
                  className="admin-input w-full text-xs font-mono"
                />
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Paste your S3 object URL or CDN link. Live preview updates immediately.
                </p>
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
            <button type="submit" className="admin-btn-primary">
              <Check className="w-3.5 h-3.5" />
              <span>{editingCloth ? 'Save Changes' : 'Create Garment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
