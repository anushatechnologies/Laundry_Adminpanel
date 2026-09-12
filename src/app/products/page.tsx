'use client';

import React from 'react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <UnifiedCatalogManager lockedMode="GARMENTS" hideModeTabs />
    </div>
  );
}
