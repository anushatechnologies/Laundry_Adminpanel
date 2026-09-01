'use client';

import React from 'react';
import { ClothType, ServiceMaster, ServicePriceItem } from '@/types';
import { GarmentImage } from '@/components/common/GarmentImage';
import { Edit2, Trash2, Cloud, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

interface CatalogProductGridProps {
  clothes: ClothType[];
  serviceMasters: ServiceMaster[];
  priceMatrix: ServicePriceItem[];
  onEditCloth: (cloth: ClothType) => void;
  onDeleteCloth: (clothId: string, clothName: string) => void;
  onOpenPriceInspector: (cloth: ClothType, service: ServiceMaster) => void;
  onToggleActive: (cloth: ClothType) => void;
}

export const CatalogProductGrid: React.FC<CatalogProductGridProps> = ({
  clothes,
  serviceMasters,
  priceMatrix,
  onEditCloth,
  onDeleteCloth,
  onOpenPriceInspector,
  onToggleActive,
}) => {
  if (clothes.length === 0) {
    return (
      <div className="p-12 text-center text-[var(--text-secondary)]">
        <p className="text-sm font-semibold">No garments found in this category or subcategory.</p>
        <p className="text-xs mt-1">Try selecting another subcategory or clear the search query.</p>
      </div>
    );
  }

  // Key 3 services for quick display
  const keyServiceIds = ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-dry-clean'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {clothes.map((cloth) => {
        const isS3 = cloth.imageUrl && cloth.imageUrl.includes('s3');

        return (
          <div
            key={cloth.id}
            className={`azea-card p-3 rounded-xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
              cloth.isActive !== false
                ? 'border-[var(--border-color)] bg-[var(--bg-card)]'
                : 'border-rose-200 dark:border-rose-900/30 opacity-75 bg-rose-50/10'
            }`}
          >
            <div>
              {/* Image & Header */}
              <div className="relative group rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800/60 aspect-4/3 flex items-center justify-center mb-3">
                <GarmentImage
                  name={cloth.name}
                  icon={cloth.icon}
                  categoryTag={cloth.categoryTag}
                  imageUrl={cloth.imageUrl}
                  size="xl"
                />

                {/* S3 Indicator Badge */}
                <div className="absolute top-2 left-2">
                  {isS3 ? (
                    <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                      <Cloud className="w-2.5 h-2.5" /> S3
                    </span>
                  ) : (
                    <span className="bg-slate-700/80 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                      <ImageIcon className="w-2.5 h-2.5" /> Photo
                    </span>
                  )}
                </div>

                {/* Hover overlay quick edit button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditCloth(cloth)}
                    className="p-2 bg-white text-slate-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Edit Garment & Image URL"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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

                  return (
                    <button
                      key={srvId}
                      type="button"
                      onClick={() => onOpenPriceInspector(cloth, srv)}
                      className="w-full flex items-center justify-between text-[11px] py-1 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left group/price"
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
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEditCloth(cloth)}
                  className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
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
  );
};
