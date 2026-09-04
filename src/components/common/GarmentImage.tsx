'use client';

import React, { useState, useEffect } from 'react';

interface GarmentImageProps {
  name: string;
  id?: string;
  icon?: string;
  imageUrl?: string;
  categoryTag?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-7 h-7 rounded-lg',
  md: 'w-9 h-9 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
  xl: 'w-16 h-16 rounded-2xl',
  full: 'w-full h-full rounded-none',
};

const S3_BASE = 'https://anjanilaundry.s3.ap-south-2.amazonaws.com';

// 100% Unique Image Mapping for all garments with authentic S3 URLs
export function getLocalFallbackPhoto(name: string, categoryTag = ''): string {
  const n = (name || '').toLowerCase();
  const c = (categoryTag || '').toUpperCase();

  // 1. Bedding & Home Textiles
  if (n.includes('mink') || (n.includes('blanket') && n.includes('double'))) return `${S3_BASE}/garments/cloth-blanket-double.jpg`;
  if (n.includes('blanket')) return `${S3_BASE}/garments/cloth-blanket-single.jpg`;
  if (n.includes('comforter') || n.includes('rajai') || n.includes('quilt')) {
    if (n.includes('single')) return `${S3_BASE}/garments/cloth-quilt-single.jpg`;
    return `${S3_BASE}/garments/cloth-quilt-double.jpg`;
  }
  if (n.includes('curtain')) {
    if (n.includes('window')) return `${S3_BASE}/garments/cloth-curtain-window.jpg`;
    if (n.includes('sheer') || n.includes('net')) return `${S3_BASE}/garments/cloth-curtain-sheer.jpg`;
    if (n.includes('long')) return `${S3_BASE}/garments/cloth-curtain-long.jpg`;
    return `${S3_BASE}/garments/cloth-curtain-door.jpg`;
  }
  if (n.includes('towel')) {
    if (n.includes('hand') || n.includes('face')) return `${S3_BASE}/garments/cloth-hand-towel.jpg`;
    if (n.includes('turkish')) return `${S3_BASE}/garments/cloth-bath-towel-turkish.jpg`;
    return `${S3_BASE}/garments/cloth-bath-towel-large.jpg`;
  }
  if (n.includes('bathrobe')) return `${S3_BASE}/garments/cloth-bathrobe.jpg`;
  if (n.includes('sofa')) {
    if (n.includes('1') || n.includes('single')) return `${S3_BASE}/garments/cloth-sofa-cover-1s.jpg`;
    return `${S3_BASE}/garments/cloth-sofa-cover-3s.jpg`;
  }
  if (n.includes('tablecloth') || n.includes('dining') || n.includes('runner')) {
    if (n.includes('runner')) return `${S3_BASE}/garments/cloth-table-runner.jpg`;
    return `${S3_BASE}/garments/cloth-tablecloth-dining.jpg`;
  }
  if (n.includes('door mat') || n.includes('doormat') || (n.includes('rug') && !n.includes('shrug'))) {
    if (n.includes('coir')) return `${S3_BASE}/garments/cloth-doormat-heavy-coir.jpg`;
    return `${S3_BASE}/garments/cloth-doormat-heavy.jpg`;
  }
  if (n.includes('bath mat')) return `${S3_BASE}/garments/cloth-bath-mat.jpg`;
  if (n.includes('bedsheet') || n.includes('bed sheet')) {
    if (n.includes('single')) return `${S3_BASE}/garments/cloth-bedsheet-single.jpg`;
    if (n.includes('king')) return `${S3_BASE}/garments/cloth-bedsheet-king.jpg`;
    if (n.includes('fitted')) return `${S3_BASE}/garments/cloth-bedsheet-fitted.jpg`;
    if (n.includes('silk') || n.includes('satin')) return `${S3_BASE}/garments/cloth-bedsheet-silk.jpg`;
    return `${S3_BASE}/garments/cloth-bedsheet-double.jpg`;
  }
  if (n.includes('cushion')) {
    if (n.includes('velvet')) return `${S3_BASE}/garments/cloth-cushion-cover-velvet.jpg`;
    return `${S3_BASE}/garments/cloth-cushion-cover.jpg`;
  }
  if (n.includes('pillow')) return `${S3_BASE}/garments/cloth-pillow.jpg`;
  if (n.includes('bolster')) return `${S3_BASE}/garments/cloth-bolster-cover.jpg`;
  if (n.includes('mattress')) return `${S3_BASE}/garments/cloth-mattress-protector.jpg`;
  if (n.includes('duvet')) return `${S3_BASE}/garments/cloth-duvet-cover.jpg`;
  if (n.includes('apron')) return `${S3_BASE}/garments/cloth-kitchen-apron.jpg`;

  // 2. Footwear, Luggage & Accessories
  if (n.includes('formal') && (n.includes('leather') || n.includes('shoes') || n.includes('oxford'))) return `${S3_BASE}/garments/cloth-shoes-formal.jpg`;
  if (n.includes('suede') || n.includes('nubuck')) return `${S3_BASE}/garments/cloth-shoes-suede.jpg`;
  if (n.includes('sneaker') || n.includes('sports shoe') || n.includes('shoe')) return `${S3_BASE}/services/service_shoe_clean.jpg`;
  if (n.includes('trolley') || n.includes('suitcase') || n.includes('luggage')) {
    if (n.includes('20') || n.includes('cabin')) return `${S3_BASE}/garments/cloth-trolley-cabin.jpg`;
    return `${S3_BASE}/garments/cloth-trolley-large.jpg`;
  }
  if (n.includes('backpack') || n.includes('school bag')) return `${S3_BASE}/garments/cloth-bag-backpack.jpg`;
  if (n.includes('handbag') || n.includes('luxury bag')) return `${S3_BASE}/garments/cloth-bag-luxury.jpg`;
  if (n.includes('helmet')) return `${S3_BASE}/garments/cloth-helmet.jpg`;
  if (n.includes('tie') || n.includes('pocket square')) return `${S3_BASE}/garments/cloth-ties-pocket-square.jpg`;

  // 3. Traditional & Bridal
  if (n.includes('silk saree') || n.includes('kanchipuram') || n.includes('zari')) return `${S3_BASE}/garments/cloth-saree-silk.jpg`;
  if (n.includes('saree') || n.includes('sari')) return `${S3_BASE}/garments/cloth-saree-cotton.jpg`;
  if (n.includes('lehenga') || n.includes('bridal')) return `${S3_BASE}/garments/cloth-lehenga.jpg`;
  if (n.includes('sherwani') || n.includes('indo-western')) return `${S3_BASE}/garments/cloth-sherwani.jpg`;
  if (n.includes('sharara') || n.includes('gharara')) return `${S3_BASE}/garments/cloth-sharara.jpg`;
  if (n.includes('shawl') || n.includes('pashmina')) return `${S3_BASE}/garments/cloth-shawl.jpg`;
  if (n.includes('blouse')) {
    if (n.includes('designer') || n.includes('padded')) return `${S3_BASE}/garments/cloth-blouse-designer.jpg`;
    return `${S3_BASE}/garments/cloth-blouse.jpg`;
  }
  if (n.includes('dupatta') || n.includes('stole')) return `${S3_BASE}/garments/cloth-dupatta.jpg`;
  if (n.includes('kurta')) return `${S3_BASE}/garments/cloth-kurta-m.jpg`;
  if (n.includes('kurti') || n.includes('tunic')) return `${S3_BASE}/garments/cloth-kurti.jpg`;
  if (n.includes('dhoti') || n.includes('mundu') || n.includes('lungi')) return `${S3_BASE}/garments/cloth-dhoti.jpg`;
  if (n.includes('nehru') || n.includes('waistcoat')) return `${S3_BASE}/garments/cloth-nehru.jpg`;
  if (n.includes('salwar') || n.includes('anarkali')) return `${S3_BASE}/garments/cloth-salwar.jpg`;

  // 4. Men's Wear
  if (n.includes('blazer') || n.includes('coat')) return `${S3_BASE}/garments/cloth-blazer.jpg`;
  if (n.includes('suit')) {
    if (n.includes('3')) return `${S3_BASE}/garments/cloth-suit-3p.jpg`;
    return `${S3_BASE}/garments/cloth-suit-2p.jpg`;
  }
  if (n.includes('tracksuit') || n.includes('gym')) return `${S3_BASE}/garments/cloth-tracksuit-m.jpg`;
  if (n.includes('sweater') || n.includes('cardigan')) return `${S3_BASE}/garments/cloth-sweater-m.jpg`;
  if (n.includes('jacket') || n.includes('shrug')) return `${S3_BASE}/garments/cloth-jacket.jpg`;
  if (n.includes('jeans') || n.includes('denim')) {
    if (c === 'WOMENS') return `${S3_BASE}/garments/cloth-w-jeans.jpg`;
    return `${S3_BASE}/garments/cloth-jeans.jpg`;
  }
  if (n.includes('trouser') || n.includes('chino')) return `${S3_BASE}/garments/cloth-trouser.jpg`;
  if (n.includes('shorts') || n.includes('bermuda')) return `${S3_BASE}/garments/cloth-shorts-m.jpg`;
  if (n.includes('t-shirt') || n.includes('tshirt') || n.includes('polo')) return `${S3_BASE}/garments/cloth-tshirt.jpg`;
  if (n.includes('shirt')) return `${S3_BASE}/garments/cloth-shirt.jpg`;

  // 5. Kids & Baby
  if (n.includes('soft toy') || n.includes('teddy') || n.includes('toy')) return `${S3_BASE}/garments/cloth-soft-toys.jpg`;
  if (n.includes('romper') || n.includes('onesie')) return `${S3_BASE}/garments/cloth-baby-set.jpg`;
  if (n.includes('uniform')) {
    if (n.includes('shirt')) return `${S3_BASE}/garments/cloth-kid-uniform-shirt.jpg`;
    if (n.includes('skirt') || n.includes('pinafore')) return `${S3_BASE}/garments/cloth-kid-uniform-skirt.jpg`;
    if (n.includes('blazer')) return `${S3_BASE}/garments/cloth-kid-uniform-blazer.jpg`;
    return `${S3_BASE}/garments/cloth-kid-uniform-pant.jpg`;
  }
  if (n.includes('frock')) return `${S3_BASE}/garments/cloth-kids-frock.jpg`;
  if (n.includes('hoodie')) return `${S3_BASE}/garments/cloth-kid-hoodie.jpg`;
  if (n.includes('nightsuit') || n.includes('sleepwear')) return `${S3_BASE}/garments/cloth-kid-nightsuit.jpg`;
  if (n.includes('trackpant')) return `${S3_BASE}/garments/cloth-kid-trackpant.jpg`;

  // 6. Category Fallbacks
  if (c === 'WOMENS') return `${S3_BASE}/garments/cloth-kurti.jpg`;
  if (c === 'KIDS') return `${S3_BASE}/garments/cloth-kids-tshirt.jpg`;
  if (c === 'HOME_TEXTILES') return `${S3_BASE}/garments/cloth-bedsheet-double.jpg`;
  return `${S3_BASE}/garments/cloth-shirt.jpg`;
}

