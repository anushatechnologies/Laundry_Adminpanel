export class AdminApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'AdminApiError';
  }
}

/**
 * Browser calls stay on the admin origin. The server-side route verifies the
 * session and injects the backend token, so no privileged token reaches JS.
 */
export async function adminApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response: Response | null = null;

  // 1. Try local serverless proxy route
  try {
    response = await fetch(`/api/backend${normalizedPath}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
      cache: 'no-store',
    });
  } catch {
    response = null;
  }

  // 2. Direct production backend fallback if proxy failed (e.g. 503, 502, 404)
  if (!response || !response.ok) {
    try {
      const directUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api'}${normalizedPath}`;
      response = await fetch(directUrl, {
        ...options,
        headers: {
          Accept: 'application/json',
          ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
          ...options?.headers,
        },
        cache: 'no-store',
      });
    } catch {
      throw new AdminApiError('The operations API could not be reached.');
    }
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new AdminApiError(payload.message || payload.error || 'The request could not be completed.', response.status);
  }

  return (payload.data !== undefined ? payload.data : payload) as T;
}

export const getAdminOrders = () => adminApi<any[]>('/orders/admin');
export const getAdminCatalog = () => adminApi<any>('/services/catalog');
export const getAdminCoupons = () => adminApi<any[]>('/coupons');
export const getAdminPincodes = () => adminApi<any[]>('/pincodes');
export const getAdminPlans = () => adminApi<any[]>('/subscriptions/plans');
export const getAdminSlots = () => adminApi<any[]>('/slots');
export const getAdminBanners = () => adminApi<import('@/types').Banner[]>(`/banners/all?_t=${Date.now()}`);
export const createAdminBanner = (data: Partial<import('@/types').Banner>) =>
  adminApi<import('@/types').Banner>('/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateAdminBanner = (id: string, data: Partial<import('@/types').Banner>) =>
  adminApi<import('@/types').Banner>(`/banners/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const toggleAdminBanner = (id: string) =>
  adminApi<import('@/types').Banner>(`/banners/${encodeURIComponent(id)}/toggle`, {
    method: 'PATCH',
  });
export const deleteAdminBanner = (id: string) =>
  adminApi<{ success: boolean }>(`/banners/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

// Kept as small compatibility helpers for the slot capacity screen. They use
// the authenticated server-side proxy above, never a browser-visible API key.
// the authenticated server-side proxy above, never a browser-visible API key.
export const getBackendSlots = () => getAdminSlots().catch(() => null);
export const updateBackendSlot = (id: string, data: Record<string, unknown>) =>
  adminApi<any>(`/slots/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }).catch(() => null);
export const createBackendSlot = (data: Record<string, unknown>) =>
  adminApi<any>('/slots', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch(() => null);

// Categories CRUD
export const getAdminCategories = () => adminApi<any[]>('/services/categories');
export const createAdminCategory = (data: Record<string, unknown>) =>
  adminApi<any>('/services/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateAdminCategory = (id: string, data: Record<string, unknown>) =>
  adminApi<any>(`/services/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteAdminCategory = (id: string) =>
  adminApi<any>(`/services/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

// Service Masters CRUD
export const getAdminServiceMasters = () => adminApi<any[]>('/services/masters');
export const updateAdminServiceMaster = (id: string, data: Record<string, unknown>) =>
  adminApi<any>(`/services/masters/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteAdminServiceMaster = (id: string) =>
  adminApi<any>(`/services/masters/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

// Subcategories CRUD
export const getAdminSubcategories = (categoryTag?: string) =>
  adminApi<any[]>(categoryTag ? `/services/subcategories?categoryTag=${encodeURIComponent(categoryTag)}` : '/services/subcategories');
export const createAdminSubcategory = (data: Record<string, unknown>) =>
  adminApi<any>('/services/subcategories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateAdminSubcategory = (id: string, data: Record<string, unknown>) =>
  adminApi<any>(`/services/subcategories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteAdminSubcategory = (id: string) =>
  adminApi<any>(`/services/subcategories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
