// artisan/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#c2703e]/10 animate-morph blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#daa520]/10 animate-morph blur-3xl" style={{ animationDelay: '5s' }} />
          <div className="absolute top-1/4 right-1/3 w-32 h-32 rounded-full bg-[#c2703e]/5 animate-float blur-xl" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(218,165,32,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>K</span>
            </div>
            <span className="font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>KalaKriti</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Welcome Back to the
            <span className="text-shimmer block mt-2">KalaKriti Community</span>
          </h2>
          <p className="text-xl text-white/60 max-w-lg leading-relaxed font-light">
            Sign in to continue exploring unique handcrafted treasures from talented artisans worldwide.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            {[
              { value: '2K+', label: 'Artisans' },
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Buyers' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fdf8f4]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>K</span>
              </div>
              <span className="font-bold text-2xl gradient-text" style={{ fontFamily: 'var(--font-display)' }}>KalaKriti</span>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-[#2d3436] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Sign In
            </h1>
            <p className="text-[#6b5e54]">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#6b5e54] hover:text-[#c2703e] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#f0ebe4] text-[#c2703e] focus:ring-[#c2703e]/20" />
                <span className="text-sm text-[#6b5e54]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#c2703e] hover:text-[#a85a30] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center mt-8 text-[#6b5e54]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#c2703e] hover:text-[#a85a30] font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}