// WargaPay API Service Layer
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface WasteServiceItem {
    id: number;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
    created_at?: string;
}

export interface DuesItem {
    id: number;
    user_id: number;
    period: string;
    waste_fee: number;
    security_fee: number;
    rt_fund: number;
    total: number;
    status: 'unpaid' | 'paid';
    paid_at?: string | null;
    created_at?: string;
}

export interface TransactionItem {
    id: number;
    user_id: number;
    order_id: string;
    type: 'dues' | 'waste_service';
    dues_id?: number | null;
    waste_service_id?: number | null;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
    payment_type?: string;
    snap_token?: string;
    snap_redirect_url?: string;
    notes?: string;
    pickup_address?: string;
    pickup_date?: string;
    paid_at?: string | null;
    created_at: string;
    user?: User;
    dues?: DuesItem;
    waste_service?: WasteServiceItem;
}

export interface WeatherData {
    location: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    description: string;
    wind_speed: number;
}

export interface ExpenseItem {
    id: number;
    title: string;
    category: string;
    amount: number;
    vendor: string;
    date: string;
    description?: string;
    receipt_ref?: string;
    approved_by?: string;
    created_at?: string;
}

export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    date: string;
    priority: string;
    dues_id?: number;
    amount?: number;
    period?: string;
}

// Token & Session Storage
export const getStoredToken = (): string | null => {
    return localStorage.getItem('wargapay_token');
};

export const setStoredToken = (token: string): void => {
    localStorage.setItem('wargapay_token', token);
};

export const getStoredUser = (): User | null => {
    const raw = localStorage.getItem('wargapay_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const setStoredUser = (user: User): void => {
    localStorage.setItem('wargapay_user', JSON.stringify(user));
};

export const clearSession = (): void => {
    localStorage.removeItem('wargapay_token');
    localStorage.removeItem('wargapay_user');
};

// Generic Fetch Wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getStoredToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
    }

    return data;
}

// ========================
// AUTH APIS
// ========================
export const apiLogin = async (email: string, password: string) => {
    const res = await request<{ message: string; token: string; data: User }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setStoredUser(res.data);
    return res;
};

export const apiRegister = async (name: string, email: string, password: string, role: string = 'user') => {
    return await request<{ message: string; data: User }>('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
    });
};

// ========================
// WASTE SERVICES APIS
// ========================
export const apiGetServices = async (params?: { name?: string; min_price?: number; max_price?: number; is_active?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.name) query.append('name', params.name);
    if (params?.min_price !== undefined) query.append('min_price', params.min_price.toString());
    if (params?.max_price !== undefined) query.append('max_price', params.max_price.toString());
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ data: WasteServiceItem[]; total: number }>(`/services${qs}`);
    return res.data || [];
};

