import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("niela_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    },
    sendOtp: async (email: string) => {
      const response = await api.post("/auth/send-otp", { email });
      return response.data;
    },
    register: async (name: string, email: string, password: string, otp: string) => {
      const response = await api.post("/auth/register", { name, email, password, otp });
      return response.data;
    },
    googleLogin: async (name?: string, email?: string, googleId?: string, token?: string) => {
      const response = await api.post("/auth/google-login", { name, email, googleId, token });
      return response.data;
    },
    getProfile: async () => {
      const response = await api.get("/auth/profile");
      return response.data;
    },
  },

  // Products & Categories
  products: {
    getAll: async (category?: string) => {
      const url = category && category !== "all" ? `/products?category=${category}` : "/products";
      const response = await api.get(url);
      return response.data;
    },
    getOne: async (id: string) => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    getCategories: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  },

  // Customer Orders
  orders: {
    create: async (orderData: any) => {
      const response = await api.post("/orders", orderData);
      return response.data;
    },
    getMyOrders: async () => {
      const response = await api.get("/orders");
      return response.data;
    },
    getDetails: async (id: string) => {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    },
  },

  // Payments (Razorpay)
  payments: {
    createOrder: async (amount: number) => {
      const response = await api.post("/payments/create", { amount });
      return response.data;
    },
    verifySignature: async (verificationData: any) => {
      const response = await api.post("/payments/verify", verificationData);
      return response.data;
    },
  },

  // Enquiries
  enquiries: {
    submit: async (enquiryData: any) => {
      const response = await api.post("/enquiries", enquiryData);
      return response.data;
    },
  },

  // Administrative Controls
  admin: {
    // Product CRUD
    createProduct: async (productData: any) => {
      const response = await api.post("/products", productData);
      return response.data;
    },
    updateProduct: async (id: string, productData: any) => {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    },
    deleteProduct: async (id: string) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    // Category CRUD
    createCategory: async (categoryData: any) => {
      const response = await api.post("/categories", categoryData);
      return response.data;
    },
    deleteCategory: async (id: string) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },
    // Order Management
    getAllOrders: async () => {
      const response = await api.get("/admin/orders");
      return response.data;
    },
    updateOrderStatus: async (id: string, orderStatus: string) => {
      const response = await api.put(`/admin/orders/${id}`, { orderStatus });
      return response.data;
    },
    // Customer Enquiries
    getAllEnquiries: async () => {
      const response = await api.get("/admin/enquiries");
      return response.data;
    },
    updateEnquiryStatus: async (id: string, status: string) => {
      const response = await api.put(`/admin/enquiries/${id}`, { status });
      return response.data;
    },
  },
};
export default apiService;
