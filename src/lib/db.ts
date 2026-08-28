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
  // --- MEN'S WEAR (20 items) ---
  { id: 'ct-m-1', name: 'Shirt', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 1 },
  { id: 'ct-m-2', name: 'T-Shirt', icon: '👕', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 2 },
  { id: 'ct-m-3', name: 'Polo T-Shirt', icon: '👕', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 3 },
  { id: 'ct-m-4', name: 'Jeans', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 4 },
  { id: 'ct-m-5', name: 'Trouser', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 5 },
  { id: 'ct-m-6', name: 'Formal Trouser', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 6 },
  { id: 'ct-m-7', name: 'Shorts', icon: '🩳', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 7 },
  { id: 'ct-m-8', name: 'Track Pants', icon: '👖', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 8 },
  { id: 'ct-m-9', name: 'Kurta', icon: '👘', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 9 },
  { id: 'ct-m-10', name: 'Kurta Pajama', icon: '👘', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 10 },
  { id: 'ct-m-11', name: 'Waistcoat', icon: '🦺', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 11 },
  { id: 'ct-m-12', name: 'Blazer', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 12 },
  { id: 'ct-m-13', name: 'Suit 2-Piece', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 13 },
  { id: 'ct-m-14', name: 'Suit 3-Piece', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 14 },
  { id: 'ct-m-15', name: 'Nehru Jacket', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 15 },
  { id: 'ct-m-16', name: 'Sweater', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 16 },
  { id: 'ct-m-17', name: 'Hoodie', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 17 },
  { id: 'ct-m-18', name: 'Jacket', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 18 },
  { id: 'ct-m-19', name: 'Coat', icon: '🧥', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 19 },
  { id: 'ct-m-20', name: 'Tie', icon: '👔', categoryTag: 'MENS', categoryLabel: "Men's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 20 },

  // --- WOMEN'S WEAR (25 items) ---
  { id: 'ct-w-1', name: 'Saree', icon: '🥻', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 21 },
  { id: 'ct-w-2', name: 'Saree + Blouse', icon: '🥻', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 22 },
  { id: 'ct-w-3', name: 'Blouse', icon: '👚', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 23 },
  { id: 'ct-w-4', name: 'Salwar', icon: '👖', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 24 },
  { id: 'ct-w-5', name: 'Kameez', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 25 },
  { id: 'ct-w-6', name: 'Salwar Suit', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 26 },
  { id: 'ct-w-7', name: 'Churidar', icon: '👖', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 27 },
  { id: 'ct-w-8', name: 'Kurti', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 28 },
  { id: 'ct-w-9', name: 'Leggings', icon: '👖', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 29 },
  { id: 'ct-w-10', name: 'Palazzo', icon: '👖', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 30 },
  { id: 'ct-w-11', name: 'Dupatta', icon: '🧣', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 31 },
  { id: 'ct-w-12', name: 'Lehenga', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 32 },
  { id: 'ct-w-13', name: 'Lehenga Choli', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 33 },
  { id: 'ct-w-14', name: 'Anarkali', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 34 },
  { id: 'ct-w-15', name: 'Gown', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 35 },
  { id: 'ct-w-16', name: 'Dress', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 36 },
  { id: 'ct-w-17', name: 'Party Wear Dress', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 37 },
  { id: 'ct-w-18', name: 'Skirt', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 38 },
  { id: 'ct-w-19', name: 'Top', icon: '👚', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 39 },
  { id: 'ct-w-20', name: 'Formal Wear', icon: '👗', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 40 },
  { id: 'ct-w-21', name: 'Shawl', icon: '🧣', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 41 },
  { id: 'ct-w-22', name: 'Scarf', icon: '🧣', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 42 },
  { id: 'ct-w-23', name: 'Jacket', icon: '🧥', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 43 },
  { id: 'ct-w-24', name: 'Cardigan', icon: '🧥', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 44 },
  { id: 'ct-w-25', name: 'Sweater', icon: '🧥', categoryTag: 'WOMENS', categoryLabel: "Women's Wear", defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 45 },

  // --- PREMIUM / BRIDAL WEAR (10 items) ---
  { id: 'ct-pb-1', name: 'Bridal Lehenga', icon: '💍', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 46 },
  { id: 'ct-pb-2', name: 'Heavy Lehenga', icon: '💍', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 47 },
  { id: 'ct-pb-3', name: 'Embroidered Saree', icon: '🥻', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 48 },
  { id: 'ct-pb-4', name: 'Designer Saree', icon: '🥻', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 49 },
  { id: 'ct-pb-5', name: 'Silk Saree', icon: '🥻', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 50 },
  { id: 'ct-pb-6', name: 'Wedding Gown', icon: '👗', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 51 },
  { id: 'ct-pb-7', name: 'Heavy Blouse', icon: '👚', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 52 },
  { id: 'ct-pb-8', name: 'Sherwani', icon: '👘', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 53 },
  { id: 'ct-pb-9', name: 'Designer Suit', icon: '👔', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_SET', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 54 },
  { id: 'ct-pb-10', name: 'Wedding Dress', icon: '👗', categoryTag: 'PREMIUM_BRIDAL', categoryLabel: 'Premium / Bridal', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 55 },

  // --- KIDS WEAR (16 items) ---
  { id: 'ct-k-1', name: 'Kids Shirt', icon: '👔', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 56 },
  { id: 'ct-k-2', name: 'Kids T-Shirt', icon: '👕', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 57 },
  { id: 'ct-k-3', name: 'Kids Jeans', icon: '👖', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 58 },
  { id: 'ct-k-4', name: 'Kids Trouser', icon: '👖', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 59 },
  { id: 'ct-k-5', name: 'Kids Shorts', icon: '🩳', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 60 },
  { id: 'ct-k-6', name: 'Kids Frock', icon: '👗', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 61 },
  { id: 'ct-k-7', name: 'Kids Dress', icon: '👗', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 62 },
  { id: 'ct-k-8', name: 'Kids Skirt', icon: '👗', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 63 },
  { id: 'ct-k-9', name: 'Kids Kurta', icon: '👘', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 64 },
  { id: 'ct-k-10', name: 'Kids Pajama', icon: '👖', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 65 },
  { id: 'ct-k-11', name: 'Kids School Uniform', icon: '👔', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_SET', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 66 },
  { id: 'ct-k-12', name: 'Kids Jacket', icon: '🧥', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 67 },
  { id: 'ct-k-13', name: 'Kids Sweater', icon: '🧥', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 68 },
  { id: 'ct-k-14', name: 'Baby Clothes', icon: '👶', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 69 },
  { id: 'ct-k-15', name: 'Baby Romper', icon: '👶', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-express'], isActive: true, sortOrder: 70 },
  { id: 'ct-k-16', name: 'Baby Blanket', icon: '🛏️', categoryTag: 'KIDS', categoryLabel: 'Kids Wear', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 71 },

  // --- HOME TEXTILES (20 items) ---
  { id: 'ct-h-1', name: 'Single Bedsheet', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 72 },
  { id: 'ct-h-2', name: 'Double Bedsheet', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 73 },
  { id: 'ct-h-3', name: 'King Bedsheet', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 74 },
  { id: 'ct-h-4', name: 'Pillow Cover', icon: '🛌', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 75 },
  { id: 'ct-h-5', name: 'Cushion Cover', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 76 },
  { id: 'ct-h-6', name: 'Blanket', icon: '🛌', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 77 },
  { id: 'ct-h-7', name: 'Heavy Blanket', icon: '🛌', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 78 },
  { id: 'ct-h-8', name: 'Comforter', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 79 },
  { id: 'ct-h-9', name: 'Quilt', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 80 },
  { id: 'ct-h-10', name: 'Dohar', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 81 },
  { id: 'ct-h-11', name: 'Mattress Cover', icon: '🛏️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 82 },
  { id: 'ct-h-12', name: 'Sofa Cover', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_SET', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 83 },
  { id: 'ct-h-13', name: 'Curtain', icon: '🪟', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PANEL', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 84 },
  { id: 'ct-h-14', name: 'Carpet', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_SQ_FT', availableServices: ['srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 85 },
  { id: 'ct-h-15', name: 'Rug', icon: '🛋️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_SQ_FT', availableServices: ['srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 86 },
  { id: 'ct-h-16', name: 'Table Cloth', icon: '🍽️', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-press', 'srv-m-dry-clean', 'srv-m-express'], isActive: true, sortOrder: 87 },
  { id: 'ct-h-17', name: 'Kitchen Towel', icon: '🧻', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-express'], isActive: true, sortOrder: 88 },
  { id: 'ct-h-18', name: 'Bath Towel', icon: '🛁', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-express'], isActive: true, sortOrder: 89 },
  { id: 'ct-h-19', name: 'Hand Towel', icon: '🧼', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-express'], isActive: true, sortOrder: 90 },
  { id: 'ct-h-20', name: 'Bath Mat', icon: '🛁', categoryTag: 'HOME_TEXTILES', categoryLabel: 'Home Textiles', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-express'], isActive: true, sortOrder: 91 },

  // --- SPECIAL CLEANING & BULK ---
  { id: 'ct-sp-1', name: 'Mattress Deep Clean', icon: '🛏️', categoryTag: 'SPECIAL_CLEANING', categoryLabel: 'Special Cleaning', defaultUnit: 'PER_PIECE', availableServices: ['srv-m-dry-clean', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 92 },
  { id: 'ct-bk-1', name: 'Mixed Clothes (Per KG)', icon: '🧺', categoryTag: 'BULK_KG', categoryLabel: 'Bulk / KG Laundry', defaultUnit: 'PER_KG', availableServices: ['srv-m-wash-fold', 'srv-m-wash-iron', 'srv-m-express', 'srv-m-premium'], isActive: true, sortOrder: 93 },
];

export const INITIAL_SERVICE_MASTERS: ServiceMaster[] = [
  { id: 'srv-m-wash-fold', name: 'Wash & Fold', slug: 'wash-fold', icon: '🧺', pricingType: 'PER_KG', baseKgPrice: 80, minOrderKg: 3, turnaroundHours: 48, description: 'Sorting, eco-wash, tumble dry, and neat folding packaging.', isActive: true },
  { id: 'srv-m-wash-iron', name: 'Wash & Steam Iron', slug: 'wash-iron', icon: '👔', pricingType: 'PER_ITEM', baseKgPrice: 120, turnaroundHours: 36, description: 'Hygienic wash, drying, and crisp steam press on hangers.', isActive: true },
  { id: 'srv-m-press', name: 'Steam Press', slug: 'steam-press', icon: '💨', pricingType: 'PER_ITEM', turnaroundHours: 24, description: 'Industrial steam press wrinkle removal & collar shaping.', isActive: true },
  { id: 'srv-m-dry-clean', name: 'Dry Cleaning', slug: 'dry-cleaning', icon: '🧥', pricingType: 'PER_ITEM', turnaroundHours: 72, description: 'Solvent dry cleaning, stain removal & garment cover protection.', isActive: true },
  { id: 'srv-m-express', name: 'Express Laundry', slug: 'express-laundry', icon: '⚡', pricingType: 'PER_ITEM', turnaroundHours: 12, description: 'Priority same-day processing for quick delivery.', isActive: true },
  { id: 'srv-m-premium', name: 'Premium Care', slug: 'premium-care', icon: '✨', pricingType: 'PER_ITEM', turnaroundHours: 72, description: 'Delicate hand wash, color lock conditioner, and luxury finish.', isActive: true },
];

export const INITIAL_SERVICE_PRICE_MATRIX: ServicePriceItem[] = INITIAL_CLOTH_TYPES.flatMap((cloth) => {
  const basePriceMap: Record<string, number> = {
    'srv-m-wash-fold': 40,
    'srv-m-wash-iron': 60,
    'srv-m-press': 30,
    'srv-m-dry-clean': 120,
    'srv-m-express': 80,
    'srv-m-premium': 150,
  };

  const isBridal = cloth.categoryTag === 'PREMIUM_BRIDAL';
  const multiplier = isBridal ? 3.5 : cloth.categoryTag === 'HOME_TEXTILES' ? 1.8 : 1.0;

  return INITIAL_SERVICE_MASTERS.map((service) => {
    const isAvailable = cloth.availableServices ? cloth.availableServices.includes(service.id) : true;
    const baseP = Math.round((basePriceMap[service.id] || 50) * multiplier);

    return {
      id: `pr-${cloth.id}-${service.id}`,
      clothTypeId: cloth.id,
      clothName: cloth.name,
      clothIcon: cloth.icon,
      categoryTag: cloth.categoryTag,
      serviceId: service.id,
      serviceName: service.name,
      price: isAvailable ? baseP : 0,
      expressPrice: isAvailable ? Math.round(baseP * 1.5) : 0,
      pricingUnit: cloth.defaultUnit || 'PER_PIECE',
      minQuantity: 1,
      turnaroundHours: service.turnaroundHours,
      expressTurnaroundHours: 12,
      isActive: true,
      isAvailable,
      specialNotes: isAvailable ? `${service.name} for ${cloth.name}` : 'Not available for this garment',
    };
  });
});

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

        const savedPincodes = localStorage.getItem('laundry_pincodes');
        if (savedPincodes) this.pincodes = JSON.parse(savedPincodes);

        const savedOrders = localStorage.getItem('laundry_orders');
        if (savedOrders) this.orders = JSON.parse(savedOrders);

        const savedServices = localStorage.getItem('laundry_services');
        if (savedServices) this.services = JSON.parse(savedServices);

        const savedCoupons = localStorage.getItem('laundry_coupons');
        if (savedCoupons) this.coupons = JSON.parse(savedCoupons);

        const savedWallet = localStorage.getItem('laundry_wallet');
        if (savedWallet) this.wallet = JSON.parse(savedWallet);

        const savedClothTypes = localStorage.getItem('laundry_cloth_types');
        if (savedClothTypes) this.clothTypes = JSON.parse(savedClothTypes);

        const savedMasters = localStorage.getItem('laundry_service_masters');
        if (savedMasters) this.serviceMasters = JSON.parse(savedMasters);

        const savedMatrix = localStorage.getItem('laundry_price_matrix');
        if (savedMatrix) this.priceMatrix = JSON.parse(savedMatrix);

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