export const apiCreateService = async (payload: { name: string; description?: string; price: number; is_active?: boolean }) => {
    return await request<{ message: string; data: WasteServiceItem }>('/admin/services', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const apiUpdateService = async (id: number, payload: { name: string; description?: string; price: number; is_active?: boolean }) => {
    return await request<{ message: string; data: WasteServiceItem }>(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
};

export const apiDeleteService = async (id: number) => {
    return await request<{ message: string }>(`/admin/services/${id}`, {
        method: 'DELETE',
    });
};

// ========================
// DUES (IURAN) APIS
// ========================
export const apiGetDues = async (params?: { period?: string; status?: string; user_id?: number }) => {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.status) query.append('status', params.status);
    if (params?.user_id) query.append('user_id', params.user_id.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ data: DuesItem[]; total: number }>(`/dues${qs}`);
    return res.data || [];
};

export const apiCreateDues = async (payload: { user_id: number; period: string; waste_fee: number; security_fee: number; rt_fund: number }) => {
    return await request<{ message: string; data: DuesItem }>('/admin/dues', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const apiPayDuesManual = async (id: number) => {
    return await request<{ message: string; data: DuesItem }>(`/admin/dues/${id}/pay`, {
        method: 'POST',
    });
};

export const apiDeleteDues = async (id: number) => {
    return await request<{ message: string }>(`/admin/dues/${id}`, {
        method: 'DELETE',
    });
};

// ========================
// EXPENSES (BUKU KAS RT) APIS
// ========================
export const apiGetExpenses = async (category?: string): Promise<ExpenseItem[]> => {
    const qs = category && category !== 'Semua' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await request<{ message: string; data: ExpenseItem[] }>(`/expenses${qs}`);
    return res.data || [];
};

export const apiCreateExpense = async (payload: {
    title: string;
    category: string;
    amount: number;
    vendor: string;
    date: string;
    description?: string;
    receipt_ref?: string;
    approved_by?: string;
}): Promise<ExpenseItem> => {
    const res = await request<{ message: string; data: ExpenseItem }>('/admin/expenses', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return res.data;
};

export const apiDeleteExpense = async (id: number) => {
    return await request<{ message: string }>(`/admin/expenses/${id}`, {
        method: 'DELETE',
    });
};

// ========================
// USERS (DATA WARGA) APIS
// ========================
export const apiGetUsers = async (): Promise<User[]> => {
    const res = await request<{ message: string; data: User[] }>('/admin/users');
    return res.data || [];
};

export const apiUpdateUserRole = async (userId: number, role: 'admin' | 'user'): Promise<User> => {
    const res = await request<{ message: string; data: User }>(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
    });
    return res.data;
};

// ========================
// NOTIFICATIONS & REMINDERS APIS
// ========================
export const apiGetNotifications = async (): Promise<{ data: NotificationItem[]; unread: number }> => {
    try {
        const res = await request<{ message: string; data: NotificationItem[]; unread: number }>('/notifications');
        return { data: res.data || [], unread: res.unread || 0 };
    } catch {
        return { data: [], unread: 0 };
    }
};

// ========================
// TRANSACTIONS & MIDTRANS APIS
// ========================
export const apiCreateTransaction = async (payload: {
    type: 'dues' | 'waste_service';
    dues_id?: number;
    waste_service_id?: number;
    pickup_address?: string;
    pickup_date?: string;
    notes?: string;
}) => {
    const res = await request<{ message: string; data: TransactionItem }>('/transactions', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return res.data;
};

export const apiGetTransactions = async (params?: { type?: string; status?: string; user_id?: number }) => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    if (params?.user_id) query.append('user_id', params.user_id.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ data: TransactionItem[]; total: number }>(`/transactions${qs}`);
    return res.data || [];
};

export const apiSimulatePayment = async (txId: number) => {
    const res = await request<{ message: string; data: TransactionItem }>(`/transactions/${txId}/simulate-paid`, {
        method: 'POST',
    });
    return res.data;
};

export const apiGetTransactionReport = async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ message: string; data: any }>(`/admin/transactions/report${qs}`);
    return res.data;
};

// ========================
// WEATHER API
// ========================
export const apiGetWeather = async (lat: number = -6.2088, lon: number = 106.8456) => {
    try {
        const res = await request<{ message: string; data: WeatherData }>(`/weather?lat=${lat}&lon=${lon}`);
        return res.data;
    } catch {
        return null;
    }
};

// ========================
// MIDTRANS POPUP HELPER (SNAP QR & PAYMENT)
// ========================
export const isMidtransRealToken = (token?: string): boolean => {
    if (!token) return false;
    if (token.startsWith('snap-sb-') || token.startsWith('mock-')) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
};

export const openMidtransSnap = (
    snapToken: string,
    redirectUrl?: string,
    callbacks?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
    }
) => {
    if (typeof window !== 'undefined' && window.snap && snapToken) {
        window.snap.pay(snapToken, {
            onSuccess: (result) => {
                if (callbacks?.onSuccess) callbacks.onSuccess(result);
            },
            onPending: (result) => {
                if (callbacks?.onPending) callbacks.onPending(result);
            },
            onError: (err) => {
                if (callbacks?.onError) callbacks.onError(err);
            },
            onClose: () => {
                if (callbacks?.onClose) callbacks.onClose();
            },
        });
    } else if (redirectUrl && isMidtransRealToken(snapToken)) {
        window.open(redirectUrl, '_blank');
    }
};

