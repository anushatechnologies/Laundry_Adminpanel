import {
  ServiceCategory,
  Service,
  Order,
  Coupon,
  Offer,
  SubscriptionPlan,
  CustomerSubscription,
  Wallet,
  PincodeZone,
  StaffMember,
  LaundryBatch,
  OrderStatus,
  ClothType,
  ServiceMaster,
  ServicePriceItem,
  PricingSettings,
  ClothCategoryTag,
  GarmentTagItem,
  WeightVerification,
  DisputeReport,
  InternalNote,
  LaundryMachine,
  CODReconciliationRecord,
  GarmentTagStatus,
  DisputeStatus,
  HubBranch,
  InHouseFleetVehicle,
  DistanceDeliveryConfig,
  DistanceTier,
  TimeSlotCapacity,
  QCChecklistRecord,
  GarmentPhotoEvidence,
  DamageCompensationRule,
  WalletTransaction,
  LoyaltyPointsAccount,
  NotificationTemplate,
  ConsumableInventory,
  AuditLogEntry,
  BulkPricingItem,
  BulkLaundryType,
} from '@/types';

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: "Men's Wear",
    slug: 'mens-wear',
    icon: '👔',
    description: 'Shirts, T-Shirts, Trousers, Suits, Blazers, Kurtas & Jackets.',
    isPopular: true,
    color: 'blue',
  },
  {
    id: 'cat-2',
    name: "Women's Wear",
    slug: 'womens-wear',
    icon: '👗',
    description: 'Sarees, Kurtis, Salwar Suits, Dresses, Gowns, Dupattas & Tops.',
    isPopular: true,
    color: 'pink',
  },
  {
    id: 'cat-3',
    name: 'Premium & Bridal Wear',
    slug: 'bridal-wear',
    icon: '💍',
    description: 'Bridal Lehengas, Heavy Sarees, Gowns, Sherwanis & Designer Wear.',
    isPopular: true,
    color: 'purple',
  },
  {
    id: 'cat-4',
    name: 'Kids Wear',
    slug: 'kids-wear',
    icon: '👶',
    description: 'Shirts, Frocks, Uniforms, Baby Rompers & Baby Blankets.',
    isPopular: false,
    color: 'amber',
  },
  {
    id: 'cat-5',
    name: 'Home Textiles',
    slug: 'home-textiles',
    icon: '🛏️',
    description: 'Bedsheets, Blankets, Comforters, Curtains, Towels & Cushion Covers.',
    isPopular: true,
    color: 'teal',
  },
  {
    id: 'cat-6',
    name: 'Special Deep Cleaning',
    slug: 'special-cleaning',
    icon: '🧹',
    description: 'Mattress, Carpet, Rug, Curtain & Sofa Cover Deep Treatment.',
    isPopular: false,
    color: 'indigo',
  },
  {
    id: 'cat-7',
    name: 'Bulk / Per-KG Laundry',
    slug: 'bulk-laundry',
    icon: '🧺',
    description: 'Everyday clothes, towels, bedsheets weighed per KG.',
    isPopular: true,
    color: 'emerald',
  },
  {
    id: 'cat-8',
    name: 'Baby Care Laundry',
    slug: 'baby-care',
    icon: '👶',
    description: 'Gentle sanitizing wash with extra rinse for sensitive baby skin.',
    isPopular: false,
    color: 'cyan',
  },
  {
    id: 'cat-9',
    name: 'Wedding & Couture Care',
    slug: 'wedding-care',
    icon: '💍',
    description: 'Special handling, hand finish, stain treatment & bridal packaging.',
    isPopular: false,
    color: 'rose',
  },
  {
    id: 'cat-10',
    name: 'Corporate & Bulk Commercial',
    slug: 'corporate-laundry',
    icon: '🏢',
    description: 'Hotel linen, PG laundry, gym towels, uniforms & monthly contracts.',
    isPopular: false,
    color: 'slate',
  },
];

export const INITIAL_SERVICES: Service[] = [
  // 1. Laundry (Wash & Fold / Wash & Iron)
  {
    id: 'srv-1',
    categoryId: 'cat-1',
    name: 'Wash & Fold (Standard)',
    slug: 'wash-and-fold',
    description: 'Everyday clothes washed, tumble dried, and neatly folded. Price calculated per KG.',
    pricingModel: 'PER_KG',
    basePrice: 60,
    unit: 'KG',
    minOrderQuantity: 3,
    turnaroundHours: 24,
    popular: true,
    expressAvailable: true,
    includedItems: ['T-shirts', 'Jeans', 'Trousers', 'Towels', 'Undergarments', 'Socks', 'Daily Wear'],
  },
  {
    id: 'srv-2',
    categoryId: 'cat-1',
    name: 'Wash & Steam Iron',
    slug: 'wash-and-iron',
    description: 'Complete hygiene wash + crisp steam press with hanger or compact fold packaging.',
    pricingModel: 'PER_KG',
    basePrice: 85,
    unit: 'KG',
    minOrderQuantity: 3,
    turnaroundHours: 36,
    popular: true,
    expressAvailable: true,
    includedItems: ['Shirts', 'Trousers', 'Kurtas', 'Salwars', 'Dresses'],
  },
  {
    id: 'srv-3',
    categoryId: 'cat-1',
    name: 'Premium Gentle Wash',
    slug: 'premium-gentle-wash',
    description: 'Individual load wash with imported fabric conditioner, zero color bleed guarantee.',
    pricingModel: 'PER_KG',
    basePrice: 110,
    unit: 'KG',
    minOrderQuantity: 2,
    turnaroundHours: 36,
    popular: false,
    expressAvailable: true,
  },
  {
    id: 'srv-4',
    categoryId: 'cat-1',
    name: 'Hand Wash Delicate',
    slug: 'hand-wash-delicate',
    description: 'Manual gentle wash for delicate knits, lace, and sensitive blended fabrics.',
    pricingModel: 'PER_ITEM',
    basePrice: 75,
    unit: 'Item',
    turnaroundHours: 48,
    popular: false,
  },
  {
    id: 'srv-5',
    categoryId: 'cat-1',
    name: 'Express Same-Day Laundry',
    slug: 'express-same-day',
    description: 'Morning pickup (by 10 AM) and evening delivery (by 8 PM) fresh & ready.',
    pricingModel: 'PER_KG',
    basePrice: 120,
    unit: 'KG',
    minOrderQuantity: 3,
    turnaroundHours: 12,
    popular: true,
    expressAvailable: true,
  },

  // 2. Ironing
  {
    id: 'srv-6',
    categoryId: 'cat-2',
    name: 'Steam Ironing — Shirt / Pant / Top',
    slug: 'steam-iron-regular',
    description: 'Industrial steam press for wrinkle-free finish with crisp collar & cuff shape.',
    pricingModel: 'PER_ITEM',
    basePrice: 15,
    unit: 'Item',
    turnaroundHours: 18,
    popular: true,
    expressAvailable: true,
  },
  {
    id: 'srv-7',
    categoryId: 'cat-2',
    name: 'Saree Steam Pressing',
    slug: 'saree-steam-iron',
    description: 'Long table tension pressing for cotton, chiffon, and georgette sarees with roll-fold.',
    pricingModel: 'PER_ITEM',
    basePrice: 60,
    unit: 'Item',
    turnaroundHours: 24,
    popular: true,
  },
  {
    id: 'srv-8',
    categoryId: 'cat-2',
    name: 'Suit 2-Piece Steam Pressing',
    slug: 'suit-pressing',
    description: 'Form-finish 3D steam dummy press for blazer and trousers to preserve canvas structure.',
    pricingModel: 'PER_ITEM',
    basePrice: 120,
    unit: 'Item',
    turnaroundHours: 24,
    popular: true,
  },
  {
    id: 'srv-9',
    categoryId: 'cat-2',
    name: 'Curtain / Drapes Pressing',
    slug: 'curtain-ironing',
    description: 'Heavy steam pressing for long pleated drapes up to 9 ft.',
    pricingModel: 'PER_ITEM',
    basePrice: 90,
    unit: 'Piece',
    turnaroundHours: 24,
  },

  // 3. Dry Cleaning
  {
    id: 'srv-10',
    categoryId: 'cat-3',
    name: 'Dry Clean — Formal Shirt / Top',
    slug: 'dry-clean-shirt',
    description: 'Hydrocarbon solvent clean, collar stain scrub, and premium form pressing.',
    pricingModel: 'PER_ITEM',
    basePrice: 80,
    unit: 'Item',
    turnaroundHours: 48,
    popular: true,
    expressAvailable: true,
  },
  {
    id: 'srv-11',
    categoryId: 'cat-3',
    name: 'Dry Clean — 2-Piece Suit / Blazer',
    slug: 'dry-clean-suit',
    description: 'Multi-stage gentle dry clean, shoulder pad preservation, lint removal & breathable garment bag.',
    pricingModel: 'PER_ITEM',
    basePrice: 280,
    unit: 'Item',
    turnaroundHours: 48,
    popular: true,
    expressAvailable: true,
  },
  {
    id: 'srv-12',
    categoryId: 'cat-3',
    name: 'Dry Clean — Silk Saree / Zari',
    slug: 'dry-clean-silk-saree',
    description: 'Specialized chemical solvent treatment for Kanchipuram, Banarasi, and Tussar silk.',
    pricingModel: 'PER_ITEM',
    basePrice: 220,
    unit: 'Item',
    turnaroundHours: 48,
    popular: true,
  },
  {
    id: 'srv-13',
    categoryId: 'cat-3',
    name: 'Dry Clean — Winter Coat / Trench / Leather',
    slug: 'dry-clean-coat',
    description: 'Heavy woolen overcoat or genuine leather jacket conditioning and dry clean.',
    pricingModel: 'PER_ITEM',
    basePrice: 350,
    unit: 'Item',
    turnaroundHours: 72,
    popular: false,
  },

  // 4. Wedding & Traditional Wear
  {
    id: 'srv-14',
    categoryId: 'cat-4',
    name: 'Bridal Lehenga / Heavy Gown',
    slug: 'bridal-lehenga-cleaning',
    description: 'Delicate stone, zardozi, and sequence hand-shielding dry clean with tissue wrap box.',
    pricingModel: 'PER_ITEM',
    basePrice: 650,
    unit: 'Set',
    turnaroundHours: 72,
    popular: true,
  },
  {
    id: 'srv-15',
    categoryId: 'cat-4',
    name: 'Sherwani & Kurta Set',
    slug: 'sherwani-cleaning',
    description: 'Groom sherwani, stole & churidar dry clean with anti-tarnish metallic protection.',
    pricingModel: 'PER_ITEM',
    basePrice: 450,
    unit: 'Set',
    turnaroundHours: 72,
    popular: true,
  },

  // 5. Home Textiles
  {
    id: 'srv-16',
    categoryId: 'cat-5',
    name: 'Double Bedsheet + 2 Pillow Covers Wash',
    slug: 'bedsheet-set-wash',
    description: 'Thermal disinfection wash at 60°C for deep mite removal and crisp calendar pressing.',
    pricingModel: 'PER_ITEM',
    basePrice: 120,
    unit: 'Set',
    turnaroundHours: 36,
    popular: true,
  },
  {
    id: 'srv-17',
    categoryId: 'cat-5',
    name: 'Heavy Blanket / Comforter / Quilt Dry Clean',
    slug: 'blanket-comforter-dry-clean',
    description: 'High-capacity drum sanitization, fluff restoration, and vacuum storage sealing.',
    pricingModel: 'PER_ITEM',
    basePrice: 260,
    unit: 'Item',
    turnaroundHours: 48,
    popular: true,
  },
  {
    id: 'srv-18',
    categoryId: 'cat-5',
    name: 'Bath Towels & Robes (Per KG)',
    slug: 'towels-per-kg',
    description: 'Ultra-fluff soft wash with antimicrobial rinse for hotel-grade softness.',
    pricingModel: 'PER_KG',
    basePrice: 70,
    unit: 'KG',
    minOrderQuantity: 2,
    turnaroundHours: 24,
  },

  // 6. Home Cleaning
  {
    id: 'srv-19',
    categoryId: 'cat-6',
    name: 'Sofa Deep Shampooing (Per Seat)',
    slug: 'sofa-cleaning',
    description: 'On-site injection-extraction foam deep clean to remove dirt, stains and odors.',
    pricingModel: 'PER_ITEM',
    basePrice: 200,
    unit: 'Seat',
    turnaroundHours: 24,
  },
  {
    id: 'srv-20',
    categoryId: 'cat-6',
    name: 'Carpet Cleaning (Up to 5x7 ft)',
    slug: 'carpet-cleaning',
    description: 'Rotary brush wash, dust extraction, and anti-fungal treatment for area rugs.',
    pricingModel: 'PER_ITEM',
    basePrice: 450,
    unit: 'Piece',
    turnaroundHours: 48,
  },

  // 7. Bags & Accessories
  {
    id: 'srv-21',
    categoryId: 'cat-7',
    name: 'Backpack / Laptop Bag Deep Clean',
    slug: 'backpack-cleaning',
    description: 'Zipper lubrication, inner liner sanitize, stain wash, and deodorization.',
    pricingModel: 'PER_ITEM',
    basePrice: 180,
    unit: 'Item',
    turnaroundHours: 48,
  },
  {
    id: 'srv-22',
    categoryId: 'cat-7',
    name: 'Luxury Leather Handbag Spa',
    slug: 'leather-bag-spa',
    description: 'pH-neutral leather cleaner, edge conditioning, color rejuvenation, and moisture shield.',
    pricingModel: 'PER_ITEM',
    basePrice: 490,
    unit: 'Item',
    turnaroundHours: 72,
  },

  // 8. Baby & Kids
  {
    id: 'srv-23',
    categoryId: 'cat-8',
    name: 'Baby Clothes Gentle Sanitization (Per KG)',
    slug: 'baby-clothes-per-kg',
    description: 'Special zero-phosphate baby detergent, double rinse cycle, anti-allergen steam pressing.',
    pricingModel: 'PER_KG',
    basePrice: 80,
    unit: 'KG',
    minOrderQuantity: 2,
    turnaroundHours: 24,
    popular: true,
  },
  {
    id: 'srv-24',
    categoryId: 'cat-8',
    name: 'Plush / Soft Toy Deep Hygiene Wash',
    slug: 'soft-toy-wash',
    description: 'UV disinfection, anti-dust-mite organic wash, and gentle tumble restoration.',
    pricingModel: 'PER_ITEM',
    basePrice: 110,
    unit: 'Item',
    turnaroundHours: 48,
  },

  // 9. Corporate & Hospitality
  {
    id: 'srv-25',
    categoryId: 'cat-9',
    name: 'Hotel & PG Bedding Bulk Contract (Per KG)',
    slug: 'corporate-bedding-bulk',
    description: 'Commercial high-volume wash, thermal ozone disinfection, and automated folding.',
    pricingModel: 'PER_KG',
    basePrice: 42,
    unit: 'KG',
    minOrderQuantity: 25,
    turnaroundHours: 24,
  },
  {
    id: 'srv-26',
    categoryId: 'cat-9',
    name: 'Staff Uniform Wash & Press (Per Set)',
    slug: 'corporate-uniform-set',
    description: 'Corporate staff aprons, scrubs, security, or hospitality uniforms barcode tagged.',
    pricingModel: 'PER_ITEM',
    basePrice: 45,
    unit: 'Set',
    minOrderQuantity: 10,
    turnaroundHours: 24,
  },

  // 10. Special Treatments
  {
    id: 'srv-27',
    categoryId: 'cat-10',
    name: 'Targeted Stubborn Stain Removal',
    slug: 'stain-removal',
    description: 'Spotting table ultrasonic gun treatment for wine, grease, ink, turmeric, and rust.',
    pricingModel: 'PER_ITEM',
    basePrice: 60,
    unit: 'Garment',
    turnaroundHours: 24,
  },
  {
    id: 'srv-28',
    categoryId: 'cat-10',
    name: 'Ozone Sanitization & Odor Extraction',
    slug: 'ozone-sanitization',
    description: 'Eliminates smoke, mold, pet, and sweat odors without harsh chemicals.',
    pricingModel: 'PER_ITEM',
    basePrice: 75,
    unit: 'Garment',
    turnaroundHours: 24,
  },

  // 11. Pet Products
  {
    id: 'srv-29',
    categoryId: 'cat-11',
    name: 'Pet Bed & Mattress Deep Sanitization',
    slug: 'pet-bed-clean',
    description: 'Fur extraction, enzyme urine cleaner, flea prevention wash, and UV sterilization.',
    pricingModel: 'PER_ITEM',
    basePrice: 220,
    unit: 'Item',
    turnaroundHours: 48,
  },

  // 12. Sports & Fitness
  {
    id: 'srv-30',
    categoryId: 'cat-12',
    name: 'Gym Wear & Jersey Pro Wash (Per KG)',
    slug: 'sports-wear-per-kg',
    description: 'Active-wear polymer wash that restores breathability and eliminates deep sweat bacteria.',
    pricingModel: 'PER_KG',
    basePrice: 75,
    unit: 'KG',
    minOrderQuantity: 2,
    turnaroundHours: 24,
  },

  // 13. Express Services
  {
    id: 'srv-31',
    categoryId: 'cat-13',
    name: 'Super Express 6-Hour Emergency Laundry',
    slug: 'super-express-6h',
    description: 'Immediate dedicated machine run and hot steam press for urgent travel & events.',
    pricingModel: 'PER_KG',
    basePrice: 150,
    unit: 'KG',
    minOrderQuantity: 3,
    turnaroundHours: 6,
    popular: true,
  },

  // 14. Seasonal
  {
    id: 'srv-32',
    categoryId: 'cat-14',
    name: 'Winter Woolens & Sweaters Conditioning',
    slug: 'winter-woolens',
    description: 'Cashmere and wool gentle wash with natural cedar moth-repellent protective packaging.',
    pricingModel: 'PER_ITEM',
    basePrice: 140,
    unit: 'Item',
    turnaroundHours: 48,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-1',
    code: 'WELCOME100',
    title: 'Flat ₹100 Off First Order',
    description: 'Get flat ₹100 discount on your very first laundry booking above ₹299.',
    discountType: 'FLAT',
    discountValue: 100,
    minOrderValue: 299,
    firstOrderOnly: true,
    expiryDate: '2026-12-31',
    usageCount: 1420,
    isActive: true,
  },
  {
    id: 'cp-2',
    code: 'FREESHIP',
    title: 'Free Pickup & Delivery',
    description: 'Zero convenience fee on orders above ₹399.',
    discountType: 'FLAT',
    discountValue: 50,
    minOrderValue: 399,
    firstOrderOnly: false,
    expiryDate: '2026-12-31',
    usageCount: 830,
    isActive: true,
  },
  {
    id: 'cp-3',
    code: 'WEEKEND20',
    title: '20% Weekend Savings',
    description: 'Save 20% up to ₹150 on all wash & fold or dry clean orders placed this weekend.',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 350,
    maxDiscountCap: 150,
    firstOrderOnly: false,
    expiryDate: '2026-12-31',
    usageCount: 654,
    isActive: true,
  },
  {
    id: 'cp-4',
    code: 'PREMIUM50',
    title: 'Flat ₹50 Off Dry Cleaning',
    description: 'Valid on suit, saree, and blazer dry cleanings above ₹400.',
    discountType: 'FLAT',
    discountValue: 50,
    minOrderValue: 400,
    firstOrderOnly: false,
    expiryDate: '2026-12-31',
    usageCount: 312,
    isActive: true,
  },
  {
    id: 'cp-5',
    code: 'MEGA30',
    title: '30% Off on Bulk Laundry (5+ KG)',
    description: 'Save 30% up to ₹250 on wash & iron orders above ₹500.',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    minOrderValue: 500,
    maxDiscountCap: 250,
    firstOrderOnly: false,
    expiryDate: '2026-12-31',
    usageCount: 489,
    isActive: true,
  },
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'of-1',
    title: 'First Order Special',
    badge: 'NEW USER',
    description: 'Get Flat ₹100 Off on your first order with free doorstep pickup.',
    code: 'WELCOME100',
    discount: '₹100 OFF',
    validTill: 'Ongoing',
    color: 'amber',
  },
  {
    id: 'of-2',
    title: 'Weekend Laundry Bonanza',
    badge: 'WEEKEND SPECIAL',
    description: 'Get 20% off all Wash & Steam Iron bookings above ₹350.',
    code: 'WEEKEND20',
    discount: '20% OFF',
    validTill: 'Every Sat & Sun',
    color: 'teal',
  },
  {
    id: 'of-3',
    title: 'Combo Wash & Iron Pack',
    badge: 'SUPER SAVER',
    description: 'Bundle Wash & Iron at ₹499 instead of ₹650 for up to 6 KG.',
    code: 'COMBO499',
    discount: 'SAVE ₹151',
    validTill: 'Limited Period',
    color: 'blue',
  },
  {
    id: 'of-4',
    title: 'Refer a Friend & Earn',
    badge: 'REFERRAL',
    description: 'Give ₹100 to your friend, get ₹100 wallet credit on their first delivery.',
    code: 'SHARE CODE',
    discount: '₹100 CREDIT',
    validTill: 'Unlimited',
    color: 'purple',
  },
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-basic-1m',
    name: 'Basic Plan (1 Month)',
    slug: 'basic-1m',
    durationMonths: 1,
    price: 999,
    originalPrice: 1299,
    validityDays: 30,
    includedKg: 20,
    freePickupDelivery: true,
    priorityService: false,
    maxFamilyMembers: 1,
    features: [
      '20 KG Wash & Fold / Wash & Iron per month',
      'Free Doorstep Pickup & Delivery',
      'Turnaround in 36 Hours',
      'Rollover unused KG (up to 5 KG)',
      'Standard eco-detergents & softeners',
    ],
    popular: false,
    isActive: true,
  },
  {
    id: 'sub-premium-1m',
    name: 'Premium Plan (1 Month)',
    slug: 'premium-1m',
    durationMonths: 1,
    price: 1999,
    originalPrice: 2499,
    validityDays: 30,
    includedKg: 50,
    freePickupDelivery: true,
    priorityService: true,
    maxFamilyMembers: 2,
    features: [
      '50 KG Wash & Fold / Steam Iron per month',
      'Free Priority Pickup & Delivery',
      'Fast 24-Hour Express Turnaround',
      'Rollover unused KG (up to 15 KG)',
      '1 Free Blazer/Saree Dry Clean / month',
      'Antibacterial sanitization wash',
    ],
    popular: true,
    isActive: true,
  },
  {
    id: 'sub-family-3m',
    name: 'Quarterly Family Saver (3 Months)',
    slug: 'family-3m',
    durationMonths: 3,
    price: 4999,
    originalPrice: 6999,
    validityDays: 90,
    includedKg: 150,
    freePickupDelivery: true,
    priorityService: true,
    maxFamilyMembers: 4,
    features: [
      '150 KG Total Allowance (50 KG / Month)',
      'Save ₹2,000 on quarterly commitment',
      'VIP Priority Slots & 12h Emergency Express',
      'Free pickup & delivery up to 24 visits',
      '3 Free Dry Clean vouchers included',
      'Dedicated Customer Support Concierge',
    ],
    popular: true,
    isActive: true,
  },
  {
    id: 'sub-annual-12m',
    name: 'Annual Ultimate Care (12 Months)',
    slug: 'annual-12m',
    durationMonths: 12,
    price: 14999,
    originalPrice: 23999,
    validityDays: 365,
    includedKg: 600,
    freePickupDelivery: true,
    priorityService: true,
    maxFamilyMembers: 5,
    features: [
      '600 KG Total Allowance (50 KG / Month)',
      'Save ₹9,000 with Annual Plan',
      'Unlimited KG rollover across full year',
      'Free Shoe & Handbag Spa included',
      '10 Free Heavy Blanket Dry Clean vouchers',
      'Dedicated Household Manager',
    ],
    popular: false,
    isActive: true,
  },
];

