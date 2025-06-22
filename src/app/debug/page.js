"use client";
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function DebugPage() {
  const { user, loading, error, isAuthenticated, getDashboardPath } = useAuth();
  const [localStorageData, setLocalStorageData] = useState({});

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    setLocalStorageData({
      token: token ? 'Present' : 'Not found',
      user: savedUser ? JSON.parse(savedUser) : 'Not found'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth State</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
              <p><strong>Dashboard Path:</strong> {getDashboardPath()}</p>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
            <button 
              onClick={checkLocalStorage}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Check LocalStorage
            </button>
            <div className="space-y-2">
              <p><strong>Token:</strong> {localStorageData.token || 'Not checked'}</p>
              <p><strong>User:</strong> {localStorageData.user ? JSON.stringify(localStorageData.user, null, 2) : 'Not checked'}</p>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-2">
              <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
              <p><strong>JWT Secret:</strong> {process.env.JWT_SECRET ? 'Set' : 'Not set'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear LocalStorage & Reload
              </button>
              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 