import { useState, useCallback, useEffect } from 'react';
import { stockService } from '@/services/stockService';

export const useStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });

  // Fetch stocks
  const fetchStocks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stockService.getStocks({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search !== undefined ? params.search : filters.search,
        category: params.category !== undefined ? params.category : filters.category
      });
      
      setStocks(response.data);
      setPagination(response.pagination);
      
      // Update filters if provided
      if (params.search !== undefined) {
        setFilters(prev => ({ ...prev, search: params.search }));
      }
      if (params.category !== undefined) {
        setFilters(prev => ({ ...prev, category: params.category }));
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.category]);

  // Create stock
  const createStock = useCallback(async (stockData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stockService.createStock(stockData);
      
      // Refresh stocks list
      await fetchStocks();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStocks]);

  // Update stock
  const updateStock = useCallback(async (id, stockData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stockService.updateStock(id, stockData);
      
      // Update stocks list
      setStocks(prev => 
        prev.map(stock => 
          stock.id === parseInt(id) ? response.data : stock
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete stock
  const deleteStock = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stockService.deleteStock(id);
      
      // Remove from stocks list
      setStocks(prev => prev.filter(stock => stock.id !== parseInt(id)));
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get stock by ID
  const getStockById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stockService.getStockById(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search stocks
  const searchStocks = useCallback((searchTerm) => {
    fetchStocks({ search: searchTerm, page: 1 });
  }, [fetchStocks]);

  // Filter by category
  const filterByCategory = useCallback((category) => {
    fetchStocks({ category, page: 1 });
  }, [fetchStocks]);

  // Change page
  const changePage = useCallback((page) => {
    fetchStocks({ page });
  }, [fetchStocks]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({ search: '', category: '' });
    fetchStocks({ search: '', category: '', page: 1 });
  }, [fetchStocks]);

  // Initial load
  useEffect(() => {
    fetchStocks();
  }, []);

  return {
    stocks,
    loading,
    error,
    pagination,
    filters,
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
    getStockById,
    searchStocks,
    filterByCategory,
    changePage,
    clearFilters
  };
}; 