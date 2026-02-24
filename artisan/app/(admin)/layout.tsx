// artisan/app/(admin)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Store, Package, ShoppingBag, Settings, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/lib/store/authStore';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Shops', href: '/admin/shops', icon: Store },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Admin Portal</h2>
            </div>
            <p className="text-sm text-gray-600">Platform Management</p>
          </div>
          <nav className="px-3 py-6">
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