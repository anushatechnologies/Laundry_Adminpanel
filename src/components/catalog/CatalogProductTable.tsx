'use client';

import React from 'react';
import { ClothType, ServiceMaster, ServicePriceItem } from '@/types';
import { GarmentImage, ServiceMasterBadge } from '@/components/common/GarmentImage';
import { Edit2, Trash2 } from 'lucide-react';

interface CatalogProductTableProps {
  clothes: ClothType[];
  serviceMasters: ServiceMaster[];
  priceMatrix: ServicePriceItem[];
  onEditCloth: (cloth: ClothType) => void;
  onDeleteCloth: (clothId: string, clothName: string) => void;
  onOpenPriceInspector: (cloth: ClothType, service: ServiceMaster) => void;
  onToggleActive: (cloth: ClothType) => void;
}

export const CatalogProductTable: React.FC<CatalogProductTableProps> = ({
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-[var(--bg-secondary-card)] border-b border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] font-bold">
            <th className="p-3 pl-6 min-w-[240px]">Garment / Cloth Type</th>
            <th className="p-3 min-w-[130px]">Subcategory</th>
            {serviceMasters.map((srv) => (
              <th key={srv.id} className="p-3 text-center min-w-[120px]">
                <div className="flex items-center justify-center">
                  <ServiceMasterBadge name={srv.name} icon={srv.icon} />
                </div>
              </th>
            ))}
            <th className="p-3 text-right pr-6 min-w-[90px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {clothes.map((cloth) => (
            <tr key={cloth.id} className="hover:bg-slate-500/5 transition-colors">
              {/* Garment Details */}
              <td className="p-3 pl-6">
                <div className="flex items-center gap-3">
                  <GarmentImage
                    name={cloth.name}
                    icon={cloth.icon}
                    categoryTag={cloth.categoryTag}
                    imageUrl={cloth.imageUrl}
                    size="md"
                  />
                  <div>
                    <div className="font-bold text-[var(--heading-color)] flex items-center gap-1.5">
                      <span>{cloth.name}</span>
                      <button
                        type="button"
                        onClick={() => onToggleActive(cloth)}
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm cursor-pointer transition-colors ${
                          cloth.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                        title="Toggle Active status"
                      >
                        {cloth.isActive !== false ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                    {cloth.description && (
                      <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">
                        {cloth.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Subcategory */}
              <td className="p-3">
                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium">
                  {cloth.subCategory || 'General'}
                </span>
              </td>

              {/* Service Price Cells */}
              {serviceMasters.map((srv) => {
                const priceItem = priceMatrix.find(
                  (p) => p.clothTypeId === cloth.id && p.serviceId === srv.id
                );
                const isAvailable = priceItem ? priceItem.isAvailable !== false && priceItem.price > 0 : false;

                return (
                  <td key={srv.id} className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenPriceInspector(cloth, srv)}
                      className={`w-full py-1.5 px-2 rounded-lg border transition-all cursor-pointer font-bold ${
                        isAvailable && priceItem
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 dark:bg-slate-900/30 dark:text-slate-500 dark:border-slate-800'
                      }`}
                      title={`Edit ${cloth.name} - ${srv.name}`}
                    >
                      {isAvailable && priceItem ? (
                        <div>
                          <span>₹{priceItem.price}</span>
                          {priceItem.expressPrice && (
                            <span className="block text-[9px] font-normal text-emerald-600 dark:text-emerald-400">
                              Exp: ₹{priceItem.expressPrice}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-normal">—</span>
                      )}
                    </button>
                  </td>
                );
              })}

              {/* Actions */}
              <td className="p-3 text-right pr-6">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEditCloth(cloth)}
                    className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                    title="Edit Garment"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCloth(cloth.id, cloth.name)}
                    className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors"
                    title="Delete Garment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
