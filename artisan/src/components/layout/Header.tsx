// artisan/src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Settings, Package, Heart, Menu, Compass } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { NotificationDropdown } from './NotificationDropdown';
import { MobileMenu } from './MobileMenu';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${scrolled
          ? 'warm-glass shadow-lg'
          : 'bg-white/95 border-b border-[#f0ebe4]'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg shadow-md"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>K</span>
              </div>
              <span className="hidden sm:block font-bold text-xl gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                KalaKriti
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Products', href: '/products', icon: Package },
                { label: 'Explore', href: '/products?featured=true', icon: Compass },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#6b5e54] hover:text-[#c2703e] rounded-lg hover:bg-[#c2703e]/5 transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <NotificationDropdown />

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative p-2.5 hover:bg-[#c2703e]/5 rounded-xl transition-all duration-200 group"
                  >
                    <ShoppingCart className="w-5 h-5 text-[#6b5e54] group-hover:text-[#c2703e] transition-colors" />
                    {itemCount > 0 && (
                      <span className="absolute top-1 right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu - Desktop */}
                  <div ref={userMenuRef} className="relative hidden md:block">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 hover:bg-[#c2703e]/5 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'var(--gradient-primary)' }}>
                        <span className="text-white font-medium text-sm">
                          {user?.firstName?.charAt(0)}
                        </span>
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-[#f0ebe4] py-2 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                        <div className="px-4 py-3 border-b border-[#f0ebe4]">
                          <p className="font-semibold text-[#2d3436]">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-[#6b5e54] truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/account"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#c2703e]/5 transition-colors text-[#6b5e54] hover:text-[#c2703e]"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">My Account</span>
                          </Link>

                          <Link
                            href="/account/orders"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#c2703e]/5 transition-colors text-[#6b5e54] hover:text-[#c2703e]"
                          >
                            <Package className="w-4 h-4" />
                            <span className="text-sm font-medium">Orders</span>
                          </Link>

                          <Link
                            href="/account/wishlist"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#c2703e]/5 transition-colors text-[#6b5e54] hover:text-[#c2703e]"
                          >
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">Wishlist</span>
                          </Link>
                        </div>

                        {user?.role === 'seller' && (
                          <>
                            <div className="border-t border-[#f0ebe4] my-1" />
                            <Link
                              href="/seller/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#c2703e]/5 transition-colors text-[#6b5e54] hover:text-[#c2703e]"
                            >
                              <Settings className="w-4 h-4" />
                              <span className="text-sm font-medium">Seller Dashboard</span>
                            </Link>
                          </>
                        )}

                        {user?.role === 'admin' && (
                          <>
                            <div className="border-t border-[#f0ebe4] my-1" />
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#c2703e]/5 transition-colors text-[#6b5e54] hover:text-[#c2703e]"
                            >
                              <Settings className="w-4 h-4" />
                              <span className="text-sm font-medium">Admin Dashboard</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-[#f0ebe4] my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-[#c0392b]"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-[#6b5e54] hover:text-[#c2703e] font-medium transition-colors rounded-lg hover:bg-[#c2703e]/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-2.5 hover:bg-[#c2703e]/5 rounded-xl transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-[#6b5e54]" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>

        {/* Animated bottom accent line */}
        <div className={`h-[2px] transition-all duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'var(--gradient-primary)' }} />
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </>
  );
}