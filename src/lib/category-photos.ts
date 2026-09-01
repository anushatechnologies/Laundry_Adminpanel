/**
 * Curated high-definition photos for Categories and Subcategories.
 * Prioritizes custom uploaded URLs (from AWS S3 / API).
 */

export const CATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  MENS: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
  'MENS-WEAR': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
  WOMENS: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  'WOMENS-WEAR': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  KIDS: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop',
  'KIDS-BABY': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop',
  HOME: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
  'HOME-TEXTILES': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
  WINTER: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
  'WINTER-WEAR': 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
  WEDDING: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
  'WEDDING-SILK': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
};

export const SUBCATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  // All
  all: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=400&auto=format&fit=crop',

  // Men's
  shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop',
  'shirts & t-shirts': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop',
  't-shirts & polos': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop',
  'trousers & chinos': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop',
  trousers: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop',
  'jeans & denim': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
  'ethnic wear': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop',
  'suits & blazers': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400&auto=format&fit=crop',
  'winter wear': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop',
  'sports & gym': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
  nightwear: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&auto=format&fit=crop',
  innerwear: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=400&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',

  // Women's
  sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
  blouses: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop',
  kurtis: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=400&auto=format&fit=crop',
  'salwar & suits': 'https://images.unsplash.com/photo-1610030469888-2949673413d7?q=80&w=400&auto=format&fit=crop',
  'western dresses': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop',
  'tops & shirts': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&auto=format&fit=crop',
  'jeans & pants': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
  'skirts & shorts': 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=400&auto=format&fit=crop',
  lehengas: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop',
  gowns: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=400&auto=format&fit=crop',
  'dupattas & stoles': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=400&auto=format&fit=crop',
  'maternity wear': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop',

  // Kids
  'baby clothing': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop',
  'boys clothing': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=400&auto=format&fit=crop',
  'girls clothing': 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop',
  'school uniforms': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=400&auto=format&fit=crop',
  'party wear': 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=400&auto=format&fit=crop',
  'traditional wear': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop',

  // Home
  bedsheets: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400&auto=format&fit=crop',
  'bed covers': 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=400&auto=format&fit=crop',
  blankets: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=400&auto=format&fit=crop',
  'comforters & duvets': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=400&auto=format&fit=crop',
  'quilts & razai': 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=400&auto=format&fit=crop',
  curtains: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop',
  'sofa covers': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop',
  'cushion covers': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400&auto=format&fit=crop',
  'pillow covers': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400&auto=format&fit=crop',
  towels: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=400&auto=format&fit=crop',
  'rugs & carpets': 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=400&auto=format&fit=crop',
  'table linen': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop',
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
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop'
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
  // Try partial matches
  for (const [subKey, url] of Object.entries(SUBCATEGORY_DEFAULT_PHOTOS)) {
    if (key.includes(subKey) || subKey.includes(key)) {
      return url;
    }
  }
  return getCategoryImageUrl(categoryTag || 'MENS');
}
