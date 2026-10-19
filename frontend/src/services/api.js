import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_REVIEWS } from '../constants/mockData';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

/**
 * Helper to build auth headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem('novacart_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    let errorMsg = data.error || data.message || `HTTP error ${response.status}`;
    if (data.errors && typeof data.errors === 'object') {
      const errValues = Object.values(data.errors).filter(Boolean);
      if (errValues.length > 0) {
        errorMsg = errValues.join('. ');
      }
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = data.details || data.errors || null;
    err.raw = data;
    throw err;
  }
  return data;
}

export const api = {
  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse(res);
    } catch (err) {
      return {
        status: 'disconnected',
        supabase_configured: false,
        error: err.message
      };
    }
  },

  /**
   * Categories
   */
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await handleResponse(res);
      const list = Array.isArray(data) ? data : (data?.data || []);
      if (list.length > 0) return list;
      return MOCK_CATEGORIES;
    } catch (err) {
      console.warn('Backend unavailable, using fallback categories:', err.message);
      return MOCK_CATEGORIES;
    }
  },

  /**
   * Products with optional filtering & sorting
   */
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.sort) query.append('sort', params.sort);
      if (params.min_price) query.append('min_price', params.min_price);
      if (params.max_price) query.append('max_price', params.max_price);
      if (params.search) query.append('search', params.search);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/products${qs}`);
      const data = await handleResponse(res);

      const items = Array.isArray(data) ? data : (data?.data || data?.items || []);
      if (items.length > 0) {
        return {
          items,
          pagination: data?.pagination || {
            total: items.length,
            page: 1,
            limit: items.length,
            total_pages: 1
          }
        };
      }
      // If DB has 0 items, fallback to mock data
      return this.filterMockProducts(params);
    } catch (err) {
      console.warn('Backend unavailable, using fallback products:', err.message);
      return this.filterMockProducts(params);
    }
  },

  /**
   * Helper to filter mock products when backend isn't connected
   */
  filterMockProducts(params = {}) {
    let list = [...MOCK_PRODUCTS];

    if (params.category) {
      list = list.filter(p => p.category_id === params.category || p.category_name?.toLowerCase() === params.category.toLowerCase());
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (params.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return {
      items: list,
      pagination: {
        total: list.length,
        page: 1,
        limit: list.length,
        total_pages: 1
      }
    };
  },

  /**
   * Single Product
   */
  async getProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      const data = await handleResponse(res);
      return data?.data || data;
    } catch (err) {
      return MOCK_PRODUCTS.find(p => p.id === id) || null;
    }
  },

  /**
   * Reviews for a product
   */
  async getReviews(productId) {
    try {
      const res = await fetch(`${API_BASE}/reviews?product_id=${productId}`);
      const data = await handleResponse(res);
      const list = Array.isArray(data) ? data : (data?.data || []);
      if (list.length > 0) return list;
      return MOCK_REVIEWS.filter(r => r.product_id === productId);
    } catch (err) {
      return MOCK_REVIEWS.filter(r => r.product_id === productId);
    }
  },

  /**
   * Submit Review
   */
  async addReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return await handleResponse(res);
  },

  /**
   * Auth: Login
   */
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(res);
  },

  /**
   * Auth: Register
   */
  async register(payload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  /**
   * Auth: Me
   */
  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  /**
   * Auth: Update Profile (preferred_language, full_name, phone, address)
   */
  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return await handleResponse(res);
  },

  /**
   * Orders: Create
   */
  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderPayload)
      });
      return await handleResponse(res);
    } catch (err) {
      // Offline fallback: save order locally so checkout never fails
      const localOrder = {
        id: 'ord_' + Date.now(),
        order_number: 'ORD-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        total_amount: orderPayload.total_amount,
        subtotal: orderPayload.subtotal,
        shipping_amount: orderPayload.shipping_amount,
        shipping_address: orderPayload.shipping_address,
        payment_method: orderPayload.payment_method,
        status: 'processing',
        created_at: new Date().toISOString(),
        items: orderPayload.items
      };
      try {
        const existing = JSON.parse(localStorage.getItem('novacart_demo_orders') || '[]');
        localStorage.setItem('novacart_demo_orders', JSON.stringify([localOrder, ...existing]));
      } catch (e) {
        // Ignore
      }
      return { success: true, order: localOrder };
    }
  },

  /**
   * Orders: Customer Order History
   */
  async getMyOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await handleResponse(res);
      const orders = Array.isArray(data) ? data : (data?.data || []);
      const demoOrders = JSON.parse(localStorage.getItem('novacart_demo_orders') || '[]');
      return [...demoOrders, ...orders];
    } catch (err) {
      const demoOrders = JSON.parse(localStorage.getItem('novacart_demo_orders') || '[]');
      return demoOrders;
    }
  },

  /**
   * Admin: Stats
   */
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  /**
   * Admin: List Orders
   */
  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/orders${query ? '?' + query : ''}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data?.data || []);
  },

  /**
   * Admin: Update Order Status
   */
  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return await handleResponse(res);
  },

  /**
   * Admin: Create Product
   */
  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return await handleResponse(res);
  },

  /**
   * Admin: Update Product
   */
  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return await handleResponse(res);
  },

  /**
   * Admin: Delete Product
   */
  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  /**
   * Admin: List Users / Customers
   */
  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data?.data || []);
  },

  /**
   * Admin: Update User Role (e.g. customer, mod, admin)
   */
  async updateUserRole(userId, role) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return await handleResponse(res);
  },

  /**
   * Admin: Delete User / Customer
   */
  async deleteUser(userId) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  }
};
