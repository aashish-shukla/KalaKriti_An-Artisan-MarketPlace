// artisan/app/(account)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import {
  User, Package, Heart, Settings, CreditCard, MapPin,
  Store, BarChart3, ShoppingBag, LogOut, ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const isSeller = user?.role === 'seller';

  const userMenuItems = [
    { label: 'Profile', href: '/account', icon: User },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'Payment Methods', href: '/account/payments', icon: CreditCard },
    { label: 'Settings', href: '/account/settings', icon: Settings },
  ];

  const sellerMenuItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: BarChart3 },
    { label: 'My Products', href: '/seller/products', icon: ShoppingBag },
    { label: 'Shop Settings', href: '/seller/shop', icon: Store },
    { label: 'Orders', href: '/seller/orders', icon: Package },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fdf8f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] sticky top-20 overflow-hidden">
                {/* User Info */}
                <div className="p-6 bg-gradient-to-br from-[#c2703e]/5 to-[#daa520]/5">
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

                {/* Navigation */}
                <nav className="p-3">
                  <div className="space-y-1">
                    {userMenuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                              ? 'bg-gradient-to-r from-[#c2703e]/10 to-[#daa520]/10 text-[#c2703e]'
                              : 'text-[#6b5e54] hover:bg-[#c2703e]/5 hover:text-[#c2703e]'
                            }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  {isSeller && (
                    <>
                      <div className="border-t border-[#f0ebe4] my-3" />
                      <p className="px-4 py-2 text-xs font-semibold text-[#6b5e54] uppercase tracking-wider">Seller</p>
                      <div className="space-y-1">
                        {sellerMenuItems.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                  ? 'bg-gradient-to-r from-[#c2703e]/10 to-[#daa520]/10 text-[#c2703e]'
                                  : 'text-[#6b5e54] hover:bg-[#c2703e]/5 hover:text-[#c2703e]'
                                }`}
                            >
                              <item.icon className="w-5 h-5" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-[#f0ebe4]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#c0392b] hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}