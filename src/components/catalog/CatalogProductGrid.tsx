'use client';

import React, { useRef, useState } from 'react';
import { ClothType, ServiceMaster, ServicePriceItem } from '@/types';
import { getLocalFallbackPhoto } from '@/components/common/GarmentImage';
import { Edit2, Trash2, Cloud, UploadCloud, Loader2, Camera } from 'lucide-react';
import { adminApi } from '@/lib/api';

interface CatalogProductGridProps {
  clothes: ClothType[];
  serviceMasters: ServiceMaster[];
  priceMatrix: ServicePriceItem[];
  onEditCloth: (cloth: ClothType) => void;
  onDeleteCloth: (clothId: string, clothName: string) => void;
  onOpenPriceInspector: (cloth: ClothType, service: ServiceMaster) => void;
  onToggleActive: (cloth: ClothType) => void;
  onUpdateClothImage?: (clothId: string, imageUrl: string) => void;
  selectedServiceFilter?: string;
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

export const CatalogProductGrid: React.FC<CatalogProductGridProps> = ({
  clothes,
  serviceMasters,
  priceMatrix,
  onEditCloth,
  onDeleteCloth,
  onOpenPriceInspector,
  onToggleActive,
  onUpdateClothImage,
  selectedServiceFilter = 'ALL',
}) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const activeInputRef = useRef<HTMLInputElement>(null);
  const [targetClothId, setTargetClothId] = useState<string | null>(null);

  if (clothes.length === 0) {
    return (
      <div className="p-12 text-center text-[var(--text-secondary)]">
        <p className="text-sm font-semibold">No garments found in this category or subcategory.</p>
        <p className="text-xs mt-1">Try selecting another subcategory or clear the search query.</p>
      </div>
    );
  }

  const keyServiceIds = ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-dry-clean'];

  const handleCardFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const clothId = targetClothId;
    if (!file || !clothId) return;

    setUploadingId(clothId);
    try {
      const compressedDataUrl = await compressImageFile(file, 700, 0.75);

      try {
        const res = await fetch('/api/upload-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: compressedDataUrl,
            fileName: `garment-${clothId}-${Date.now()}.jpg`,
          }),
        });

        const uploadData = await res.json();
        const finalUrl = (uploadData.success && uploadData.data?.s3Url) ? uploadData.data.s3Url : compressedDataUrl;
        if (onUpdateClothImage) {
          onUpdateClothImage(clothId, finalUrl);
        }
      } catch (apiErr) {
        console.warn('Remote S3 API failed, saving optimized local image:', apiErr);
        if (onUpdateClothImage) {
          onUpdateClothImage(clothId, compressedDataUrl);
        }
      }
    } catch (err) {
      console.error('Quick image upload error:', err);
    } finally {
      setUploadingId(null);
      setTargetClothId(null);
    }
  };

  const triggerDirectUpload = (clothId: string) => {
    setTargetClothId(clothId);
    activeInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden file input for 1-click card upload */}
      <input
        ref={activeInputRef}
        type="file"
        accept="image/*"
        onChange={handleCardFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {clothes.map((cloth) => {
          const isS3 = cloth.imageUrl && cloth.imageUrl.includes('s3');
          const isCurrentlyUploading = uploadingId === cloth.id;
          const displayImage = cloth.imageUrl || getLocalFallbackPhoto(cloth.name, cloth.categoryTag);

          return (
            <div
              key={cloth.id}
              className={`azea-card p-3 rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between ${
                cloth.isActive !== false
                  ? 'border-[var(--border-color)] bg-[var(--bg-card)]'
                  : 'border-rose-200 dark:border-rose-900/30 opacity-75 bg-rose-50/10'
              }`}
            >
              <div>
                {/* Full-bleed Photo Banner */}
                <div className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 aspect-4/3 w-full flex items-center justify-center mb-3 border border-[var(--border-color)]">
                  <img
                    key={displayImage}
                    src={displayImage}
                    alt={cloth.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const fallback = getLocalFallbackPhoto(cloth.name, cloth.categoryTag);
                      if ((e.target as HTMLImageElement).src !== fallback) {
                        (e.target as HTMLImageElement).src = fallback;
                      }
                    }}
                  />

                  {/* S3 Indicator Badge */}
                  <div className="absolute top-2 left-2">
                    {isS3 ? (
                      <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-xs">
                        <Cloud className="w-2.5 h-2.5" /> S3 Cloud
                      </span>
                    ) : (
                      <span className="bg-slate-800/80 text-white text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-xs">
                        Photo
                      </span>
                    )}
                  </div>

                  {/* Upload Spinner Overlay */}
                  {isCurrentlyUploading && (
                    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-white z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="text-[10px] font-bold mt-1">Uploading to S3...</span>
                    </div>
                  )}

                  {/* Permanent, Always-Visible Upload Button on Card Image */}
                  {!isCurrentlyUploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDirectUpload(cloth.id);
                      }}
                      className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/85 hover:bg-blue-600 text-white rounded-lg shadow-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs border border-white/25 hover:scale-105 z-10"
                      title="Click to upload new photo to AWS S3"
                    >
                      <Camera className="w-3 h-3 text-blue-400 group-hover:text-white" />
                      <span>Upload Photo</span>
                    </button>
                  )}
                </div>

                {/* Title & Subcategory */}
                <div className="mb-2.5">
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="font-bold text-xs text-[var(--heading-color)] line-clamp-1">
                      {cloth.icon} {cloth.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onToggleActive(cloth)}
                      className={`shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded-sm cursor-pointer transition-colors ${
                        cloth.isActive !== false
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                      title="Click to toggle Active status"
                    >
                      {cloth.isActive !== false ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                  {cloth.subCategory && (
                    <span className="inline-block mt-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {cloth.subCategory}
                    </span>
                  )}
                  {cloth.description && (
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                      {cloth.description}
                    </p>
                  )}
                </div>

                {/* Service Prices Display */}
                <div className="space-y-1 pt-1 border-t border-[var(--border-color)]">
                  {keyServiceIds.map((srvId) => {
                    const srv = serviceMasters.find((s) => s.id === srvId);
                    if (!srv) return null;

                    const priceItem = priceMatrix.find(
                      (p) => p.clothTypeId === cloth.id && p.serviceId === srvId
                    );
                    const isAvailable = priceItem ? priceItem.isAvailable !== false && priceItem.price > 0 : false;

                    const isHighlighted = selectedServiceFilter === srvId;
                    return (
                      <button
                        key={srvId}
                        type="button"
                        onClick={() => onOpenPriceInspector(cloth, srv)}
                        className={`w-full flex items-center justify-between text-[11px] py-1 px-1.5 rounded-md transition-all cursor-pointer text-left group/price ${
                          isHighlighted
                            ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-400 dark:border-blue-700 font-bold text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                        title={`Click to edit ${srv.name} price`}
                      >
                        <span className="text-[var(--text-secondary)] truncate flex items-center gap-1">
                          <span className="text-xs">{srv.icon}</span>
                          <span className="text-[10px] font-medium">{srv.name.replace(' Only', '')}</span>
                        </span>
                        {isAvailable && priceItem ? (
                          <span className="font-bold text-[var(--heading-color)] group-hover/price:text-blue-600 transition-colors">
                            ₹{priceItem.price}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">—</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-color)]">
                <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  {cloth.defaultUnit || 'PIECE'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => triggerDirectUpload(cloth.id)}
                    className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Upload new photo to AWS S3"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditCloth(cloth)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Edit garment details and S3 URL"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCloth(cloth.id, cloth.name)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete garment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
