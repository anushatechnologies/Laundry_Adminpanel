'use client';

import React, { useState } from 'react';
import { INITIAL_CATEGORIES, db } from '@/lib/db';
import { useApp } from '@/context/AppContext';
import { Layers, Plus, Search, Edit2, Check, X, Clock, Scale, Trash2, Image as ImageIcon, Upload, Link as LinkIcon, FileImage } from 'lucide-react';
import { Service, PricingModel } from '@/types';
import { adminApi } from '@/lib/api';

export default function AdminServicesPage() {
  const { showToast } = useApp();
  const [services, setServices] = useState<Service[]>(() => db.getServices());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'FILE' | 'URL'>('FILE');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  React.useEffect(() => {
    adminApi<{ services: Service[] }>('/services')
      .then((catalog) => {
        if (catalog?.services && Array.isArray(catalog.services) && catalog.services.length > 0) {
          setServices(catalog.services);
        }
      })
      .catch(() => {
        setServices(db.getServices());
      });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat-1',
    slug: '',
    description: '',
    pricingModel: 'PER_KG' as PricingModel,
    basePrice: 60,
    unit: 'KG',
    minOrderQuantity: 3,
    turnaroundHours: 24,
    expressAvailable: true,
    imageUrl: '/images/service_wash_fold.jpg',
  });

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const compressImageFile = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
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
      try {
        const compressedDataUrl = await compressImageFile(file);
        
        // Show instant preview while uploading to AWS S3
        setFormData((prev) => ({
          ...prev,
          imageUrl: compressedDataUrl,
        }));

        showToast(`Uploading ${file.name} to secure media storage…`, 'info');
        const uploaded = await adminApi<{ s3Url: string }>('/services/upload-s3', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: compressedDataUrl, fileName: file.name }),
        });

        if (uploaded.s3Url) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: uploaded.s3Url,
          }));
          showToast('Image uploaded successfully.', 'success');
        } else {
          showToast('The image could not be saved to media storage.', 'error');
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            imageUrl: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      const saved = editingServiceId
        ? await adminApi<Service>(`/services/${encodeURIComponent(editingServiceId)}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await adminApi<Service>('/services', { method: 'POST', body: JSON.stringify(payload) });
      setServices((current) => editingServiceId ? current.map((service) => service.id === saved.id ? saved : service) : [saved, ...current]);
      setEditingServiceId(null);
      setShowAddModal(false);
      showToast(`Service "${saved.name}" saved.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not save service.', 'error');
      return;
    }

    setFormData({
      name: '',
      categoryId: 'cat-1',
      slug: '',
      description: '',
      pricingModel: 'PER_KG',
      basePrice: 60,
      unit: 'KG',
      minOrderQuantity: 3,
      turnaroundHours: 24,
      expressAvailable: true,
      imageUrl: '/images/service_wash_fold.jpg',
    });
    setSelectedFileName(null);
  };

  const handleStartEdit = (s: Service) => {
    setEditingServiceId(s.id);
    setFormData({
      name: s.name,
      categoryId: s.categoryId,
      slug: s.slug,
      description: s.description,
      pricingModel: s.pricingModel,
      basePrice: s.basePrice,
      unit: s.unit,
      minOrderQuantity: s.minOrderQuantity || 1,
      turnaroundHours: s.turnaroundHours,
      expressAvailable: s.expressAvailable ?? true,
      imageUrl: s.image || '/images/service_wash_fold.jpg',
    });
    setSelectedFileName(null);
    setShowAddModal(true);
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await adminApi(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
        setServices((current) => current.filter((service) => service.id !== id));
        showToast(`Deleted service "${name}"`, 'info');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not delete service.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-[14px] border border-[var(--border-color)]">
        <div>
          <h1 className="text-xl font-black text-[var(--heading-color)] font-poppins flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>Garment Services & Product Photos</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage garment laundry catalog, upload product photos, prices, and turnaround times
          </p>
        </div>

        <button
          onClick={() => {
            setEditingServiceId(null);
            setFormData({
              name: '',
              categoryId: 'cat-1',
              slug: '',
              description: '',
              pricingModel: 'PER_KG',
              basePrice: 60,
              unit: 'KG',
              minOrderQuantity: 3,
              turnaroundHours: 24,
              expressAvailable: true,
              imageUrl: '/images/service_wash_fold.jpg',
            });
            setSelectedFileName(null);
            setShowAddModal(true);
          }}
          className="admin-btn-primary self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service & Photo</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search services by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-9 w-full"
        />
      </div>

      {/* Services Table */}
      <div className="bg-[var(--bg-card)] rounded-[14px] border border-[var(--border-color)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card-hover)] text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Garment Photo</th>
                <th className="p-3">Service Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pricing Model</th>
                <th className="p-3">Base Price</th>
                <th className="p-3">Turnaround</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredServices.map((service) => {
                const category = INITIAL_CATEGORIES.find((c) => c.id === service.categoryId);
                return (
                  <tr key={service.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                    {/* Photo Thumbnail */}
                    <td className="p-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                        <img
                          src={service.imageUrl || '/images/service_wash_fold.jpg'}
                          alt={service.name}
                          className="w-full h-full object-cover"
                          suppressHydrationWarning
                        />
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[var(--heading-color)] text-sm">{service.name}</div>
                      <div className="text-[11px] text-slate-400 max-w-xs line-clamp-1">{service.description}</div>
                    </td>

                    <td className="p-3 font-semibold text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">
                        {category?.name || 'General'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          service.pricingModel === 'PER_KG'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {service.pricingModel === 'PER_KG' ? 'Per-KG (Weighed)' : 'Per-Item'}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-emerald-700 text-sm">
                      ₹{service.basePrice} / {service.unit}
                    </td>

                    <td className="p-3 text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{service.turnaroundHours}h</span>
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStartEdit(service)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Service & Photo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal with Real File Upload Support */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-[14px] shadow-2xl max-w-lg w-full p-6 border border-[var(--border-color)] text-xs space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-[var(--heading-color)]">
                {editingServiceId ? 'Edit Laundry Service & Photo' : 'Create New Laundry Service & Photo'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Woolen Suit Dry Clean"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input w-full font-bold"
                />
              </div>

              {/* REAL IMAGE FILE UPLOADER & URL SWITCHER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--heading-color)] block">Product Photo Upload</label>
                  {/* Mode Switcher Buttons */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('FILE')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        imageInputMode === 'FILE'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('URL')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        imageInputMode === 'URL'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌐 Image URL / S3
                    </button>
                  </div>
                </div>

                {imageInputMode === 'FILE' ? (
                  /* FILE UPLOAD INPUT FIELD */
                  <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl p-4 text-center transition-all">
                    <input
                      type="file"
                      id="product-file-input"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-file-input"
                      className="flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-emerald-800">
                        {selectedFileName ? `Selected: ${selectedFileName}` : 'Click to Upload Garment Photo from Computer'}
                      </span>
                      <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, GIF files</span>
                    </label>
                  </div>
                ) : (
                  /* DIRECT URL INPUT FIELD */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="/images/service_dry_cleaning.jpg or https://s3.amazonaws.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="admin-input flex-1 font-mono text-xs"
                    />
                  </div>
                )}

                {/* LIVE PREVIEW THUMBNAIL */}
                {formData.imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-slate-300 relative shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Garment Preview"
                        className="w-full h-full object-cover"
                        suppressHydrationWarning
                      />
                    </div>
                    <div className="text-[11px] space-y-0.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{formData.imageUrl.includes('amazonaws.com') ? '☁️ AWS S3 Cloud Storage' : 'Live Image Preview'}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold line-clamp-1 font-mono">
                        {formData.imageUrl.includes('amazonaws.com')
                          ? `AWS S3: ${formData.imageUrl}`
                          : formData.imageUrl.startsWith('data:')
                          ? 'Base64 Local Compressed File'
                          : formData.imageUrl}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="admin-input w-full font-bold"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Pricing Model</label>
                  <select
                    value={formData.pricingModel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricingModel: e.target.value as PricingModel,
                        unit: e.target.value === 'PER_KG' ? 'KG' : 'Item',
                      })
                    }
                    className="admin-input w-full font-bold"
                  >
                    <option value="PER_KG">Per-KG (Weighed at Facility)</option>
                    <option value="PER_ITEM">Per-Item (Fixed Price)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="admin-input w-full font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--heading-color)] block mb-1">Turnaround (Hours)</label>
                  <input
                    type="number"
                    required
                    value={formData.turnaroundHours}
                    onChange={(e) => setFormData({ ...formData, turnaroundHours: parseInt(e.target.value) || 24 })}
                    className="admin-input w-full font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--heading-color)] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service description..."
                  className="admin-input w-full font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary cursor-pointer">
                  {editingServiceId ? 'Update Service & Photo' : 'Save Service & Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
