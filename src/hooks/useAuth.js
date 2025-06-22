import { useState, useCallback } from 'react';
import { authService } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      // Simpan token dan data user ke localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Simpan token ke cookie untuk middleware
      document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
      
      // Update state
      setUser(response.user);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      
      // Hapus token dari localStorage dan cookie
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData);
        return userData;
      } catch (err) {
        // Token tidak valid, hapus dari localStorage dan cookie
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        throw err;
      } finally {
        setLoading(false);
      }
    }
    
    return null;
  }, []);

  // Fungsi untuk mendapatkan path dashboard berdasarkan role
  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'user':
        return '/user/dashboard';
      default:
        return '/dashboard';
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    getDashboardPath,
    isAuthenticated: !!user,
  };
}; 