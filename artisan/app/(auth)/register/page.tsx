// artisan/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';
import { Eye, EyeOff, Sparkles, ArrowRight, Store, ShoppingBag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'buyer' as 'buyer' | 'seller',
    shopName: '',
    shopDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const registerData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'seller') {
        registerData.shopName = formData.shopName;
        registerData.shopDescription = formData.shopDescription;
      }

      await register(registerData);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-[#c2703e]/5 animate-float blur-xl" />
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
            Join the
            <span className="text-shimmer block mt-2">KalaKriti Marketplace</span>
          </h2>
          <p className="text-xl text-white/60 max-w-lg leading-relaxed font-light">
            Create your account and start discovering unique handcrafted items or sell your own creations.
          </p>

          {/* Benefits List */}
          <ul className="mt-10 space-y-4">
            {[
              'Access to thousands of handcrafted products',
              'Direct connection with artisans',
              'Secure transactions guaranteed',
              'Easy setup for sellers',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-white/70">
                <div className="w-6 h-6 rounded-full bg-[#2d9f6f]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#2d9f6f]" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
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
              Create Account
            </h1>
            <p className="text-[#6b5e54]">
              Fill in the details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-2">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 ${formData.role === 'buyer'
                    ? 'border-[#c2703e] bg-[#c2703e]/5'
                    : 'border-[#f0ebe4] hover:border-[#c2703e]/30'
                    }`}
                >
                  <ShoppingBag className={`w-6 h-6 ${formData.role === 'buyer' ? 'text-[#c2703e]' : 'text-[#6b5e54]'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'buyer' ? 'text-[#c2703e]' : 'text-[#2d3436]'}`}>
                    Buy Products
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 ${formData.role === 'seller'
                    ? 'border-[#c2703e] bg-[#c2703e]/5'
                    : 'border-[#f0ebe4] hover:border-[#c2703e]/30'
                    }`}
                >
                  <Store className={`w-6 h-6 ${formData.role === 'seller' ? 'text-[#c2703e]' : 'text-[#6b5e54]'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'seller' ? 'text-[#c2703e]' : 'text-[#2d3436]'}`}>
                    Sell Products
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
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

            {/* Seller-specific fields */}
            {formData.role === 'seller' && (
              <div className="space-y-4 p-4 bg-[#daa520]/5 rounded-xl border border-[#daa520]/20 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                <h3 className="text-sm font-semibold text-[#2d3436] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#daa520]" />
                  Shop Details
                </h3>
                <Input
                  label="Shop Name"
                  name="shopName"
                  placeholder="My KalaKriti Shop"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
                    Shop Description
                  </label>
                  <textarea
                    name="shopDescription"
                    placeholder="Describe what you sell..."
                    value={formData.shopDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-[#f0ebe4] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e] transition-all"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center mt-8 text-[#6b5e54]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#c2703e] hover:text-[#a85a30] font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}