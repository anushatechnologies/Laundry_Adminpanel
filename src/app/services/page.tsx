'use client';

import React from 'react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--heading-color)] tracking-tight">
            Garment Services & Product Photos
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your clean commercial catalog, upload high-resolution product photography to AWS S3, and configure service rates.
          </p>
        </div>
      </div>

      {/* Unified Catalog & Services Manager Component */}
      <UnifiedCatalogManager />
    </div>
  );
}
