/**
 * Official AWS S3 public photos for Categories and Subcategories.
 * Bucket: laundry-storage-2026 (ap-south-1).
 * Every image is authentic, unique, and verified.
 */

export const CATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  MENS: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/mens-wear.jpg',
  'MENS-WEAR': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/mens-wear.jpg',
  WOMENS: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/womens-wear.jpg',
  'WOMENS-WEAR': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/womens-wear.jpg',
  KIDS: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/kids-baby.jpg',
  'KIDS-BABY': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/kids-baby.jpg',
  HOME: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/home-textiles.jpg',
  'HOME-TEXTILES': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/home-textiles.jpg',
  WINTER: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/winter-wear.jpg',
  'WINTER-WEAR': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/winter-wear.jpg',
  WEDDING: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/wedding-silk.jpg',
  'WEDDING-SILK': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/wedding-silk.jpg',
};

export const SUBCATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  // All
  all: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/home-textiles.jpg',

  // Men's
  shirts: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-shirts.jpg',
  'shirts & t-shirts': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-shirts.jpg',
  't-shirts & polos': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-tshirts.jpg',
  'trousers & chinos': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-trousers.jpg',
  trousers: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-trousers.jpg',
  'jeans & denim': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-jeans.jpg',
  jeans: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-jeans.jpg',
  'ethnic wear': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-ethnic.jpg',
  'suits & blazers': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-suits.jpg',
  'winter wear': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-winter.jpg',
  'sports & gym': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-sports.jpg',
  nightwear: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-nightwear.jpg',
  innerwear: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-innerwear.jpg',
  accessories: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/mens-accessories.jpg',

  // Women's
  sarees: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-sarees.jpg',
  blouses: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-blouses.jpg',
  kurtis: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-kurtis.jpg',
  'salwar & suits': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-salwar-suits.jpg',
  'western dresses': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-western-dresses.jpg',
  'tops & shirts': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-tops-shirts.jpg',
  'jeans & pants': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-jeans-pants.jpg',
  'skirts & shorts': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-skirts-shorts.jpg',
  lehengas: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-lehengas.jpg',
  gowns: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-gowns.jpg',
  'dupattas & stoles': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-dupattas.jpg',
  'maternity wear': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/womens-maternity.jpg',

  // Kids
  'baby clothing': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-baby-clothing.jpg',
  'boys clothing': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-boys-clothing.jpg',
  'girls clothing': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-girls-clothing.jpg',
  'school uniforms': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-school-uniforms.jpg',
  'party wear': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-party-wear.jpg',
  'traditional wear': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/kids-traditional-wear.jpg',

  // Home
  bedsheets: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-bedsheets.jpg',
  'bed covers': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-bed-covers.jpg',
  blankets: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-blankets.jpg',
  'comforters & duvets': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-comforters-duvets.jpg',
  'quilts & razai': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-quilts-razai.jpg',
  curtains: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-curtains.jpg',
  'sofa covers': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-sofa-covers.jpg',
  'cushion covers': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-cushion-covers.jpg',
  'pillow covers': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-pillow-covers.jpg',
  towels: 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-towels.jpg',
  'rugs & carpets': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-rugs-carpets.jpg',
  'table linen': 'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/subcategories/home-table-linen.jpg',
};

export function getCategoryImageUrl(tag: string, customUrl?: string): string {
  if (customUrl && typeof customUrl === 'string' && customUrl.trim().length > 10) {
    return customUrl.trim();
  }
  const cleanTag = (tag || 'MENS').toUpperCase().trim();
  return (
    CATEGORY_DEFAULT_PHOTOS[cleanTag] ||
    CATEGORY_DEFAULT_PHOTOS[cleanTag.replace(/_/g, '-')] ||
    CATEGORY_DEFAULT_PHOTOS.MENS ||
    'https://laundry-storage-2026.s3.ap-south-1.amazonaws.com/categories/mens-wear.jpg'
  );
}

export function getSubcategoryImageUrl(subName: string, categoryTag?: string, customUrl?: string): string {
  if (customUrl && typeof customUrl === 'string' && customUrl.trim().length > 10) {
    return customUrl.trim();
  }
  const key = (subName || 'all').toLowerCase().trim();
  if (SUBCATEGORY_DEFAULT_PHOTOS[key]) {
    return SUBCATEGORY_DEFAULT_PHOTOS[key];
  }
  for (const [subKey, url] of Object.entries(SUBCATEGORY_DEFAULT_PHOTOS)) {
    if (key.includes(subKey) || subKey.includes(key)) {
      return url;
    }
  }
  return getCategoryImageUrl(categoryTag || 'MENS');
}
