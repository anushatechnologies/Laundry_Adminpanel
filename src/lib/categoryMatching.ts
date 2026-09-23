/**
 * Category Normalization and Taxonomy Matching Engine
 * 
 * Provides robust, non-overlapping matching between garments, subcategories,
 * and master categories. Eliminates false-positive substring collisions
 * (e.g. "WOMEN" containing the substring "MEN").
 */

/**
 * Normalizes any category tag, ID, slug, or label into a canonical uppercase token:
 * 'MENS' | 'WOMENS' | 'KIDS' | 'HOME_TEXTILES' | 'FOOTWEAR' | 'ACCESSORIES' | 'BRIDAL' | 'BULK' | custom
 */
export function getNormalizedCategoryTag(input?: string | null): string {
  if (!input) return '';
  const s = String(input).trim().toUpperCase();

  // 1. WOMEN'S WEAR (CRITICAL: Must be evaluated BEFORE Men's wear because "WOMEN" contains the substring "MEN"!)
  if (
    s === 'W' ||
    s === 'CAT-2' ||
    s === 'WOMEN' ||
    s === 'WOMENS' ||
    s === 'WOMEN_WEAR' ||
    s === 'WOMENS_WEAR' ||
    s === 'WOMEN-WEAR' ||
    s === 'WOMENS-WEAR' ||
    s.includes('WOMEN')
  ) {
    return 'WOMENS';
  }

  // 2. MEN'S WEAR (Strictly guarded so Women's wear never collides)
  if (
    s === 'M' ||
    s === 'CAT-1' ||
    s === 'MEN' ||
    s === 'MENS' ||
    s === 'MEN_WEAR' ||
    s === 'MENS_WEAR' ||
    s === 'MEN-WEAR' ||
    s === 'MENS-WEAR' ||
    s === 'MAN' ||
    s.startsWith('MEN') ||
    s.includes('MENS') ||
    s.includes('MEN WEAR') ||
    s.includes('MENS WEAR')
  ) {
    return 'MENS';
  }

  // 3. KIDS' WEAR
  if (
    s === 'K' ||
    s === 'CAT-3' ||
    s === 'KID' ||
    s === 'KIDS' ||
    s === 'KIDS_WEAR' ||
    s === 'KID_WEAR' ||
    s === 'KIDS-WEAR' ||
    s.includes('KID') ||
    s.includes('CHILD')
  ) {
    return 'KIDS';
  }

  // 4. HOME TEXTILES / HOUSEHOLD
  if (
    s === 'H' ||
    s === 'CAT-4' ||
    s === 'HOME' ||
    s === 'HOME_TEXTILES' ||
    s === 'HOME-TEXTILES' ||
    s === 'HOUSEHOLD' ||
    s.includes('HOME') ||
    s.includes('TEXTILE') ||
    s.includes('BED') ||
    s.includes('CURTAIN')
  ) {
    return 'HOME_TEXTILES';
  }

  // 5. FOOTWEAR / SHOES
  if (
    s === 'F' ||
    s === 'CAT-5' ||
    s === 'FOOTWEAR' ||
    s === 'SHOES' ||
    s === 'SHOE' ||
    s === 'FOOT' ||
    s.includes('FOOT') ||
    s.includes('SHOE') ||
    s.includes('SNEAKER')
  ) {
    return 'FOOTWEAR';
  }

  // 6. ACCESSORIES / BAGS
  if (
    s === 'A' ||
    s === 'CAT-6' ||
    s === 'ACCESSORIES' ||
    s === 'ACCESSORY' ||
    s === 'BAGS' ||
    s === 'BAG' ||
    s.includes('ACCESS') ||
    s.includes('BAG') ||
    s.includes('LUGGAGE')
  ) {
    return 'ACCESSORIES';
  }

  // 7. BRIDAL / WEDDING / SPECIAL
  if (
    s === 'CAT-7' ||
    s === 'BRIDAL' ||
    s === 'WEDDING' ||
    s === 'SPECIAL' ||
    s.includes('BRIDAL') ||
    s.includes('WEDDING')
  ) {
    return 'BRIDAL';
  }

  // 8. BULK / COMMERCIAL
  if (
    s === 'CAT-8' ||
    s === 'BULK' ||
    s === 'COMMERCIAL' ||
    s === 'HOTEL' ||
    s.includes('BULK') ||
    s.includes('COMMERCIAL')
  ) {
    return 'BULK';
  }

  // Fallback: cleaned uppercase string for custom categories
  return s;
}

/**
 * Checks whether a garment or subcategory categoryTag belongs to a category.
 * Handles both object representations and string category IDs.
 */
export function isSubcategoryInCategory(
  subTag: string | undefined | null,
  category: { id: string; name?: string; slug?: string } | string | undefined | null
): boolean {
  if (!subTag || !category) return false;

  const rawSub = String(subTag).trim().toLowerCase();

  // If category is passed as string (e.g. activeCategory string)
  if (typeof category === 'string') {
    const rawCat = category.trim().toLowerCase();
    if (rawSub === rawCat) return true;
    const normSub = getNormalizedCategoryTag(subTag);
    const normCat = getNormalizedCategoryTag(category);
    return Boolean(normSub && normCat && normSub === normCat);
  }

  // Exact raw match on id, slug, or name
  const rawId = (category.id || '').trim().toLowerCase();
  const rawSlug = (category.slug || '').trim().toLowerCase();
  const rawName = (category.name || '').trim().toLowerCase();

  if (rawSub && (rawSub === rawId || rawSub === rawSlug || rawSub === rawName)) {
    return true;
  }

  // Normalized canonical matching
  const normSub = getNormalizedCategoryTag(subTag);
  const normCatId = getNormalizedCategoryTag(category.id);
  const normCatSlug = getNormalizedCategoryTag(category.slug);
  const normCatName = getNormalizedCategoryTag(category.name);

  if (normSub && (normSub === normCatId || normSub === normCatSlug || normSub === normCatName)) {
    return true;
  }

  return false;
}
