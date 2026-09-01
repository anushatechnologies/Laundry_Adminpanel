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

// 100% Unique Image Mapping for all garments
export function getLocalFallbackPhoto(name: string, categoryTag = ''): string {
  const n = (name || '').toLowerCase();
  const c = (categoryTag || '').toUpperCase();

  // Men's Wear
  if (n.includes('dhoti') || n.includes('mundu') || n.includes('lungi')) return '/images/garments/dhoti.jpg';
  if (n.includes('sherwani') || n.includes('indo-western') || n.includes('groom')) return '/images/garments/sherwani.jpg';
  if (n.includes('nehru') || n.includes('waistcoat') || n.includes('modi')) return '/images/garments/nehru.jpg';
  if (n.includes('t-shirt') || n.includes('tee') || n.includes('polo')) return '/images/garments/tshirt.jpg';
  if (n.includes('trouser') || n.includes('chino')) return '/images/garments/trouser.svg';
  if (n.includes('kurta')) return '/images/garments/kurta.svg';
  if (n.includes('blazer') || n.includes('coat')) return '/images/garments/blazer.svg';
  if (n.includes('suit')) return '/images/garments/suit.jpg';
  if (n.includes('sweater') || n.includes('pullover')) return '/images/garments/sweater.svg';
  if (n.includes('jacket') || n.includes('winter')) return '/images/garments/jacket.svg';
  if (n.includes('jean') || n.includes('denim')) return '/images/garments/jeans.jpg';
  if (n.includes('shirt') && !n.includes('kid')) return '/images/garments/shirt.jpg';

  // Women's Wear
  if (n.includes('sharara') || n.includes('gharara')) return '/images/garments/sharara.jpg';
  if (n.includes('shawl') || n.includes('pashmina') || n.includes('cashmere')) return '/images/garments/shawl.jpg';
  if (n.includes('silk') || n.includes('kanchipuram') || n.includes('zari')) return '/images/garments/saree.jpg';
  if (n.includes('saree') || n.includes('sari')) return '/images/garments/saree_cotton.svg';
  if (n.includes('blouse')) return '/images/garments/blouse.svg';
  if (n.includes('salwar') || n.includes('suit set')) return '/images/garments/salwar.svg';
  if (n.includes('lehenga') || n.includes('bridal')) return '/images/garments/lehenga.jpg';
  if (n.includes('gown') || n.includes('dress / western')) return '/images/garments/gown.svg';
  if (n.includes('kurti') || n.includes('tunic')) return '/images/garments/kurti.jpg';

  // Kids & Baby Care
  if (n.includes('toy') || n.includes('teddy') || n.includes('plush') || n.includes('baby') || n.includes('romper')) return '/images/garments/baby_toy.jpg';
  if (n.includes('school') || n.includes('uniform')) return '/images/garments/uniform.svg';
  if (n.includes('frock') || (c === 'KIDS' && n.includes('dress'))) return '/images/garments/kid_dress.svg';
  if (c === 'KIDS' && (n.includes('pant') || n.includes('short'))) return '/images/garments/kid_pant.svg';
  if (c === 'KIDS' && (n.includes('shirt') || n.includes('top'))) return '/images/garments/kid_shirt.svg';

  // Home Textiles & Linen
  if (n.includes('blanket') || n.includes('quilt')) return '/images/garments/blanket.svg';
  if (n.includes('comforter') || n.includes('rajai')) return '/images/garments/comforter.svg';
  if (n.includes('curtain')) return '/images/garments/curtains.svg';
  if (n.includes('towel') || n.includes('bath')) return '/images/garments/towel.svg';
  if (n.includes('bedsheet') || n.includes('sheet')) return '/images/garments/bedsheet.jpg';

  // Footwear, Travel & Luggage
  if (n.includes('trolley') || n.includes('suitcase') || n.includes('luggage')) return '/images/garments/trolley.jpg';
  if (n.includes('formal') || n.includes('leather shoes') || n.includes('oxford')) return '/images/garments/formal_shoes.svg';
  if (n.includes('sneaker') || n.includes('sports shoe') || n.includes('shoe')) return '/images/garments/sneakers.jpg';
  if (n.includes('backpack') || n.includes('school bag') || n.includes('bag-backpack')) return '/images/garments/backpack.svg';
  if (n.includes('handbag') || n.includes('luxury') || n.includes('purse')) return '/images/garments/handbag.jpg';

  return '/images/garments/shirt.jpg';
}

export function getGarmentPhotoUrl(name: string, categoryTag = '', customUrl?: string): string {
  if (customUrl && !customUrl.startsWith('data:image/svg') && customUrl.trim() !== '') {
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

  let photo = imageUrl || '/images/service_wash_fold.jpg';
  let badgeColor = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';

  if (n.includes('charak') || n.includes('polishing') || n.includes('saree')) {
    photo = imageUrl || '/images/service_saree_charak.jpg';
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (n.includes('starch') || n.includes('kalaf')) {
    photo = imageUrl || '/images/service_starch.jpg';
    badgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (n.includes('dry') || n.includes('clean')) {
    photo = imageUrl || '/images/service_dry_cleaning.jpg';
    badgeColor = 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  } else if (n.includes('express') || n.includes('emergency')) {
    photo = imageUrl || '/images/delivery_van_driver.jpg';
    badgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (n.includes('shoe') || n.includes('spa') || n.includes('leather')) {
    photo = imageUrl || '/images/service_shoe_clean.jpg';
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (n.includes('steam') || n.includes('press') || n.includes('iron')) {
    photo = imageUrl || '/images/service_steam_press.jpg';
    badgeColor = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (n.includes('iron')) {
    photo = imageUrl || '/images/service_wash_iron.jpg';
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
          onError={() => setSrc('/images/service_wash_fold.jpg')}
        />
      </div>
      <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap">{name}</span>
    </div>
  );
}
