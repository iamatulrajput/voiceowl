'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkConnection = async () => {
      try {
        await apiService.healthCheck();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Don't render anything on server-side or before mounted
  if (!mounted || isConnected === null) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
        isConnected
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isConnected ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {isConnected ? 'Connected' : 'Backend Offline'}
      </span>
    </div>
  );
}

