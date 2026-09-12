'use client';

import React from 'react';
import { UnifiedCatalogManager } from '@/components/catalog/UnifiedCatalogManager';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <UnifiedCatalogManager lockedMode="CATEGORIES" hideModeTabs />
    </div>
  );
}