export function getGarmentPhotoUrl(name: string, categoryTag = '', customUrl?: string): string {
  if (customUrl && customUrl.trim() !== '' && !customUrl.includes('laundry-storage-2026') && !customUrl.startsWith('data:image/svg')) {
    return customUrl;
  }
  return getLocalFallbackPhoto(name, categoryTag);
}

export function GarmentImage({
  name,
  id,
  icon,
  imageUrl,
  categoryTag = '',
  size = 'md',
  className = '',
}: GarmentImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => getGarmentPhotoUrl(name, categoryTag, imageUrl));

  useEffect(() => {
    setImgSrc(getGarmentPhotoUrl(name, categoryTag, imageUrl));
  }, [imageUrl, name, categoryTag]);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 shadow-2xs group transition-transform duration-200 hover:scale-105 ${sizeClass} ${className}`}
      title={name}
    >
      <img
        src={imgSrc}
        alt={name}
        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={() => {
          const fallback = getLocalFallbackPhoto(name, categoryTag);
          if (imgSrc !== fallback) {
            setImgSrc(fallback);
          }
        }}
      />
    </div>
  );
}

export function ServiceMasterBadge({
  name,
  icon,
  imageUrl,
  size = 'sm',
  className = '',
}: {
  name: string;
  icon?: string;
  imageUrl?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const n = (name || '').toLowerCase();

  let photo = imageUrl || `${S3_BASE}/services/service_wash_fold.jpg`;
  let badgeColor = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';

  if (n.includes('charak') || n.includes('polishing') || n.includes('saree')) {
    photo = imageUrl || `${S3_BASE}/garments/cloth-saree-silk.jpg`;
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (n.includes('starch') || n.includes('kalaf') || n.includes('crisp')) {
    photo = imageUrl || `${S3_BASE}/garments/cloth-shirt.jpg`;
    badgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (n.includes('dry') || n.includes('clean')) {
    photo = imageUrl || `${S3_BASE}/services/service_dry_cleaning.jpg`;
    badgeColor = 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  } else if (n.includes('express') || n.includes('emergency')) {
    photo = imageUrl || `${S3_BASE}/services/delivery_van_driver.jpg`;
    badgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (n.includes('shoe') || n.includes('spa') || n.includes('leather')) {
    photo = imageUrl || `${S3_BASE}/services/service_shoe_clean.jpg`;
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (n.includes('steam') || n.includes('press')) {
    photo = imageUrl || `${S3_BASE}/services/service_steam_press.jpg`;
    badgeColor = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (n.includes('wash & steam iron') || n.includes('wash & iron')) {
    photo = imageUrl || `${S3_BASE}/services/service_wash_iron.jpg`;
    badgeColor = 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
  }

  const [src, setSrc] = useState(photo);

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border shadow-2xs ${badgeColor} ${className}`}>
      <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-black/10">
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setSrc(`${S3_BASE}/services/service_wash_fold.jpg`)}
        />
      </div>
      <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap">{name}</span>
    </div>
  );
}
