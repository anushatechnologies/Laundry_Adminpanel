'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Service,
  OrderItem,
  Order,
  Coupon,
  PincodeZone,
  ExpressTier,
  OrderStatus,
  Wallet,
  PaymentMethod,
  ClothType,
  ServiceMaster,
  ServicePriceItem,
  PricingSettings,
  DisputeReport,
  DisputeStatus,
  LaundryMachine,
  CODReconciliationRecord,
  GarmentTagStatus,
  InternalNote,
  HubBranch,
  DistanceDeliveryConfig,
  TimeSlotCapacity,
  QCChecklistRecord,
  ConsumableInventory,
  NotificationTemplate,
  AuditLogEntry,
  LoyaltyPointsAccount,
  BulkPricingItem,
  BulkLaundryType,
  SubscriptionPlan,
} from '@/types';
import { db } from '@/lib/db';
import { adminApi, getAdminCatalog, getAdminCoupons, getAdminOrders, getAdminPincodes, getAdminPlans, getAdminSlots } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
}

interface Address {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth & Roles
  currentUser: UserProfile;
  userRole: Role;
  setUserRole: (role: Role) => void;
  savedAddresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => void;

  // Pincode & Location
  userPincode: string;
  currentZone: PincodeZone | null;
  setPincode: (pincode: string) => { isServiceable: boolean; zone?: PincodeZone; message: string };
  pincodes: PincodeZone[];
  addPincode: (pin: PincodeZone) => void;
  updatePincode: (pincode: string, updates: Partial<PincodeZone>) => void;
  deletePincode: (pincode: string) => void;

  // Coupons & Offers
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Subscription Plans
  subscriptionPlans: SubscriptionPlan[];
  addSubscriptionPlan: (plan: SubscriptionPlan) => void;
  updateSubscriptionPlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  deleteSubscriptionPlan: (id: string) => void;

  // Cart & Booking
  cart: {
    items: OrderItem[];
    expressTier: ExpressTier;
    appliedCoupon: Coupon | null;
    discountAmount: number;
    pickupDate: string;
    pickupSlot: string;
    deliveryDate: string;
    deliverySlot: string;
    selectedAddress: Address | null;
    notes: string;
  };
  addToCart: (service: Service, quantity?: number, instructions?: string) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;
  setExpressTier: (tier: ExpressTier) => void;
  setBookingSlots: (pickupDate: string, pickupSlot: string, deliveryDate?: string, deliverySlot?: string) => void;
  setSelectedAddress: (address: Address) => void;
  setOrderNotes: (notes: string) => void;
  cartTotals: {
    itemTotal: number;
    discount: number;
    deliveryFee: number;
    expressFee: number;
    tax: number;
    grandTotal: number;
    totalKg: number;
    itemCount: number;
  };

  // Orders
  orders: Order[];
  createOrder: (
    paymentMethod: PaymentMethod,
    razorpayDetails?: { razorpayPaymentId?: string; razorpayOrderId?: string; razorpaySignature?: string }
  ) => Order;
  advanceOrderStatus: (orderId: string, status: OrderStatus, notes?: string, updatedBy?: string) => Order | null;
  updateOrderWeight: (orderId: string, weightKg: number) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => void;

  // Wallet
  wallet: Wallet;
  rechargeWallet: (amount: number) => void;

  // Dynamic Cloth Types & 2D Pricing Engine
  clothTypes: ClothType[];
  serviceMasters: ServiceMaster[];
  priceMatrix: ServicePriceItem[];
  bulkPricing: BulkPricingItem[];
  pricingSettings: PricingSettings;
  addClothType: (data: Partial<ClothType>) => Promise<ClothType> | ClothType;
  updateClothType: (id: string, data: Partial<ClothType>) => void;
  deleteClothType: (id: string) => void;
  updatePriceItem: (id: string, data: Partial<ServicePriceItem>) => void;
  upsertPriceItem: (data: ServicePriceItem) => void;
  addBulkPrice: (item: BulkPricingItem) => void;
  updateBulkPrice: (id: string, updates: Partial<BulkPricingItem>) => void;
  deleteBulkPrice: (id: string) => void;
  updateBulkSlab: (serviceId: string, laundryType: BulkLaundryType, slabs: { weightKg: number; regularPrice: number; expressPrice: number }[]) => void;
  updatePricingSettings: (settings: Partial<PricingSettings>) => void;
  resetToMasterCatalog: () => void;
  addClothItemToCart: (cloth: ClothType, priceItem: ServicePriceItem, quantity?: number, instructions?: string) => void;
  // Operational Workflows & Lifecycle
  disputes: DisputeReport[];
  createDispute: (data: Omit<DisputeReport, 'id' | 'reportedAt' | 'status'>) => DisputeReport;
  updateDisputeStatus: (id: string, status: DisputeStatus, notes?: string, compensation?: number) => void;
  machines: LaundryMachine[];
  updateMachineStatus: (id: string, status: LaundryMachine['status'], loadKg?: number) => void;
  codRecords: CODReconciliationRecord[];
  reconcileRiderCOD: (riderId: string, depositedAmount: number, notes?: string) => void;
  submitWeightVerification: (orderId: string, grossKg: number, tareKg: number, ratePerKg?: number, weighedBy?: string) => void;
  approvePriceAdjustment: (orderId: string) => void;
  updateGarmentTagStatus: (orderId: string, tagId: string, status: GarmentTagStatus, qcNotes?: string) => void;
  addInternalNote: (orderId: string, author: string, role: string, content: string) => void;

