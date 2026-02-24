// artisan/src/components/layout/NotificationDropdown.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '@/lib/api/services';
import { formatRelativeTime } from '@/lib/utils';
import { useSocketEvent } from '@/lib/hooks/useSocket';
import { Badge } from '@/components/ui/Badge';
import type { Notification } from '@/types';
import Link from 'next/link';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useSocketEvent('notification', (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications({ limit: 10 });
      setNotifications((response as any).data || []);
      const unread = ((response as any).data || []).filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-[#c2703e]/5 rounded-xl transition-colors group"
      >
        <Bell className="w-5 h-5 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1" style={{ background: 'var(--gradient-primary)' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-[#f0ebe4] z-50 max-h-[500px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          {/* Header */}
          <div className="p-4 border-b border-[#f0ebe4] flex items-center justify-between">
            <h3 className="font-semibold text-[#2d3436]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-[#c2703e] hover:text-[#a85a30] font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-4 text-center text-[#6b5e54]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#6b5e54]">
                <Bell className="w-12 h-12 mx-auto mb-2 text-[#f0ebe4]" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  href={notification.link || '#'}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification._id);
                    }
                    setIsOpen(false);
                  }}
                  className={`block p-4 hover:bg-[#faf6f1] border-b border-[#f0ebe4] last:border-b-0 transition-colors ${!notification.isRead ? 'bg-[#c2703e]/5' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-[#2d3436] text-sm">
                        {notification.title}
                      </p>
                      <p className="text-sm text-[#6b5e54] mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#6b5e54]/60 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#c2703e] rounded-full mt-1" />
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#f0ebe4]">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-[#c2703e] hover:text-[#a85a30] font-medium"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}