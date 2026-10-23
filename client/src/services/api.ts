import {
  Service,
  Booking,
  BookingFormData,
  GalleryItem,
  AdminUser,
  DashboardStats,
  SiteSettings,
  BookingStatus,
} from '../types';

const API_BASE = '/api';

// Token storage key
const TOKEN_KEY = 'tanya_events_admin_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

// Helper for authorized fetch
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// ================= Services API =================
export const servicesApi = {
  getAll: async (includeInactive = false): Promise<Service[]> => {
    const res = await apiFetch<{ success: boolean; services: Service[] }>(
      `/services${includeInactive ? '?all=true' : ''}`
    );
    return res.services || [];
  },

  getBySlug: async (slug: string): Promise<Service> => {
    const res = await apiFetch<{ success: boolean; service: Service }>(`/services/${slug}`);
    return res.service;
  },

  create: async (data: Partial<Service>): Promise<Service> => {
    const res = await apiFetch<{ success: boolean; service: Service }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.service;
  },

  update: async (id: string, data: Partial<Service>): Promise<Service> => {
    const res = await apiFetch<{ success: boolean; service: Service }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.service;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<{ success: boolean }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// ================= Gallery API =================
export const galleryApi = {
  getAll: async (category?: string, includeUnpublished = false): Promise<GalleryItem[]> => {
    let url = '/gallery?';
    if (category && category !== 'All') url += `category=${encodeURIComponent(category)}&`;
    if (includeUnpublished) url += 'all=true';
    const res = await apiFetch<{ success: boolean; items: GalleryItem[] }>(url);
    return res.items || [];
  },

  create: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await apiFetch<{ success: boolean; item: GalleryItem }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.item;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<{ success: boolean }>(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};

// ================= Bookings API =================
export const bookingsApi = {
  submit: async (data: BookingFormData): Promise<{ success: boolean; message: string; booking: Booking }> => {
    return apiFetch<{ success: boolean; message: string; booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  lookup: async (reference: string, phone?: string): Promise<Booking> => {
    let url = `/bookings/lookup/${encodeURIComponent(reference)}`;
    if (phone) url += `?phone=${encodeURIComponent(phone)}`;
    const res = await apiFetch<{ success: boolean; booking: Booking }>(url);
    return res.booking;
  },

  getStats: async (): Promise<DashboardStats> => {
    const res = await apiFetch<{ success: boolean; stats: DashboardStats }>('/bookings/stats');
    return res.stats;
  },

  getAll: async (params: {
    search?: string;
    status?: string;
    service?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<Booking[]> => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.service) query.append('service', params.service);
    if (params.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params.dateTo) query.append('dateTo', params.dateTo);

    const res = await apiFetch<{ success: boolean; bookings: Booking[] }>(`/bookings?${query.toString()}`);
    return res.bookings || [];
  },

  updateStatus: async (id: string, status: BookingStatus, adminNotes?: string): Promise<Booking> => {
    const res = await apiFetch<{ success: boolean; booking: Booking }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
    return res.booking;
  },

  updateQuotation: async (
    id: string,
    quotationAmount: number | null,
    adminNotes?: string,
    status?: BookingStatus
  ): Promise<Booking> => {
    const res = await apiFetch<{ success: boolean; booking: Booking }>(`/bookings/${id}/quotation`, {
      method: 'PATCH',
      body: JSON.stringify({ quotationAmount, adminNotes, status }),
    });
    return res.booking;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<{ success: boolean }>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// ================= Auth API =================
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const res = await apiFetch<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setToken(res.token);
    return res;
  },

  getMe: async (): Promise<AdminUser> => {
    const res = await apiFetch<{ success: boolean; user: AdminUser }>('/auth/me');
    return res.user;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiFetch<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    authStorage.removeToken();
  },
};

// ================= Settings & Contact API =================
export const settingsApi = {
  get: async (): Promise<SiteSettings> => {
    const res = await apiFetch<{ success: boolean; settings: SiteSettings }>('/settings');
    return res.settings;
  },

  update: async (data: Partial<SiteSettings>): Promise<void> => {
    await apiFetch<{ success: boolean }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  submitContact: async (data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }): Promise<{ message: string }> => {
    return apiFetch<{ success: boolean; message: string }>('/settings/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
