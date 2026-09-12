/**
 * Category-based Service Separation Configuration
 * Ensures that footwear, bags, bridal, clothing, and textiles only receive
 * services that make physical and operational sense for their material type.
 */

export interface CategoryServiceRule {
  allowedServiceIds: string[];
  defaultServices: Array<{ serviceId: string; defaultPrice: number; name: string }>;
  forbiddenServiceIds: string[];
}

export const CATEGORY_SERVICES_RULES: Record<string, CategoryServiceRule> = {
  FOOTWEAR: {
    allowedServiceIds: ['srv-m-spa', 'srv-m-dry-clean', 'srv-m-express'],
    defaultServices: [
      { serviceId: 'srv-m-spa', defaultPrice: 250, name: 'Deep Shoe & Leather Spa' },
      { serviceId: 'srv-m-dry-clean', defaultPrice: 220, name: 'Dry Cleaning' },
      { serviceId: 'srv-m-express', defaultPrice: 200, name: 'Express Emergency Laundry' },
    ],
    forbiddenServiceIds: ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-wash-fold'],
  },
  ACCESSORIES: {
    allowedServiceIds: ['srv-m-spa', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-wash-fold'],
    defaultServices: [
      { serviceId: 'srv-m-spa', defaultPrice: 280, name: 'Bag & Leather Spa' },
      { serviceId: 'srv-m-dry-clean', defaultPrice: 220, name: 'Dry Cleaning' },
      { serviceId: 'srv-m-express', defaultPrice: 220, name: 'Express Emergency Laundry' },
    ],
    forbiddenServiceIds: ['srv-m-steam-iron', 'srv-m-wash-iron'],
  },
  BRIDAL: {
    allowedServiceIds: ['srv-m-dry-clean', 'srv-m-steam-iron', 'srv-m-express', 'srv-m-spa'],
    defaultServices: [
      { serviceId: 'srv-m-dry-clean', defaultPrice: 350, name: 'Dry Cleaning' },
      { serviceId: 'srv-m-steam-iron', defaultPrice: 80, name: 'Premium Steam Press' },
      { serviceId: 'srv-m-express', defaultPrice: 300, name: 'Express Emergency Laundry' },
    ],
    forbiddenServiceIds: ['srv-m-wash-iron', 'srv-m-wash-fold'],
  },
  SPECIAL: {
    allowedServiceIds: ['srv-m-dry-clean', 'srv-m-steam-iron', 'srv-m-express', 'srv-m-spa'],
    defaultServices: [
      { serviceId: 'srv-m-dry-clean', defaultPrice: 250, name: 'Dry Cleaning' },
      { serviceId: 'srv-m-steam-iron', defaultPrice: 60, name: 'Steam Press' },
      { serviceId: 'srv-m-express', defaultPrice: 250, name: 'Express Emergency Laundry' },
    ],
    forbiddenServiceIds: ['srv-m-wash-iron', 'srv-m-wash-fold'],
  },
  MENS: {
    allowedServiceIds: ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-wash-fold', 'srv-m-dry-clean', 'srv-m-express'],
    defaultServices: [
      { serviceId: 'srv-m-steam-iron', defaultPrice: 20, name: 'Iron Only (Steam Press)' },
      { serviceId: 'srv-m-wash-iron', defaultPrice: 49, name: 'Wash & Steam Iron' },
      { serviceId: 'srv-m-wash-fold', defaultPrice: 35, name: 'Wash & Fold' },
      { serviceId: 'srv-m-dry-clean', defaultPrice: 80, name: 'Dry Cleaning' },
    ],
    forbiddenServiceIds: ['srv-m-spa'],
  },
  WOMENS: {
    allowedServiceIds: ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-wash-fold', 'srv-m-dry-clean', 'srv-m-express'],
    defaultServices: [
      { serviceId: 'srv-m-steam-iron', defaultPrice: 20, name: 'Iron Only (Steam Press)' },
      { serviceId: 'srv-m-wash-iron', defaultPrice: 49, name: 'Wash & Steam Iron' },
      { serviceId: 'srv-m-wash-fold', defaultPrice: 35, name: 'Wash & Fold' },
      { serviceId: 'srv-m-dry-clean', defaultPrice: 90, name: 'Dry Cleaning' },
    ],
    forbiddenServiceIds: ['srv-m-spa'],
  },
  KIDS: {
    allowedServiceIds: ['srv-m-steam-iron', 'srv-m-wash-iron', 'srv-m-wash-fold', 'srv-m-dry-clean', 'srv-m-express'],
    defaultServices: [
      { serviceId: 'srv-m-steam-iron', defaultPrice: 15, name: 'Iron Only (Steam Press)' },
      { serviceId: 'srv-m-wash-iron', defaultPrice: 35, name: 'Wash & Steam Iron' },
      { serviceId: 'srv-m-wash-fold', defaultPrice: 25, name: 'Wash & Fold' },
      { serviceId: 'srv-m-dry-clean', defaultPrice: 60, name: 'Dry Cleaning' },
    ],
    forbiddenServiceIds: ['srv-m-spa'],
  },
  HOME_TEXTILES: {
    allowedServiceIds: ['srv-m-wash-iron', 'srv-m-wash-fold', 'srv-m-dry-clean', 'srv-m-steam-iron', 'srv-m-express'],
    defaultServices: [
      { serviceId: 'srv-m-dry-clean', defaultPrice: 150, name: 'Dry Cleaning' },
      { serviceId: 'srv-m-wash-iron', defaultPrice: 99, name: 'Wash & Steam Iron' },
      { serviceId: 'srv-m-wash-fold', defaultPrice: 75, name: 'Wash & Fold' },
    ],
    forbiddenServiceIds: ['srv-m-spa'],
  },
};

/**
 * Check if a service is allowed for a given garment category tag.
 */
export function isServiceAllowedForCategory(categoryTag?: string, serviceId?: string): boolean {
  if (!serviceId) return true;
  if (!categoryTag) return true;

  const normCat = categoryTag.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  // Direct rule lookup
  const rule = CATEGORY_SERVICES_RULES[normCat];
  if (rule) {
    if (rule.forbiddenServiceIds.includes(serviceId)) return false;
    return rule.allowedServiceIds.includes(serviceId);
  }

  // Common aliases
  if (normCat.includes('FOOTWEAR') || normCat.includes('SHOE')) {
    return CATEGORY_SERVICES_RULES.FOOTWEAR.allowedServiceIds.includes(serviceId);
  }
  if (normCat.includes('ACCESSOR') || normCat.includes('BAG') || normCat.includes('LUGGAGE')) {
    return CATEGORY_SERVICES_RULES.ACCESSORIES.allowedServiceIds.includes(serviceId);
  }
  if (normCat.includes('BRIDAL') || normCat.includes('WEDDING') || normCat.includes('SILK')) {
    return CATEGORY_SERVICES_RULES.BRIDAL.allowedServiceIds.includes(serviceId);
  }

  return true;
}

/**
 * Returns focus options dynamically customized for the active category.
 */
export function getCategoryServiceFocusOptions(activeCategory?: string): Array<{
  id: string;
  name: string;
  icon: string;
  badge?: string | null;
}> {
  const normCat = (activeCategory || 'ALL').toUpperCase().replace(/[^A-Z0-9]/g, '_');

  if (normCat === 'FOOTWEAR' || normCat.includes('SHOE')) {
    return [
      { id: 'ALL', name: 'All Services', icon: '✨', badge: null },
      { id: 'srv-m-spa', name: 'Shoe Spa & Cleaning', icon: '👟', badge: 'POPULAR' },
      { id: 'srv-m-dry-clean', name: 'Dry Cleaning', icon: '🧼', badge: null },
      { id: 'srv-m-express', name: 'Express Emergency', icon: '⚡', badge: 'FAST' },
    ];
  }

  if (normCat === 'ACCESSORIES' || normCat.includes('BAG')) {
    return [
      { id: 'ALL', name: 'All Services', icon: '✨', badge: null },
      { id: 'srv-m-spa', name: 'Bag & Leather Spa', icon: '🧽', badge: 'POPULAR' },
      { id: 'srv-m-dry-clean', name: 'Dry Cleaning', icon: '🧼', badge: null },
      { id: 'srv-m-wash-fold', name: 'Wash & Fold (Fabric Bags)', icon: '🧺', badge: null },
      { id: 'srv-m-express', name: 'Express Emergency', icon: '⚡', badge: 'FAST' },
    ];
  }

  if (normCat === 'BRIDAL' || normCat.includes('WEDDING') || normCat.includes('SILK')) {
    return [
      { id: 'ALL', name: 'All Services', icon: '✨', badge: null },
      { id: 'srv-m-dry-clean', name: 'Delicate Dry Clean', icon: '🧼', badge: 'POPULAR' },
      { id: 'srv-m-steam-iron', name: 'Premium Steam Press', icon: '🔥', badge: 'DAILY' },
      { id: 'srv-m-express', name: 'Express Emergency', icon: '⚡', badge: null },
    ];
  }

  // Default / All / Clothing Categories
  return [
    { id: 'ALL', name: 'All Services (Full View)', icon: '✨', badge: null },
    { id: 'srv-m-steam-iron', name: 'Iron Only (Steam Press)', icon: '🔥', badge: 'DAILY' },
    { id: 'srv-m-dry-clean', name: 'Dry Cleaning', icon: '🧥', badge: 'POPULAR' },
    { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', icon: '👔', badge: null },
    { id: 'srv-m-wash-fold', name: 'Wash & Fold', icon: '🧺', badge: null },
    { id: 'srv-m-spa', name: 'Shoe & Leather Spa', icon: '👟', badge: null },
    { id: 'srv-m-express', name: 'Express Emergency', icon: '⚡', badge: null },
  ];
}
