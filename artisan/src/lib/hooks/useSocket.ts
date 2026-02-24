// artisan/src/lib/hooks/useSocket.ts
'use client';

import { useEffect } from 'react';
import { socketClient } from '@/lib/socket/client';
import { useAuthStore } from '@/lib/store/authStore';

export function useSocket() {
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      socketClient.connect(token);
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.disconnect();
    };
  }, [isAuthenticated, token]);

  return socketClient;
}

export function useSocketEvent(event: string, callback: Function) {
  useEffect(() => {
    socketClient.on(event, callback);
    return () => {
      socketClient.off(event, callback);
    };
  }, [event, callback]);
}