export const INITIAL_PINCODES: PincodeZone[] = [
  // --- HYDERABAD & SECUNDERABAD (50 Key Localities & Tech Hubs) ---
  { pincode: '500081', areaName: 'Hitec City / Madhapur / Cyber Towers', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500032', areaName: 'Gachibowli / Financial District / Nanakramguda', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500084', areaName: 'Kondapur / Kothaguda / Botanical Garden', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500072', areaName: 'Kukatpally / KPHB Colony (Phase 1-6)', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500085', areaName: 'KPHB Phase 7-9 / JNTU Road', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500033', areaName: 'Jubilee Hills / Film Nagar / Road No 36', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500034', areaName: 'Banjara Hills (Road 1-14) / Panjagutta', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500089', areaName: 'Manikonda / Puppalguda / Alkapur Township', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500075', areaName: 'Gandipet / Kokapet / Narsingi', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500049', areaName: 'Miyapur / Chandanagar / Gangaram', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500050', areaName: 'BHEL / Lingampally / Tara Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500090', areaName: 'Nizampet / Pragathi Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500018', areaName: 'Ameerpet / SR Nagar / Sanathnagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500082', areaName: 'Somajiguda / Raj Bhavan Road / Erramanzil', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500016', areaName: 'Begumpet / Prakash Nagar / Mayur Marg', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500003', areaName: 'Secunderabad / MG Road / Paradise', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500026', areaName: 'Marredpally (East & West) / Shenoy Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500009', areaName: 'Bowenpally / Hasmathpet / Manovikas Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500015', areaName: 'Karkhana / Trimulgherry / Gunrock', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500011', areaName: 'Alwal / Lothkunta / Old Alwal', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500062', areaName: 'ECIL / AS Rao Nagar / Dr AS Rao Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500047', areaName: 'Sainikpuri / Vayupuri / Yapral', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500040', areaName: 'Malkajgiri / Safilguda / Anandbagh', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500056', areaName: 'Dammaiguda / Nagaram / Keesara', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500014', areaName: 'Kompally / Jeedimetla Village / Petbasheerabad', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500055', areaName: 'Chintal / Quthbullapur / Suchitra', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500037', areaName: 'Balanagar / Moosapet / Fathenagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500008', areaName: 'Mehdipatnam / Tolichowki / Shaikpet', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500028', areaName: 'Masab Tank / AC Guards / Khairatabad', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500004', areaName: 'Nampally / Red Hills / Bazar Ghat', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500001', areaName: 'Abids / Koti / Gunfoundry / Sultan Bazaar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500029', areaName: 'Himayatnagar / Liberty / Narayanguda', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500020', areaName: 'Domalguda / Ashok Nagar / Chikkadpally', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500044', areaName: 'Vidyanagar / Nallakunta / DD Colony', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500007', areaName: 'Tarnaka / Habsiguda / Osmania University', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500017', areaName: 'Moula Ali / Lalaguda / Industrial Area', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500039', areaName: 'Uppal / Ramanthapur / Survey of India', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500076', areaName: 'Boduppal / Peerzadiguda / Medipally', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500068', areaName: 'Nagole / Alkapuri / Snehapuri Colony', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500074', areaName: 'LB Nagar / Mansoorabad / Rock Town', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500070', areaName: 'Vanasthalipuram / Hayathnagar / Auto Nagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500035', areaName: 'Kothapet / Saroornagar / Gaddiannaram', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500036', areaName: 'Dilsukhnagar / Chaitanyapuri / P&T Colony', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500059', areaName: 'Saidabad / Champapet / Santoshnagar', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500053', areaName: 'Chandrayangutta / Bandlaguda / Falaknuma', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500077', areaName: 'Attapur / Hyderguda / Upparpally', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500030', areaName: 'Rajendranagar / Budvel / Shivrampally', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500052', areaName: 'Shamshabad / RGIA Airport Zone', city: 'Hyderabad', isServiceable: true, standardFee: 50, minFreeOrderValue: 499, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500088', areaName: 'Pocharam / Ghatkesar / Infosys SEZ', city: 'Hyderabad', isServiceable: true, standardFee: 50, minFreeOrderValue: 499, expressAvailable: true, averageTurnaroundHours: 24 },
  { pincode: '500043', areaName: 'Bandlaguda Jagir / Sun City / Peerancheru', city: 'Hyderabad', isServiceable: true, standardFee: 40, minFreeOrderValue: 399, expressAvailable: true, averageTurnaroundHours: 24 },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.admin@laundryfresh.com',
    phone: '+91 98765 43210',
    role: 'SUPER_ADMIN',
    assignedFacility: 'Central Hub - Koramangala',
    isActive: true,
  },
  {
    id: 'stf-2',
    name: 'Priya Sharma',
    email: 'priya.ops@laundryfresh.com',
    phone: '+91 98765 43211',
    role: 'MANAGER',
    assignedFacility: 'Central Hub - Koramangala',
    isActive: true,
  },
  {
    id: 'stf-3',
    name: 'Arun M.',
    email: 'arun.wash@laundryfresh.com',
    phone: '+91 98765 43212',
    role: 'LAUNDRY_STAFF',
    assignedFacility: 'Facility 1 - Indiranagar',
    isActive: true,
    ordersProcessed: 482,
  },
  {
    id: 'stf-4',
    name: 'Vikram Singh (Pickup Agent)',
    email: 'vikram.rider@laundryfresh.com',
    phone: '+91 98450 11223',
    role: 'PICKUP_AGENT',
    assignedZone: 'HSR & Koramangala Zone',
    isActive: true,
    rating: 4.9,
    ordersProcessed: 320,
  },
  {
    id: 'stf-5',
    name: 'Suresh Patil (Delivery Agent)',
    email: 'suresh.rider@laundryfresh.com',
    phone: '+91 98450 44556',
    role: 'DELIVERY_AGENT',
    assignedZone: 'Indiranagar & CBD Zone',
    isActive: true,
    rating: 4.85,
    ordersProcessed: 275,
  },
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_WALLET: Wallet = {
  customerId: 'cust-1',
  balance: 350,
  rewardPoints: 240,
  transactions: [
    {
      id: 'tx-1',
      customerId: 'cust-1',
      type: 'CREDIT',
      amount: 100,
      description: 'Signup Referral Bonus Credited',
      date: '2026-08-15 10:00 AM',
      balanceAfter: 100,
    },
    {
      id: 'tx-2',
      customerId: 'cust-1',
      type: 'CREDIT',
      amount: 500,
      description: 'Wallet Recharge via UPI',
      date: '2026-08-18 02:15 PM',
      balanceAfter: 600,
    },
    {
      id: 'tx-3',
      customerId: 'cust-1',
      type: 'DEBIT',
      amount: 250,
      description: 'Payment for Order #LAU10238',
      date: '2026-08-19 11:30 AM',
      orderId: 'LAU10238',
      balanceAfter: 350,
    },
  ],
};

export const INITIAL_BATCHES: LaundryBatch[] = [
  {
    id: 'BATCH-2026-08-01',
    stage: 'WASHING',
    machineId: 'Drum Washer #M4 (Ozone Clean)',
    orderIds: ['LAU10245'],
    totalWeightKg: 18.5,
    startedAt: '2026-08-25 11:30 AM',
    operatorName: 'Arun M.',
  },
  {
    id: 'BATCH-2026-08-02',
    stage: 'DRYING',
    machineId: 'Gas Dryer #D2',
    orderIds: ['LAU10244', 'LAU10243'],
    totalWeightKg: 24.0,
    startedAt: '2026-08-25 10:45 AM',
    operatorName: 'Arun M.',
  },
  {
    id: 'BATCH-2026-08-03',
    stage: 'IRONING',
    machineId: 'Steam Press Table #P1',
    orderIds: ['LAU10241'],
    totalWeightKg: 12.0,
    startedAt: '2026-08-25 09:15 AM',
    operatorName: 'Priya S.',
  },
];

export const INITIAL_CLOTH_TYPES: ClothType[] = [
  // ── MEN'S CLOTHING ──
  { id: 'cloth-shirt', name: 'Shirt', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Regular casual & formal shirts', isActive: true, sortOrder: 1 },
  { id: 'cloth-tshirt', name: 'T-Shirt', icon: '👕', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Polo & round-neck t-shirts', isActive: true, sortOrder: 2 },
  { id: 'cloth-jeans', name: 'Jeans / Denim', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Heavy denim and cotton jeans', isActive: true, sortOrder: 3 },
  { id: 'cloth-trouser', name: 'Formal Trouser / Chinos', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Cotton trousers, chinos & pants', isActive: true, sortOrder: 4 },
  { id: 'cloth-kurta-m', name: 'Kurta (Men)', icon: '🥻', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Cotton & festive silk kurtas', isActive: true, sortOrder: 5 },
  { id: 'cloth-dhoti', name: 'Dhoti / Mundu / Lungi', icon: '🥻', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Traditional cotton & silk lower wear', isActive: true, sortOrder: 6 },
  { id: 'cloth-sherwani', name: 'Sherwani / Indo-Western', icon: '🤴', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Groom & wedding ethnic designer wear', isActive: true, sortOrder: 7 },
  { id: 'cloth-nehru', name: 'Nehru Jacket / Waistcoat', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Sleeveless Modi / Nehru bandhgala jacket', isActive: true, sortOrder: 8 },
  { id: 'cloth-blazer', name: 'Blazer / Coat', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Single or double-breasted formal blazer', isActive: true, sortOrder: 9 },
  { id: 'cloth-suit-2p', name: 'Suit 2-Piece', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Blazer + Trouser combo set', isActive: true, sortOrder: 10 },
  { id: 'cloth-suit-3p', name: 'Suit 3-Piece', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Blazer + Vest + Trouser combo set', isActive: true, sortOrder: 11 },
  { id: 'cloth-sweater', name: 'Sweater / Pullover', icon: '🧶', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Woolen & blended sweaters', isActive: true, sortOrder: 12 },
  { id: 'cloth-jacket', name: 'Winter Jacket', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Fleece, windcheater & padded jacket', isActive: true, sortOrder: 13 },
  { id: 'cloth-tracksuit', name: 'Tracksuit / Gym Set', icon: '🏃', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Athletic hoodie and trackpants', isActive: true, sortOrder: 14 },
  { id: 'cloth-tie', name: 'Tie / Pocket Square', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Clothing", description: 'Silk ties, bowties and pocket squares', isActive: true, sortOrder: 15 },

  // ── WOMEN'S CLOTHING ──
  { id: 'cloth-saree-reg', name: 'Saree (Daily / Cotton)', icon: '🥻', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Cotton, chiffon, georgette daily sarees', isActive: true, sortOrder: 16 },
  { id: 'cloth-saree-silk', name: 'Silk Saree (Kanchipuram / Zari)', icon: '🥻', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Pure silk, Banarasi & embroidered zari sarees', isActive: true, sortOrder: 17 },
  { id: 'cloth-saree-heavy', name: 'Heavy Designer Saree', icon: '🥻', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Stone work, cutwork and heavy bridal sarees', isActive: true, sortOrder: 18 },
  { id: 'cloth-blouse', name: 'Blouse', icon: '👚', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Regular cotton & silk blouses', isActive: true, sortOrder: 19 },
  { id: 'cloth-blouse-padded', name: 'Blouse (Padded / Zari)', icon: '👚', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Padded & designer embroidered blouses', isActive: true, sortOrder: 20 },
  { id: 'cloth-kurti', name: 'Kurti / Tunic', icon: '👚', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Casual & partywear kurtis', isActive: true, sortOrder: 21 },
  { id: 'cloth-salwar', name: 'Salwar Kameez / Suit Set', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: '3-Piece Top, Bottom & Dupatta set', isActive: true, sortOrder: 22 },
  { id: 'cloth-sharara', name: 'Sharara / Gharara Set', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Flared festive ethnic party wear', isActive: true, sortOrder: 23 },
  { id: 'cloth-dupatta', name: 'Dupatta / Stole', icon: '🧣', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Cotton, chiffon and silk stoles', isActive: true, sortOrder: 24 },
  { id: 'cloth-leggings', name: 'Leggings / Plazo', icon: '👖', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Stretch cotton leggings, jeggings and plazos', isActive: true, sortOrder: 25 },
  { id: 'cloth-lehenga', name: 'Bridal / Party Lehenga', icon: '👰', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Heavy flared lehenga with stone & zardozi work', isActive: true, sortOrder: 26 },
  { id: 'cloth-dress-w', name: 'Dress / Western Gown', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Maxi dress, evening gowns & party dresses', isActive: true, sortOrder: 27 },
  { id: 'cloth-shawl', name: 'Kashmiri / Pashmina Shawl', icon: '🧣', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Pure wool & delicate embroidered shawls', isActive: true, sortOrder: 28 },
  { id: 'cloth-nighty', name: 'Nighty / Loungewear', icon: '👘', categoryTag: 'WOMENS', categoryLabel: "Women's Clothing", description: 'Cotton nighties, kaftans and pyjamas', isActive: true, sortOrder: 29 },

  // ── KIDS & BABY CARE ──
  { id: 'cloth-kid-shirt', name: 'Kids Shirt / Top', icon: '👕', categoryTag: 'KIDS', categoryLabel: 'Kids Clothing', description: 'Infant to teenage shirts and tops', isActive: true, sortOrder: 30 },
  { id: 'cloth-kid-pant', name: 'Kids Pant / Shorts', icon: '🩳', categoryTag: 'KIDS', categoryLabel: 'Kids Clothing', description: 'Kids denim, track pants & shorts', isActive: true, sortOrder: 31 },
  { id: 'cloth-kid-dress', name: 'Kids Frock / Dress', icon: '👗', categoryTag: 'KIDS', categoryLabel: 'Kids Clothing', description: 'Girls dresses and party frocks', isActive: true, sortOrder: 32 },
  { id: 'cloth-kid-uniform', name: 'School Uniform Set', icon: '🎒', categoryTag: 'KIDS', categoryLabel: 'Kids Clothing', description: 'Shirt + Skirt/Trouser with tie and badge', isActive: true, sortOrder: 33 },
  { id: 'cloth-baby-romper', name: 'Baby Rompers (Pack of 3)', icon: '👶', categoryTag: 'KIDS', categoryLabel: 'Baby Care', description: 'Hypoallergenic sanitizing wash for infant onesies', isActive: true, sortOrder: 34 },
  { id: 'cloth-soft-toy', name: 'Soft Toys / Teddy Bear', icon: '🧸', categoryTag: 'KIDS', categoryLabel: 'Baby Care', description: 'Anti-allergen ozone sanitization for plush toys', isActive: true, sortOrder: 35 },

  // ── HOME & BEDDING TEXTILES ──
  { id: 'cloth-bedsheet-s', name: 'Bedsheet (Single)', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Single bedsheet + 1 pillow cover', isActive: true, sortOrder: 36 },
  { id: 'cloth-bedsheet-d', name: 'Bedsheet (Double / King)', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Double/King bedsheet + 2 pillow covers', isActive: true, sortOrder: 37 },
  { id: 'cloth-pillow-cover', name: 'Pillow Covers (Pair)', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Standard size bed pillow slips', isActive: true, sortOrder: 38 },
  { id: 'cloth-blanket', name: 'Blanket / Quilt (Single)', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Medium weight single quilt or fleece blanket', isActive: true, sortOrder: 39 },
  { id: 'cloth-blanket-d', name: 'Blanket / Mink (Double)', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Heavy double mink blanket with sanitization', isActive: true, sortOrder: 40 },
  { id: 'cloth-comforter', name: 'Heavy Comforter / Rajai (Double)', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Heavy double winter comforter or duvet', isActive: true, sortOrder: 41 },
  { id: 'cloth-curtain', name: 'Curtains (Per Panel)', icon: '🪟', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Window and door curtains up to 9ft', isActive: true, sortOrder: 42 },
  { id: 'cloth-towel', name: 'Bath Towel', icon: '🛁', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Plush cotton bath towels and robes', isActive: true, sortOrder: 43 },
  { id: 'cloth-sofa-cover', name: 'Sofa Covers (Set of 5)', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Living room cushion & sofa fabric covers', isActive: true, sortOrder: 44 },
  { id: 'cloth-tablecloth', name: 'Tablecloth / Runner', icon: '🍽️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: '6-8 seater dining tablecloth and runner', isActive: true, sortOrder: 45 },
  { id: 'cloth-doormat', name: 'Door Mat / Small Rug', icon: '🚪', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home & Bedding', description: 'Entrance & bath microfiber mats', isActive: true, sortOrder: 46 },

  // ── FOOTWEAR & SHOES ──
  { id: 'cloth-shoes-sneaker', name: 'Sneakers / Sports Shoes', icon: '👟', categoryTag: 'FOOTWEAR', categoryLabel: 'Footwear', description: 'Mesh, knit & canvas running shoes', isActive: true, sortOrder: 47 },
  { id: 'cloth-shoes-formal', name: 'Formal Leather Shoes', icon: '👞', categoryTag: 'FOOTWEAR', categoryLabel: 'Footwear', description: 'Leather conditioning, buff & polish', isActive: true, sortOrder: 48 },
  { id: 'cloth-shoes-suede', name: 'Suede / Nubuck Shoes', icon: '👞', categoryTag: 'FOOTWEAR', categoryLabel: 'Footwear', description: 'Delicate suede shampoo & waterproofing', isActive: true, sortOrder: 49 },

  // ── BAGS & TRAVEL LUGGAGE ──
  { id: 'cloth-bag-backpack', name: 'Backpack / School Bag', icon: '🎒', categoryTag: 'ACCESSORIES', categoryLabel: 'Bags & Accessories', description: 'Canvas & polyester laptop backpacks', isActive: true, sortOrder: 50 },
  { id: 'cloth-bag-luxury', name: 'Luxury Handbag', icon: '👜', categoryTag: 'ACCESSORIES', categoryLabel: 'Bags & Accessories', description: 'Designer leather and fabric handbags', isActive: true, sortOrder: 51 },
  { id: 'cloth-trolley-cabin', name: 'Cabin Trolley Bag (20")', icon: '🧳', categoryTag: 'ACCESSORIES', categoryLabel: 'Travel & Luggage', description: 'Deep vacuum & outer shell sanitization', isActive: true, sortOrder: 52 },
  { id: 'cloth-trolley-large', name: 'Check-in Suitcase (28")', icon: '🧳', categoryTag: 'ACCESSORIES', categoryLabel: 'Travel & Luggage', description: 'Large luggage antibacterial shampooing', isActive: true, sortOrder: 53 },
  { id: 'cloth-helmet', name: 'Bike Riding Helmet', icon: '🪖', categoryTag: 'ACCESSORIES', categoryLabel: 'Accessories', description: 'Inner foam anti-odor deep sanitization', isActive: true, sortOrder: 54 },
];

export const INITIAL_SERVICE_MASTERS: ServiceMaster[] = [
  { id: 'srv-m-wash-fold', name: 'Wash & Fold', slug: 'wash-and-fold', icon: '🧺', pricingType: 'PER_KG', baseKgPrice: 60, minOrderKg: 3, turnaroundHours: 24, description: 'Hygienic wash, tumble dry, and neat compact fold.', isActive: true },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', slug: 'wash-and-iron', icon: '👔', pricingType: 'PER_KG', baseKgPrice: 85, minOrderKg: 3, turnaroundHours: 36, description: 'Eco-wash + industrial steam pressing on hangers.', isActive: true },
  { id: 'srv-m-dry-clean', name: 'Dry Cleaning', slug: 'dry-cleaning', icon: '🧥', pricingType: 'PER_ITEM', turnaroundHours: 48, description: 'Hydrocarbon solvent treatment with breathable garment cover.', isActive: true },
  { id: 'srv-m-steam-iron', name: 'Steam Pressing Only', slug: 'steam-iron', icon: '♨️', pricingType: 'PER_ITEM', turnaroundHours: 18, description: 'High-pressure wrinkle removal with shape restoration.', isActive: true },
  { id: 'srv-m-charak', name: 'Saree Polishing & Charak', slug: 'saree-charak', icon: '🥻', pricingType: 'PER_ITEM', turnaroundHours: 48, description: 'Traditional starching, roll pressing & zari shine revival.', isActive: true },
  { id: 'srv-m-starch', name: 'Starch & Crisp Finish', slug: 'starch-finish', icon: '✨', pricingType: 'PER_ITEM', turnaroundHours: 24, description: 'Stiff starching for crisp cotton shirts, dhotis & uniforms.', isActive: true },
  { id: 'srv-m-spa', name: 'Deep Shoe & Leather Spa', slug: 'shoe-spa', icon: '👟', pricingType: 'PER_ITEM', turnaroundHours: 48, description: 'Ultrasonic stain treatment and antibacterial ozone sanitization.', isActive: true },
  { id: 'srv-m-express', name: 'Express Emergency Laundry', slug: 'express-emergency', icon: '⚡', pricingType: 'PER_KG', baseKgPrice: 120, minOrderKg: 3, turnaroundHours: 12, description: 'Dedicated machine slot with same-day return.', isActive: true },
];

export const INITIAL_SERVICE_PRICE_MATRIX: ServicePriceItem[] = [
  // ── 1. MEN'S CLOTHING ──
  // Shirt
  { id: 'pr-shirt-wf', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 30, expressPrice: 50, turnaroundHours: 24, isActive: true },
  { id: 'pr-shirt-wi', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 45, expressPrice: 65, turnaroundHours: 36, isActive: true },
  { id: 'pr-shirt-dc', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 80, expressPrice: 120, turnaroundHours: 48, isActive: true },
  { id: 'pr-shirt-si', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 20, expressPrice: 35, turnaroundHours: 18, isActive: true },
  { id: 'pr-shirt-ex', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 60, expressPrice: 90, turnaroundHours: 12, isActive: true },
  { id: 'pr-shirt-st', clothTypeId: 'cloth-shirt', clothName: 'Shirt', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-starch', serviceName: 'Starch & Crisp Finish', price: 25, expressPrice: 40, turnaroundHours: 24, isActive: true },

  // T-Shirt
  { id: 'pr-tshirt-wf', clothTypeId: 'cloth-tshirt', clothName: 'T-Shirt', clothIcon: '👕', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 25, expressPrice: 45, turnaroundHours: 24, isActive: true },
  { id: 'pr-tshirt-wi', clothTypeId: 'cloth-tshirt', clothName: 'T-Shirt', clothIcon: '👕', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 35, expressPrice: 55, turnaroundHours: 36, isActive: true },
  { id: 'pr-tshirt-dc', clothTypeId: 'cloth-tshirt', clothName: 'T-Shirt', clothIcon: '👕', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 60, expressPrice: 90, turnaroundHours: 48, isActive: true },
  { id: 'pr-tshirt-si', clothTypeId: 'cloth-tshirt', clothName: 'T-Shirt', clothIcon: '👕', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-tshirt-ex', clothTypeId: 'cloth-tshirt', clothName: 'T-Shirt', clothIcon: '👕', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 50, expressPrice: 75, turnaroundHours: 12, isActive: true },

  // Jeans
  { id: 'pr-jeans-wf', clothTypeId: 'cloth-jeans', clothName: 'Jeans / Denim', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-jeans-wi', clothTypeId: 'cloth-jeans', clothName: 'Jeans / Denim', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 50, expressPrice: 70, turnaroundHours: 36, isActive: true },
  { id: 'pr-jeans-dc', clothTypeId: 'cloth-jeans', clothName: 'Jeans / Denim', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 90, expressPrice: 130, turnaroundHours: 48, isActive: true },
  { id: 'pr-jeans-si', clothTypeId: 'cloth-jeans', clothName: 'Jeans / Denim', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 25, expressPrice: 40, turnaroundHours: 18, isActive: true },
  { id: 'pr-jeans-ex', clothTypeId: 'cloth-jeans', clothName: 'Jeans / Denim', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 70, expressPrice: 100, turnaroundHours: 12, isActive: true },

  // Formal Trouser
  { id: 'pr-trouser-wf', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-trouser-wi', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 50, expressPrice: 70, turnaroundHours: 36, isActive: true },
  { id: 'pr-trouser-dc', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 90, expressPrice: 130, turnaroundHours: 48, isActive: true },
  { id: 'pr-trouser-si', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 20, expressPrice: 35, turnaroundHours: 18, isActive: true },
  { id: 'pr-trouser-ex', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 70, expressPrice: 100, turnaroundHours: 12, isActive: true },
  { id: 'pr-trouser-st', clothTypeId: 'cloth-trouser', clothName: 'Formal Trouser / Chinos', clothIcon: '👖', categoryTag: 'MENS', serviceId: 'srv-m-starch', serviceName: 'Starch & Crisp Finish', price: 25, expressPrice: 40, turnaroundHours: 24, isActive: true },

  // Kurta (Men)
  { id: 'pr-kurta-m-wf', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 45, expressPrice: 70, turnaroundHours: 24, isActive: true },
  { id: 'pr-kurta-m-wi', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 65, expressPrice: 95, turnaroundHours: 36, isActive: true },
  { id: 'pr-kurta-m-dc', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 110, expressPrice: 160, turnaroundHours: 48, isActive: true },
  { id: 'pr-kurta-m-si', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 30, expressPrice: 45, turnaroundHours: 18, isActive: true },
  { id: 'pr-kurta-m-ex', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 85, expressPrice: 120, turnaroundHours: 12, isActive: true },
  { id: 'pr-kurta-m-st', clothTypeId: 'cloth-kurta-m', clothName: 'Kurta (Men)', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-starch', serviceName: 'Starch & Crisp Finish', price: 30, expressPrice: 45, turnaroundHours: 24, isActive: true },

  // Dhoti / Mundu
  { id: 'pr-dhoti-wf', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-dhoti-wi', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 55, expressPrice: 80, turnaroundHours: 36, isActive: true },
  { id: 'pr-dhoti-dc', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 90, expressPrice: 130, turnaroundHours: 48, isActive: true },
  { id: 'pr-dhoti-si', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 25, expressPrice: 40, turnaroundHours: 18, isActive: true },
  { id: 'pr-dhoti-ex', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 70, expressPrice: 100, turnaroundHours: 12, isActive: true },
  { id: 'pr-dhoti-st', clothTypeId: 'cloth-dhoti', clothName: 'Dhoti / Mundu / Lungi', clothIcon: '🥻', categoryTag: 'MENS', serviceId: 'srv-m-starch', serviceName: 'Starch & Crisp Finish', price: 30, expressPrice: 45, turnaroundHours: 24, isActive: true },

  // Sherwani / Indo-Western
  { id: 'pr-sherwani-dc', clothTypeId: 'cloth-sherwani', clothName: 'Sherwani / Indo-Western', clothIcon: '🤴', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 450, expressPrice: 650, turnaroundHours: 72, isActive: true },
  { id: 'pr-sherwani-si', clothTypeId: 'cloth-sherwani', clothName: 'Sherwani / Indo-Western', clothIcon: '🤴', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 150, expressPrice: 220, turnaroundHours: 24, isActive: true },
  { id: 'pr-sherwani-ex', clothTypeId: 'cloth-sherwani', clothName: 'Sherwani / Indo-Western', clothIcon: '🤴', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 350, expressPrice: 500, turnaroundHours: 24, isActive: true },
  { id: 'pr-sherwani-spa', clothTypeId: 'cloth-sherwani', clothName: 'Sherwani / Indo-Western', clothIcon: '🤴', categoryTag: 'MENS', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 200, expressPrice: 290, turnaroundHours: 48, isActive: true },

  // Nehru Jacket / Waistcoat
  { id: 'pr-nehru-dc', clothTypeId: 'cloth-nehru', clothName: 'Nehru Jacket / Waistcoat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 180, turnaroundHours: 48, isActive: true },
  { id: 'pr-nehru-si', clothTypeId: 'cloth-nehru', clothName: 'Nehru Jacket / Waistcoat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 50, expressPrice: 75, turnaroundHours: 18, isActive: true },
  { id: 'pr-nehru-ex', clothTypeId: 'cloth-nehru', clothName: 'Nehru Jacket / Waistcoat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 95, expressPrice: 140, turnaroundHours: 12, isActive: true },
  { id: 'pr-nehru-wi', clothTypeId: 'cloth-nehru', clothName: 'Nehru Jacket / Waistcoat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 70, expressPrice: 105, turnaroundHours: 36, isActive: true },

  // Blazer / Coat
  { id: 'pr-blazer-dc', clothTypeId: 'cloth-blazer', clothName: 'Blazer / Coat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 220, expressPrice: 320, turnaroundHours: 48, isActive: true },
  { id: 'pr-blazer-si', clothTypeId: 'cloth-blazer', clothName: 'Blazer / Coat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 90, expressPrice: 140, turnaroundHours: 24, isActive: true },
  { id: 'pr-blazer-ex', clothTypeId: 'cloth-blazer', clothName: 'Blazer / Coat', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 180, expressPrice: 260, turnaroundHours: 18, isActive: true },

  // Suit 2-Piece
  { id: 'pr-suit-dc', clothTypeId: 'cloth-suit-2p', clothName: 'Suit 2-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 350, expressPrice: 480, turnaroundHours: 48, isActive: true },
  { id: 'pr-suit-si', clothTypeId: 'cloth-suit-2p', clothName: 'Suit 2-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 140, expressPrice: 200, turnaroundHours: 24, isActive: true },
  { id: 'pr-suit-ex', clothTypeId: 'cloth-suit-2p', clothName: 'Suit 2-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 280, expressPrice: 390, turnaroundHours: 18, isActive: true },

  // Suit 3-Piece
  { id: 'pr-suit-3p-dc', clothTypeId: 'cloth-suit-3p', clothName: 'Suit 3-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 450, expressPrice: 600, turnaroundHours: 48, isActive: true },
  { id: 'pr-suit-3p-si', clothTypeId: 'cloth-suit-3p', clothName: 'Suit 3-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 180, expressPrice: 250, turnaroundHours: 24, isActive: true },
  { id: 'pr-suit-3p-ex', clothTypeId: 'cloth-suit-3p', clothName: 'Suit 3-Piece', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 360, expressPrice: 490, turnaroundHours: 18, isActive: true },

  // Sweater / Pullover
  { id: 'pr-sweater-wf', clothTypeId: 'cloth-sweater', clothName: 'Sweater / Pullover', clothIcon: '🧶', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 50, expressPrice: 80, turnaroundHours: 24, isActive: true },
  { id: 'pr-sweater-wi', clothTypeId: 'cloth-sweater', clothName: 'Sweater / Pullover', clothIcon: '🧶', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 75, expressPrice: 110, turnaroundHours: 36, isActive: true },
  { id: 'pr-sweater-dc', clothTypeId: 'cloth-sweater', clothName: 'Sweater / Pullover', clothIcon: '🧶', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 180, turnaroundHours: 48, isActive: true },
  { id: 'pr-sweater-si', clothTypeId: 'cloth-sweater', clothName: 'Sweater / Pullover', clothIcon: '🧶', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 40, expressPrice: 60, turnaroundHours: 18, isActive: true },
  { id: 'pr-sweater-ex', clothTypeId: 'cloth-sweater', clothName: 'Sweater / Pullover', clothIcon: '🧶', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 95, expressPrice: 140, turnaroundHours: 12, isActive: true },

  // Winter Jacket
  { id: 'pr-jacket-wf', clothTypeId: 'cloth-jacket', clothName: 'Winter Jacket', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 80, expressPrice: 120, turnaroundHours: 24, isActive: true },
  { id: 'pr-jacket-wi', clothTypeId: 'cloth-jacket', clothName: 'Winter Jacket', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 120, expressPrice: 170, turnaroundHours: 36, isActive: true },
  { id: 'pr-jacket-dc', clothTypeId: 'cloth-jacket', clothName: 'Winter Jacket', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 250, expressPrice: 350, turnaroundHours: 48, isActive: true },
  { id: 'pr-jacket-si', clothTypeId: 'cloth-jacket', clothName: 'Winter Jacket', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 60, expressPrice: 90, turnaroundHours: 24, isActive: true },
  { id: 'pr-jacket-ex', clothTypeId: 'cloth-jacket', clothName: 'Winter Jacket', clothIcon: '🧥', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 200, expressPrice: 290, turnaroundHours: 18, isActive: true },

  // Tracksuit / Gym Set
  { id: 'pr-tracksuit-wf', clothTypeId: 'cloth-tracksuit', clothName: 'Tracksuit / Gym Set', clothIcon: '🏃', categoryTag: 'MENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 45, expressPrice: 70, turnaroundHours: 24, isActive: true },
  { id: 'pr-tracksuit-wi', clothTypeId: 'cloth-tracksuit', clothName: 'Tracksuit / Gym Set', clothIcon: '🏃', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 70, expressPrice: 100, turnaroundHours: 36, isActive: true },
  { id: 'pr-tracksuit-dc', clothTypeId: 'cloth-tracksuit', clothName: 'Tracksuit / Gym Set', clothIcon: '🏃', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 140, expressPrice: 200, turnaroundHours: 48, isActive: true },
  { id: 'pr-tracksuit-si', clothTypeId: 'cloth-tracksuit', clothName: 'Tracksuit / Gym Set', clothIcon: '🏃', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 35, expressPrice: 50, turnaroundHours: 18, isActive: true },
  { id: 'pr-tracksuit-ex', clothTypeId: 'cloth-tracksuit', clothName: 'Tracksuit / Gym Set', clothIcon: '🏃', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 110, expressPrice: 160, turnaroundHours: 12, isActive: true },

  // Tie / Pocket Square
  { id: 'pr-tie-wi', clothTypeId: 'cloth-tie', clothName: 'Tie / Pocket Square', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 25, expressPrice: 40, turnaroundHours: 36, isActive: true },
  { id: 'pr-tie-dc', clothTypeId: 'cloth-tie', clothName: 'Tie / Pocket Square', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 40, expressPrice: 60, turnaroundHours: 48, isActive: true },
  { id: 'pr-tie-si', clothTypeId: 'cloth-tie', clothName: 'Tie / Pocket Square', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-tie-ex', clothTypeId: 'cloth-tie', clothName: 'Tie / Pocket Square', clothIcon: '👔', categoryTag: 'MENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 30, expressPrice: 45, turnaroundHours: 12, isActive: true },

  // ── 2. WOMEN'S CLOTHING ──
  // Saree (Daily / Cotton)
  { id: 'pr-saree-reg-wi', clothTypeId: 'cloth-saree-reg', clothName: 'Saree (Daily / Cotton)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 90, expressPrice: 140, turnaroundHours: 36, isActive: true },
  { id: 'pr-saree-reg-dc', clothTypeId: 'cloth-saree-reg', clothName: 'Saree (Daily / Cotton)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 150, expressPrice: 220, turnaroundHours: 48, isActive: true },
  { id: 'pr-saree-reg-si', clothTypeId: 'cloth-saree-reg', clothName: 'Saree (Daily / Cotton)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 60, expressPrice: 90, turnaroundHours: 24, isActive: true },
  { id: 'pr-saree-reg-ex', clothTypeId: 'cloth-saree-reg', clothName: 'Saree (Daily / Cotton)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 120, expressPrice: 175, turnaroundHours: 12, isActive: true },
  { id: 'pr-saree-reg-ch', clothTypeId: 'cloth-saree-reg', clothName: 'Saree (Daily / Cotton)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-charak', serviceName: 'Saree Polishing & Charak', price: 120, expressPrice: 180, turnaroundHours: 48, isActive: true },

  // Silk Saree (Kanchipuram / Zari)
  { id: 'pr-saree-silk-wi', clothTypeId: 'cloth-saree-silk', clothName: 'Silk Saree (Kanchipuram / Zari)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 130, expressPrice: 190, turnaroundHours: 36, isActive: true },
  { id: 'pr-saree-silk-dc', clothTypeId: 'cloth-saree-silk', clothName: 'Silk Saree (Kanchipuram / Zari)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 220, expressPrice: 320, turnaroundHours: 48, isActive: true },
  { id: 'pr-saree-silk-si', clothTypeId: 'cloth-saree-silk', clothName: 'Silk Saree (Kanchipuram / Zari)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 80, expressPrice: 120, turnaroundHours: 24, isActive: true },
  { id: 'pr-saree-silk-ex', clothTypeId: 'cloth-saree-silk', clothName: 'Silk Saree (Kanchipuram / Zari)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 180, expressPrice: 260, turnaroundHours: 18, isActive: true },
  { id: 'pr-saree-silk-ch', clothTypeId: 'cloth-saree-silk', clothName: 'Silk Saree (Kanchipuram / Zari)', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-charak', serviceName: 'Saree Polishing & Charak', price: 150, expressPrice: 220, turnaroundHours: 48, isActive: true },

  // Heavy Designer Saree
  { id: 'pr-saree-heavy-dc', clothTypeId: 'cloth-saree-heavy', clothName: 'Heavy Designer Saree', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 300, expressPrice: 420, turnaroundHours: 48, isActive: true },
  { id: 'pr-saree-heavy-si', clothTypeId: 'cloth-saree-heavy', clothName: 'Heavy Designer Saree', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 100, expressPrice: 150, turnaroundHours: 24, isActive: true },
  { id: 'pr-saree-heavy-ex', clothTypeId: 'cloth-saree-heavy', clothName: 'Heavy Designer Saree', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 240, expressPrice: 340, turnaroundHours: 18, isActive: true },
  { id: 'pr-saree-heavy-ch', clothTypeId: 'cloth-saree-heavy', clothName: 'Heavy Designer Saree', clothIcon: '🥻', categoryTag: 'WOMENS', serviceId: 'srv-m-charak', serviceName: 'Saree Polishing & Charak', price: 180, expressPrice: 260, turnaroundHours: 48, isActive: true },

  // Blouse
  { id: 'pr-blouse-wi', clothTypeId: 'cloth-blouse', clothName: 'Blouse', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 35, expressPrice: 55, turnaroundHours: 36, isActive: true },
  { id: 'pr-blouse-dc', clothTypeId: 'cloth-blouse', clothName: 'Blouse', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 60, expressPrice: 90, turnaroundHours: 48, isActive: true },
  { id: 'pr-blouse-si', clothTypeId: 'cloth-blouse', clothName: 'Blouse', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 20, expressPrice: 35, turnaroundHours: 18, isActive: true },
  { id: 'pr-blouse-ex', clothTypeId: 'cloth-blouse', clothName: 'Blouse', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 45, expressPrice: 70, turnaroundHours: 12, isActive: true },

  // Blouse (Padded / Zari)
  { id: 'pr-blouse-pad-wi', clothTypeId: 'cloth-blouse-padded', clothName: 'Blouse (Padded / Zari)', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 45, expressPrice: 65, turnaroundHours: 36, isActive: true },
  { id: 'pr-blouse-pad-dc', clothTypeId: 'cloth-blouse-padded', clothName: 'Blouse (Padded / Zari)', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 80, expressPrice: 120, turnaroundHours: 48, isActive: true },
  { id: 'pr-blouse-pad-si', clothTypeId: 'cloth-blouse-padded', clothName: 'Blouse (Padded / Zari)', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 25, expressPrice: 40, turnaroundHours: 18, isActive: true },
  { id: 'pr-blouse-pad-ex', clothTypeId: 'cloth-blouse-padded', clothName: 'Blouse (Padded / Zari)', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 65, expressPrice: 95, turnaroundHours: 12, isActive: true },

  // Kurti / Tunic
  { id: 'pr-kurti-wf', clothTypeId: 'cloth-kurti', clothName: 'Kurti / Tunic', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 30, expressPrice: 50, turnaroundHours: 24, isActive: true },
  { id: 'pr-kurti-wi', clothTypeId: 'cloth-kurti', clothName: 'Kurti / Tunic', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 45, expressPrice: 65, turnaroundHours: 36, isActive: true },
  { id: 'pr-kurti-dc', clothTypeId: 'cloth-kurti', clothName: 'Kurti / Tunic', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 80, expressPrice: 120, turnaroundHours: 48, isActive: true },
  { id: 'pr-kurti-si', clothTypeId: 'cloth-kurti', clothName: 'Kurti / Tunic', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 20, expressPrice: 35, turnaroundHours: 18, isActive: true },
  { id: 'pr-kurti-ex', clothTypeId: 'cloth-kurti', clothName: 'Kurti / Tunic', clothIcon: '👚', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 60, expressPrice: 90, turnaroundHours: 12, isActive: true },

  // Salwar Kameez / Suit Set
  { id: 'pr-salwar-wf', clothTypeId: 'cloth-salwar', clothName: 'Salwar Kameez / Suit Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 60, expressPrice: 90, turnaroundHours: 24, isActive: true },
  { id: 'pr-salwar-wi', clothTypeId: 'cloth-salwar', clothName: 'Salwar Kameez / Suit Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 85, expressPrice: 125, turnaroundHours: 36, isActive: true },
  { id: 'pr-salwar-dc', clothTypeId: 'cloth-salwar', clothName: 'Salwar Kameez / Suit Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 160, expressPrice: 230, turnaroundHours: 48, isActive: true },
  { id: 'pr-salwar-si', clothTypeId: 'cloth-salwar', clothName: 'Salwar Kameez / Suit Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 40, expressPrice: 60, turnaroundHours: 18, isActive: true },
  { id: 'pr-salwar-ex', clothTypeId: 'cloth-salwar', clothName: 'Salwar Kameez / Suit Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 130, expressPrice: 190, turnaroundHours: 12, isActive: true },

  // Sharara / Gharara Set
  { id: 'pr-sharara-wi', clothTypeId: 'cloth-sharara', clothName: 'Sharara / Gharara Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 140, expressPrice: 200, turnaroundHours: 36, isActive: true },
  { id: 'pr-sharara-dc', clothTypeId: 'cloth-sharara', clothName: 'Sharara / Gharara Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 280, expressPrice: 390, turnaroundHours: 48, isActive: true },
  { id: 'pr-sharara-si', clothTypeId: 'cloth-sharara', clothName: 'Sharara / Gharara Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 90, expressPrice: 135, turnaroundHours: 24, isActive: true },
  { id: 'pr-sharara-ex', clothTypeId: 'cloth-sharara', clothName: 'Sharara / Gharara Set', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 220, expressPrice: 310, turnaroundHours: 18, isActive: true },

  // Dupatta / Stole
  { id: 'pr-dupatta-wi', clothTypeId: 'cloth-dupatta', clothName: 'Dupatta / Stole', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 30, expressPrice: 45, turnaroundHours: 36, isActive: true },
  { id: 'pr-dupatta-dc', clothTypeId: 'cloth-dupatta', clothName: 'Dupatta / Stole', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 50, expressPrice: 75, turnaroundHours: 48, isActive: true },
  { id: 'pr-dupatta-si', clothTypeId: 'cloth-dupatta', clothName: 'Dupatta / Stole', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-dupatta-ex', clothTypeId: 'cloth-dupatta', clothName: 'Dupatta / Stole', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 40, expressPrice: 60, turnaroundHours: 12, isActive: true },

  // Leggings / Plazo
  { id: 'pr-leggings-wf', clothTypeId: 'cloth-leggings', clothName: 'Leggings / Plazo', clothIcon: '👖', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 25, expressPrice: 40, turnaroundHours: 24, isActive: true },
  { id: 'pr-leggings-wi', clothTypeId: 'cloth-leggings', clothName: 'Leggings / Plazo', clothIcon: '👖', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 35, expressPrice: 55, turnaroundHours: 36, isActive: true },
  { id: 'pr-leggings-dc', clothTypeId: 'cloth-leggings', clothName: 'Leggings / Plazo', clothIcon: '👖', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 60, expressPrice: 90, turnaroundHours: 48, isActive: true },
  { id: 'pr-leggings-si', clothTypeId: 'cloth-leggings', clothName: 'Leggings / Plazo', clothIcon: '👖', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-leggings-ex', clothTypeId: 'cloth-leggings', clothName: 'Leggings / Plazo', clothIcon: '👖', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 45, expressPrice: 70, turnaroundHours: 12, isActive: true },

  // Bridal / Party Lehenga
  { id: 'pr-lehenga-dc', clothTypeId: 'cloth-lehenga', clothName: 'Bridal / Party Lehenga', clothIcon: '👰', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 650, expressPrice: 900, turnaroundHours: 72, isActive: true },
  { id: 'pr-lehenga-si', clothTypeId: 'cloth-lehenga', clothName: 'Bridal / Party Lehenga', clothIcon: '👰', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 250, expressPrice: 350, turnaroundHours: 36, isActive: true },
  { id: 'pr-lehenga-ex', clothTypeId: 'cloth-lehenga', clothName: 'Bridal / Party Lehenga', clothIcon: '👰', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 490, expressPrice: 700, turnaroundHours: 24, isActive: true },
  { id: 'pr-lehenga-spa', clothTypeId: 'cloth-lehenga', clothName: 'Bridal / Party Lehenga', clothIcon: '👰', categoryTag: 'WOMENS', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 250, expressPrice: 360, turnaroundHours: 48, isActive: true },

  // Dress / Western Gown
  { id: 'pr-dress-w-wf', clothTypeId: 'cloth-dress-w', clothName: 'Dress / Western Gown', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 55, expressPrice: 85, turnaroundHours: 24, isActive: true },
  { id: 'pr-dress-w-wi', clothTypeId: 'cloth-dress-w', clothName: 'Dress / Western Gown', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 80, expressPrice: 120, turnaroundHours: 36, isActive: true },
  { id: 'pr-dress-w-dc', clothTypeId: 'cloth-dress-w', clothName: 'Dress / Western Gown', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 160, expressPrice: 240, turnaroundHours: 48, isActive: true },
  { id: 'pr-dress-w-si', clothTypeId: 'cloth-dress-w', clothName: 'Dress / Western Gown', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 40, expressPrice: 65, turnaroundHours: 18, isActive: true },
  { id: 'pr-dress-w-ex', clothTypeId: 'cloth-dress-w', clothName: 'Dress / Western Gown', clothIcon: '👗', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 130, expressPrice: 190, turnaroundHours: 12, isActive: true },

  // Kashmiri / Pashmina Shawl
  { id: 'pr-shawl-wi', clothTypeId: 'cloth-shawl', clothName: 'Kashmiri / Pashmina Shawl', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 70, expressPrice: 105, turnaroundHours: 36, isActive: true },
  { id: 'pr-shawl-dc', clothTypeId: 'cloth-shawl', clothName: 'Kashmiri / Pashmina Shawl', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 160, expressPrice: 240, turnaroundHours: 48, isActive: true },
  { id: 'pr-shawl-si', clothTypeId: 'cloth-shawl', clothName: 'Kashmiri / Pashmina Shawl', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 40, expressPrice: 60, turnaroundHours: 18, isActive: true },
  { id: 'pr-shawl-ex', clothTypeId: 'cloth-shawl', clothName: 'Kashmiri / Pashmina Shawl', clothIcon: '🧣', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 130, expressPrice: 190, turnaroundHours: 12, isActive: true },

  // Nighty / Loungewear
  { id: 'pr-nighty-wf', clothTypeId: 'cloth-nighty', clothName: 'Nighty / Loungewear', clothIcon: '👘', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 30, expressPrice: 50, turnaroundHours: 24, isActive: true },
  { id: 'pr-nighty-wi', clothTypeId: 'cloth-nighty', clothName: 'Nighty / Loungewear', clothIcon: '👘', categoryTag: 'WOMENS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 45, expressPrice: 65, turnaroundHours: 36, isActive: true },
  { id: 'pr-nighty-dc', clothTypeId: 'cloth-nighty', clothName: 'Nighty / Loungewear', clothIcon: '👘', categoryTag: 'WOMENS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 80, expressPrice: 120, turnaroundHours: 48, isActive: true },
  { id: 'pr-nighty-si', clothTypeId: 'cloth-nighty', clothName: 'Nighty / Loungewear', clothIcon: '👘', categoryTag: 'WOMENS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 20, expressPrice: 35, turnaroundHours: 18, isActive: true },
  { id: 'pr-nighty-ex', clothTypeId: 'cloth-nighty', clothName: 'Nighty / Loungewear', clothIcon: '👘', categoryTag: 'WOMENS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 60, expressPrice: 90, turnaroundHours: 12, isActive: true },

  // ── 3. KIDS CLOTHING ──
  // Kids Shirt / Top
  { id: 'pr-kid-shirt-wf', clothTypeId: 'cloth-kid-shirt', clothName: 'Kids Shirt / Top', clothIcon: '👕', categoryTag: 'KIDS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 20, expressPrice: 35, turnaroundHours: 24, isActive: true },
  { id: 'pr-kid-shirt-wi', clothTypeId: 'cloth-kid-shirt', clothName: 'Kids Shirt / Top', clothIcon: '👕', categoryTag: 'KIDS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 28, expressPrice: 45, turnaroundHours: 36, isActive: true },
  { id: 'pr-kid-shirt-dc', clothTypeId: 'cloth-kid-shirt', clothName: 'Kids Shirt / Top', clothIcon: '👕', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 50, expressPrice: 75, turnaroundHours: 48, isActive: true },
  { id: 'pr-kid-shirt-si', clothTypeId: 'cloth-kid-shirt', clothName: 'Kids Shirt / Top', clothIcon: '👕', categoryTag: 'KIDS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 12, expressPrice: 20, turnaroundHours: 18, isActive: true },
  { id: 'pr-kid-shirt-ex', clothTypeId: 'cloth-kid-shirt', clothName: 'Kids Shirt / Top', clothIcon: '👕', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 40, expressPrice: 60, turnaroundHours: 12, isActive: true },

  // Kids Pant / Shorts
  { id: 'pr-kid-pant-wf', clothTypeId: 'cloth-kid-pant', clothName: 'Kids Pant / Shorts', clothIcon: '🩳', categoryTag: 'KIDS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 20, expressPrice: 35, turnaroundHours: 24, isActive: true },
  { id: 'pr-kid-pant-wi', clothTypeId: 'cloth-kid-pant', clothName: 'Kids Pant / Shorts', clothIcon: '🩳', categoryTag: 'KIDS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 28, expressPrice: 45, turnaroundHours: 36, isActive: true },
  { id: 'pr-kid-pant-dc', clothTypeId: 'cloth-kid-pant', clothName: 'Kids Pant / Shorts', clothIcon: '🩳', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 50, expressPrice: 75, turnaroundHours: 48, isActive: true },
  { id: 'pr-kid-pant-si', clothTypeId: 'cloth-kid-pant', clothName: 'Kids Pant / Shorts', clothIcon: '🩳', categoryTag: 'KIDS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 12, expressPrice: 20, turnaroundHours: 18, isActive: true },
  { id: 'pr-kid-pant-ex', clothTypeId: 'cloth-kid-pant', clothName: 'Kids Pant / Shorts', clothIcon: '🩳', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 40, expressPrice: 60, turnaroundHours: 12, isActive: true },

  // Kids Frock / Dress
  { id: 'pr-kid-dress-wf', clothTypeId: 'cloth-kid-dress', clothName: 'Kids Frock / Dress', clothIcon: '👗', categoryTag: 'KIDS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-kid-dress-wi', clothTypeId: 'cloth-kid-dress', clothName: 'Kids Frock / Dress', clothIcon: '👗', categoryTag: 'KIDS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 50, expressPrice: 75, turnaroundHours: 36, isActive: true },
  { id: 'pr-kid-dress-dc', clothTypeId: 'cloth-kid-dress', clothName: 'Kids Frock / Dress', clothIcon: '👗', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 110, expressPrice: 160, turnaroundHours: 48, isActive: true },
  { id: 'pr-kid-dress-si', clothTypeId: 'cloth-kid-dress', clothName: 'Kids Frock / Dress', clothIcon: '👗', categoryTag: 'KIDS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 25, expressPrice: 40, turnaroundHours: 18, isActive: true },
  { id: 'pr-kid-dress-ex', clothTypeId: 'cloth-kid-dress', clothName: 'Kids Frock / Dress', clothIcon: '👗', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 85, expressPrice: 125, turnaroundHours: 12, isActive: true },

  // School Uniform Set
  { id: 'pr-kid-uniform-wf', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 40, expressPrice: 60, turnaroundHours: 24, isActive: true },
  { id: 'pr-kid-uniform-wi', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 60, expressPrice: 90, turnaroundHours: 36, isActive: true },
  { id: 'pr-kid-uniform-dc', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 170, turnaroundHours: 48, isActive: true },
  { id: 'pr-kid-uniform-si', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 25, expressPrice: 40, turnaroundHours: 18, isActive: true },
  { id: 'pr-kid-uniform-ex', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 95, expressPrice: 135, turnaroundHours: 12, isActive: true },
  { id: 'pr-kid-uniform-st', clothTypeId: 'cloth-kid-uniform', clothName: 'School Uniform Set', clothIcon: '🎒', categoryTag: 'KIDS', serviceId: 'srv-m-starch', serviceName: 'Starch & Crisp Finish', price: 20, expressPrice: 35, turnaroundHours: 24, isActive: true },

  // Baby Rompers (Pack of 3)
  { id: 'pr-baby-romper-wf', clothTypeId: 'cloth-baby-romper', clothName: 'Baby Rompers (Pack of 3)', clothIcon: '👶', categoryTag: 'KIDS', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-baby-romper-wi', clothTypeId: 'cloth-baby-romper', clothName: 'Baby Rompers (Pack of 3)', clothIcon: '👶', categoryTag: 'KIDS', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 50, expressPrice: 75, turnaroundHours: 36, isActive: true },
  { id: 'pr-baby-romper-dc', clothTypeId: 'cloth-baby-romper', clothName: 'Baby Rompers (Pack of 3)', clothIcon: '👶', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 70, expressPrice: 100, turnaroundHours: 48, isActive: true },
  { id: 'pr-baby-romper-si', clothTypeId: 'cloth-baby-romper', clothName: 'Baby Rompers (Pack of 3)', clothIcon: '👶', categoryTag: 'KIDS', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-baby-romper-ex', clothTypeId: 'cloth-baby-romper', clothName: 'Baby Rompers (Pack of 3)', clothIcon: '👶', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 60, expressPrice: 90, turnaroundHours: 12, isActive: true },

  // Soft Toys / Teddy Bear
  { id: 'pr-soft-toy-spa', clothTypeId: 'cloth-soft-toy', clothName: 'Soft Toys / Teddy Bear', clothIcon: '🧸', categoryTag: 'KIDS', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 160, expressPrice: 240, turnaroundHours: 48, isActive: true },
  { id: 'pr-soft-toy-dc', clothTypeId: 'cloth-soft-toy', clothName: 'Soft Toys / Teddy Bear', clothIcon: '🧸', categoryTag: 'KIDS', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 140, expressPrice: 200, turnaroundHours: 48, isActive: true },
  { id: 'pr-soft-toy-ex', clothTypeId: 'cloth-soft-toy', clothName: 'Soft Toys / Teddy Bear', clothIcon: '🧸', categoryTag: 'KIDS', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 110, expressPrice: 160, turnaroundHours: 18, isActive: true },

  // ── 4. HOME & BEDDING ──
  // Bedsheet (Single)
  { id: 'pr-bedsheet-s-wf', clothTypeId: 'cloth-bedsheet-s', clothName: 'Bedsheet (Single)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 50, expressPrice: 75, turnaroundHours: 24, isActive: true },
  { id: 'pr-bedsheet-s-wi', clothTypeId: 'cloth-bedsheet-s', clothName: 'Bedsheet (Single)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 80, expressPrice: 120, turnaroundHours: 36, isActive: true },
  { id: 'pr-bedsheet-s-dc', clothTypeId: 'cloth-bedsheet-s', clothName: 'Bedsheet (Single)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 170, turnaroundHours: 48, isActive: true },
  { id: 'pr-bedsheet-s-si', clothTypeId: 'cloth-bedsheet-s', clothName: 'Bedsheet (Single)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 35, expressPrice: 55, turnaroundHours: 18, isActive: true },
  { id: 'pr-bedsheet-s-ex', clothTypeId: 'cloth-bedsheet-s', clothName: 'Bedsheet (Single)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 95, expressPrice: 140, turnaroundHours: 12, isActive: true },

  // Bedsheet (Double / King)
  { id: 'pr-bedsheet-d-wf', clothTypeId: 'cloth-bedsheet-d', clothName: 'Bedsheet (Double / King)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 80, expressPrice: 120, turnaroundHours: 24, isActive: true },
  { id: 'pr-bedsheet-d-wi', clothTypeId: 'cloth-bedsheet-d', clothName: 'Bedsheet (Double / King)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 120, expressPrice: 180, turnaroundHours: 36, isActive: true },
  { id: 'pr-bedsheet-d-dc', clothTypeId: 'cloth-bedsheet-d', clothName: 'Bedsheet (Double / King)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 160, expressPrice: 240, turnaroundHours: 48, isActive: true },
  { id: 'pr-bedsheet-d-si', clothTypeId: 'cloth-bedsheet-d', clothName: 'Bedsheet (Double / King)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 50, expressPrice: 75, turnaroundHours: 18, isActive: true },
  { id: 'pr-bedsheet-d-ex', clothTypeId: 'cloth-bedsheet-d', clothName: 'Bedsheet (Double / King)', clothIcon: '🛏️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 130, expressPrice: 190, turnaroundHours: 12, isActive: true },

  // Pillow Covers (Pair)
  { id: 'pr-pillow-cover-wf', clothTypeId: 'cloth-pillow-cover', clothName: 'Pillow Covers (Pair)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 25, expressPrice: 40, turnaroundHours: 24, isActive: true },
  { id: 'pr-pillow-cover-wi', clothTypeId: 'cloth-pillow-cover', clothName: 'Pillow Covers (Pair)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 35, expressPrice: 55, turnaroundHours: 36, isActive: true },
  { id: 'pr-pillow-cover-dc', clothTypeId: 'cloth-pillow-cover', clothName: 'Pillow Covers (Pair)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 40, expressPrice: 60, turnaroundHours: 48, isActive: true },
  { id: 'pr-pillow-cover-si', clothTypeId: 'cloth-pillow-cover', clothName: 'Pillow Covers (Pair)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-pillow-cover-ex', clothTypeId: 'cloth-pillow-cover', clothName: 'Pillow Covers (Pair)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 30, expressPrice: 45, turnaroundHours: 12, isActive: true },

  // Blanket / Quilt (Single)
  { id: 'pr-blanket-wf', clothTypeId: 'cloth-blanket', clothName: 'Blanket / Quilt (Single)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 180, expressPrice: 260, turnaroundHours: 36, isActive: true },
  { id: 'pr-blanket-dc', clothTypeId: 'cloth-blanket', clothName: 'Blanket / Quilt (Single)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 240, expressPrice: 340, turnaroundHours: 48, isActive: true },
  { id: 'pr-blanket-ex', clothTypeId: 'cloth-blanket', clothName: 'Blanket / Quilt (Single)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 190, expressPrice: 270, turnaroundHours: 24, isActive: true },
  { id: 'pr-blanket-spa', clothTypeId: 'cloth-blanket', clothName: 'Blanket / Quilt (Single)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 260, expressPrice: 370, turnaroundHours: 48, isActive: true },

  // Blanket / Mink (Double)
  { id: 'pr-blanket-d-wf', clothTypeId: 'cloth-blanket-d', clothName: 'Blanket / Mink (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 240, expressPrice: 340, turnaroundHours: 36, isActive: true },
  { id: 'pr-blanket-d-dc', clothTypeId: 'cloth-blanket-d', clothName: 'Blanket / Mink (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 320, expressPrice: 440, turnaroundHours: 48, isActive: true },
  { id: 'pr-blanket-d-ex', clothTypeId: 'cloth-blanket-d', clothName: 'Blanket / Mink (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 250, expressPrice: 360, turnaroundHours: 24, isActive: true },
  { id: 'pr-blanket-d-spa', clothTypeId: 'cloth-blanket-d', clothName: 'Blanket / Mink (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 340, expressPrice: 480, turnaroundHours: 48, isActive: true },

  // Heavy Comforter / Rajai (Double)
  { id: 'pr-comforter-wf', clothTypeId: 'cloth-comforter', clothName: 'Heavy Comforter / Rajai (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 240, expressPrice: 350, turnaroundHours: 36, isActive: true },
  { id: 'pr-comforter-dc', clothTypeId: 'cloth-comforter', clothName: 'Heavy Comforter / Rajai (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 320, expressPrice: 450, turnaroundHours: 48, isActive: true },
  { id: 'pr-comforter-ex', clothTypeId: 'cloth-comforter', clothName: 'Heavy Comforter / Rajai (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 250, expressPrice: 360, turnaroundHours: 24, isActive: true },
  { id: 'pr-comforter-spa', clothTypeId: 'cloth-comforter', clothName: 'Heavy Comforter / Rajai (Double)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 350, expressPrice: 490, turnaroundHours: 48, isActive: true },

  // Curtains (Per Panel)
  { id: 'pr-curtain-wi', clothTypeId: 'cloth-curtain', clothName: 'Curtains (Per Panel)', clothIcon: '🪟', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 70, expressPrice: 110, turnaroundHours: 36, isActive: true },
  { id: 'pr-curtain-dc', clothTypeId: 'cloth-curtain', clothName: 'Curtains (Per Panel)', clothIcon: '🪟', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 180, turnaroundHours: 48, isActive: true },
  { id: 'pr-curtain-si', clothTypeId: 'cloth-curtain', clothName: 'Curtains (Per Panel)', clothIcon: '🪟', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 35, expressPrice: 55, turnaroundHours: 18, isActive: true },
  { id: 'pr-curtain-ex', clothTypeId: 'cloth-curtain', clothName: 'Curtains (Per Panel)', clothIcon: '🪟', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 95, expressPrice: 140, turnaroundHours: 12, isActive: true },

  // Bath Towel
  { id: 'pr-towel-wf', clothTypeId: 'cloth-towel', clothName: 'Bath Towel', clothIcon: '🛁', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 35, expressPrice: 55, turnaroundHours: 24, isActive: true },
  { id: 'pr-towel-wi', clothTypeId: 'cloth-towel', clothName: 'Bath Towel', clothIcon: '🛁', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 50, expressPrice: 75, turnaroundHours: 36, isActive: true },
  { id: 'pr-towel-dc', clothTypeId: 'cloth-towel', clothName: 'Bath Towel', clothIcon: '🛁', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 50, expressPrice: 75, turnaroundHours: 48, isActive: true },
  { id: 'pr-towel-si', clothTypeId: 'cloth-towel', clothName: 'Bath Towel', clothIcon: '🛁', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 15, expressPrice: 25, turnaroundHours: 18, isActive: true },
  { id: 'pr-towel-ex', clothTypeId: 'cloth-towel', clothName: 'Bath Towel', clothIcon: '🛁', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 40, expressPrice: 60, turnaroundHours: 12, isActive: true },

  // Sofa Covers (Set of 5)
  { id: 'pr-sofa-cover-wi', clothTypeId: 'cloth-sofa-cover', clothName: 'Sofa Covers (Set of 5)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 140, expressPrice: 200, turnaroundHours: 36, isActive: true },
  { id: 'pr-sofa-cover-dc', clothTypeId: 'cloth-sofa-cover', clothName: 'Sofa Covers (Set of 5)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 220, expressPrice: 320, turnaroundHours: 48, isActive: true },
  { id: 'pr-sofa-cover-si', clothTypeId: 'cloth-sofa-cover', clothName: 'Sofa Covers (Set of 5)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 60, expressPrice: 90, turnaroundHours: 24, isActive: true },
  { id: 'pr-sofa-cover-ex', clothTypeId: 'cloth-sofa-cover', clothName: 'Sofa Covers (Set of 5)', clothIcon: '🛋️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 175, expressPrice: 250, turnaroundHours: 18, isActive: true },

  // Tablecloth / Runner
  { id: 'pr-tablecloth-wf', clothTypeId: 'cloth-tablecloth', clothName: 'Tablecloth / Runner', clothIcon: '🍽️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 40, expressPrice: 60, turnaroundHours: 24, isActive: true },
  { id: 'pr-tablecloth-wi', clothTypeId: 'cloth-tablecloth', clothName: 'Tablecloth / Runner', clothIcon: '🍽️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', price: 70, expressPrice: 100, turnaroundHours: 36, isActive: true },
  { id: 'pr-tablecloth-dc', clothTypeId: 'cloth-tablecloth', clothName: 'Tablecloth / Runner', clothIcon: '🍽️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 120, expressPrice: 170, turnaroundHours: 48, isActive: true },
  { id: 'pr-tablecloth-si', clothTypeId: 'cloth-tablecloth', clothName: 'Tablecloth / Runner', clothIcon: '🍽️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-steam-iron', serviceName: 'Steam Pressing Only', price: 35, expressPrice: 50, turnaroundHours: 18, isActive: true },
  { id: 'pr-tablecloth-ex', clothTypeId: 'cloth-tablecloth', clothName: 'Tablecloth / Runner', clothIcon: '🍽️', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 70, expressPrice: 100, turnaroundHours: 12, isActive: true },

  // Door Mat / Small Rug
  { id: 'pr-doormat-wf', clothTypeId: 'cloth-doormat', clothName: 'Door Mat / Small Rug', clothIcon: '🚪', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 60, expressPrice: 90, turnaroundHours: 24, isActive: true },
  { id: 'pr-doormat-dc', clothTypeId: 'cloth-doormat', clothName: 'Door Mat / Small Rug', clothIcon: '🚪', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 80, expressPrice: 120, turnaroundHours: 48, isActive: true },
  { id: 'pr-doormat-spa', clothTypeId: 'cloth-doormat', clothName: 'Door Mat / Small Rug', clothIcon: '🚪', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 90, expressPrice: 130, turnaroundHours: 48, isActive: true },
  { id: 'pr-doormat-ex', clothTypeId: 'cloth-doormat', clothName: 'Door Mat / Small Rug', clothIcon: '🚪', categoryTag: 'HOME_TEXTILES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 60, expressPrice: 90, turnaroundHours: 18, isActive: true },

  // ── 5. FOOTWEAR ──
  // Sneakers / Sports Shoes
  { id: 'pr-shoes-sneaker-spa', clothTypeId: 'cloth-shoes-sneaker', clothName: 'Sneakers / Sports Shoes', clothIcon: '👟', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 250, expressPrice: 350, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-sneaker-dc', clothTypeId: 'cloth-shoes-sneaker', clothName: 'Sneakers / Sports Shoes', clothIcon: '👟', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 220, expressPrice: 320, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-sneaker-ex', clothTypeId: 'cloth-shoes-sneaker', clothName: 'Sneakers / Sports Shoes', clothIcon: '👟', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 190, expressPrice: 280, turnaroundHours: 18, isActive: true },

  // Formal Leather Shoes
  { id: 'pr-shoes-formal-spa', clothTypeId: 'cloth-shoes-formal', clothName: 'Formal Leather Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 290, expressPrice: 400, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-formal-dc', clothTypeId: 'cloth-shoes-formal', clothName: 'Formal Leather Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 250, expressPrice: 350, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-formal-ex', clothTypeId: 'cloth-shoes-formal', clothName: 'Formal Leather Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 220, expressPrice: 310, turnaroundHours: 18, isActive: true },

  // Suede / Nubuck Shoes
  { id: 'pr-shoes-suede-spa', clothTypeId: 'cloth-shoes-suede', clothName: 'Suede / Nubuck Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 350, expressPrice: 490, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-suede-dc', clothTypeId: 'cloth-shoes-suede', clothName: 'Suede / Nubuck Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 300, expressPrice: 420, turnaroundHours: 48, isActive: true },
  { id: 'pr-shoes-suede-ex', clothTypeId: 'cloth-shoes-suede', clothName: 'Suede / Nubuck Shoes', clothIcon: '👞', categoryTag: 'FOOTWEAR', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 260, expressPrice: 370, turnaroundHours: 18, isActive: true },

  // ── 6. BAGS, TRAVEL LUGGAGE & ACCESSORIES ──
  // Backpack / School Bag
  { id: 'pr-bag-backpack-spa', clothTypeId: 'cloth-bag-backpack', clothName: 'Backpack / School Bag', clothIcon: '🎒', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 180, expressPrice: 260, turnaroundHours: 48, isActive: true },
  { id: 'pr-bag-backpack-dc', clothTypeId: 'cloth-bag-backpack', clothName: 'Backpack / School Bag', clothIcon: '🎒', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 150, expressPrice: 220, turnaroundHours: 48, isActive: true },
  { id: 'pr-bag-backpack-wf', clothTypeId: 'cloth-bag-backpack', clothName: 'Backpack / School Bag', clothIcon: '🎒', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', price: 120, expressPrice: 180, turnaroundHours: 24, isActive: true },
  { id: 'pr-bag-backpack-ex', clothTypeId: 'cloth-bag-backpack', clothName: 'Backpack / School Bag', clothIcon: '🎒', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 140, expressPrice: 200, turnaroundHours: 18, isActive: true },

  // Luxury Handbag
  { id: 'pr-bag-luxury-spa', clothTypeId: 'cloth-bag-luxury', clothName: 'Luxury Handbag', clothIcon: '👜', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 490, expressPrice: 690, turnaroundHours: 48, isActive: true },
  { id: 'pr-bag-luxury-dc', clothTypeId: 'cloth-bag-luxury', clothName: 'Luxury Handbag', clothIcon: '👜', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 420, expressPrice: 600, turnaroundHours: 48, isActive: true },
  { id: 'pr-bag-luxury-ex', clothTypeId: 'cloth-bag-luxury', clothName: 'Luxury Handbag', clothIcon: '👜', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 380, expressPrice: 520, turnaroundHours: 18, isActive: true },

  // Cabin Trolley Bag (20")
  { id: 'pr-trolley-cabin-spa', clothTypeId: 'cloth-trolley-cabin', clothName: 'Cabin Trolley Bag (20")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 250, expressPrice: 350, turnaroundHours: 48, isActive: true },
  { id: 'pr-trolley-cabin-dc', clothTypeId: 'cloth-trolley-cabin', clothName: 'Cabin Trolley Bag (20")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 220, expressPrice: 320, turnaroundHours: 48, isActive: true },
  { id: 'pr-trolley-cabin-ex', clothTypeId: 'cloth-trolley-cabin', clothName: 'Cabin Trolley Bag (20")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 220, expressPrice: 320, turnaroundHours: 18, isActive: true },

  // Check-in Suitcase (28")
  { id: 'pr-trolley-large-spa', clothTypeId: 'cloth-trolley-large', clothName: 'Check-in Suitcase (28")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 390, expressPrice: 550, turnaroundHours: 48, isActive: true },
  { id: 'pr-trolley-large-dc', clothTypeId: 'cloth-trolley-large', clothName: 'Check-in Suitcase (28")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 350, expressPrice: 500, turnaroundHours: 48, isActive: true },
  { id: 'pr-trolley-large-ex', clothTypeId: 'cloth-trolley-large', clothName: 'Check-in Suitcase (28")', clothIcon: '🧳', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 340, expressPrice: 480, turnaroundHours: 18, isActive: true },

  // Bike Riding Helmet
  { id: 'pr-helmet-spa', clothTypeId: 'cloth-helmet', clothName: 'Bike Riding Helmet', clothIcon: '🪖', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-spa', serviceName: 'Deep Shoe & Leather Spa', price: 180, expressPrice: 260, turnaroundHours: 48, isActive: true },
  { id: 'pr-helmet-dc', clothTypeId: 'cloth-helmet', clothName: 'Bike Riding Helmet', clothIcon: '🪖', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-dry-clean', serviceName: 'Dry Cleaning', price: 160, expressPrice: 240, turnaroundHours: 48, isActive: true },
  { id: 'pr-helmet-ex', clothTypeId: 'cloth-helmet', clothName: 'Bike Riding Helmet', clothIcon: '🪖', categoryTag: 'ACCESSORIES', serviceId: 'srv-m-express', serviceName: 'Express Emergency Laundry', price: 150, expressPrice: 220, turnaroundHours: 18, isActive: true },
];

export const INITIAL_PRICING_SETTINGS: PricingSettings = {
  taxPercentage: 5,
  minOrderValue: 299,
  freeDeliveryThreshold: 499,
  standardDeliveryFee: 30,
  expressDeliveryFee: 80,
  extraKgPrice: 40,
};

export const INITIAL_DISPUTES: DisputeReport[] = [
  {
    id: 'DSP-1024',
    orderId: 'LAU10245',
    itemTagId: 'SH-10245-01',
    itemName: 'Formal Shirt (Blue Stripe)',
    issueType: 'DAMAGED_GARMENT',
    description: 'Customer reported minor button detachment on right cuff during wash cycle.',
    evidencePhotoUrl: '/assets/dispute_shirt.jpg',
    reportedBy: 'Rahul Verma',
    reportedAt: '2026-08-25 11:45 AM',
    status: 'INVESTIGATING',
    resolutionNotes: 'Under review with facility QC lead. Replacement button being attached at tailoring bench.',
  },
  {
    id: 'DSP-1021',
    orderId: 'LAU10242',
    itemTagId: 'BS-10242-01',
    itemName: 'Bedsheet Double (Pink Floral)',
    issueType: 'COLOR_BLEED',
    description: 'Light color bleeding on pillow cover border.',
    reportedBy: 'Ananya Deshmukh',
    reportedAt: '2026-08-24 04:20 PM',
    status: 'RESOLVED_CREDIT',
    resolutionNotes: 'Approved ₹150 store credit to customer wallet as courtesy compensation.',
    compensationAmount: 150,
    closedAt: '2026-08-24 06:00 PM',
  },
];

export const INITIAL_MACHINES: LaundryMachine[] = [
  {
    id: 'WM-001',
    type: 'WASHER',
    name: 'Industrial Ozone Washer #1 (25 KG)',
    capacityKg: 25,
    currentLoadKg: 20,
    status: 'RUNNING',
    lastServiceDate: '2026-08-01',
    nextServiceDate: '2026-09-01',
  },
  {
    id: 'WM-002',
    type: 'WASHER',
    name: 'Industrial Ozone Washer #2 (25 KG)',
    capacityKg: 25,
    currentLoadKg: 0,
    status: 'AVAILABLE',
    lastServiceDate: '2026-08-10',
    nextServiceDate: '2026-09-10',
  },
  {
    id: 'DR-001',
    type: 'DRYER',
    name: 'Heavy Duty Gas Tumble Dryer (30 KG)',
    capacityKg: 30,
    currentLoadKg: 25,
    status: 'RUNNING',
    lastServiceDate: '2026-08-05',
    nextServiceDate: '2026-09-05',
  },
  {
    id: 'SI-001',
    type: 'STEAM_PRESS',
    name: 'Vacuum Steam Press Table #1',
    capacityKg: 15,
    currentLoadKg: 10,
    status: 'RUNNING',
    lastServiceDate: '2026-08-15',
    nextServiceDate: '2026-09-15',
  },
  {
    id: 'SI-002',
    type: 'STEAM_PRESS',
    name: 'Vacuum Steam Press Table #2',
    capacityKg: 15,
    currentLoadKg: 0,
    status: 'MAINTENANCE',
    lastServiceDate: '2026-07-20',
    nextServiceDate: '2026-08-26',
  },
];

export const INITIAL_COD_RECORDS: CODReconciliationRecord[] = [
  {
    id: 'COD-20260825-01',
    riderId: 'stf-4',
    riderName: 'Vikram Singh',
    date: '2026-08-25',
    orderIds: ['LAU10245', 'LAU10243'],
    totalCollected: 4200,
    depositedAmount: 4200,
    difference: 0,
    status: 'SETTLED',
    notes: 'All cash verified and deposited at Koramangala cash desk.',
  },
  {
    id: 'COD-20260825-02',
    riderId: 'stf-5',
    riderName: 'Ravi Kumar',
    date: '2026-08-25',
    orderIds: ['LAU10241'],
    totalCollected: 1850,
    depositedAmount: 0,
    difference: 1850,
    status: 'PENDING',
    notes: 'Out on evening delivery shift.',
  },
];

export const INITIAL_HUBS: HubBranch[] = [
  {
    id: 'HUB-RJY-01',
    name: 'Rajahmundry Central Hub',
    city: 'Rajahmundry',
    address: 'Plot 42, Danavaipeta Main Road, Rajahmundry, AP - 533103',
    pincodes: ['533001', '533002', '533003', '533004', '533101', '533103'],
    contactPhone: '+91 883 245 6789',
    capacityKgPerDay: 500,
    activeOrdersCount: 24,
    inHouseVehicles: [
      {
        id: 'VAN-RJY-01',
        vehicleType: 'ELECTRIC_VAN',
        registrationNo: 'AP-05-EV-4120',
        driverName: 'Vikram Singh',
        driverPhone: '+91 98765 11001',
        capacityKg: 120,
        status: 'ON_ROUTE',
        currentHubId: 'HUB-RJY-01',
      },
      {
        id: 'SCOOT-RJY-01',
        vehicleType: 'CARGO_SCOOTER',
        registrationNo: 'AP-05-EV-8821',
        driverName: 'Kishore Varma',
        driverPhone: '+91 98765 11002',
        capacityKg: 40,
        status: 'IDLE',
        currentHubId: 'HUB-RJY-01',
      },
    ],
    isActive: true,
  },
  {
    id: 'HUB-KAK-01',
    name: 'Kakinada Port Hub',
    city: 'Kakinada',
    address: 'Near Bhanugudi Junction, Cinema Road, Kakinada, AP - 533003',
    pincodes: ['533005', '533006', '533007'],
    contactPhone: '+91 884 233 4567',
    capacityKgPerDay: 350,
    activeOrdersCount: 12,
    inHouseVehicles: [
      {
        id: 'VAN-KAK-01',
        vehicleType: 'DELIVERY_VAN',
        registrationNo: 'AP-04-TX-9021',
        driverName: 'Srinivas Rao',
        driverPhone: '+91 98765 22001',
        capacityKg: 100,
        status: 'IDLE',
        currentHubId: 'HUB-KAK-01',
      },
    ],
    isActive: true,
  },
  {
    id: 'HUB-BGL-01',
    name: 'Bangalore HSR Hub',
    city: 'Bengaluru',
    address: 'Sector 2, 27th Main Rd, HSR Layout, Bengaluru, KA - 560102',
    pincodes: ['560034', '560102', '560095', '560068', '560076'],
    contactPhone: '+91 80 4122 3344',
    capacityKgPerDay: 800,
    activeOrdersCount: 46,
    inHouseVehicles: [
      {
        id: 'VAN-BGL-01',
        vehicleType: 'ELECTRIC_VAN',
        registrationNo: 'KA-01-EV-3301',
        driverName: 'Ravi Kumar',
        driverPhone: '+91 98765 33001',
        capacityKg: 150,
        status: 'ON_ROUTE',
        currentHubId: 'HUB-BGL-01',
      },
    ],
    isActive: true,
  },
];

export const INITIAL_DISTANCE_CONFIG: DistanceDeliveryConfig = {
  baseDistanceKm: 3,
  baseFee: 0,
  perKmRateAfterBase: 10,
  distanceTiers: [
    { minKm: 0, maxKm: 3, fee: 0 },
    { minKm: 3, maxKm: 7, fee: 40 },
    { minKm: 7, maxKm: 12, fee: 80 },
    { minKm: 12, maxKm: 20, fee: 150 },
  ],
  freeDeliveryOrderValue: 499,
  maxServiceRadiusKm: 25,
  expressDeliveryMultiplier: 1.5,
};

export const INITIAL_SLOT_CAPACITIES: TimeSlotCapacity[] = [
  {
    id: 'SLOT-01',
    hubId: 'HUB-RJY-01',
    date: '2026-08-25',
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    maxOrders: 10,
    maxKg: 60,
    bookedOrders: 7,
    bookedKg: 42,
    isAvailable: true,
    isActive: true,
  },
  {
    id: 'SLOT-02',
    hubId: 'HUB-RJY-01',
    date: '2026-08-25',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    maxOrders: 15,
    maxKg: 90,
    bookedOrders: 15,
    bookedKg: 90,
    isAvailable: false,
    isActive: true,
  },
  {
    id: 'SLOT-03',
    hubId: 'HUB-RJY-01',
    date: '2026-08-25',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    maxOrders: 12,
    maxKg: 70,
    bookedOrders: 4,
    bookedKg: 24,
    isAvailable: true,
    isActive: true,
  },
  {
    id: 'SLOT-04',
    hubId: 'HUB-RJY-01',
    date: '2026-08-25',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    maxOrders: 15,
    maxKg: 90,
    bookedOrders: 6,
    bookedKg: 36,
    isAvailable: true,
    isActive: true,
  },
  {
    id: 'SLOT-05',
    hubId: 'HUB-RJY-01',
    date: '2026-08-25',
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    maxOrders: 10,
    maxKg: 60,
    bookedOrders: 2,
    bookedKg: 12,
    isAvailable: true,
    isActive: true,
  },
];

export const INITIAL_QC_RECORDS: QCChecklistRecord[] = [
  {
    id: 'QC-10245-01',
    orderId: 'LAU10245',
    garmentTagId: 'SH-10245-01',
    clothName: 'Formal Shirt (Blue Stripe)',
    stainRemoved: true,
    washedProperly: true,
    driedProperly: true,
    ironedProperly: true,
    noDamage: true,
    correctItem: true,
    correctQuantity: true,
    correctPackaging: true,
    status: 'QC_PASSED',
    reworkCount: 0,
    inspectedBy: 'Anil Kumar (QC Inspector #2)',
    inspectedAt: '2026-08-25 11:30 AM',
  },
];

export const INITIAL_DAMAGE_RULES: DamageCompensationRule[] = [
  {
    id: 'RUL-01',
    garmentCategory: 'Silk Sarees / Bridal Wear',
    damageType: 'MAJOR_TEAR',
    maxCompensation: 2500,
    requiresAdminApproval: true,
  },
  {
    id: 'RUL-02',
    garmentCategory: 'Formal Shirts & Trousers',
    damageType: 'BUTTON_LOSS',
    maxCompensation: 200,
    requiresAdminApproval: false,
  },
  {
    id: 'RUL-03',
    garmentCategory: 'Bedding & Curtains',
    damageType: 'COLOR_BLEED',
    maxCompensation: 800,
    requiresAdminApproval: true,
  },
];

export const INITIAL_INVENTORY: ConsumableInventory[] = [
  {
    id: 'INV-01',
    itemName: 'Eco-Enzyme Commercial Detergent',
    category: 'DETERGENT',
    currentStock: 180,
    minThreshold: 50,
    unit: 'LITERS',
    unitCost: 140,
    status: 'IN_STOCK',
    location: 'Hub A - Shelf D1',
    lastRestockedAt: '2026-08-20',
  },
  {
    id: 'INV-02',
    itemName: 'Continuous Ozone Sanitizing Fluid',
    category: 'CHEMICAL',
    currentStock: 35,
    minThreshold: 40,
    unit: 'LITERS',
    unitCost: 320,
    status: 'LOW_STOCK',
    location: 'Hub A - Chemical Vault',
    lastRestockedAt: '2026-08-15',
  },
  {
    id: 'INV-03',
    itemName: 'Lavender Fabric Conditioner & Softener',
    category: 'SOFTENER',
    currentStock: 240,
    minThreshold: 60,
    unit: 'LITERS',
    unitCost: 95,
    status: 'IN_STOCK',
    location: 'Hub A - Shelf D2',
    lastRestockedAt: '2026-08-22',
  },
  {
    id: 'INV-04',
    itemName: 'Stain Remover & Spotting Solution',
    category: 'CHEMICAL',
    currentStock: 12,
    minThreshold: 20,
    unit: 'LITERS',
    unitCost: 450,
    status: 'LOW_STOCK',
    location: 'Hub B - Spotting Bench',
    lastRestockedAt: '2026-08-10',
  },
  {
    id: 'INV-05',
    itemName: 'Breathable Garment Suit Bags',
    category: 'PACKAGING',
    currentStock: 350,
    minThreshold: 100,
    unit: 'UNITS',
    unitCost: 12,
    status: 'IN_STOCK',
    location: 'Hub A - Packing Station',
    lastRestockedAt: '2026-08-12',
  },
];

export const INITIAL_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'TMP-01',
    eventName: 'PICKUP_SCHEDULED',
    channel: 'WHATSAPP',
    title: 'Pickup Confirmed Notification',
    templateBody: '🧺 *LaundryFresh Update*\n\nHello {{customer_name}},\nYour laundry pickup for Order *#{{order_id}}* is scheduled for *{{pickup_time}}*.\n\nAssigned In-House Driver: *{{driver_name}}* ({{driver_phone}})\nDistance: *{{distance_km}} KM*\n\nTrack: {{track_url}}',
    placeholders: ['customer_name', 'order_id', 'pickup_time', 'driver_name', 'driver_phone', 'distance_km', 'track_url'],
    isActive: true,
  },
  {
    id: 'TMP-02',
    eventName: 'PRICE_APPROVAL_REQUIRED',
    channel: 'WHATSAPP',
    title: 'Scale Weighed & Price Approval',
    templateBody: '⚖️ *LaundryFresh Scale Verified*\n\nOrder *#{{order_id}}* has been weighed at our hub.\n\nEstimated: *{{estimated_kg}} KG*\nActual Weighed: *{{actual_kg}} KG*\nDifference: *₹{{difference_amount}}*\n\n👉 Click below to approve and start wash:\n{{approval_url}}',
    placeholders: ['order_id', 'estimated_kg', 'actual_kg', 'difference_amount', 'approval_url'],
    isActive: true,
  },
  {
    id: 'TMP-03',
    eventName: 'OUT_FOR_DELIVERY',
    channel: 'WHATSAPP',
    title: 'Out for Delivery Notification',
    templateBody: '🚚 *LaundryFresh Delivery On The Way*\n\nHello {{customer_name}},\nYour sanitized, fresh clothes for Order *#{{order_id}}* are on the way!\n\nDelivery OTP: *{{delivery_otp}}*\nIn-House Driver: *{{driver_name}}*\n\nShare OTP only after verifying your garments.',
    placeholders: ['customer_name', 'order_id', 'delivery_otp', 'driver_name'],
    isActive: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-01',
    userId: 'usr-admin-1',
    userName: 'Rajesh Kumar',
    userRole: 'SUPER_ADMIN',
    action: 'PRICE_UPDATED',
    module: 'PRICING_ENGINE',
    details: 'Updated Men Shirt Steam Iron rate from ₹35 to ₹40.',
    timestamp: '2026-08-25 10:15 AM',
  },
  {
    id: 'AUD-02',
    userId: 'usr-admin-1',
    userName: 'Rajesh Kumar',
    userRole: 'SUPER_ADMIN',
    action: 'DISPUTE_RESOLVED',
    module: 'DISPUTES',
    details: 'Approved ₹150 wallet credit for dispute #DSP-1021.',
    timestamp: '2026-08-24 06:00 PM',
  },
  {
    id: 'AUD-03',
    userId: 'usr-mgr-1',
    userName: 'Anita Rao',
    userRole: 'MANAGER',
    action: 'DELIVERY_CONFIG_UPDATED',
    module: 'DISTANCE_ENGINE',
    details: 'Set free delivery threshold to ₹499.',
    timestamp: '2026-08-24 02:30 PM',
  },
];

export const INITIAL_BULK_PRICING: BulkPricingItem[] = [
  // Wash & Fold (srv-m-wash-fold)
  { id: 'bp-wf-1', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 1, regularPrice: 80, expressPrice: 160, regularTatHours: 48, expressTatHours: 12, isActive: true },
  { id: 'bp-wf-2', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 2, regularPrice: 150, expressPrice: 300, regularTatHours: 48, expressTatHours: 12, isActive: true },
  { id: 'bp-wf-3', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 3, regularPrice: 210, expressPrice: 420, regularTatHours: 48, expressTatHours: 12, isActive: true },
  { id: 'bp-wf-4', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 4, regularPrice: 260, expressPrice: 520, regularTatHours: 48, expressTatHours: 12, isActive: true },
  { id: 'bp-wf-5', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 5, regularPrice: 300, expressPrice: 600, regularTatHours: 48, expressTatHours: 12, isActive: true },
  { id: 'bp-wf-10', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-fold', serviceName: 'Wash & Fold', weightKg: 10, regularPrice: 550, expressPrice: 1100, regularTatHours: 48, expressTatHours: 12, isActive: true },

  // Wash & Steam Iron (srv-m-wash-iron)
  { id: 'bp-wi-1', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 1, regularPrice: 120, expressPrice: 220, regularTatHours: 36, expressTatHours: 12, isActive: true },
  { id: 'bp-wi-2', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 2, regularPrice: 220, expressPrice: 400, regularTatHours: 36, expressTatHours: 12, isActive: true },
  { id: 'bp-wi-3', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 3, regularPrice: 315, expressPrice: 580, regularTatHours: 36, expressTatHours: 12, isActive: true },
  { id: 'bp-wi-4', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 4, regularPrice: 400, expressPrice: 720, regularTatHours: 36, expressTatHours: 12, isActive: true },
  { id: 'bp-wi-5', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 5, regularPrice: 475, expressPrice: 850, regularTatHours: 36, expressTatHours: 12, isActive: true },
  { id: 'bp-wi-10', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-wash-iron', serviceName: 'Wash & Steam Iron', weightKg: 10, regularPrice: 880, expressPrice: 1550, regularTatHours: 36, expressTatHours: 12, isActive: true },

  // Express Laundry (srv-m-express)
  { id: 'bp-ex-1', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 1, regularPrice: 160, expressPrice: 240, regularTatHours: 12, expressTatHours: 6, isActive: true },
  { id: 'bp-ex-2', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 2, regularPrice: 300, expressPrice: 450, regularTatHours: 12, expressTatHours: 6, isActive: true },
  { id: 'bp-ex-3', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 3, regularPrice: 420, expressPrice: 630, regularTatHours: 12, expressTatHours: 6, isActive: true },
  { id: 'bp-ex-4', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 4, regularPrice: 520, expressPrice: 780, regularTatHours: 12, expressTatHours: 6, isActive: true },
  { id: 'bp-ex-5', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 5, regularPrice: 600, expressPrice: 900, regularTatHours: 12, expressTatHours: 6, isActive: true },
  { id: 'bp-ex-10', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-express', serviceName: 'Express Laundry', weightKg: 10, regularPrice: 1100, expressPrice: 1650, regularTatHours: 12, expressTatHours: 6, isActive: true },

  // Premium Care (srv-m-premium)
  { id: 'bp-pr-1', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 1, regularPrice: 180, expressPrice: 280, regularTatHours: 72, expressTatHours: 24, isActive: true },
  { id: 'bp-pr-2', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 2, regularPrice: 340, expressPrice: 520, regularTatHours: 72, expressTatHours: 24, isActive: true },
  { id: 'bp-pr-3', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 3, regularPrice: 480, expressPrice: 740, regularTatHours: 72, expressTatHours: 24, isActive: true },
  { id: 'bp-pr-4', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 4, regularPrice: 600, expressPrice: 900, regularTatHours: 72, expressTatHours: 24, isActive: true },
  { id: 'bp-pr-5', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 5, regularPrice: 700, expressPrice: 1050, regularTatHours: 72, expressTatHours: 24, isActive: true },
  { id: 'bp-pr-10', laundryType: 'MIXED_LAUNDRY', serviceId: 'srv-m-premium', serviceName: 'Premium Care', weightKg: 10, regularPrice: 1300, expressPrice: 1950, regularTatHours: 72, expressTatHours: 24, isActive: true },
];

export const INITIAL_LOYALTY_ACCOUNT: LoyaltyPointsAccount = {
  customerId: 'usr-default',
  totalPoints: 350,
  pointsEarnedLifetime: 650,
  pointsRedeemedLifetime: 300,
  conversionRateInr: 0.1,
};

// Helper Functions for Store Management
class LaundryDatabase {
  private orders: Order[] = [...INITIAL_ORDERS];
  private services: Service[] = [...INITIAL_SERVICES];
  private categories: ServiceCategory[] = [...INITIAL_CATEGORIES];
  private coupons: Coupon[] = [...INITIAL_COUPONS];
  private pincodes: PincodeZone[] = [...INITIAL_PINCODES];
  private staff: StaffMember[] = [...INITIAL_STAFF];
  private batches: LaundryBatch[] = [...INITIAL_BATCHES];
  private wallet: Wallet = { ...INITIAL_WALLET };
  private clothTypes: ClothType[] = [...INITIAL_CLOTH_TYPES];
  private serviceMasters: ServiceMaster[] = [...INITIAL_SERVICE_MASTERS];
  private priceMatrix: ServicePriceItem[] = [...INITIAL_SERVICE_PRICE_MATRIX];
  private bulkPricing: BulkPricingItem[] = [...INITIAL_BULK_PRICING];
  private pricingSettings: PricingSettings = { ...INITIAL_PRICING_SETTINGS };
  private disputes: DisputeReport[] = [...INITIAL_DISPUTES];
  private machines: LaundryMachine[] = [...INITIAL_MACHINES];
  private codRecords: CODReconciliationRecord[] = [...INITIAL_COD_RECORDS];
  private hubs: HubBranch[] = [...INITIAL_HUBS];
  private distanceConfig: DistanceDeliveryConfig = { ...INITIAL_DISTANCE_CONFIG };
  private slotCapacities: TimeSlotCapacity[] = [...INITIAL_SLOT_CAPACITIES];
  private qcRecords: QCChecklistRecord[] = [...INITIAL_QC_RECORDS];
  private inventory: ConsumableInventory[] = [...INITIAL_INVENTORY];
  private notificationTemplates: NotificationTemplate[] = [...INITIAL_NOTIFICATION_TEMPLATES];
  private auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
  private damageRules: DamageCompensationRule[] = [...INITIAL_DAMAGE_RULES];
  private loyaltyAccount: LoyaltyPointsAccount = { ...INITIAL_LOYALTY_ACCOUNT };
  private subscriptionPlans: SubscriptionPlan[] = [...INITIAL_SUBSCRIPTION_PLANS];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const savedPlans = localStorage.getItem('laundry_subscription_plans');
        if (savedPlans) this.subscriptionPlans = JSON.parse(savedPlans);

        const PINCODE_CACHE_VERSION = 'v2.0_hyderabad_50';
        const currentPincodeVersion = localStorage.getItem('laundry_pincode_version');
        const savedPincodes = localStorage.getItem('laundry_pincodes');
        if (
          !savedPincodes ||
          currentPincodeVersion !== PINCODE_CACHE_VERSION
        ) {
          // Seed from code defaults — includes all 50 Hyderabad pincodes
          this.pincodes = [...INITIAL_PINCODES];
          this.safeSetItem('laundry_pincodes', JSON.stringify(this.pincodes));
          this.safeSetItem('laundry_pincode_version', PINCODE_CACHE_VERSION);
        } else {
          try {
            const parsedPincodes = JSON.parse(savedPincodes);
            // If saved list is too small (< 50), force re-seed
            if (!Array.isArray(parsedPincodes) || parsedPincodes.length < 50) {
              this.pincodes = [...INITIAL_PINCODES];
              this.safeSetItem('laundry_pincodes', JSON.stringify(this.pincodes));
              this.safeSetItem('laundry_pincode_version', PINCODE_CACHE_VERSION);
            } else {
              this.pincodes = parsedPincodes;
            }
          } catch {
            this.pincodes = [...INITIAL_PINCODES];
          }
        }

        const CATALOG_CACHE_VERSION = 'v3.3_full_comprehensive_matrix';
        const currentVersion = localStorage.getItem('laundry_catalog_version');

        const savedOrders = localStorage.getItem('laundry_orders');
        if (savedOrders) this.orders = JSON.parse(savedOrders);

        const savedServices = localStorage.getItem('laundry_services');
        if (savedServices) this.services = JSON.parse(savedServices);

        const savedCoupons = localStorage.getItem('laundry_coupons');
        if (savedCoupons) this.coupons = JSON.parse(savedCoupons);

        const savedWallet = localStorage.getItem('laundry_wallet');
        if (savedWallet) this.wallet = JSON.parse(savedWallet);

        const savedClothTypes = localStorage.getItem('laundry_cloth_types');
        const savedMasters = localStorage.getItem('laundry_service_masters');
        const savedMatrix = localStorage.getItem('laundry_price_matrix');

        // Check if cached data is stale, legacy format, or has test/empty values
        if (
          currentVersion !== CATALOG_CACHE_VERSION ||
          !savedClothTypes ||
          !savedMatrix ||
          !savedMasters
        ) {
          this.clothTypes = [...INITIAL_CLOTH_TYPES];
          this.serviceMasters = [...INITIAL_SERVICE_MASTERS];
          this.priceMatrix = [...INITIAL_SERVICE_PRICE_MATRIX];
          this.safeSetItem('laundry_cloth_types', JSON.stringify(this.clothTypes));
          this.safeSetItem('laundry_service_masters', JSON.stringify(this.serviceMasters));
          this.safeSetItem('laundry_price_matrix', JSON.stringify(this.priceMatrix));
          this.safeSetItem('laundry_catalog_version', CATALOG_CACHE_VERSION);
        } else {
          try {
            const parsedCloth = JSON.parse(savedClothTypes);
            const parsedMatrix = JSON.parse(savedMatrix);
            // If parsed data is old dummy list (< 50 items) or matrix size < 150, reset to master
            if (
              !Array.isArray(parsedCloth) ||
              parsedCloth.length < 50 ||
              !Array.isArray(parsedMatrix) ||
              parsedMatrix.length < 150 ||
              parsedMatrix.some((p: any) => p.clothName === 'Shirt' && p.serviceId === 'srv-m-dry-clean' && p.price === 1)
            ) {
              this.clothTypes = [...INITIAL_CLOTH_TYPES];
              this.serviceMasters = [...INITIAL_SERVICE_MASTERS];
              this.priceMatrix = [...INITIAL_SERVICE_PRICE_MATRIX];
              this.safeSetItem('laundry_cloth_types', JSON.stringify(this.clothTypes));
              this.safeSetItem('laundry_service_masters', JSON.stringify(this.serviceMasters));
              this.safeSetItem('laundry_price_matrix', JSON.stringify(this.priceMatrix));
              this.safeSetItem('laundry_catalog_version', CATALOG_CACHE_VERSION);
            } else {
              this.clothTypes = parsedCloth;
              this.serviceMasters = JSON.parse(savedMasters);
              this.priceMatrix = parsedMatrix;
            }
          } catch (e) {
            this.clothTypes = [...INITIAL_CLOTH_TYPES];
            this.serviceMasters = [...INITIAL_SERVICE_MASTERS];
            this.priceMatrix = [...INITIAL_SERVICE_PRICE_MATRIX];
          }
        }

        const savedSettings = localStorage.getItem('laundry_pricing_settings');
        if (savedSettings) this.pricingSettings = JSON.parse(savedSettings);

        const savedDisputes = localStorage.getItem('laundry_disputes');
        if (savedDisputes) this.disputes = JSON.parse(savedDisputes);

        const savedMachines = localStorage.getItem('laundry_machines');
        if (savedMachines) this.machines = JSON.parse(savedMachines);

        const savedCOD = localStorage.getItem('laundry_cod_records');
        if (savedCOD) this.codRecords = JSON.parse(savedCOD);

        const savedHubs = localStorage.getItem('laundry_hubs');
        if (savedHubs) this.hubs = JSON.parse(savedHubs);

        const savedDistance = localStorage.getItem('laundry_distance_config');
        if (savedDistance) this.distanceConfig = JSON.parse(savedDistance);

        const savedSlots = localStorage.getItem('laundry_slot_capacities');
        if (savedSlots) this.slotCapacities = JSON.parse(savedSlots);

        const savedQC = localStorage.getItem('laundry_qc_records');
        if (savedQC) this.qcRecords = JSON.parse(savedQC);

        const savedInventory = localStorage.getItem('laundry_inventory');
        if (savedInventory) this.inventory = JSON.parse(savedInventory);

        const savedTemplates = localStorage.getItem('laundry_notification_templates');
        if (savedTemplates) this.notificationTemplates = JSON.parse(savedTemplates);

        const savedAudit = localStorage.getItem('laundry_audit_logs');
        if (savedAudit) this.auditLogs = JSON.parse(savedAudit);

        const savedDamage = localStorage.getItem('laundry_damage_rules');
        if (savedDamage) this.damageRules = JSON.parse(savedDamage);

        const savedLoyalty = localStorage.getItem('laundry_loyalty_account');
        if (savedLoyalty) this.loyaltyAccount = JSON.parse(savedLoyalty);
      } catch (err) {
        console.error('Failed to load local database', err);
      }
    }
  }

  private safeSetItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        console.warn(`localStorage quota exceeded for key "${key}". Cleaning legacy base64 images...`);
        // If services key caused quota exceeded, sanitize heavy base64 images
        if (key === 'laundry_services') {
          const sanitizedServices = this.services.map((s) => ({
            ...s,
            imageUrl: s.imageUrl?.startsWith('data:') && s.imageUrl.length > 50000
              ? '/images/service_wash_fold.jpg'
              : s.imageUrl,
          }));
          try {
            localStorage.setItem(key, JSON.stringify(sanitizedServices));
          } catch (retryErr) {
            console.error('Failed to save services even after sanitization', retryErr);
          }
        }
      } else {
        console.error(`Error saving ${key} to localStorage`, err);
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      this.safeSetItem('laundry_pincodes', JSON.stringify(this.pincodes));
      this.safeSetItem('laundry_orders', JSON.stringify(this.orders));
      this.safeSetItem('laundry_services', JSON.stringify(this.services));
      this.safeSetItem('laundry_coupons', JSON.stringify(this.coupons));
      this.safeSetItem('laundry_wallet', JSON.stringify(this.wallet));
      this.safeSetItem('laundry_cloth_types', JSON.stringify(this.clothTypes));
      this.safeSetItem('laundry_service_masters', JSON.stringify(this.serviceMasters));
      this.safeSetItem('laundry_price_matrix', JSON.stringify(this.priceMatrix));
      this.safeSetItem('laundry_pricing_settings', JSON.stringify(this.pricingSettings));
      this.safeSetItem('laundry_disputes', JSON.stringify(this.disputes));
      this.safeSetItem('laundry_machines', JSON.stringify(this.machines));
      this.safeSetItem('laundry_cod_records', JSON.stringify(this.codRecords));
      this.safeSetItem('laundry_hubs', JSON.stringify(this.hubs));
      this.safeSetItem('laundry_distance_config', JSON.stringify(this.distanceConfig));
      this.safeSetItem('laundry_slot_capacities', JSON.stringify(this.slotCapacities));
      this.safeSetItem('laundry_qc_records', JSON.stringify(this.qcRecords));
      this.safeSetItem('laundry_inventory', JSON.stringify(this.inventory));
      this.safeSetItem('laundry_notification_templates', JSON.stringify(this.notificationTemplates));
      this.safeSetItem('laundry_audit_logs', JSON.stringify(this.auditLogs));
      this.safeSetItem('laundry_damage_rules', JSON.stringify(this.damageRules));
      this.safeSetItem('laundry_loyalty_account', JSON.stringify(this.loyaltyAccount));
      this.safeSetItem('laundry_subscription_plans', JSON.stringify(this.subscriptionPlans));
    }
  }

  // --- Subscription Plans CRUD ---
  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.subscriptionPlans;
  }

  setSubscriptionPlans(plans: SubscriptionPlan[]): void {
    this.subscriptionPlans = plans;
    this.persist();
  }

  addSubscriptionPlan(plan: SubscriptionPlan): SubscriptionPlan {
    const idx = this.subscriptionPlans.findIndex((p) => p.id === plan.id || p.slug === plan.slug);
    if (idx !== -1) {
      this.subscriptionPlans[idx] = { ...this.subscriptionPlans[idx], ...plan };
    } else {
      this.subscriptionPlans.unshift(plan);
    }
    this.persist();
    return plan;
  }

  updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan | null {
    const idx = this.subscriptionPlans.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.subscriptionPlans[idx] = { ...this.subscriptionPlans[idx], ...updates };
    this.persist();
    return this.subscriptionPlans[idx];
  }

  deleteSubscriptionPlan(id: string): boolean {
    const beforeLen = this.subscriptionPlans.length;
    this.subscriptionPlans = this.subscriptionPlans.filter((p) => p.id !== id);
    const deleted = this.subscriptionPlans.length < beforeLen;
    if (deleted) this.persist();
    return deleted;
  }

  // --- Orders ---
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  }

  createOrder(newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'bagTagCode' | 'pickupOtp' | 'deliveryOtp' | 'currentStatus' | 'statusHistory' | 'isWeighed'>): Order {
    const nextNum = 10246 + this.orders.length;
    const id = `LAU${nextNum}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bagTagCode = `BAG-${id}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const order: Order = {
      ...newOrder,
      id,
      bagTagCode,
      pickupOtp,
      deliveryOtp,
      currentStatus: 'ORDER_PLACED',
      isWeighed: false,
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          title: 'Order Placed',
          description: `Your laundry order #${id} has been placed successfully.`,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.orders.unshift(order);
    this.persist();
    return order;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string, updatedBy?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.currentStatus = newStatus;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const statusDescriptions: Record<OrderStatus, { title: string; desc: string }> = {
      ORDER_PLACED: { title: 'Order Placed', desc: 'Order received and waiting for pickup allocation.' },
      PICKUP_ASSIGNED: { title: 'Pickup Assigned', desc: 'Pickup partner is assigned to collect your laundry.' },
      PICKED_UP: { title: 'Picked Up', desc: 'Laundry bag collected and OTP verified.' },
      RECEIVED_AT_FACILITY: { title: 'Received at Facility', desc: 'Arrived at the washing facility.' },
      WEIGHED_VERIFIED: { title: 'Weighed & Verified', desc: 'Load accurately weighed and line items confirmed.' },
      WASHING: { title: 'Washing', desc: 'Clothes are undergoing eco-friendly washing cycle.' },
      DRYING: { title: 'Drying', desc: 'Tumble drying at controlled temperatures.' },
      IRONING: { title: 'Steam Ironing', desc: 'Crisp steam pressing & wrinkle removal.' },
      QUALITY_CHECK: { title: 'Quality Check', desc: 'Final inspection for spotless finish & button checks.' },
      PACKED: { title: 'Packed & Tagged', desc: 'Garments neatly packed in protective covers.' },
      DELIVERY_ASSIGNED: { title: 'Delivery Assigned', desc: 'Delivery partner assigned for doorstep drop.' },
      OUT_FOR_DELIVERY: { title: 'Out for Delivery', desc: 'Delivery partner is heading to your location.' },
      DELIVERED: { title: 'Delivered', desc: 'Order delivered to customer and verified with OTP.' },
      COMPLETED: { title: 'Order Completed', desc: 'Service completed successfully. Thank you!' },
      CANCELLED: { title: 'Order Cancelled', desc: notes || 'Order has been cancelled.' },
    };

    const statusInfo = statusDescriptions[newStatus] || { title: newStatus, desc: notes || '' };

    order.statusHistory.push({
      status: newStatus,
      title: statusInfo.title,
      description: notes || statusInfo.desc,
      timestamp: now,
      updatedBy: updatedBy || 'Operations Admin',
    });

    order.updatedAt = now;
    this.persist();
    return order;
  }

  updateOrderWeight(orderId: string, actualWeightKg: number): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.actualWeightKg = actualWeightKg;
    order.isWeighed = true;

    // Recalculate Per-KG items
    let recalculatedSubtotal = 0;
    order.items.forEach((item) => {
      if (item.pricingModel === 'PER_KG') {
        item.actualWeightKg = actualWeightKg;
        item.quantity = actualWeightKg;
        item.subtotal = item.unitPrice * actualWeightKg;
      }
      recalculatedSubtotal += item.subtotal;
    });

    order.itemTotal = recalculatedSubtotal;
    const finalAmount = Math.max(0, order.itemTotal - order.discountAmount + order.pickupDeliveryFee + order.expressFee);
    order.taxAmount = +(finalAmount * 0.05).toFixed(2);
    order.totalAmount = +(finalAmount + order.taxAmount).toFixed(2);

    this.updateOrderStatus(
      orderId,
      'WEIGHED_VERIFIED',
      `Facility verified exact load weight: ${actualWeightKg} KG. Updated total: ₹${order.totalAmount}`
    );

    this.persist();
    return order;
  }

  // --- Services & Categories ---
  getCategories(): ServiceCategory[] {
    return this.categories;
  }

  getServices(categoryId?: string): Service[] {
    if (!categoryId || categoryId === 'all') return this.services;
    return this.services.filter((s) => s.categoryId === categoryId);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }

  addService(service: Omit<Service, 'id'>): Service {
    const id = `srv-${this.services.length + 1}`;
    const newSrv = { ...service, id };
    this.services.push(newSrv);
    this.persist();
    return newSrv;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...updates };
    this.persist();
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Coupons ---
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, orderTotal: number, isFirstOrder = false): { isValid: boolean; discount: number; message: string } {
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { isValid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (orderTotal < coupon.minOrderValue) {
      return { isValid: false, discount: 0, message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` };
    }

    if (coupon.firstOrderOnly && !isFirstOrder) {
      return { isValid: false, discount: 0, message: 'This coupon is valid on first orders only.' };
    }

    let discount = 0;
    if (coupon.discountType === 'FLAT') {
      discount = coupon.discountValue;
    } else {
      discount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
        discount = coupon.maxDiscountCap;
      }
    }

    return { isValid: true, discount: Math.round(discount), message: `Coupon applied: ${coupon.title}` };
  }

  addCoupon(coupon: Coupon): Coupon {
    const existingIndex = this.coupons.findIndex((c) => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());
    if (existingIndex > -1) {
      this.coupons[existingIndex] = { ...this.coupons[existingIndex], ...coupon };
    } else {
      this.coupons.unshift(coupon);
    }
    this.persist();
    return coupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const index = this.coupons.findIndex((c) => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;
    this.coupons[index] = { ...this.coupons[index], ...updates };
    this.persist();
    return this.coupons[index];
  }

  deleteCoupon(id: string): boolean {
    const index = this.coupons.findIndex((c) => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (index === -1) return false;
    this.coupons.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Pincodes ---
  getPincodes(): PincodeZone[] {
    return this.pincodes;
  }

  checkPincode(pincode: string): PincodeZone | undefined {
    return this.pincodes.find((p) => p.pincode === pincode.trim());
  }

  // --- Wallet ---
  getWallet(): Wallet {
    return this.wallet;
  }

  rechargeWallet(amount: number): Wallet {
    const newBal = this.wallet.balance + amount;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.wallet.transactions.unshift({
      id: `tx-${Date.now()}`,
      customerId: this.wallet.customerId,
      type: 'CREDIT',
      amount,
      description: 'Wallet Recharge (UPI/Card)',
      date: now,
      balanceAfter: newBal,
    });
    this.wallet.balance = newBal;
    this.persist();
    return this.wallet;
  }

  deductWallet(amount: number, orderId: string): boolean {
    if (this.wallet.balance < amount) return false;
    const newBal = this.wallet.balance - amount;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.wallet.transactions.unshift({
      id: `tx-${Date.now()}`,
      customerId: this.wallet.customerId,
      type: 'DEBIT',
      amount,
      description: `Payment for Order #${orderId}`,
      date: now,
      orderId,
      balanceAfter: newBal,
    });
    this.wallet.balance = newBal;
    this.persist();
    return true;
  }

  // --- Staff & Batches ---
  getStaff(): StaffMember[] {
    return this.staff;
  }

  getBatches(): LaundryBatch[] {
    return this.batches;
  }

  // --- Dynamic Cloth Types ---
  getClothTypes(categoryTag?: string): ClothType[] {
    if (!categoryTag || categoryTag === 'ALL') return this.clothTypes;
    return this.clothTypes.filter((c) => c.categoryTag === categoryTag);
  }

  getClothTypeById(id: string): ClothType | undefined {
    return this.clothTypes.find((c) => c.id === id);
  }

  createClothType(data: Partial<ClothType>): ClothType {
    const id = `cloth-${Date.now()}`;
    const newCloth: ClothType = {
      id,
      name: data.name || 'New Garment',
      icon: data.icon || '👕',
      categoryTag: data.categoryTag || 'MENS',
      categoryLabel: data.categoryLabel || "Men's Clothing",
      description: data.description || '',
      isActive: data.isActive !== undefined ? data.isActive : true,
      sortOrder: this.clothTypes.length + 1,
    };
    this.clothTypes.push(newCloth);
    this.persist();
    return newCloth;
  }

  updateClothType(id: string, data: Partial<ClothType>): ClothType | null {
    const item = this.clothTypes.find((c) => c.id === id);
    if (!item) return null;
    Object.assign(item, data);
    this.persist();
    return item;
  }

  deleteClothType(id: string): boolean {
    const idx = this.clothTypes.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.clothTypes.splice(idx, 1);
    this.priceMatrix = this.priceMatrix.filter((p) => p.clothTypeId !== id);
    this.persist();
    return true;
  }

  // --- Dynamic Service Masters ---
  getServiceMasters(): ServiceMaster[] {
    return this.serviceMasters;
  }

  createServiceMaster(data: Partial<ServiceMaster>): ServiceMaster {
    const id = `srv-m-${Date.now()}`;
    const service: ServiceMaster = {
      id,
      name: data.name || 'New Service',
      slug: (data.name || 'service').toLowerCase().replace(/\s+/g, '-'),
      icon: data.icon || '✨',
      pricingType: data.pricingType || 'PER_ITEM',
      baseKgPrice: data.baseKgPrice,
      minOrderKg: data.minOrderKg,
      turnaroundHours: data.turnaroundHours || 24,
      description: data.description || '',
      isActive: true,
    };
    this.serviceMasters.push(service);
    this.persist();
    return service;
  }

  updateServiceMaster(id: string, data: Partial<ServiceMaster>): ServiceMaster | null {
    const item = this.serviceMasters.find((s) => s.id === id);
    if (!item) return null;
    Object.assign(item, data);
    this.persist();
    return item;
  }

  // --- 2D Price Matrix ---
  getPriceMatrix(clothId?: string, serviceId?: string): ServicePriceItem[] {
    let result = this.priceMatrix;
    if (clothId) result = result.filter((p) => p.clothTypeId === clothId);
    if (serviceId) result = result.filter((p) => p.serviceId === serviceId);
    return result;
  }

  updatePriceItem(id: string, data: Partial<ServicePriceItem>): ServicePriceItem | null {
    const item = this.priceMatrix.find((p) => p.id === id);
    if (!item) return null;
    Object.assign(item, data);
    this.persist();
    return item;
  }

  upsertPriceItem(data: ServicePriceItem): ServicePriceItem {
    const idx = this.priceMatrix.findIndex((p) => p.id === data.id || (p.clothTypeId === data.clothTypeId && p.serviceId === data.serviceId));
    if (idx >= 0) {
      this.priceMatrix[idx] = { ...this.priceMatrix[idx], ...data };
      this.persist();
      return this.priceMatrix[idx];
    } else {
      this.priceMatrix.push(data);
      this.persist();
      return data;
    }
  }

  // --- Reset to Complete Master 54-Garment Catalog ---
  public resetToMasterCatalog(): { clothTypes: ClothType[]; serviceMasters: ServiceMaster[]; priceMatrix: ServicePriceItem[] } {
    this.clothTypes = [...INITIAL_CLOTH_TYPES];
    this.serviceMasters = [...INITIAL_SERVICE_MASTERS];
    this.priceMatrix = [...INITIAL_SERVICE_PRICE_MATRIX];
    this.persist();
    if (typeof window !== 'undefined') {
      this.safeSetItem('laundry_catalog_version', 'v3.2_54_clean_catalog');
    }
    return {
      clothTypes: this.clothTypes,
      serviceMasters: this.serviceMasters,
      priceMatrix: this.priceMatrix,
    };
  }

  // --- Pricing Settings & Financial Rules ---
  getPricingSettings(): PricingSettings {
    return this.pricingSettings;
  }

  updatePricingSettings(settings: Partial<PricingSettings>): PricingSettings {
    Object.assign(this.pricingSettings, settings);
    this.persist();
    return this.pricingSettings;
  }

  // --- Disputes & Damage Reports ---
  getDisputes(): DisputeReport[] {
    return this.disputes;
  }

  createDispute(data: Omit<DisputeReport, 'id' | 'reportedAt' | 'status'>): DisputeReport {
    const dispute: DisputeReport = {
      ...data,
      id: `DSP-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'OPEN',
    };
    this.disputes.unshift(dispute);
    this.persist();
    return dispute;
  }

  updateDisputeStatus(
    id: string,
    status: DisputeStatus,
    resolutionNotes?: string,
    compensationAmount?: number
  ): DisputeReport | null {
    const item = this.disputes.find((d) => d.id === id);
    if (!item) return null;
    item.status = status;
    if (resolutionNotes) item.resolutionNotes = resolutionNotes;
    if (compensationAmount !== undefined) item.compensationAmount = compensationAmount;
    if (['RESOLVED_REFUND', 'RESOLVED_CREDIT', 'REJECTED'].includes(status)) {
      item.closedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    }
    this.persist();
    return item;
  }

  // --- Laundry Facility Machines ---
  getMachines(): LaundryMachine[] {
    return this.machines;
  }

  updateMachineStatus(id: string, status: LaundryMachine['status'], currentLoadKg?: number): LaundryMachine | null {
    const m = this.machines.find((x) => x.id === id);
    if (!m) return null;
    m.status = status;
    if (currentLoadKg !== undefined) m.currentLoadKg = currentLoadKg;
    this.persist();
    return m;
  }

  // --- COD Reconciliation ---
  getCODRecords(): CODReconciliationRecord[] {
    return this.codRecords;
  }

  reconcileRiderCOD(riderId: string, depositedAmount: number, notes?: string): CODReconciliationRecord | null {
    const rec = this.codRecords.find((r) => r.riderId === riderId && r.status !== 'SETTLED');
    if (!rec) return null;
    rec.depositedAmount = depositedAmount;
    rec.difference = rec.totalCollected - depositedAmount;
    rec.status = rec.difference === 0 ? 'SETTLED' : 'DISCREPANCY';
    if (notes) rec.notes = notes;
    this.persist();
    return rec;
  }

  // --- Operational Weight & Item Tag Mutations ---
  submitWeightVerification(
    orderId: string,
    grossWeightKg: number,
    tareWeightKg: number,
    ratePerKg: number = 60,
    weighedBy: string = 'Facility Station 1'
  ): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    const netWeightKg = Math.max(0, +(grossWeightKg - tareWeightKg).toFixed(2));
    const estimatedWeight = order.estimatedWeightKg || 4.0;
    const estimatedAmount = estimatedWeight * ratePerKg;
    const actualAmount = netWeightKg * ratePerKg;
    const differenceAmount = +(actualAmount - estimatedAmount).toFixed(2);

    const verification: WeightVerification = {
      orderId,
      grossWeightKg,
      tareWeightKg,
      netWeightKg,
      estimatedWeightKg: estimatedWeight,
      ratePerKg,
      estimatedAmount,
      actualAmount,
      differenceAmount,
      weighedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      weighedBy,
      status: differenceAmount === 0 ? 'AUTO_APPROVED' : 'PENDING_APPROVAL',
    };

    order.weightVerification = verification;
    order.actualWeightKg = netWeightKg;
    order.isWeighed = true;

    // Add status history entry
    order.statusHistory.push({
      status: 'WEIGHED_VERIFIED',
      title: 'Weight Verified',
      description: `Net weight: ${netWeightKg} KG (Gross: ${grossWeightKg}kg, Tare: ${tareWeightKg}kg). Difference: ${differenceAmount >= 0 ? '+' : ''}₹${differenceAmount}.`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedBy: weighedBy,
    });

    this.persist();
    return order;
  }

  approvePriceAdjustment(orderId: string): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order || !order.weightVerification) return null;

    order.weightVerification.status = 'APPROVED_BY_CUSTOMER';
    order.weightVerification.customerApprovedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    order.totalAmount = +(order.totalAmount + order.weightVerification.differenceAmount).toFixed(2);

    order.statusHistory.push({
      status: order.currentStatus,
      title: 'Price Adjustment Approved',
      description: `Customer approved additional charge of ₹${order.weightVerification.differenceAmount}. New total: ₹${order.totalAmount}.`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });

    this.persist();
    return order;
  }

  updateGarmentTagStatus(orderId: string, tagId: string, status: GarmentTagStatus, qcNotes?: string): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order || !order.garmentTags) return null;

    const tag = order.garmentTags.find((t) => t.id === tagId);
    if (!tag) return null;

    tag.currentStatus = status;
    if (qcNotes) tag.qcNotes = qcNotes;

    this.persist();
    return order;
  }

  addInternalNote(orderId: string, author: string, role: string, content: string): InternalNote | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    if (!order.internalNotes) order.internalNotes = [];

    const note: InternalNote = {
      id: `note-${Date.now()}`,
      author,
      role,
      content,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    order.internalNotes.push(note);
    this.persist();
    return note;
  }

  // --- Hub & Branch Operations ---
  getHubs(): HubBranch[] {
    return this.hubs;
  }

  getHubById(id: string): HubBranch | undefined {
    return this.hubs.find((h) => h.id === id);
  }

  createHub(data: Omit<HubBranch, 'id' | 'activeOrdersCount'>): HubBranch {
    const hub: HubBranch = {
      ...data,
      id: `HUB-${Date.now().toString(36).toUpperCase()}`,
      activeOrdersCount: 0,
    };
    this.hubs.push(hub);
    this.logAuditEvent('admin-1', 'Super Admin', 'SUPER_ADMIN', 'HUB_CREATED', 'HUBS_MANAGEMENT', `Created branch hub ${hub.name} (${hub.city})`);
    this.persist();
    return hub;
  }

  updateHub(id: string, data: Partial<HubBranch>): HubBranch | null {
    const idx = this.hubs.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    this.hubs[idx] = { ...this.hubs[idx], ...data };
    this.logAuditEvent('admin-1', 'Super Admin', 'SUPER_ADMIN', 'HUB_UPDATED', 'HUBS_MANAGEMENT', `Updated branch hub ${id}`);
    this.persist();
    return this.hubs[idx];
  }

  findHubForPincode(pincode: string): HubBranch {
    const matched = this.hubs.find((h) => h.pincodes.includes(pincode) && h.isActive);
    return matched || this.hubs[0]; // Fallback to primary hub
  }

  // --- Distance-Based In-House Fleet Delivery Engine ---
  getDistanceConfig(): DistanceDeliveryConfig {
    return this.distanceConfig;
  }

  updateDistanceConfig(data: Partial<DistanceDeliveryConfig>): DistanceDeliveryConfig {
    this.distanceConfig = { ...this.distanceConfig, ...data };
    this.logAuditEvent('admin-1', 'Super Admin', 'SUPER_ADMIN', 'DISTANCE_CONFIG_UPDATED', 'DISTANCE_ENGINE', 'Updated distance delivery tiers and base rates');
    this.persist();
    return this.distanceConfig;
  }

  calculateDistanceDeliveryFee(distanceKm: number, orderSubtotal: number, isExpress = false): { fee: number; tierLabel: string; isFree: boolean } {
    const cfg = this.distanceConfig;

    // Check free delivery threshold
    if (orderSubtotal >= cfg.freeDeliveryOrderValue && distanceKm <= 7) {
      return { fee: 0, tierLabel: `Free Delivery (Order > ₹${cfg.freeDeliveryOrderValue})`, isFree: true };
    }

    // Find matching tier
    const matchedTier = cfg.distanceTiers.find((t) => distanceKm >= t.minKm && distanceKm < t.maxKm);
    let fee = 0;
    let tierLabel = '';

    if (matchedTier) {
      fee = matchedTier.fee;
      tierLabel = `${matchedTier.minKm}-${matchedTier.maxKm} KM (₹${matchedTier.fee})`;
    } else if (distanceKm >= 20) {
      const extraKm = distanceKm - 20;
      fee = 150 + extraKm * cfg.perKmRateAfterBase;
      tierLabel = `Outstation >20 KM (₹${fee})`;
    } else {
      fee = cfg.baseFee;
      tierLabel = `Base 0-${cfg.baseDistanceKm} KM (₹${fee})`;
    }

    if (isExpress) {
      fee = Math.round(fee * cfg.expressDeliveryMultiplier);
      tierLabel += ' [Express +50%]';
    }

    return { fee, tierLabel, isFree: fee === 0 };
  }

  // --- Slot Capacity Engine ---
  getSlotCapacities(hubId?: string, date?: string): TimeSlotCapacity[] {
    return this.slotCapacities.filter((s) => {
      const matchesHub = !hubId || s.hubId === hubId;
      const matchesDate = !date || s.date === date;
      return matchesHub && matchesDate;
    });
  }

  bookSlotCapacity(slotId: string, orderKg = 4.5): TimeSlotCapacity | null {
    const slot = this.slotCapacities.find((s) => s.id === slotId);
    if (!slot) return null;

    slot.bookedOrders += 1;
    slot.bookedKg = +(slot.bookedKg + orderKg).toFixed(1);

    if (slot.bookedOrders >= slot.maxOrders || slot.bookedKg >= slot.maxKg) {
      slot.isAvailable = false;
    }

    this.persist();
    return slot;
  }

  updateSlotCapacity(slotId: string, data: Partial<TimeSlotCapacity>): TimeSlotCapacity | null {
    const idx = this.slotCapacities.findIndex((s) => s.id === slotId);
    if (idx === -1) return null;
    this.slotCapacities[idx] = { ...this.slotCapacities[idx], ...data };
    this.persist();
    return this.slotCapacities[idx];
  }

  // --- QC & Rework Loop ---
  getQCRecords(orderId?: string): QCChecklistRecord[] {
    if (!orderId) return this.qcRecords;
    return this.qcRecords.filter((q) => q.orderId === orderId);
  }

  submitQCChecklist(record: Omit<QCChecklistRecord, 'id' | 'inspectedAt'>): QCChecklistRecord {
    const newRecord: QCChecklistRecord = {
      ...record,
      id: `QC-${Date.now()}`,
      inspectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.qcRecords.unshift(newRecord);

    const order = this.orders.find((o) => o.id === record.orderId);
    if (order) {
      if (!order.qcRecords) order.qcRecords = [];
      order.qcRecords.push(newRecord);

      if (record.status === 'QC_PASSED') {
        this.updateGarmentTagStatus(record.orderId, record.garmentTagId, 'QC_PASSED', 'Passed 8-point inspection checklist');
      } else {
        this.triggerRework(record.orderId, record.garmentTagId, record.reworkReason || 'Stain or fold defect detected in QC', record.inspectedBy);
      }
    }

    this.persist();
    return newRecord;
  }

  triggerRework(orderId: string, garmentTagId: string, reason: string, operator = 'QC Lead'): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.reworkCount = (order.reworkCount || 0) + 1;
    this.updateGarmentTagStatus(orderId, garmentTagId, 'WASHING', `Rework Cycle #${order.reworkCount}: ${reason}`);

    order.statusHistory.push({
      status: 'WASHING',
      title: 'Free Quality Rework Dispatched',
      description: `Garment ${garmentTagId} routed for complementary re-washing & pressing: ${reason}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedBy: operator,
    });

    this.logAuditEvent('qc-inspector-1', operator, 'LAUNDRY_STAFF', 'REWORK_TRIGGERED', 'QUALITY_CONTROL', `Triggered free re-wash for ${garmentTagId} on order ${orderId}: ${reason}`);
    this.persist();
    return order;
  }

  // --- Consumables & Inventory Management ---
  getInventory(): ConsumableInventory[] {
    return this.inventory;
  }

  updateInventoryStock(id: string, newStock: number, reason?: string): ConsumableInventory | null {
    const item = this.inventory.find((i) => i.id === id);
    if (!item) return null;

    item.currentStock = newStock;
    if (item.currentStock <= 0) {
      item.status = 'OUT_OF_STOCK';
    } else if (item.currentStock <= (item.minThreshold || 10)) {
      item.status = 'LOW_STOCK';
    } else {
      item.status = 'IN_STOCK';
    }

    this.logAuditEvent('inv-admin', 'Facility Manager', 'MANAGER', 'INVENTORY_UPDATED', 'INVENTORY', `Updated stock of ${item.itemName} to ${newStock} ${item.unit}. Reason: ${reason || 'Manual Audit'}`);
    this.persist();
    return item;
  }

  // --- Notification Templates CMS ---
  getNotificationTemplates(): NotificationTemplate[] {
    return this.notificationTemplates;
  }

  updateNotificationTemplate(id: string, data: Partial<NotificationTemplate>): NotificationTemplate | null {
    const idx = this.notificationTemplates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.notificationTemplates[idx] = { ...this.notificationTemplates[idx], ...data };
    this.persist();
    return this.notificationTemplates[idx];
  }

  // --- System Audit Logs ---
  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  logAuditEvent(userId: string, userName: string, userRole: any, action: string, module: string, details: string): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      userId,
      userName,
      userRole,
      action,
      module,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    this.persist();
    return entry;
  }

  // --- Loyalty Points Engine ---
  getLoyaltyAccount(customerId = 'usr-default'): LoyaltyPointsAccount {
    return this.loyaltyAccount;
  }

  redeemLoyaltyPoints(customerId: string, points: number): { success: boolean; discountAmount: number; remainingPoints: number } {
    if (this.loyaltyAccount.totalPoints < points) {
      return { success: false, discountAmount: 0, remainingPoints: this.loyaltyAccount.totalPoints };
    }

    const discountAmount = +(points * this.loyaltyAccount.conversionRateInr).toFixed(2);
    this.loyaltyAccount.totalPoints -= points;
    this.loyaltyAccount.pointsRedeemedLifetime += points;

    this.persist();
    return { success: true, discountAmount, remainingPoints: this.loyaltyAccount.totalPoints };
  }

  // --- Dedicated Bulk / KG Pricing Engine ---
  getBulkPricing(): BulkPricingItem[] {
    return this.bulkPricing;
  }

  addBulkPrice(item: BulkPricingItem): BulkPricingItem {
    this.bulkPricing.push(item);
    this.persist();
    return item;
  }

  updateBulkPrice(id: string, updates: Partial<BulkPricingItem>): BulkPricingItem | null {
    const idx = this.bulkPricing.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.bulkPricing[idx] = { ...this.bulkPricing[idx], ...updates };
    this.persist();
    return this.bulkPricing[idx];
  }

  deleteBulkPrice(id: string): boolean {
    const beforeLen = this.bulkPricing.length;
    this.bulkPricing = this.bulkPricing.filter((b) => b.id !== id);
    const deleted = this.bulkPricing.length < beforeLen;
    if (deleted) this.persist();
    return deleted;
  }

  updateBulkSlab(serviceId: string, laundryType: BulkLaundryType, slabs: { weightKg: number; regularPrice: number; expressPrice: number }[]): BulkPricingItem[] {
    const service = this.serviceMasters.find((s) => s.id === serviceId);
    const serviceName = service ? service.name : serviceId;

    slabs.forEach((slab) => {
      const existingIdx = this.bulkPricing.findIndex(
        (b) => b.serviceId === serviceId && b.laundryType === laundryType && b.weightKg === slab.weightKg
      );

      if (existingIdx !== -1) {
        this.bulkPricing[existingIdx].regularPrice = slab.regularPrice;
        this.bulkPricing[existingIdx].expressPrice = slab.expressPrice;
      } else {
        this.bulkPricing.push({
          id: `bp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          laundryType,
          serviceId,
          serviceName,
          weightKg: slab.weightKg,
          regularPrice: slab.regularPrice,
          expressPrice: slab.expressPrice,
          regularTatHours: 48,
          expressTatHours: 12,
          isActive: true,
        });
      }
    });

    this.persist();
    return this.bulkPricing.filter((b) => b.serviceId === serviceId && b.laundryType === laundryType);
  }

  // Pincode CRUD Methods
  addPincode(pin: PincodeZone): PincodeZone {
    const existingIdx = this.pincodes.findIndex((p) => p.pincode.trim() === pin.pincode.trim());
    if (existingIdx !== -1) {
      this.pincodes[existingIdx] = { ...this.pincodes[existingIdx], ...pin };
    } else {
      this.pincodes.unshift(pin);
    }
    this.persist();
    return pin;
  }

  updatePincode(pincode: string, updates: Partial<PincodeZone>): PincodeZone | null {
    const idx = this.pincodes.findIndex((p) => p.pincode.trim() === pincode.trim());
    if (idx === -1) return null;
    this.pincodes[idx] = { ...this.pincodes[idx], ...updates };
    this.persist();
    return this.pincodes[idx];
  }

  deletePincode(pincode: string): boolean {
    const beforeLen = this.pincodes.length;
    this.pincodes = this.pincodes.filter((p) => p.pincode.trim() !== pincode.trim());
    const deleted = this.pincodes.length < beforeLen;
    if (deleted) this.persist();
    return deleted;
  }

  getFullCatalog() {
    return {
      categories: this.categories,
      clothTypes: this.clothTypes,
      serviceMasters: this.serviceMasters,
      priceMatrix: this.priceMatrix,
      bulkPricing: this.bulkPricing,
      pincodes: this.pincodes,
      settings: this.pricingSettings,
      perKgServices: this.serviceMasters.filter((s) => s.pricingType === 'PER_KG' && s.isActive),
    };
  }
}

// Singleton database instance
export const db = new LaundryDatabase();