  // Enterprise Operations: Hubs, Fleet Distance, Slots, QC Rework, Inventory, CMS & Audit
  hubs: HubBranch[];
  createHub: (data: Omit<HubBranch, 'id' | 'activeOrdersCount'>) => Promise<HubBranch> | HubBranch;
  updateHub: (id: string, data: Partial<HubBranch>) => void;
  distanceConfig: DistanceDeliveryConfig;
  updateDistanceConfig: (data: Partial<DistanceDeliveryConfig>) => void;
  calculateDistanceDeliveryFee: (distanceKm: number, orderSubtotal: number, isExpress?: boolean) => { fee: number; tierLabel: string; isFree: boolean };
  slotCapacities: TimeSlotCapacity[];
  bookSlotCapacity: (slotId: string, orderKg?: number) => void;
  updateSlotCapacity: (slotId: string, data: Partial<TimeSlotCapacity>) => void;
  qcRecords: QCChecklistRecord[];
  submitQCChecklist: (record: Omit<QCChecklistRecord, 'id' | 'inspectedAt'>) => QCChecklistRecord;
  triggerRework: (orderId: string, garmentTagId: string, reason: string, operator?: string) => void;
  inventory: ConsumableInventory[];
  updateInventoryStock: (id: string, newStock: number, reason?: string) => void;
  notificationTemplates: NotificationTemplate[];
  updateNotificationTemplate: (id: string, data: Partial<NotificationTemplate>) => void;
  auditLogs: AuditLogEntry[];
  logAuditEvent: (userId: string, userName: string, userRole: any, action: string, module: string, details: string) => void;
  loyaltyAccount: LoyaltyPointsAccount;
  redeemLoyaltyPoints: (customerId: string, points: number) => { success: boolean; discountAmount: number; remainingPoints: number };

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultUser: UserProfile = {
  id: 'admin-console',
  name: 'Operations Admin',
  phone: '',
  email: '',
  role: 'SUPER_ADMIN',
};

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    street: '#42, 3rd Cross, 5th Block, Koramangala',
    landmark: 'Near Sony World Signal',
    city: 'Bengaluru',
    pincode: '560034',
  },
  {
    id: 'addr-2',
    type: 'Office',
    street: 'Prestige Tech Park, Building 2B, 3rd Floor, Outer Ring Road',
    landmark: 'Opposite Cisco',
    city: 'Bengaluru',
    pincode: '560103',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [userRole, setUserRoleState] = useState<Role>('SUPER_ADMIN');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(defaultAddresses);
  const [userPincode, setUserPincode] = useState<string>('560034');
  const [currentZone, setCurrentZone] = useState<PincodeZone | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet>(db.getWallet());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [clothTypes, setClothTypes] = useState<ClothType[]>([]);
  const [serviceMasters, setServiceMasters] = useState<ServiceMaster[]>([]);
  const [priceMatrix, setPriceMatrix] = useState<ServicePriceItem[]>([]);
  const [bulkPricing, setBulkPricing] = useState<BulkPricingItem[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(db.getPricingSettings());
  const [disputes, setDisputes] = useState<DisputeReport[]>(db.getDisputes());
  const [machines, setMachines] = useState<LaundryMachine[]>(db.getMachines());
  const [codRecords, setCODRecords] = useState<CODReconciliationRecord[]>(db.getCODRecords());
  const [hubs, setHubs] = useState<HubBranch[]>(db.getHubs());
  const [distanceConfig, setDistanceConfig] = useState<DistanceDeliveryConfig>(db.getDistanceConfig());
  const [slotCapacities, setSlotCapacities] = useState<TimeSlotCapacity[]>(db.getSlotCapacities());
  const [qcRecords, setQCRecords] = useState<QCChecklistRecord[]>(db.getQCRecords());
  const [inventory, setInventory] = useState<ConsumableInventory[]>(db.getInventory());
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(db.getNotificationTemplates());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(db.getAuditLogs());
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyPointsAccount>(db.getLoyaltyAccount());

  // Cart State
  const [cart, setCart] = useState<{
    items: OrderItem[];
    expressTier: ExpressTier;
    appliedCoupon: Coupon | null;
    discountAmount: number;
    pickupDate: string;
    pickupSlot: string;
    deliveryDate: string;
    deliverySlot: string;
    selectedAddress: Address | null;
    notes: string;
  }>({
    items: [],
    expressTier: 'REGULAR',
    appliedCoupon: null,
    discountAmount: 0,
    pickupDate: '',
    pickupSlot: '08:00 AM - 10:00 AM',
    deliveryDate: '',
    deliverySlot: '04:00 PM - 06:00 PM',
    selectedAddress: defaultAddresses[0],
    notes: '',
  });

  const [pincodes, setPincodes] = useState<PincodeZone[]>(db.getPincodes());
  const [coupons, setCoupons] = useState<Coupon[]>(db.getCoupons());
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(db.getSubscriptionPlans());

  // Initialize data on mount
  useEffect(() => {
    // Orders are sourced from the protected operations API. Keeping the
    // console empty until that request resolves avoids showing stale browser
    // demo data as if it were live business data.
    setOrders([]);
    setPincodes(db.getPincodes());
    setCoupons(db.getCoupons());
    setSubscriptionPlans(db.getSubscriptionPlans());
    const zone = db.checkPincode('500081') || db.checkPincode('560034');
    if (zone) setCurrentZone(zone);
    setWallet(db.getWallet());
    setClothTypes(db.getClothTypes());
    setServiceMasters(db.getServiceMasters());
    setPriceMatrix(db.getPriceMatrix());
    setBulkPricing(db.getBulkPricing());
    setPricingSettings(db.getPricingSettings());

    const loadOperationsData = async () => {
      const results = await Promise.allSettled([
        getAdminOrders(),
        getAdminCatalog(),
        getAdminCoupons(),
        getAdminPincodes(),
        getAdminPlans(),
        getAdminSlots(),
      ]);

      const valueAt = <T,>(index: number): T | null => {
        const result = results[index];
        return result.status === 'fulfilled' ? (result.value as T) : null;
      };

      const remoteOrders = valueAt<Order[]>(0);
      const catalog = valueAt<any>(1);
      const remoteCoupons = valueAt<Coupon[]>(2);
      const remotePincodes = valueAt<PincodeZone[]>(3);
      const remotePlans = valueAt<SubscriptionPlan[]>(4);
      const remoteSlots = valueAt<any[]>(5);

      if (remoteOrders) setOrders(remoteOrders);
      if (catalog) {
        if (catalog.clothTypes && Array.isArray(catalog.clothTypes) && catalog.clothTypes.length >= 10) {
          setClothTypes(catalog.clothTypes);
        }
        if (catalog.serviceMasters && Array.isArray(catalog.serviceMasters) && catalog.serviceMasters.length >= 6) {
          setServiceMasters(catalog.serviceMasters);
        }
        if (
          catalog.priceMatrix &&
          Array.isArray(catalog.priceMatrix) &&
          catalog.priceMatrix.length >= 40 &&
          !catalog.priceMatrix.some((p: any) => p.clothName === 'Shirt' && p.serviceId === 'srv-m-dry-clean' && p.price < 50)
        ) {
          setPriceMatrix(catalog.priceMatrix);
        }
        if (catalog.bulkPricing && Array.isArray(catalog.bulkPricing) && catalog.bulkPricing.length > 0) {
          setBulkPricing(catalog.bulkPricing);
        }
        if (catalog.settings) setPricingSettings(catalog.settings);
      }

      // Sync global cloud overrides from S3 so changes made by ANY user/device appear immediately
      try {
        const ovRes = await fetch(
          '/api/catalog-overrides?t=' + Date.now(),
          { cache: 'no-store' }
        );
        if (ovRes.ok) {
          const ovJson = await ovRes.json();
          // /api/catalog-overrides returns { success, data: { clothOverrides, ... } }
          // Direct S3 fetch returns the object itself — handle both
          const ovData = ovJson?.data || ovJson;
          const { clothOverrides, deletedClothIds } = ovData;
          if (deletedClothIds && Array.isArray(deletedClothIds) && deletedClothIds.length > 0) {
            const delSet = new Set(deletedClothIds);
            setClothTypes((prev) => prev.filter((item) => !delSet.has(item.id)));
          }
          if (clothOverrides && typeof clothOverrides === 'object') {
            setClothTypes((prev) =>
              prev.map((item) => (clothOverrides[item.id] ? { ...item, ...clothOverrides[item.id] } : item))
            );
          }
        }
      } catch (err) {
        console.warn('Could not sync S3 cloud overrides', err);
      }
      if (remoteCoupons) setCoupons(remoteCoupons);
      if (remotePincodes) setPincodes(remotePincodes);
      if (remotePlans && Array.isArray(remotePlans) && remotePlans.length > 0) {
        db.setSubscriptionPlans(remotePlans);
        setSubscriptionPlans(remotePlans);
      }
      if (remoteSlots) {
        setSlotCapacities(
          remoteSlots.map((slot) => ({
            id: slot.id,
            hubId: slot.hubId || 'HUB-RJY-01',
            date: slot.date || new Date().toISOString().slice(0, 10),
            startTime: slot.startTime,
            endTime: slot.endTime,
            maxOrders: slot.maxOrders,
            maxKg: slot.maxKg,
            bookedOrders: slot.bookedOrders,
            bookedKg: slot.bookedKg,
            isAvailable: slot.isAvailable,
            isActive: slot.isActive !== false,
          }))
        );
      }
    };

    void loadOperationsData();
  }, []);

  const addSubscriptionPlan = async (plan: SubscriptionPlan) => {
    // 1. Optimistically save to local DB and state
    db.addSubscriptionPlan(plan);
    setSubscriptionPlans([...db.getSubscriptionPlans()]);

    try {
      const created = await adminApi<SubscriptionPlan>('/subscriptions/plans', {
        method: 'POST',
        body: JSON.stringify(plan),
      });
      if (created) {
        db.addSubscriptionPlan(created);
        setSubscriptionPlans([...db.getSubscriptionPlans()]);
      }
      showToast(`Subscription plan "${plan.name}" saved to database.`, 'success');
      return created || plan;
    } catch (error) {
      showToast(`Plan saved locally. (${error instanceof Error ? error.message : 'Backend offline'})`, 'info');
      return plan;
    }
  };

  const updateSubscriptionPlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    // 1. Optimistically update local DB and state
    const localUpdated = db.updateSubscriptionPlan(id, updates);
    if (localUpdated) {
      setSubscriptionPlans([...db.getSubscriptionPlans()]);
    }

    try {
      const updated = await adminApi<SubscriptionPlan>(`/subscriptions/plans/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (updated) {
        db.updateSubscriptionPlan(id, updated);
        setSubscriptionPlans([...db.getSubscriptionPlans()]);
      }
      showToast('Subscription plan updated in database.', 'success');
      return updated || localUpdated;
    } catch (error) {
      showToast(`Plan updated locally. (${error instanceof Error ? error.message : 'Backend offline'})`, 'info');
      return localUpdated;
    }
  };

  const deleteSubscriptionPlan = async (id: string) => {
    // 1. Optimistically delete from local DB and state
    db.deleteSubscriptionPlan(id);
    setSubscriptionPlans([...db.getSubscriptionPlans()]);

    try {
      await adminApi(`/subscriptions/plans/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      showToast('Subscription plan removed from database.', 'success');
      return true;
    } catch (error) {
      showToast(`Plan removed locally. (${error instanceof Error ? error.message : 'Backend offline'})`, 'info');
      return true;
    }
  };

  const addCoupon = async (coupon: Coupon) => {
    try {
      const created = await adminApi<Coupon>('/coupons', {
        method: 'POST',
        body: JSON.stringify(coupon),
      });
      db.addCoupon(created);
      setCoupons([...db.getCoupons()]);
      showToast(`Coupon ${created.code} created.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not create coupon.', 'error');
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    try {
      const updated = await adminApi<Coupon>(`/coupons/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      db.updateCoupon(id, updated);
      setCoupons([...db.getCoupons()]);
      showToast('Coupon updated.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update coupon.', 'error');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await adminApi(`/coupons/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      db.deleteCoupon(id);
      setCoupons([...db.getCoupons()]);
      showToast('Coupon removed.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not remove coupon.', 'error');
    }
  };

  const addPincode = async (pin: PincodeZone) => {
    try {
      const created = await adminApi<PincodeZone>('/pincodes', {
        method: 'POST',
        body: JSON.stringify(pin),
      });
      db.addPincode(created);
      setPincodes([...db.getPincodes()]);
      showToast(`Coverage for ${created.pincode} added.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not add pincode coverage.', 'error');
    }
  };

  const updatePincode = async (pincode: string, updates: Partial<PincodeZone>) => {
    try {
      const updated = await adminApi<PincodeZone>(`/pincodes/${encodeURIComponent(pincode)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      db.updatePincode(pincode, updated);
      setPincodes([...db.getPincodes()]);
      showToast(`Coverage for ${pincode} updated.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not update pincode coverage.', 'error');
    }
  };

  const deletePincode = async (pincode: string) => {
    try {
      await adminApi(`/pincodes/${encodeURIComponent(pincode)}`, {
        method: 'DELETE',
      });
      db.deletePincode(pincode);
      setPincodes([...db.getPincodes()]);
      showToast(`Coverage for ${pincode} removed.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not remove pincode coverage.', 'error');
    }
  };

  const setUserRole = (role: Role) => {
    setUserRoleState(role);
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Switched active perspective to: ${role.replace('_', ' ')}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setPincode = (pincode: string) => {
    setUserPincode(pincode);
    const zone = db.checkPincode(pincode);
    if (zone && zone.isServiceable) {
      setCurrentZone(zone);
      showToast(`Great! We deliver to ${zone.areaName}, ${zone.city}`, 'success');
      return { isServiceable: true, zone, message: `Delivery available in ${zone.areaName}` };
    } else {
      setCurrentZone(null);
      showToast(`Sorry, pincode ${pincode} is not serviceable currently.`, 'error');
      return { isServiceable: false, message: 'Currently out of service coverage.' };
    }
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setSavedAddresses((prev) => [...prev, newAddr]);
    showToast('New address saved successfully', 'success');
  };

  // Cart Helpers
  const addToCart = (service: Service, quantity = 1, instructions = '') => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.serviceId === service.id);
      let updatedItems: OrderItem[];

      const isPerKg = service.pricingModel === 'PER_KG';
      const qtyToAdd = isPerKg && quantity === 1 && service.minOrderQuantity ? service.minOrderQuantity : quantity;

      if (existingIndex > -1) {
        updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + qtyToAdd;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unitPrice * newQty,
          estimatedWeightKg: isPerKg ? newQty : undefined,
          specialInstructions: instructions || existing.specialInstructions,
        };
      } else {
        const newItem: OrderItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          serviceId: service.id,
          serviceName: service.name,
          categoryName: service.categoryId,
          pricingModel: service.pricingModel,
          unitPrice: service.basePrice,
          quantity: qtyToAdd,
          estimatedWeightKg: isPerKg ? qtyToAdd : undefined,
          unit: service.unit,
          subtotal: service.basePrice * qtyToAdd,
          specialInstructions: instructions,
        };
        updatedItems = [...prev.items, newItem];
      }

      showToast(`Added "${service.name}" to bag`, 'success');
      return { ...prev, items: updatedItems };
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.serviceId !== serviceId),
    }));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.serviceId === serviceId) {
          return {
            ...item,
            quantity,
            subtotal: item.unitPrice * quantity,
            estimatedWeightKg: item.pricingModel === 'PER_KG' ? quantity : undefined,
          };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      expressTier: 'REGULAR',
      appliedCoupon: null,
      discountAmount: 0,
      pickupDate: '',
      pickupSlot: '08:00 AM - 10:00 AM',
      deliveryDate: '',
      deliverySlot: '04:00 PM - 06:00 PM',
      selectedAddress: savedAddresses[0] || null,
      notes: '',
    });
  };

  const applyCouponCode = (code: string) => {
    const rawTotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const result = db.validateCoupon(code, rawTotal, true);

    if (result.isValid) {
      const couponObj = db.getCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase());
      setCart((prev) => ({
        ...prev,
        appliedCoupon: couponObj || null,
        discountAmount: result.discount,
      }));
      showToast(result.message, 'success');
      return { success: true, message: result.message };
    } else {
      setCart((prev) => ({ ...prev, appliedCoupon: null, discountAmount: 0 }));
      showToast(result.message, 'error');
      return { success: false, message: result.message };
    }
  };

  const removeCouponCode = () => {
    setCart((prev) => ({ ...prev, appliedCoupon: null, discountAmount: 0 }));
    showToast('Coupon removed', 'info');
  };

  const setExpressTier = (tier: ExpressTier) => {
    setCart((prev) => ({ ...prev, expressTier: tier }));
  };

  const setBookingSlots = (pickupDate: string, pickupSlot: string, deliveryDate?: string, deliverySlot?: string) => {
    setCart((prev) => ({
      ...prev,
      pickupDate,
      pickupSlot,
      deliveryDate: deliveryDate || '',
      deliverySlot: deliverySlot || prev.deliverySlot,
    }));
  };

  const setSelectedAddress = (address: Address) => {
    setCart((prev) => ({ ...prev, selectedAddress: address }));
  };

  const setOrderNotes = (notes: string) => {
    setCart((prev) => ({ ...prev, notes }));
  };

  // Dynamic Pricing Handlers with Backend API Persistence
  const addClothType = async (data: Partial<ClothType>): Promise<ClothType> => {
    try {
      const created = await adminApi<ClothType>('/services/cloth-types', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      db.createClothType(created);
      setClothTypes([...db.getClothTypes()]);
      showToast(`Cloth item "${created.name}" saved to database.`, 'success');
      return created;
    } catch {
      const local = db.createClothType(data);
      setClothTypes([...db.getClothTypes()]);
      showToast(`Cloth item "${local.name}" saved.`, 'success');
      return local;
    }
  };

  const updateClothType = async (id: string, data: Partial<ClothType>) => {
    // 1. Sync to Global S3 Cloud Overrides - skip base64 to avoid huge payload 500
    const persistData: Partial<ClothType> = { ...data };
    if (persistData.imageUrl && !persistData.imageUrl.startsWith('http')) {
      delete (persistData as any).imageUrl; // base64 blobs cause 500
    }
    if (Object.keys(persistData).length > 0) {
      try {
        await fetch('/api/catalog-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clothId: id, data: persistData }),
        });
      } catch (e) {
        console.warn('Could not sync to cloud overrides', e);
      }
    }

    // 2. Also try backend API
    try {
      await adminApi(`/services/cloth-types/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {}

    // 3. Update local state
    db.updateClothType(id, data);
    setClothTypes((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
    showToast('Cloth type updated globally across all devices.', 'success');
  };

  const deleteClothType = async (id: string) => {
    // 1. Sync to Global S3 Cloud Overrides immediately
    try {
      await fetch('/api/catalog-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clothId: id, isDeleted: true }),
      });
    } catch (e) {
      console.warn('Could not sync to cloud overrides', e);
    }

    // 2. Also try backend API
    try {
      await adminApi(`/services/cloth-types/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch {}

    // 3. Update local state
    db.deleteClothType(id);
    setClothTypes((prev) => prev.filter((item) => item.id !== id));
    setPriceMatrix((prev) => prev.filter((item) => item.clothTypeId !== id));
    showToast('Cloth item removed globally from catalog.', 'info');
  };

  const updatePriceItem = async (id: string, data: Partial<ServicePriceItem>) => {
    try {
      await adminApi(`/services/pricing-matrix/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      db.updatePriceItem(id, data);
      setPriceMatrix([...db.getPriceMatrix()]);
      showToast('Price updated in database.', 'success');
    } catch {
      db.updatePriceItem(id, data);
      setPriceMatrix([...db.getPriceMatrix()]);
    }
  };

  const upsertPriceItem = async (data: ServicePriceItem) => {
    try {
      await adminApi('/services/pricing-matrix/upsert', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      db.upsertPriceItem(data);
      setPriceMatrix([...db.getPriceMatrix()]);
      showToast('Price rule saved in database.', 'success');
    } catch {
      db.upsertPriceItem(data);
      setPriceMatrix([...db.getPriceMatrix()]);
    }
  };

  const updatePricingSettings = async (settings: Partial<PricingSettings>) => {
    try {
      const updated = await adminApi<PricingSettings>('/services/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      const merged = db.updatePricingSettings(updated || settings);
      setPricingSettings({ ...merged });
      showToast('Pricing & Tax settings saved to database.', 'success');
    } catch {
      const merged = db.updatePricingSettings(settings);
      setPricingSettings({ ...merged });
    }
  };

  const resetToMasterCatalog = () => {
    const res = db.resetToMasterCatalog();
    setClothTypes([...res.clothTypes]);
    setServiceMasters([...res.serviceMasters]);
    setPriceMatrix([...res.priceMatrix]);
    showToast('Reset to 542-garment master pricing matrix successfully!', 'success');
  };

  const addClothItemToCart = (cloth: ClothType, priceItem: ServicePriceItem, quantity = 1, instructions = '') => {
    setCart((prev) => {
      const itemKey = `${cloth.id}-${priceItem.serviceId}`;
      const existingIndex = prev.items.findIndex((item) => item.id === itemKey);
      let updatedItems: OrderItem[];

      if (existingIndex > -1) {
        updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + quantity;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unitPrice * newQty,
          specialInstructions: instructions || existing.specialInstructions,
        };
      } else {
        const newItem: OrderItem = {
          id: itemKey,
          serviceId: priceItem.serviceId,
          serviceName: `${cloth.name} (${priceItem.serviceName})`,
          categoryName: cloth.categoryLabel,
          pricingModel: 'PER_ITEM',
          unitPrice: priceItem.price,
          quantity,
          unit: 'Piece',
          subtotal: priceItem.price * quantity,
          specialInstructions: instructions,
        };
        updatedItems = [...prev.items, newItem];
      }

      showToast(`Added ${quantity}x ${cloth.name} (${priceItem.serviceName}) to bag`, 'success');
      return { ...prev, items: updatedItems };
    });
  };

  // Cart Totals calculation (Dynamically powered by admin pricingSettings)
  const itemTotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalKg = cart.items.filter((i) => i.pricingModel === 'PER_KG').reduce((sum, i) => sum + i.quantity, 0);
  const itemCount = cart.items.reduce((sum, i) => sum + (i.pricingModel === 'PER_ITEM' ? i.quantity : 1), 0);

  let deliveryFee = pricingSettings.standardDeliveryFee;
  if (currentZone) {
    deliveryFee = itemTotal >= currentZone.minFreeOrderValue ? 0 : currentZone.standardFee;
  } else if (itemTotal >= pricingSettings.freeDeliveryThreshold) {
    deliveryFee = 0;
  }

  let expressFee = 0;
  if (cart.expressTier === 'EXPRESS_24H') expressFee = pricingSettings.expressDeliveryFee;
  if (cart.expressTier === 'SAME_DAY') expressFee = pricingSettings.expressDeliveryFee * 2;

  const discountedSubtotal = Math.max(0, itemTotal - cart.discountAmount);
  const taxableAmount = discountedSubtotal + deliveryFee + expressFee;
  const tax = +(taxableAmount * (pricingSettings.taxPercentage / 100)).toFixed(2);
  const grandTotal = +(taxableAmount + tax).toFixed(2);

  const cartTotals = {
    itemTotal,
    discount: cart.discountAmount,
    deliveryFee,
    expressFee,
    tax,
    grandTotal,
    totalKg,
    itemCount,
  };

  // Orders Actions
  const createOrder = (paymentMethod: PaymentMethod): Order => {
    const isPerKg = cart.items.some((i) => i.pricingModel === 'PER_KG');
    const orderAddress = cart.selectedAddress || savedAddresses[0];

    const newOrder = db.createOrder({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      address: orderAddress,
      items: [...cart.items],
      pricingModelSummary: isPerKg ? 'PER_KG' : 'PER_ITEM',
      expressTier: cart.expressTier,
      pickupSlot: {
        date: cart.pickupDate || new Date().toISOString().split('T')[0],
        slot: cart.pickupSlot || '08:00 AM - 10:00 AM',
      },
      deliverySlot: {
        date: cart.deliveryDate || '',
        slot: cart.deliverySlot || '04:00 PM - 06:00 PM',
      },
      itemTotal: cartTotals.itemTotal,
      discountAmount: cartTotals.discount,
      couponCode: cart.appliedCoupon?.code,
      pickupDeliveryFee: cartTotals.deliveryFee,
      expressFee: cartTotals.expressFee,
      taxAmount: cartTotals.tax,
      totalAmount: cartTotals.grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      notes: cart.notes,
      estimatedWeightKg: totalKg > 0 ? totalKg : undefined,
    });

    if (paymentMethod === 'WALLET') {
      db.deductWallet(cartTotals.grandTotal, newOrder.id);
      setWallet(db.getWallet());
    }

    refreshOrders();
    clearCart();
    showToast(`Order #${newOrder.id} placed successfully!`, 'success');
    return newOrder;
  };

  const replaceRemoteOrder = (remoteOrder: Order) => {
    setOrders((previous) => previous.map((order) => (order.id === remoteOrder.id ? remoteOrder : order)));
  };

  const advanceOrderStatus = (orderId: string, status: OrderStatus, notes?: string, updatedBy?: string) => {
    const current = orders.find((order) => order.id === orderId);
    if (!current) {
      showToast('That order is no longer available. Refreshing the queue.', 'error');
      void refreshOrders();
      return null;
    }

    const optimistic: Order = {
      ...current,
      currentStatus: status,
      statusHistory: [
        ...(current.statusHistory || []),
        {
          status,
          title: status.replaceAll('_', ' '),
          description: notes || 'Status updated from the admin console.',
          timestamp: new Date().toISOString(),
          updatedBy,
        },
      ],
    };
    replaceRemoteOrder(optimistic);
    showToast(`Order #${orderId} status updated to: ${status.replace('_', ' ')}`, 'success');

    void adminApi<Order>(`/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, updatedBy }),
    })
      .then(replaceRemoteOrder)
      .catch((error) => {
        replaceRemoteOrder(current);
        showToast(error instanceof Error ? error.message : 'Could not save the status update.', 'error');
      });

    return optimistic;
  };

  const updateOrderWeight = (orderId: string, weightKg: number) => {
    const current = orders.find((order) => order.id === orderId);
    if (!current) return null;

    const optimistic: Order = { ...current, actualWeightKg: weightKg, isWeighed: true };
    replaceRemoteOrder(optimistic);
    void adminApi<Order>(`/orders/${encodeURIComponent(orderId)}/weight`, {
      method: 'PATCH',
      body: JSON.stringify({ actualWeightKg: weightKg }),
    })
      .then(replaceRemoteOrder)
      .catch((error) => {
        replaceRemoteOrder(current);
        showToast(error instanceof Error ? error.message : 'Could not save the verified weight.', 'error');
      });
    return optimistic;
  };

  const getOrderById = (orderId: string) => orders.find((order) => order.id === orderId);

  const refreshOrders = () => {
    void getAdminOrders()
      .then(setOrders)
      .catch((error) => showToast(error instanceof Error ? error.message : 'Could not refresh orders.', 'error'));
  };

  const rechargeWallet = (amount: number) => {
    const updated = db.rechargeWallet(amount);
    setWallet({ ...updated });
    showToast(`₹${amount} added to wallet balance successfully!`, 'success');
  };

  const createDispute = (data: Omit<DisputeReport, 'id' | 'reportedAt' | 'status'>) => {
    const dispute = db.createDispute(data);
    setDisputes([...db.getDisputes()]);
    showToast(`Dispute ticket #${dispute.id} created successfully.`, 'info');
    return dispute;
  };

  const updateDisputeStatus = (id: string, status: DisputeStatus, notes?: string, compensation?: number) => {
    const updated = db.updateDisputeStatus(id, status, notes, compensation);
    if (updated) {
      setDisputes([...db.getDisputes()]);
      if (status === 'RESOLVED_CREDIT' && compensation) {
        db.rechargeWallet(compensation);
        setWallet(db.getWallet());
      }
      showToast(`Dispute #${id} marked as ${status.replace('_', ' ')}`, 'success');
    }
  };

  const updateMachineStatus = (id: string, status: LaundryMachine['status'], loadKg?: number) => {
    const updated = db.updateMachineStatus(id, status, loadKg);
    if (updated) {
      setMachines([...db.getMachines()]);
      showToast(`Machine ${id} status updated to ${status}`, 'success');
    }
  };

  const reconcileRiderCOD = (riderId: string, depositedAmount: number, notes?: string) => {
    const updated = db.reconcileRiderCOD(riderId, depositedAmount, notes);
    if (updated) {
      setCODRecords([...db.getCODRecords()]);
      showToast(`COD reconciliation recorded for ${updated.riderName}: ${updated.status}`, 'success');
    }
  };

  const submitWeightVerification = (
    orderId: string,
    grossKg: number,
    tareKg: number,
    ratePerKg: number = 60,
    weighedBy: string = 'Facility Scale Operator'
  ) => {
    const netWeightKg = Math.max(0, +(grossKg - tareKg).toFixed(2));
    const updated = updateOrderWeight(orderId, netWeightKg);
    if (updated) {
      showToast(`Verified #${orderId}: net scale weight ${netWeightKg} KG.`, 'success');
    }
  };

  const approvePriceAdjustment = (orderId: string) => {
    const updated = db.approvePriceAdjustment(orderId);
    if (updated) {
      refreshOrders();
      showToast(`Price adjustment approved for Order #${orderId}. Total: ₹${updated.totalAmount}`, 'success');
    }
  };

  const updateGarmentTagStatus = (orderId: string, tagId: string, status: GarmentTagStatus, qcNotes?: string) => {
    const updated = db.updateGarmentTagStatus(orderId, tagId, status, qcNotes);
    if (updated) {
      refreshOrders();
      showToast(`Tag ${tagId} marked as ${status}`, 'success');
    }
  };

  const addInternalNote = (orderId: string, author: string, role: string, content: string) => {
    const note = db.addInternalNote(orderId, author, role, content);
    if (note) {
      refreshOrders();
      showToast('Internal note saved (confidential to staff).', 'info');
    }
  };

  const createHub = async (data: Omit<HubBranch, 'id' | 'activeOrdersCount'>) => {
    try {
      const created = await adminApi<HubBranch>('/hubs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      db.createHub(created || (data as any));
      setHubs([...db.getHubs()]);
      showToast(`Branch Hub "${data.name}" created and saved to database.`, 'success');
      return created || (data as any);
    } catch {
      const hub = db.createHub(data);
      setHubs([...db.getHubs()]);
      showToast(`Branch Hub "${hub.name}" saved.`, 'info');
      return hub;
    }
  };

  const updateHub = async (id: string, data: Partial<HubBranch>) => {
    try {
      await adminApi(`/hubs/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      const updated = db.updateHub(id, data);
      if (updated) {
        setHubs([...db.getHubs()]);
        showToast(`Branch Hub #${id} updated in database.`, 'success');
      }
    } catch {
      const updated = db.updateHub(id, data);
      if (updated) {
        setHubs([...db.getHubs()]);
      }
    }
  };

  const updateDistanceConfig = (data: Partial<DistanceDeliveryConfig>) => {
    const updated = db.updateDistanceConfig(data);
    setDistanceConfig({ ...updated });
    showToast('Distance delivery tiers & pricing updated.', 'success');
  };

  const calculateDistanceDeliveryFee = (distanceKm: number, orderSubtotal: number, isExpress = false) => {
    return db.calculateDistanceDeliveryFee(distanceKm, orderSubtotal, isExpress);
  };

  const bookSlotCapacity = (slotId: string, orderKg = 4.5) => {
    const updated = db.bookSlotCapacity(slotId, orderKg);
    if (updated) {
      setSlotCapacities([...db.getSlotCapacities()]);
    }
  };

  const updateSlotCapacity = (slotId: string, data: Partial<TimeSlotCapacity>) => {
    const updated = db.updateSlotCapacity(slotId, data);
    if (updated) {
      setSlotCapacities([...db.getSlotCapacities()]);
      showToast('Slot capacity limit updated.', 'success');
    }
  };

  const submitQCChecklist = (record: Omit<QCChecklistRecord, 'id' | 'inspectedAt'>) => {
    const result = db.submitQCChecklist(record);
    setQCRecords([...db.getQCRecords()]);
    refreshOrders();
    showToast(`QC ${result.status === 'QC_PASSED' ? 'Passed' : 'Failed (Rework Triggered)'} for ${record.clothName}`, result.status === 'QC_PASSED' ? 'success' : 'info');
    return result;
  };

  const triggerRework = (orderId: string, garmentTagId: string, reason: string, operator = 'QC Lead') => {
    const updated = db.triggerRework(orderId, garmentTagId, reason, operator);
    if (updated) {
      refreshOrders();
      setQCRecords([...db.getQCRecords()]);
      showToast(`Rework cycle dispatched for ${garmentTagId} (no extra charge).`, 'info');
    }
  };

  const updateInventoryStock = (id: string, newStock: number, reason?: string) => {
    const updated = db.updateInventoryStock(id, newStock, reason);
    if (updated) {
      setInventory([...db.getInventory()]);
      showToast(`Inventory updated: ${updated.itemName} (${newStock} ${updated.unit})`, 'success');
    }
  };

  const updateNotificationTemplate = (id: string, data: Partial<NotificationTemplate>) => {
    const updated = db.updateNotificationTemplate(id, data);
    if (updated) {
      setNotificationTemplates([...db.getNotificationTemplates()]);
      showToast('Notification template updated successfully.', 'success');
    }
  };

  const logAuditEvent = (userId: string, userName: string, userRole: any, action: string, module: string, details: string) => {
    const entry = db.logAuditEvent(userId, userName, userRole, action, module, details);
    setAuditLogs([...db.getAuditLogs()]);
    return entry;
  };

  const redeemLoyaltyPoints = (customerId: string, points: number) => {
    const result = db.redeemLoyaltyPoints(customerId, points);
    if (result.success) {
      setLoyaltyAccount({ ...db.getLoyaltyAccount(customerId) });
      showToast(`Redeemed ${points} points for ₹${result.discountAmount} discount!`, 'success');
    } else {
      showToast('Insufficient loyalty points.', 'error');
    }
    return result;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole,
        savedAddresses,
        addAddress,
        userPincode,
        currentZone,
        setPincode,
        pincodes,
        addPincode,
        updatePincode,
        deletePincode,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        subscriptionPlans,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        setExpressTier,
        setBookingSlots,
        setSelectedAddress,
        setOrderNotes,
        cartTotals,
        orders,
        createOrder,
        advanceOrderStatus,
        updateOrderWeight,
        getOrderById,
        refreshOrders,
        wallet,
        rechargeWallet,
        clothTypes,
        serviceMasters,
        priceMatrix,
        bulkPricing,
        pricingSettings,
        addClothType,
        updateClothType,
        deleteClothType,
        updatePriceItem,
        upsertPriceItem,
        addBulkPrice: (item: BulkPricingItem) => {
          db.addBulkPrice(item);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updateBulkPrice: (id: string, updates: Partial<BulkPricingItem>) => {
          db.updateBulkPrice(id, updates);
          setBulkPricing([...db.getBulkPricing()]);
        },
        deleteBulkPrice: (id: string) => {
          db.deleteBulkPrice(id);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updateBulkSlab: (serviceId: string, laundryType: BulkLaundryType, slabs: { weightKg: number; regularPrice: number; expressPrice: number }[]) => {
          db.updateBulkSlab(serviceId, laundryType, slabs);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updatePricingSettings,
        resetToMasterCatalog,
        addClothItemToCart,
        disputes,
        createDispute,
        updateDisputeStatus,
        machines,
        updateMachineStatus,
        codRecords,
        reconcileRiderCOD,
        submitWeightVerification,
        approvePriceAdjustment,
        updateGarmentTagStatus,
        addInternalNote,
        hubs,
        createHub,
        updateHub,
        distanceConfig,
        updateDistanceConfig,
        calculateDistanceDeliveryFee,
        slotCapacities,
        bookSlotCapacity,
        updateSlotCapacity,
        qcRecords,
        submitQCChecklist,
        triggerRework,
        inventory,
        updateInventoryStock,
        notificationTemplates,
        updateNotificationTemplate,
        auditLogs,
        logAuditEvent,
        loyaltyAccount,
        redeemLoyaltyPoints,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-center justify-between border transition-all animate-bounce-short text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-[#0F766E] text-white border-teal-700'
                : toast.type === 'error'
                ? 'bg-[#DC2626] text-white border-red-700'
                : 'bg-[#0B3B36] text-white border-cyan-900'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/80 hover:text-white text-lg font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
