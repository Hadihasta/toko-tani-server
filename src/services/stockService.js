import apiClient from './api';

export const stockService = {
  // Get all stocks with pagination and filters
  getStocks: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);

      const response = await apiClient.get(`/stock?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil data stock');
    }
  },

  // Get stock by ID
  getStockById: async (id) => {
    try {
      const response = await apiClient.get(`/stock/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil data stock');
    }
  },

  // Create new stock
  createStock: async (stockData) => {
    try {
      const response = await apiClient.post('/stock', stockData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal membuat stock');
    }
  },

  // Update stock
  updateStock: async (id, stockData) => {
    try {
      const response = await apiClient.put(`/stock/${id}`, stockData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengupdate stock');
    }
  },

  // Delete stock
  deleteStock: async (id) => {
    try {
      const response = await apiClient.delete(`/stock/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal menghapus stock');
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil data kategori');
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal membuat kategori');
    }
  },

  // Get suppliers
  getSuppliers: async () => {
    try {
      const response = await apiClient.get('/suppliers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil data supplier');
    }
  },

  // Create supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await apiClient.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal membuat supplier');
    }
  }
}; 