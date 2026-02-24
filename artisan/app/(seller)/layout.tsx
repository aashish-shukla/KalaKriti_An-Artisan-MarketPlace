// artisan/app/(seller)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Store, BarChart, Star, Settings, LogOut } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/lib/store/authStore';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/seller/products', icon: Package },
  { name: 'Orders', href: '/seller/orders', icon: ShoppingBag },
  { name: 'Shop', href: '/seller/shop', icon: Store },
  { name: 'Analytics', href: '/seller/analytics', icon: BarChart },
  { name: 'Reviews', href: '/seller/reviews', icon: Star },
  { name: 'Settings', href: '/seller/settings', icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== 'seller') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'seller') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Seller Portal</h2>
            <p className="text-sm text-gray-600">
              {typeof user.shop === 'object' && user.shop.name}
            </p>
          </div>
          <nav className="px-3 pb-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}