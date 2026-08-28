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
  let response: Response;
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
    throw new AdminApiError('The operations API could not be reached.');
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

// Kept as small compatibility helpers for the slot capacity screen. They use
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
