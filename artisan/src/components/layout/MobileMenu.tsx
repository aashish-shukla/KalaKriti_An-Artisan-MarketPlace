// artisan/src/components/layout/MobileMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Home, ShoppingBag, User, Heart, Package, Settings, LogOut, ChevronRight, Compass } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: ShoppingBag },
    { label: 'Explore', href: '/products?featured=true', icon: Compass },
  ];

  const userMenuItems = isAuthenticated
    ? [
      { label: 'My Orders', href: '/account/orders', icon: Package },
      { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
      { label: 'Account Settings', href: '/account', icon: Settings },
    ]
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#fdf8f4] shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#f0ebe4]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>K</span>
              </div>
              <span className="font-bold text-lg text-[#2d3436]" style={{ fontFamily: 'var(--font-display)' }}>KalaKriti</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f0ebe4] rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-[#6b5e54]" />
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated ? (
            <div className="p-4 border-b border-[#f0ebe4] bg-gradient-to-br from-[#c2703e]/5 to-[#daa520]/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'var(--gradient-primary)' }}>
                  <span className="text-white font-semibold text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2d3436] truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-[#6b5e54] truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-[#f0ebe4] bg-gradient-to-br from-[#c2703e]/5 to-[#daa520]/5">
              <p className="text-sm text-[#6b5e54] mb-3">Sign in to access your account</p>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 px-4 bg-white border border-[#c2703e]/30 text-[#c2703e] rounded-xl font-medium hover:bg-[#c2703e]/5 transition-colors"
                  onClick={onClose}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 px-4 text-white rounded-xl font-medium hover:opacity-90 transition-all"
                  style={{ background: 'var(--gradient-primary)' }}
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#c2703e]/5 transition-colors group"
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
                    <span className="font-medium text-[#2d3436] group-hover:text-[#c2703e] transition-colors">
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[#6b5e54]/40 group-hover:text-[#c2703e] transition-colors" />
                  </Link>
                );
              })}
            </div>

            {isAuthenticated && userMenuItems.length > 0 && (
              <>
                <div className="px-4 py-3 mt-4">
                  <p className="text-xs font-semibold text-[#6b5e54] uppercase tracking-wider">My Account</p>
                </div>
                <div className="px-2">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#c2703e]/5 transition-colors group"
                        onClick={onClose}
                      >
                        <Icon className="w-5 h-5 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
                        <span className="font-medium text-[#2d3436] group-hover:text-[#c2703e] transition-colors">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-auto text-[#6b5e54]/40 group-hover:text-[#c2703e] transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </nav>

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="p-4 border-t border-[#f0ebe4]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-[#c0392b] rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
