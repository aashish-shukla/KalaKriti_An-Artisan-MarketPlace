// artisan/src/lib/socket/client.ts
import { io, Socket } from 'socket.io-client';
import type { Notification } from '@/types';

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5001', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('notification', (notification: Notification) => {
      this.emit('notification', notification);
    });

    this.socket.on('order:status', (data: any) => {
      this.emit('orderStatus', data);
    });

    this.socket.on('message', (message: any) => {
      this.emit('message', message);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  send(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const socketClient = new SocketClient();